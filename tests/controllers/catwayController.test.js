/* tests/controllers/catwayController.test.js */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Catway = require('../../models/catway');
const catwayController = require('../../controllers/catwayController');
const catwayService = require('../../services/catwayService');

jest.mock('../../services/catwayService'); // mock du service pour certains tests

let mongoServer;

jest.setTimeout(20000); // timeout global

// Mock Express req/res
const mockResponse = () => {
  const res = {};
  res.redirect = jest.fn();
  res.status = jest.fn(() => res);
  res.json = jest.fn();
  return res;
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Catway.deleteMany();
});

describe('Catway Controller - Dashboard', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = mockResponse();
  });

  test('Créer un catway via Dashboard controller', async () => {
    req.body = { catwayNumber: 200, type: 'short', catwayState: 'libre' };
    await catwayController.createCatwayDashboard(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      expect.stringContaining('message=Catway créé avec succès')
    );

    const catway = await Catway.findOne({ catwayNumber: 200 });
    expect(catway).not.toBeNull();
    expect(catway.type).toBe('short');
  });

  test('Erreur si catwayNumber manquant', async () => {
    req.body = { type: 'short', catwayState: 'libre' };
    await catwayController.createCatwayDashboard(req, res);

    const redirectUrl = res.redirect.mock.calls[0][0];
    expect(decodeURIComponent(redirectUrl)).toContain('Le numéro du catway est requis');
  });

  test('Supprimer un catway via Dashboard controller', async () => {
    // Crée un catway pour tester la suppression
    const catway = await Catway.create({ catwayNumber: 300, type: 'short', catwayState: 'libre' });

    req.params.id = catway._id.toString();
    catwayService.catwayHasReservations.mockResolvedValue(false); // aucun reservation
    catwayService.deleteCatway.mockResolvedValue(catway);

    await catwayController.deleteCatwayDashboard(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      expect.stringContaining('message=Catway supprimé avec succès')
    );
  });
});

describe('Catway Controller - API', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = mockResponse();
  });

  test('getAllCatwaysAPI retourne les catways', async () => {
    // Mock du service pour qu'il retourne un tableau de catways
    catwayService.getAllCatways.mockResolvedValue([
      { catwayNumber: 400, type: 'long', catwayState: 'libre' }
    ]);

    await catwayController.getAllCatwaysAPI(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ catwayNumber: 400 })])
    );
  });

  test('getCatwayByIdAPI retourne un catway', async () => {
    const catway = { _id: '123', catwayNumber: 401, type: 'short', catwayState: 'libre' };
    req.params.id = '123';

    catwayService.getCatwayById.mockResolvedValue(catway);

    await catwayController.getCatwayByIdAPI(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ catwayNumber: 401 }));
  });
});