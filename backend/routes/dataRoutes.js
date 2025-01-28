const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/dashboard/:userId', authMiddleware, dataController.getDashboardData);

router.get('/products/:userId', authMiddleware, dataController.getProducts);
router.put('/products/:userId', authMiddleware, dataController.updateProduct);
router.delete('/products/:userId/:id', authMiddleware, dataController.deleteProduct);

router.post('/products/:userId', authMiddleware, dataController.createProduct);
router.put('/products/:userId/order', authMiddleware, dataController.updateProductOrder);

router.get('/notifications/:userId', authMiddleware, dataController.getNotifications);
router.post('/notification/edit/:userId', authMiddleware, dataController.editNotification);

module.exports = router;
