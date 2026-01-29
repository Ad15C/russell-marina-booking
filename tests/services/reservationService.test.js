// tests/services/reservationService.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const reservationService = require('../../services/reservationService');
const Reservation = require('../../models/Reservation');
const Catway = require('../../models/catway');

let mongoServer;
let catway;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Créer un catway de test
  catway = await Catway.create({ catwayNumber: 1, type: 'short', catwayState: 'libre' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Reservation.deleteMany({});
});

describe('Reservation Service', () => {

  test('validateReservation réussit avec données valides', async () => {
    const data = {
      catwayId: catway._id,
      clientName: 'Alice',
      boatName: 'Boaty',
      checkIn: new Date(Date.now() + 86400000),
      checkOut: new Date(Date.now() + 2 * 86400000)
    };
    const result = await reservationService.validateReservation(data);
    expect(result.catway._id.toString()).toBe(catway._id.toString());
  });

  test('createReservation crée une réservation valide', async () => {
    const data = {
      catwayId: catway._id,
      clientName: 'Bob',
      boatName: 'SeaQueen',
      checkIn: new Date(Date.now() + 86400000),
      checkOut: new Date(Date.now() + 2 * 86400000)
    };
    const reservation = await reservationService.createReservation(data);
    expect(reservation._id).toBeDefined();
    expect(reservation.clientName).toBe('Bob');
    expect(reservation.catwayId.toString()).toBe(catway._id.toString());
  });

  test('createReservation échoue si chevauchement', async () => {
    const checkIn = new Date(Date.now() + 86400000);
    const checkOut = new Date(Date.now() + 2 * 86400000);

    // Crée une réservation existante
    await Reservation.create({
      catwayId: catway._id,
      catwayNumber: catway.catwayNumber,
      clientName: 'Charlie',
      boatName: 'Boat1',
      checkIn,
      checkOut
    });

    // Tente une réservation qui chevauche
    await expect(
      reservationService.createReservation({
        catwayId: catway._id,
        clientName: 'David',
        boatName: 'Boat2',
        checkIn,
        checkOut
      })
    ).rejects.toThrow('Ce catway est déjà réservé sur ces dates');
  });

  test('getAllReservations retourne toutes les réservations', async () => {
    await Reservation.create({
      catwayId: catway._id,
      catwayNumber: catway.catwayNumber,
      clientName: 'Eve',
      boatName: 'BoatX',
      checkIn: new Date(Date.now() + 86400000),
      checkOut: new Date(Date.now() + 2 * 86400000)
    });
    const reservations = await reservationService.getAllReservations();
    expect(reservations.length).toBe(1);
  });

  test('getReservationById retourne la réservation correcte', async () => {
    const resv = await Reservation.create({
      catwayId: catway._id,
      catwayNumber: catway.catwayNumber,
      clientName: 'Frank',
      boatName: 'BoatY',
      checkIn: new Date(Date.now() + 86400000),
      checkOut: new Date(Date.now() + 2 * 86400000)
    });
    const found = await reservationService.getReservationById(resv._id);
    expect(found.clientName).toBe('Frank');
  });

  test('updateReservation modifie une réservation existante', async () => {
    const resv = await Reservation.create({
      catwayId: catway._id,
      catwayNumber: catway.catwayNumber,
      clientName: 'Grace',
      boatName: 'BoatZ',
      checkIn: new Date(Date.now() + 86400000),
      checkOut: new Date(Date.now() + 2 * 86400000)
    });

    const updated = await reservationService.updateReservation(resv._id, {
      catwayId: catway._id,
      clientName: 'Grace Updated',
      boatName: 'BoatZ Updated',
      checkIn: new Date(Date.now() + 86400000),
      checkOut: new Date(Date.now() + 2 * 86400000)
    });

    expect(updated.clientName).toBe('Grace Updated');
    expect(updated.boatName).toBe('BoatZ Updated');
  });

  test('deleteReservation supprime une réservation', async () => {
    const resv = await Reservation.create({
      catwayId: catway._id,
      catwayNumber: catway.catwayNumber,
      clientName: 'Hank',
      boatName: 'BoatH',
      checkIn: new Date(Date.now() + 86400000),
      checkOut: new Date(Date.now() + 2 * 86400000)
    });

    const deleted = await reservationService.deleteReservation(resv._id);
    expect(deleted._id.toString()).toBe(resv._id.toString());

    const stillThere = await Reservation.findById(resv._id);
    expect(stillThere).toBeNull();
  });

});
