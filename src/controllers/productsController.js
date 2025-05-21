import mongoosePaginate from "mongoose-paginate-v2"
import {productModel} from "../models/product.model.js"
import {productService} from "../services/productService.js"


export const getProducts = async (req, res) => {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
  
      // Construir filtro de búsqueda
      let filter = {};
      if (query) {
        // Si query es categoría o status
        if (query === "available") {
          filter.status = true;
        } else {
          filter.category = query;
        }
      }
  
      // Configuración para paginación y orden
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        lean: true
      };
  
      if (sort) {
        // ordenar por precio ascendente o descendente
        options.sort = { price: sort.toLowerCase() === "asc" ? 1 : -1 };
      }
  
      // Usamos paginate para obtener resultados
      //const result = await productModel.paginate(filter, options);

      const result = await productService.getProducts(filter, options);
  
      // Construir prevLink y nextLink para la paginación
      const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
      
      res.json({
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.hasPrevPage ? result.prevPage : null,
        nextPage: result.hasNextPage ? result.nextPage : null,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}` : null,
        nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}` : null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: "Error al obtener productos" });
    }
  };
  


  export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    //verifica si tiene el formato correcto tipo: 664c17f3f9a0db81c26c3a25

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: "error", message: "ID de producto inválido" });
    }

    //const product = await productModel.findById(pid);
    const product = await productService.getProductById(pid);
    
    if (!product) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al buscar producto" });
  }
};


export const addProduct = async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    // Validar campos obligatorios
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ status: "error", message: "Faltan campos obligatorios" });
    }

    // status es opcional, por defecto true si no viene
    /*const newProduct = await productModel. create({
      title,
      description,
      code,
      price,
      status: status !== undefined ? status : true,
      stock,
      category,
      thumbnails: thumbnails || []
    }); */

     const newProductData = {
      title,
      description,
      code,
      price,
      status: status !== undefined ? status : true,
      stock,
      category,
      thumbnails: thumbnails || [],
    };

    const newProduct = await productService.createProduct(newProductData);

    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: "error", message: "Código de producto ya existe" });
    }
    res.status(500).json({ status: "error", message: "Error al crear producto" });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: "error", message: "ID inválido" });
    }

    const updateData = { ...req.body };

    // No permitir actualizar _id,por eso borro el campo _id
    delete updateData._id;

    /*const updatedProduct = await productModel.findByIdAndUpdate(pid, updateData, { new: true }); */

const updatedProduct = await productService.updateProduct(pid, updateData);

    if (!updatedProduct) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al actualizar producto" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: "error", message: "ID inválido" });
    }
    //const deleted = await productModel.findByIdAndDelete(pid);
    const deleted = await productService.deleteProduct(pid);

    if (!deleted) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.json({ status: "success", message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al eliminar producto" });
  }
};


