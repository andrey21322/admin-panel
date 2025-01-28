const dataService = require('../services/dataService');

exports.getDashboardData = (req, res) => {
  const { userId } = req.params;

  const data = dataService.getDashboardData(Number(userId));
  res.json(data);
};

exports.getProducts = (req, res) => {
  const { userId } = req.params;

  const products = dataService.getProducts(Number(userId));
  res.json(products);
};

exports.updateProduct = (req, res) => {
  const { userId } = req.params;
  const { id, name, price, image } = req.body;

  if (!id || !name || price == null) {
    return res.status(400).json({ error: 'ID, имя и цена обязательны' });
  }

  const updatedProducts = dataService.updateProduct(Number(userId), id, name, price, image);
  res.json(updatedProducts);
};

exports.deleteProduct = (req, res) => {
  const { userId, id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID продукта обязателен' });
  }

  const updatedProducts = dataService.deleteProduct(Number(userId), id);
  res.json(updatedProducts);
};

exports.getNotifications = (req, res) => {
  const { userId } = req.params;

  const notifications = dataService.getNotifications(Number(userId));
  res.json(notifications);
};

exports.editNotification = async (req, res) => {
  const { userId } = req.params;
  const { id, updates } = req.body;

  if (!id || !updates) {
    return res.status(400).json({ error: 'ID и обновления обязательны' });
  }

  try {
    const updatedNotification = await dataService.updateNotification(
      Number(userId),
      id,
      updates
    );

    if (!updatedNotification) {
      return res.status(404).json({ error: 'Уведомление не найдено' });
    }

    res.json(updatedNotification);
  } catch (error) {
    console.error('Ошибка при обновлении уведомления:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, price, image } = req.body;

    if (!name || price == null || !image) {
      return res.status(400).json({ error: 'Имя, цена и изображение обязательны' });
    }

    const newProduct = await dataService.createProduct(userId, name, price, image);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при создании продукта', error: err.message });
  }
};

exports.updateProductOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { order } = req.body;

    if (!Array.isArray(order) || order.some((item) => !item.id || typeof item.order !== 'number')) {
      return res.status(400).json({ error: 'Некорректный формат данных' });
    }

    const result = await dataService.updateProductOrder(userId, order);

    if (!result) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.status(200).json({ message: 'Порядок продуктов обновлен' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при обновлении порядка', error: err.message });
  }
};

