import CartRepository from "../dao/repositories/cart.repository.js";

const cartRepo = new CartRepository();

export async function getProductsFromCartByID(cid) {
  const cart = await cartRepo.findByIdPopulated(cid);
  if (!cart) return { status: "error" };

  
  return {
    status: "success",
    products: cart.products?.map(p => ({
      ...p,
      
      title: p.product?.title,
      price: p.product?.price
    })) ?? []
  };
}
