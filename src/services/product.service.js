
import ProductRepository from "../dao/repositories/product.repository.js";

const productsRepo = new ProductRepository();

export async function getAllProducts(query = {}) {
  
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  let sort = undefined;
  if (query.sort === "asc") sort = { price: 1 };
  if (query.sort === "desc") sort = { price: -1 };

  const filter = {};
  if (query.category) filter.category = query.category;

  if (typeof productsRepo.paginate === "function") {
    const result = await productsRepo.paginate(filter, { page, limit, sort, lean: true });
    return {
      docs: result.docs,
      totalDocs: result.totalDocs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
    };
  }

  
  return await productsRepo.find(filter, { limit, sort, lean: true });
}

export function getProductById(id) {
  return productsRepo.findById(id);
}

export function createProduct(data) {
  
  return productsRepo.create(data);
}

export function updateProduct(id, data) {
  return productsRepo.updateById(id, data);
}

export function deleteProduct(id) {
  return productsRepo.deleteById(id);
}
