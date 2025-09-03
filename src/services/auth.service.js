import crypto from "crypto";
import bcrypt from "bcrypt";
import UserRepository from "../dao/repositories/user.repository.js";
import { sendResetEmail } from "../utils/mailer.js";

const users = new UserRepository();

export async function startPasswordReset(email, baseUrl) {
  const user = await users.findByEmail(email);
 
  if (!user) return;

  const raw = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(raw).digest("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); 

  
  await users.setResetToken(email, tokenHash, expires);

  const link = `${baseUrl.replace(/\/$/, "")}/reset-password?token=${raw}&email=${encodeURIComponent(email)}`;
  await sendResetEmail(email, link);
}

export async function resetPassword(email, rawToken, newPassword) {
  const user = await users.findByEmail(email);
  if (!user || !user.resetToken || !user.resetExpires) throw new Error("Token inválido");
  if (user.resetExpires < new Date()) throw new Error("Token expirado");

  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  if (tokenHash !== user.resetToken) throw new Error("Token inválido");

  const igual = bcrypt.compareSync(newPassword, user.password);
  if (igual) throw new Error("La nueva contraseña no puede ser igual a la anterior");

  const newHash = bcrypt.hashSync(newPassword, 10);

  
  await users.updateOne({ email }, { password: newHash });
  await users.clearResetToken(email);
}
