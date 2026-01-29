const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Catway = require('../../models/catway');

let mongoServer;

// Augmenter le timeout des hooks si nécessaire
jest.setTimeout(30000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connexion Mongoose sans options obsolètes
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Catway.deleteMany({});
});

describe('Catway Model', () => {
  test('crée un catway valide', async () => {
    const catway = new Catway({
      catwayNumber: 1,
      type: 'long',
      catwayState: 'libre'
    });
    const savedCatway = await catway.save();

    expect(savedCatway._id).toBeDefined();
    expect(savedCatway.catwayNumber).toBe(1);
    expect(savedCatway.type).toBe('long');
    expect(savedCatway.catwayState).toBe('libre');
  });

  test('échoue si catwayNumber manquant', async () => {
    const catway = new Catway({ type: 'long', catwayState: 'libre' });

    let err;
    try {
      await catway.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.catwayNumber).toBeDefined();
  });

  test('échoue si type non valide', async () => {
    const catway = new Catway({ catwayNumber: 2, type: 'medium', catwayState: 'libre' });

    let err;
    try {
      await catway.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.type).toBeDefined();
  });

  test('échoue si catwayState non valide', async () => {
    const catway = new Catway({ catwayNumber: 3, type: 'short', catwayState: 'blocked' });

    let err;
    try {
      await catway.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.catwayState).toBeDefined();
  });

  test('utilise "libre" par défaut si catwayState non précisé', async () => {
    const catway = new Catway({ catwayNumber: 4, type: 'short' });
    const savedCatway = await catway.save();
    expect(savedCatway.catwayState).toBe('libre');
  });
});
