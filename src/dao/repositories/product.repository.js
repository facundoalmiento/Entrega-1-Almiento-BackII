import BaseRepository from "./base.repository.js";
import { productModel } from "../models/product.model.js";


export default class ProductRepository extends BaseRepository {
  constructor() { super(productModel); }
  
  paginate(filter, options) {
    return this.model.paginate(filter, options);
  }
}