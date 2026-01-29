const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Reservation = require('../../models/Reservation');
const Catway = require('../../models/catway');

let mongoServer;

jest.setTimeout(30000); // Augmente le timeout pour MongoMemoryServer

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
  await Reservation.deleteMany({});
  await Catway.deleteMany({});
});

describe('Reservation Model', () => {
  let catway;

  beforeEach(async () => {
    // Crée un catway pour la réservation
    catway = await Catway.create({ catwayNumber: 1, type: 'long', catwayState: 'libre' });
  });

  test('crée une réservation valide', async () => {
    const reservation = new Reservation({
      catwayId: catway._id,
      catwayNumber: catway.catwayNumber,
      clientName: 'Alice',
      boatName: 'Titanic',
      checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000), // demain
      checkOut: new Date(Date.now() + 48 * 60 * 60 * 1000) // après demain
    });

    const saved = await reservation.save();
    expect(saved._id).toBeDefined();
    expect(saved.status).toBe('confirmée');
  });

  test('échoue si checkIn avant aujourd’hui', async () => {
    const reservation = new Reservation({
      catwayId: catway._id,
      catwayNumber: catway.catwayNumber,
      clientName: 'Bob',
      boatName: 'Nemo',
      checkIn: new Date(Date.now() - 24 * 60 * 60 * 1000), // hier
      checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    let err;
    try {
      await reservation.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.checkIn).toBeDefined();
  });

  test('échoue si checkOut avant checkIn', async () => {
    const reservation = new Reservation({
      catwayId: catway._id,
      catwayNumber: catway.catwayNumber,
      clientName: 'Charlie',
      boatName: 'SeaQueen',
      checkIn: new Date(Date.now() + 48 * 60 * 60 * 1000), // après demain
      checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000) // demain
    });

    let err;
    try {
      await reservation.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.checkOut).toBeDefined();
  });

  test('échoue si réservation chevauche une autre', async () => {
    const start = new Date(Date.now() + 24 * 60 * 60 * 1000); // demain
    const end = new Date(Date.now() + 48 * 60 * 60 * 1000); // après demain

    await Reservation.create({
      catwayId: catway._id,
      catwayNumber: catway.catwayNumber,
      clientName: 'Alice',
      boatName: 'Titanic',
      checkIn: start,
      checkOut: end
    });

    const overlapping = new Reservation({
      catwayId: catway._id,
      catwayNumber: catway.catwayNumber,
      clientName: 'Bob',
      boatName: 'Nemo',
      checkIn: new Date(start.getTime() + 1 * 60 * 60 * 1000), // chevauche
      checkOut: new Date(end.getTime() + 1 * 60 * 60 * 1000)
    });

    let err;
    try {
      await overlapping.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.message).toContain('déjà réservé');
  });
});

