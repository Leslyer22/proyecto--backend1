import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { socketProductEvents } from "./controllers/productsController.js";

const PORT = process.env.PORT_2 || 3000;

const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Cuando un cliente se conecta
io.on("connection", (socket) => {
  console.log("Cliente conectado via socket.io");

  // Escuchar agregar producto
  socket.on("addProduct", async (newProduct) => {
    await productService.createProduct(newProduct);
    const products = await productService.getProducts({}, { page: 1, limit: 100 });
    io.emit("updateProducts", products.docs);
  });

  // Escuchar eliminar producto
  socket.on("deleteProduct", async (productId) => {
    await productService.deleteProduct(productId);
    const products = await productService.getProducts({}, { page: 1, limit: 100 });
    io.emit("updateProducts", products.docs);
  });
});



httpServer.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

export { io };
