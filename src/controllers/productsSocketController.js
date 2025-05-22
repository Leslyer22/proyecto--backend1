import { productService } from "../services/productService.js";

export const socketProductEvents = (socket, io) => {
  socket.on("newProduct", async (data) => {
    try {
      await productService.createProduct(data);
      const updated = await productService.getProducts({}, { limit: 10, page: 1 });
      io.emit("updateProducts", updated.docs);
    } catch (error) {
      console.error("Error en evento newProduct:", error);
    }
  });
};
