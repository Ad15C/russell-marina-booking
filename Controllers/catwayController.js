const catwayService = require('../services/catwayService');


// Fonction utilitaire pour rendre le dashboard avec catways
async function renderDashboard(res, user, message = null, error = null) {
  const catways = await catwayService.getAllCatways();
  return res.render('dashboard', { user, catways, message, error });
}

/* GET/catways - Récupérer tous les catways */
async function getAllCatways(req, res) {
    try {
        const catways = await catwayService.getAllCatways();

        res.status(200).json({
            success: true,
            message: "Liste des catways récupérée avec succès",
            data: catways
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des catways",
            error: err.message
        });
    }
}

/*GET /catways/:id- Récupérer un catway par ID */
async function getCatwayById(req, res) {
    try {
        const catway = await catwayService.getCatwayById(req.params.id);

        if (!catway) {
            return res.status(404).json({
                success: false,
                message: "Catway introuvable"
            });
        }

        res.status(200).json({
            success: true,
            message: "Catway récupéré avec succès",
            data: catway
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: "ID de catway invalide",
            error: err.message
        });
    }
}

/*POST /catways - Créer un nouveau catway */
async function createCatway(req, res) {
    try {
        const catway = await catwayService.createCatway(req.body);

        res.status(201).json({
            success: true,
            message: "Catway créé avec succès",
            data: catway
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Erreur lors de la création du catway",
            error: err.message
        });
    }
}


/*PUT /catways/:id - Mettre à jour un catway */
async function updateCatway(req, res) {
    try {
        const catway = await catwayService.updateCatway(req.params.id, req.body);
        if (!catway) {
            return res.status(404).json({
                success: false,
                message: "Catway introuvable"
            });
        }

        res.status(200).json({
            success: true,
            message: "Catway mis à jour avec succès",
            data: catway
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Erreur lors de la mise à jour du catway",
            error: err.message
        });
    }
}


/* DELETE /catways/:id - Supprimer un catway */
async function deleteCatway(req, res) {
    try {
        const catway = await catwayService.deleteCatway(req.params.id);

        if (!catway) {
            return res.status(404).json({
                success: false,
                message: "Catway introuvable"
            });
        }

        res.status(200).json({
            success: true,
            message: "Catway supprimé avec succès"
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Erreur lors de la suppression du catway",
            error: err.message
        });
    }
}

module.exports = {
    getAllCatways,
    getCatwayById,
    createCatway,
    updateCatway,
    deleteCatway
};
