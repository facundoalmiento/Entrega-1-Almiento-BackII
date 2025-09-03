import BaseRepository from "./base.repository.js";
import { usuariosModelo } from "../models/usuario.model.js";


export default class UserRepository extends BaseRepository {
  constructor(){ super(usuariosModelo); }
  findByEmail(email){ return this.model.findOne({ email }); }
  setResetToken(email, token, exp) {
    return this.model.updateOne({ email }, { resetToken: token, resetExpires: exp });
  }
  clearResetToken(email) {
    return this.model.updateOne({ email }, { $unset: { resetToken: "", resetExpires: "" } });
  }
}
