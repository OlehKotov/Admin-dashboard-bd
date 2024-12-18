import createHttpError from 'http-errors';
import { createProduct, deleteProduct, getAllProducts, updateProduct } from '../services/products.js';
import { parseSortProductsParams } from '../utils/parseProductsSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getProductsController = async (req, res, next) => {
    const { sortBy, sortOrder } = parseSortProductsParams(req.query);
    const filter = parseFilterParams(req.query);
  try {
    const products = await getAllProducts({
        sortBy,
        sortOrder,
        filter,
      });

    res.json({
      status: 200,
      message: 'Successfully found products!',
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const createProductController = async (req, res) => {
  const product = await createProduct(req.body);

  res.status(201).json({
    status: 201,
    message: `Successfully created a product!`,
    data: product,
  });
};

export const deleteProductController = async (req, res, next) => {
  const { productId } = req.params;

  const product = await deleteProduct(productId);

  if (!product) {
    next(createHttpError(404, 'Product not found'));
    return;
  }

  res.status(204).send();
};

export const upsertProductController = async (req, res, next) => {
    const { productId } = req.params;

    const result = await updateProduct(productId, req.body, {
        upsert: false,
      });

      if (!result) {
        next(createHttpError(404, 'Product not found'));
        return;
      }

      const status = result.isNew ? 201 : 200;

      res.status(status).json({
        status,
        message: `Successfully upserted a product!`,
        data: result.product,
      });
  }
