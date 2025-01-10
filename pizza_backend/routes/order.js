import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController.js';

const router = express.Router();

// Create an order
router.post('/', createOrder);

// Get all orders
router.get('/', getAllOrders);

// Get a single order by ID
router.get('/:id', getOrderById);

// Update an order by ID
router.put('/:id', updateOrder);

// Delete an order by ID
router.delete('/:id', deleteOrder);

export default router;
