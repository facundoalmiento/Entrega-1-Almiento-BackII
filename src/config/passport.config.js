import passport from "passport";
import local from "passport-local";
import passportJWT from "passport-jwt";
import bcrypt from "bcrypt";
import { usuariosModelo } from "../dao/models/usuario.model.js";


const LocalStrategy = local.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// Extraer token desde cookies
const buscarToken = req => req.cookies?.cookieToken || null;

// Validar contraseña
const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export const iniciarPassport = () => {

    // Registro de usuario
    passport.use(
        "register",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, email, password, done) => {
                try {
                    const { first_name, last_name, age } = req.body;

                    // Verificar si el usuario ya existe
                    const userExists = await usuariosModelo.findOne({ email });
                    if (userExists) return done(null, false, { message: "Usuario ya existe" });

                    // Hashear la contraseña
                    const hashedPassword = bcrypt.hashSync(password, 10);

                    // Crear nuevo usuario
                    const newUser = await usuariosModelo.create({
                        first_name,
                        last_name,
                        email,
                        age,
                        password: hashedPassword,
                        role: "user"
                    });

                    return done(null, newUser);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // Login
    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "email" },
            async (email, password, done) => {
                try {
                    // Buscar usuario en MongoDB
                    const user = await usuariosModelo.findOne({ email });
                    if (!user) return done(null, false, { message: "Usuario no encontrado" });

                    if (!isValidPassword(user, password)) return done(null, false, { message: "Contraseña incorrecta" });

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // JWT para usuario actual
    passport.use(
        "current",
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([buscarToken]),
                secretOrKey: process.env.SECRET || "CoderCoder123"
            },
            async (tokenPayload, done) => {
                try {
                    return done(null, tokenPayload);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

};
