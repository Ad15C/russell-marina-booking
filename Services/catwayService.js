const Catway = require('../models/catway');

/* Récupérer tous les catways */
async function getAllCatways() {
    return await Catway.find();
}

/* Récupérer un catway par ID */
async function getCatwayById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }
    return await Catway.findById(id);
}

/* Créer un nouveau catway */
async function createCatway(data) {
    if (!['short', 'long'].includes(data.type)) {
        throw new Error("Le type doit être 'short' ou 'long'");
    }
    
    const catway = new Catway(data);
    return await catway.save();
}

/* Mettre à jour un catway */
async function updateCatway(id, data) {
      if (data.type && !['short', 'long'].includes(data.type)) {
        throw new Error("Le type doit être 'short' ou 'long'");
    }

    if (Object.keys(data).length === 0) {
        throw new Error("Aucune donnée à mettre à jour");
    }

    return await Catway.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
}


/* Supprimer un catway */
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
