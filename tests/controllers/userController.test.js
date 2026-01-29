const userController = require('../../controllers/userController');
const User = require('../../models/User');
const dashboardController = require('../../controllers/dashboardController');

// Mocks
jest.mock('../../models/User');
jest.mock('../../controllers/dashboardController', () => ({
  renderDashboard: jest.fn()
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  res.redirect = jest.fn();
  return res;
};

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, headers: {} };
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    test('rend une erreur si champs manquants', async () => {
      req.body = { name: '', email: '', password: '' };
      await userController.createUser(req, res);

      expect(dashboardController.renderDashboard).toHaveBeenCalledWith(
        req,
        res,
        null,
        'Tous les champs sont obligatoires'
      );
    });

    test('rend une erreur si mot de passe < 8 caractères', async () => {
      req.body = { name: 'Alice', email: 'a@a.com', password: '1234' };
      await userController.createUser(req, res);

      expect(dashboardController.renderDashboard).toHaveBeenCalledWith(
        req,
        res,
        null,
        'Le mot de passe doit contenir au moins 8 caractères'
      );
    });

    test('redirige vers dashboard si création réussie', async () => {
      const fakeUser = { _id: 'u1' };
      User.create.mockResolvedValue(fakeUser);
      req.body = { name: 'Alice', email: 'a@a.com', password: '12345678' };

      await userController.createUser(req, res);

      expect(res.redirect).toHaveBeenCalledWith(`/dashboard?message=Utilisateur créé (ID : ${fakeUser._id})`);
    });

    test('rend une erreur si User.create échoue', async () => {
      User.create.mockRejectedValue(new Error('DB Error'));
      req.body = { name: 'Alice', email: 'a@a.com', password: '12345678' };

      await userController.createUser(req, res);

      expect(dashboardController.renderDashboard).toHaveBeenCalledWith(
        req,
        res,
        null,
        'DB Error'
      );
    });
  });

  describe('deleteUserById', () => {
    test('redirige vers erreur si pas d’id', async () => {
      req.body = {};
      await userController.deleteUserById(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/dashboard?error=ID utilisateur requis');
    });

    test('redirige vers message succès si supprimé', async () => {
      User.findByIdAndDelete.mockResolvedValue(true);
      req.body.id = 'u1';

      await userController.deleteUserById(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/dashboard?message=Utilisateur supprimé');
    });

    test('redirige vers erreur si utilisateur introuvable', async () => {
      User.findByIdAndDelete.mockResolvedValue(null);
      req.body.id = 'u1';

      await userController.deleteUserById(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/dashboard?error=Utilisateur introuvable');
    });
  });

  describe('getAllUsers (API)', () => {
    test('renvoie la liste des utilisateurs', async () => {
      const users = [{ name: 'Alice' }, { name: 'Bob' }];
      User.find.mockResolvedValue(users);

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: users });
    });

    test('renvoie une erreur si User.find échoue', async () => {
      User.find.mockRejectedValue(new Error('DB Error'));

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'DB Error' });
    });
  });
});
