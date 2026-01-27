import * as newService from '../../../services/products.service';

export const productsService = {
    getAllProducts: newService.getAllProducts,
    getProductById: newService.getProductById,
    // Add others if used
};

// Also export individual named exports if used directly
export const { getAllProducts, getProductById } = newService;

