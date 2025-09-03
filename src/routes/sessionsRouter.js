import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import UserDTO from "../dao/dtos/user.dto.js";
import UserRepository from "../dao/repositories/user.repository.js";
import { startPasswordReset, resetPassword } from "../services/auth.service.js";


const router = Router();
const usersRepo = new UserRepository();

router.post(
  "/register",
  (req, _res, next) => { console.log("[/register] body recibido:", req.body); next(); },
  passport.authenticate("register", { session: false }),
  (req, res) => {
    const user = req.user?.toObject ? req.user.toObject() : req.user;
    if (user) delete user.password;
    return res.status(201).json({ message: "Registro exitoso", user });
  }
);

router.post(
  "/login",
  (req, _res, next) => { console.log("[/login] body recibido:", req.body); next(); },
  passport.authenticate("login", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role || "user" },
      process.env.SECRET || "CoderCoder123",
      { expiresIn: "1h" }
    );
    return res
      .cookie("cookieToken", token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
      .json({ message: "Login exitoso", token });
  }
);

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    const userDoc = await usersRepo.findById(req.user.id);
    if (!userDoc) return res.status(401).json({ error: "Token válido pero usuario no existe" });
    return res.status(200).json({ user: new UserDTO(userDoc) });
  }
);

router.post("/password/forgot", async (req, res) => {
  const { email } = req.body;
  try {
    await startPasswordReset(email, process.env.BASE_URL || "http://localhost:3000");
    return res.json({ message: "Si el email existe, se envió un enlace para restablecer la contraseña." });
  } catch (e) {
    return res.status(500).json({ error: "Error enviando el email" });
  }
});

router.post("/password/reset", async (req, res) => {
  const { email, token, newPassword } = req.body;
  try {
    await resetPassword(email, token, newPassword);
    return res.json({ message: "Contraseña restablecida correctamente" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/error", (_req, res) => res.status(400).json({ error: "Error de autenticación" }));

export default router;
