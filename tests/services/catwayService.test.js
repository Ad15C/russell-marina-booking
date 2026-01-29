// tests/services/catwayService.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const catwayService = require('../../services/catwayService');
const Catway = require('../../models/catway');
const Reservation = require('../../models/Reservation');

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
  await Catway.deleteMany({});
  await Reservation.deleteMany({});
});

describe('Catway Service', () => {

  test('createCatway crée un catway valide', async () => {
    const catway = await catwayService.createCatway({ catwayNumber: 101, type: 'short', catwayState: 'libre' });
    expect(catway._id).toBeDefined();
    expect(catway.catwayNumber).toBe(101);
    expect(catway.type).toBe('short');
    expect(catway.catwayState).toBe('libre');
  });

  test('createCatway échoue si type non valide', async () => {
    await expect(
      catwayService.createCatway({ catwayNumber: 102, type: 'medium', catwayState: 'libre' })
    ).rejects.toThrow("Le type doit être 'short' ou 'long'");
  });

  test('getAllCatways retourne tous les catways', async () => {
    await catwayService.createCatway({ catwayNumber: 201, type: 'long', catwayState: 'libre' });
    await catwayService.createCatway({ catwayNumber: 202, type: 'short', catwayState: 'occupé' });
    const catways = await catwayService.getAllCatways();
    expect(catways.length).toBe(2);
    expect(catways.map(c => c.catwayNumber)).toEqual(expect.arrayContaining([201, 202]));
  });

  test('getCatwayById retourne le catway correct', async () => {
    const catway = await catwayService.createCatway({ catwayNumber: 301, type: 'short' });
    const found = await catwayService.getCatwayById(catway._id);
    expect(found.catwayNumber).toBe(301);
  });

  test('updateCatway modifie un catway existant', async () => {
    const catway = await catwayService.createCatway({ catwayNumber: 401, type: 'short' });
    const updated = await catwayService.updateCatway(catway._id, { catwayState: 'occupé', type: 'long' });
    expect(updated.catwayState).toBe('occupé');
    expect(updated.type).toBe('long');
  });

  test('deleteCatway supprime un catway', async () => {
    const catway = await catwayService.createCatway({ catwayNumber: 501, type: 'long' });
    const deleted = await catwayService.deleteCatway(catway._id);
    expect(deleted._id.toString()).toBe(catway._id.toString());
    const stillThere = await Catway.findById(catway._id);
    expect(stillThere).toBeNull();
  });

  test('catwayHasReservations retourne true si réservation existante', async () => {
    const catway = await catwayService.createCatway({ catwayNumber: 601, type: 'short' });
    await Reservation.create({ 
      catwayId: catway._id, 
      catwayNumber: catway.catwayNumber,
      clientName: 'Alice', 
      boatName: 'Boat1', 
      checkIn: new Date(Date.now() + 86400000), 
      checkOut: new Date(Date.now() + 2*86400000) 
    });
    const hasReservations = await catwayService.catwayHasReservations(catway._id);
    expect(hasReservations).toBeTruthy();
  });

});
