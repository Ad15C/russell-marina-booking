const dashboardController = require('../../controllers/dashboardController');
const catwayService = require('../../services/catwayService');
const Reservation = require('../../models/Reservation');

// Mock des services
jest.mock('../../services/catwayService');
jest.mock('../../models/Reservation');

// Mock express res
const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.render = jest.fn();
  res.send = jest.fn();
  return res;
};

describe('Dashboard Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { session: { user: { id: '123', name: 'Alice', email: 'a@a.com' } } };
    res = mockResponse();
    jest.clearAllMocks();
  });

  test('renderDashboard rend la vue dashboard avec les catways et reservations', async () => {
    // Mocks
    const catwaysMock = [
      { catwayNumber: 1, type: 'long', catwayState: 'libre' }
    ];
    const reservationsMock = [
      { _id: 'r1', catwayId: 1, userId: 'u1' }
    ];

    catwayService.getAllCatways.mockResolvedValue(catwaysMock);
    Reservation.find.mockResolvedValue(reservationsMock);

    await dashboardController.renderDashboard(req, res, 'message OK', 'error KO');

    // Vérifications
    expect(catwayService.getAllCatways).toHaveBeenCalled();
    expect(Reservation.find).toHaveBeenCalled();
    expect(res.render).toHaveBeenCalledWith('dashboard', {
      user: req.session.user,
      catways: catwaysMock,
      reservations: reservationsMock,
      message: 'message OK',
      error: 'error KO'
    });
  });

  test('renderDashboard gère les erreurs', async () => {
    catwayService.getAllCatways.mockRejectedValue(new Error('Erreur DB'));
    
    await dashboardController.renderDashboard(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Erreur chargement dashboard');
  });
});
