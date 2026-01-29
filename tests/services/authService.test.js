// tests/services/authService.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const authService = require('../../services/authService');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth Service', () => {

  describe('register', () => {
    test('crée un utilisateur valide', async () => {
      const user = await authService.register('Alice', 'alice@example.com', 'password123');
      expect(user._id).toBeDefined();
      expect(user.name).toBe('Alice');
      expect(user.email).toBe('alice@example.com');
      expect(user.password).not.toBe('password123'); // password hashé
    });

    test('échoue si l\'email est déjà utilisé', async () => {
      await authService.register('Bob', 'bob@example.com', 'password123');
      await expect(authService.register('Bob2', 'bob@example.com', 'password123')).rejects.toThrow(
        'Email déjà utilisé'
      );
    });
  });

  describe('login', () => {
    test('retourne un token JWT valide', async () => {
      // crée un utilisateur
      const user = await authService.register('Charlie', 'charlie@example.com', 'mypassword');

      // on peut mocker process.env.JWT_SECRET si besoin
      process.env.JWT_SECRET = 'testsecret';

      const token = await authService.login('charlie@example.com', 'mypassword');
      expect(token).toBeDefined();

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id.toString()).toBe(user._id.toString());
    });

    test('échoue si l\'utilisateur n\'existe pas', async () => {
      await expect(authService.login('nonexistent@example.com', 'password')).rejects.toThrow(
        'Utilisateur non trouvé'
      );
    });

    test('échoue si le mot de passe est incorrect', async () => {
      await authService.register('David', 'david@example.com', 'correctpassword');
      await expect(authService.login('david@example.com', 'wrongpassword')).rejects.toThrow(
        'Mot de passe incorrect'
      );
    });
  });

});
