const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const Catway = require('../models/catway');
const Reservation = require('../models/Reservation');

jest.setTimeout(20000);

// Mock middleware protect
jest.mock('../middleware/auth', () => (req, res, next) => {
  req.user = { name: 'TestUser', id: '12345' };
  next();
});

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

beforeEach(async () => {
  // Nettoyer les collections avant chaque test
  await Catway.deleteMany({});
  await Reservation.deleteMany({});
});

describe('Test routes principales avec MongoMemoryServer', () => {

  it('GET /dashboard', async () => {
    const res = await request(app).get('/dashboard');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Bienvenue');
  });

  it('GET /catways', async () => {
    await Catway.create({ catwayNumber: '1', type: 'long', catwayState: 'libre' });
    const res = await request(app).get('/catways');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Liste des Catways');
    expect(res.text).toContain('1'); // Vérifie que le catway est affiché
  });

  it('GET /reservations', async () => {
  const catway = await Catway.create({ catwayNumber: '2', type: 'short', catwayState: 'libre' });

 /* Créer une réservation liée au catway */
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  await Reservation.create({
    clientName: 'Alice',
    boatName: 'SeaFox',
    catwayId: catway._id,
    catwayNumber: catway.catwayNumber, /* Redondant mais utile */
    checkIn: now,
    checkOut: tomorrow
  });

  const res = await request(app).get('/reservations');
  expect(res.status).toBe(200);
  expect(res.text).toContain('Liste des Réservations');
  expect(res.text).toContain('Alice');
});


  it('GET /documentation', async () => {
    const res = await request(app).get('/documentation');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Invité');
  });

});
