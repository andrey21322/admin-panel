const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwtHelper = require('../helpers/jwtHelper');
require('dotenv').config();

const pathDbFromEnv = process.env.DBPATH;
const dbPath = path.resolve(pathDbFromEnv);

const readDB = () => JSON.parse(fs.readFileSync(dbPath));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

exports.register = async (username, email, password) => {
  const db = readDB();
  const users = db.users;

  const existingUser = users.find(
    (user) => user.username === username || user.email === email
  );
  if (existingUser) {
    throw new Error('User with this username or email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    username,
    email,
    password: hashedPassword,
    dashboardData: [],
    notifications: [],
    products: []
  };
  users.push(newUser);

  writeDB({ ...db, users });

  return { id: newUser.id, username: newUser.username, email: newUser.email };
};

exports.login = async (username, password) => {
  const db = readDB();
  const user = db.users.find((user) => user.username === username);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return { token: jwtHelper.generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
    }), 
    userId: user.id
  }
};
