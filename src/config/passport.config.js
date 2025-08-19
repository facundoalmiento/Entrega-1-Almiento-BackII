import passport from "passport";
import local from "passport-local";
import passportJWT from "passport-jwt";
import bcrypt from "bcrypt";
import { usuariosModelo } from "../dao/models/usuario.model.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const buscarToken = req => req.cookies?.cookieToken || null;
const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export const iniciarPassport = () => {
  // REGISTER
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          console.log("[passport register] email:", email);
          const { first_name, last_name, age } = req.body;
          if (!first_name || !last_name || !age) {
            console.log("[passport register] faltan campos");
            return done(null, false, { message: "Faltan campos" });
          }

          const userExists = await usuariosModelo.findOne({ email });
          if (userExists) {
            console.log("[passport register] ya existe:", email);
            return done(null, false, { message: "Usuario ya existe" });
          }

          const hashedPassword = bcrypt.hashSync(password, 10);

          const newUser = await usuariosModelo.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            role: "user"
          });

          console.log("[passport register] creado OK:", newUser._id);
          return done(null, newUser);
        } catch (error) {
          console.error("[passport register] error:", error);
          return done(error);
        }
      }
    )
  );

  // LOGIN
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          console.log("[passport login] email:", email);
          const user = await usuariosModelo.findOne({ email });
          if (!user) {
            console.log("[passport login] usuario no encontrado");
            return done(null, false, { message: "Usuario no encontrado" });
          }
          const ok = isValidPassword(user, password);
          if (!ok) {
            console.log("[passport login] password incorrecta");
            return done(null, false, { message: "Contraseña incorrecta" });
          }
          console.log("[passport login] OK:", user._id);
          return done(null, user);
        } catch (error) {
          console.error("[passport login] error:", error);
          return done(error);
        }
      }
    )
  );

  // CURRENT (JWT)
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([
          buscarToken,
          // si querés también permitir Authorization: Bearer <token>
          ExtractJWT.fromAuthHeaderAsBearerToken()
        ]),
        secretOrKey: process.env.SECRET || "CoderCoder123"
      },
      async (tokenPayload, done) => {
        try {
          // tokenPayload: { id, email, role, iat, exp }
          return done(null, tokenPayload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
