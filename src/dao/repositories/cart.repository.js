import BaseRepository from "./base.repository.js";
import { cartModel } from "../models/cartModel.js";



export default class CartRepository extends BaseRepository {
  constructor() { super(cartModel); }
  findByIdPopulated(id) {

    return this.model.findById(id).populate("products.product").lean();
  }
}
