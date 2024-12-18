import { ProductsCollection } from '../db/models/products.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllProducts = async ({
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const productsQuery = ProductsCollection.find();

  if (filter.name) {
    productsQuery.where('name').equals(filter.name);
  }

  const products = await productsQuery.exec();

  const transformedProducts = products.map((product) => ({
    ...product._doc,
    price: parseFloat(product.price),
    stock: parseInt(product.stock, 10),
  }));

  const sortedProducts = transformedProducts.sort((a, b) => {
    const orderMultiplier = sortOrder === SORT_ORDER.ASC ? 1 : -1;

    if (sortBy === '_id') {
      return (
        a[sortBy].toString().localeCompare(b[sortBy].toString()) *
        orderMultiplier
      );
    }

    if (typeof a[sortBy] === 'string' && typeof b[sortBy] === 'string') {
      return a[sortBy].localeCompare(b[sortBy]) * orderMultiplier;
    } else if (typeof a[sortBy] === 'number' && typeof b[sortBy] === 'number') {
      return (a[sortBy] - b[sortBy]) * orderMultiplier;
    }

    return 0;
  });

  return sortedProducts;
};

export const createProduct = async (payload) => {
  const product = await ProductsCollection.create(payload);
  return product;
};

export const deleteProduct = async (productId) => {
  const product = await ProductsCollection.findOneAndDelete({
    _id: productId,
  });

  return product;
};

export const updateProduct = async (productId, payload, options = {}) => {
  const rawResult = await ProductsCollection.findOneAndUpdate(
    { _id: productId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    product: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
