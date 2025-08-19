import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

// --- Registro ---
router.post(
  "/register",
  (req, res, next) => {
    console.log("[/register] body recibido:", req.body);
    next();
  },
  passport.authenticate("register", { session: false }),
  (req, res) => {
    const user = req.user?.toObject ? req.user.toObject() : req.user;
    if (user) delete user.password;
    return res.status(201).json({ message: "Registro exitoso", user });
  }
);

// --- Login (devuelve JWT) ---
router.post(
  "/login",
  (req, res, next) => {
    console.log("[/login] body recibido:", req.body);
    next();
  },
  passport.authenticate("login", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role || "user" },
      process.env.SECRET || "CoderCoder123",
      { expiresIn: "1h" }
    );
    // Devolvés cookie + JSON
    return res
      .cookie("cookieToken", token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
      .json({ message: "Login exitoso", token });
  }
);

// --- Current protegido por JWT (cookie o header) ---
router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    return res.status(200).json({ user: req.user });
  }
);

// --- Ruta de error para debug ---
router.get("/error", (req, res) => {
  return res.status(400).json({ error: "Error de autenticación" });
});

export default router;
