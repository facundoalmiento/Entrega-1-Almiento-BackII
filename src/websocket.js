import * as productService from "./services/product.service.js";

export default function websocket(io) {
  io.on("connection", (socket) => {
    console.log("🟢 cliente conectado");

    // crear producto
    socket.on("createProduct", async (data) => {
      try {
        await productService.createProduct(data);
        const products = await productService.getAllProducts({});
        
        const list = products.docs ?? products;
       
        io.emit("publishProducts", list);
      } catch (error) {
        socket.emit("statusError", error.message);
      }
    });

    // eliminar producto
    socket.on("deleteProduct", async ({ pid }) => {
      try {
        await productService.deleteProduct(pid);
        const products = await productService.getAllProducts({});
        const list = products.docs ?? products;
        io.emit("publishProducts", list);
      } catch (error) {
        socket.emit("statusError", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 cliente desconectado");
    });
  });
}
