const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pathDbFromEnv = process.env.DBPATH;
const dbPath = path.resolve(pathDbFromEnv);

const readDB = () => JSON.parse(fs.readFileSync(dbPath));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

exports.getDashboardData = (userId) => {
  const db = readDB();
  const user = db.users.find((user) => user.id === userId);
  return user ? user.dashboardData : [];
};

exports.getProducts = (userId) => {
  const db = readDB();
  const user = db.users.find((user) => user.id === userId);
  return user ? user.products : [];
};

exports.updateProduct = (userId, productId, name, price, image) => {
  const db = readDB();
  const userIndex = db.users.findIndex((user) => user.id === userId);

  if (userIndex === -1) return null;

  const user = db.users[userIndex];
  user.products = user.products.map((product) =>
    product.id === productId ? { ...product, name, price, image} : product
  );

  db.users[userIndex] = user;
  writeDB(db);

  return user.products;
};

exports.deleteProduct = (userId, productId) => {
  const db = readDB();
  const userIndex = db.users.findIndex((user) => user.id === userId);

  if (userIndex === -1) return null;

  const user = db.users[userIndex];
  user.products = user.products.filter((product) => product.id !== productId);

  db.users[userIndex] = user;
  writeDB(db);

  return user.products;
};

exports.getNotifications = (userId) => {
  const db = readDB();
  const user = db.users.find((user) => user.id === userId);
  return user ? user.notifications : [];
};

exports.updateNotification = (userId, notificationId, updates) => {
  const db = readDB();
  const userIndex = db.users.findIndex((user) => user.id === userId);

  if (userIndex === -1) return null;

  const user = db.users[userIndex];
  const notificationIndex = user.notifications.findIndex((n) => n.id === notificationId);

  if (notificationIndex === -1) return null;

  const notification = user.notifications[notificationIndex];
  const updatedNotification = { ...notification, ...updates };
  user.notifications[notificationIndex] = updatedNotification;

  db.users[userIndex] = user;
  writeDB(db);

  return updatedNotification;
};

exports.createProduct = async (userId, name, price, image) => {
  const db = readDB();
  const userIndex = db.users.findIndex((user) => user.id === Number(userId));

  if (userIndex === -1) return "TRY AGAIN";

  const product = {
    id: Date.now().toString(), name, price, image
  };

  db.users[userIndex].products.push(product)

  writeDB(db);

  return db.users[userIndex].products;
};

exports.updateProductOrder = (userId, order) => {
  const db = readDB();
  const userIndex = db.users.findIndex((user) => user.id === Number(userId));

  if (userIndex === -1) {
    return null;
  }

  const userProducts = db.users[userIndex].products;

  order.forEach((item) => {
    const productIndex = userProducts.findIndex((p) => p.id === item.id);
    if (productIndex !== -1) {
      userProducts[productIndex].order = item.order;
    }
  });

  userProducts.sort((a, b) => a.order - b.order);

  writeDB(db);

  return true;
};
