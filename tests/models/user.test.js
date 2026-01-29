// tests/models/user.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/User'); // adapte le chemin si besoin
const bcrypt = require('bcryptjs');

let mongoServer;

beforeAll(async () => {
  // Crée une DB Mongo en mémoire
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Nettoyer la DB après chaque test
  await User.deleteMany({});
});

describe('User Model', () => {
  test('crée un utilisateur valide et hash le mot de passe', async () => {
    const userData = {
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123'
    };

    const user = await User.create(userData);

    expect(user._id).toBeDefined();
    expect(user.name).toBe('Alice');
    expect(user.email).toBe('alice@example.com');

    // Vérifie que le mot de passe est hashé
    expect(user.password).not.toBe('password123');
    const isMatch = await bcrypt.compare('password123', user.password);
    expect(isMatch).toBe(true);
  });

  test('échoue si le mot de passe est trop court', async () => {
    const userData = {
      name: 'Bob',
      email: 'bob@example.com',
      password: 'short'
    };

    await expect(User.create(userData)).rejects.toThrow(
      /Le mot de passe doit contenir au moins 8 caractères/
    );
  });

  test('matchPassword retourne true pour le bon mot de passe', async () => {
    const userData = {
      name: 'Charlie',
      email: 'charlie@example.com',
      password: 'longpassword'
    };

    const user = await User.create(userData);
    const result = await user.matchPassword('longpassword');
    expect(result).toBe(true);
  });

  test('matchPassword retourne false pour un mauvais mot de passe', async () => {
    const userData = {
      name: 'David',
      email: 'david@example.com',
      password: 'mypassword'
    };

    const user = await User.create(userData);
    const result = await user.matchPassword('wrongpassword');
    expect(result).toBe(false);
  });
});
