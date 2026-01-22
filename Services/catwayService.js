const Catway = require('../models/catway');

// Récupérer tous les catways
async function getAllCatways() {
    return await Catway.find();
}

// Récupérer un catway par ID
async function getCatwayById(id) {
    return await Catway.findById(id);
}

// Créer un nouveau catway
async function createCatway(data) {
    const catway = new Catway(data);
    return await catway.save();
}

// Mettre à jour un catway
async function updateCatway(id, data) {
    return await Catway.findByIdAndUpdate(id, data, { new: true });
}

// Supprimer un catway
async function deleteCatway(id) {
    return await Catway.findByIdAndDelete(id);
}

module.exports = {
    getAllCatways,
    getCatwayById,
    createCatway,
    updateCatway,
    deleteCatway
};
