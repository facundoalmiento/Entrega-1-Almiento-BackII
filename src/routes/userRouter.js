import { Router } from "express";
import bcrypt from "bcrypt";
import { usuariosModelo } from "../dao/models/usuario.model.js";


const router = Router();

// Crear usuario
router.post("/", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await usuariosModelo.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword
        });

        res.status(201).json({ message: "Usuario creado correctamente", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
