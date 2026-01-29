/* tests/controllers/authController.test.js */
const authController = require('../../controllers/authController');
const authService = require('../../services/authService');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

// Mock du service et de User
jest.mock('../../services/authService');
jest.mock('../../models/User');
jest.mock('jsonwebtoken');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.render = jest.fn();
  res.redirect = jest.fn();
  return res;
};

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, session: {} };
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('doit renvoyer une erreur si des champs manquent', async () => {
      req.body = { name: 'Alice', email: '' };
      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.render).toHaveBeenCalledWith('register', { error: 'Tous les champs sont obligatoires' });
    });

    test('doit renvoyer une erreur si le mot de passe est trop court', async () => {
      req.body = { name: 'Alice', email: 'a@a.com', password: '123' };
      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.render).toHaveBeenCalledWith('register', { error: 'Le mot de passe doit contenir au moins 8 caractères' });
    });

    test('doit créer un utilisateur et rediriger vers le dashboard', async () => {
      const fakeUser = { _id: '123', name: 'Alice', email: 'a@a.com' };
      req.body = { name: 'Alice', email: 'a@a.com', password: '12345678' };
      authService.register.mockResolvedValue(fakeUser);
      jwt.sign.mockReturnValue('fake-token');

      await authController.register(req, res);

      expect(req.session.token).toBe('fake-token');
      expect(req.session.user).toEqual({ id: '123', name: 'Alice', email: 'a@a.com' });
      expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });

    test('doit gérer une erreur du service', async () => {
      req.body = { name: 'Alice', email: 'a@a.com', password: '12345678' };
      authService.register.mockRejectedValue(new Error('Erreur service'));

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.render).toHaveBeenCalledWith('register', { error: 'Erreur service' });
    });
  });

  describe('login', () => {
    test('doit connecter un utilisateur et rediriger vers le dashboard', async () => {
      req.body = { email: 'a@a.com', password: '12345678' };
      authService.login.mockResolvedValue('fake-token');
      User.findOne.mockResolvedValue({ _id: '123', name: 'Alice', email: 'a@a.com' });

      await authController.login(req, res);

      expect(req.session.token).toBe('fake-token');
      expect(req.session.user).toEqual({ id: '123', name: 'Alice', email: 'a@a.com' });
      expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });

    test('doit renvoyer une erreur si login échoue', async () => {
      req.body = { email: 'a@a.com', password: '12345678' };
      authService.login.mockRejectedValue(new Error('Login échoué'));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.render).toHaveBeenCalledWith('login', { error: 'Login échoué' });
    });
  });

  describe('logout', () => {
    test('doit supprimer la session et rediriger', () => {
      req.session = { token: 't', user: {} };
      authController.logout(req, res);
      expect(req.session).toBeNull();
      expect(res.redirect).toHaveBeenCalledWith('/');
    });
  });
});
