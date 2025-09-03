import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  age:        { type: Number, required: true },
  password:   { type: String, required: true },
  cart:       { type: mongoose.Schema.Types.ObjectId, ref: "carts", default: null },
  role:       { type: String, default: "user" },

  resetToken:   { type: String, default: null },
resetExpires: { type: Date,   default: null }
});

export const usuariosModelo = mongoose.model(userCollection, userSchema);
