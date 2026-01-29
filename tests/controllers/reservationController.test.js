const reservationController = require('../../controllers/reservationController');
const reservationService = require('../../services/reservationService');
const Reservation = require('../../models/Reservation');

// Mocks
jest.mock('../../services/reservationService');
jest.mock('../../models/Reservation');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  res.redirect = jest.fn();
  res.render = jest.fn();
  return res;
};

describe('Reservation Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, headers: {} };
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('createReservation (API)', () => {
    test('renvoie 201 avec reservation JSON', async () => {
      const reservationMock = { _id: 'r1', catwayId: 'c1', userId: 'u1' };
      reservationService.createReservation.mockResolvedValue(reservationMock);
      req.headers.accept = 'application/json';

      await reservationController.createReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(reservationMock);
    });

    test('gère l’erreur et renvoie 500', async () => {
      reservationService.createReservation.mockRejectedValue(new Error('Erreur DB'));
      req.headers.accept = 'application/json';

      await reservationController.createReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erreur DB' });
    });
  });

  describe('getReservationById (API)', () => {
    test('renvoie la réservation si trouvée', async () => {
      const reservationMock = { _id: 'r1', catwayId: 'c1', toObject: () => ({ _id: 'r1' }) };
      reservationService.getReservationById.mockResolvedValue(reservationMock);
      req.params.reservationId = 'r1';
      req.headers.accept = 'application/json';

      await reservationController.getReservationById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ _id: 'r1' });
    });

    test('renvoie 404 si non trouvée', async () => {
      reservationService.getReservationById.mockResolvedValue(null);
      req.params.reservationId = 'r1';
      req.headers.accept = 'application/json';

      await reservationController.getReservationById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Réservation introuvable' });
    });
  });

  describe('deleteReservation (API)', () => {
    test('renvoie message succès si supprimée', async () => {
      reservationService.deleteReservation.mockResolvedValue(true);
      req.params.reservationId = 'r1';
      req.headers.accept = 'application/json';

      await reservationController.deleteReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Réservation supprimée avec succès' });
    });

    test('renvoie 404 si non trouvée', async () => {
      reservationService.deleteReservation.mockResolvedValue(false);
      req.params.reservationId = 'r1';
      req.headers.accept = 'application/json';

      await reservationController.deleteReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Réservation introuvable' });
    });
  });

  describe('createReservationFromDashboard', () => {
    test('redirige vers dashboard avec message succès', async () => {
      reservationService.createReservation.mockResolvedValue({});
      req.body.redirectTo = '/dashboard';

      await reservationController.createReservationFromDashboard(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/dashboard?message=Réservation créée avec succès !');
    });

    test('redirige vers dashboard avec message erreur', async () => {
      reservationService.createReservation.mockRejectedValue(new Error('Erreur'));
      req.body.redirectTo = '/dashboard';

      await reservationController.createReservationFromDashboard(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/dashboard?error=Erreur');
    });
  });

  describe('deleteReservationFromDashboard', () => {
    test('redirige vers dashboard avec message succès', async () => {
      reservationService.deleteReservation.mockResolvedValue(true);
      req.params.reservationId = 'r1';

      await reservationController.deleteReservationFromDashboard(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/dashboard?message=Réservation supprimée !');
    });

    test('redirige vers dashboard avec message erreur si non trouvée', async () => {
      reservationService.deleteReservation.mockResolvedValue(false);
      req.params.reservationId = 'r1';

      await reservationController.deleteReservationFromDashboard(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/dashboard?error=Réservation introuvable');
    });
  });
});
