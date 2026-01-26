import * as newService from '../../../services/orders.service';

// Export named exports
export const { createOrder, getOrderById } = newService;

// Export default object for legacy compatibility if needed (though named export was requested in error)
// The error said "does not provide an export named 'ordersService'". 
// This means usage is import { ordersService } from ...
export const ordersService = {
    createOrder: newService.createOrder,
    getOrderById: newService.getOrderById
};

