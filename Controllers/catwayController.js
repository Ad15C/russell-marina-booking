const catwayService = require('../services/catwayService');

// GET /catways
async function getAllCatways(req, res) {
    try {
        const catways = await catwayService.getAllCatways();
        res.json(catways);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// GET /catways/:id
async function getCatwayById(req, res) {
    try {
        const catway = await catwayService.getCatwayById(req.params.id);
        if (!catway) return res.status(404).json({ message: "Catway not found" });
        res.json(catway);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST /catways
async function createCatway(req, res) {
    try {
        const catway = await catwayService.createCatway(req.body);
        res.status(201).json(catway);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// PUT /catways/:id
async function updateCatway(req, res) {
    try {
        const catway = await catwayService.updateCatway(req.params.id, req.body);
        if (!catway) return res.status(404).json({ message: "Catway not found" });
        res.json(catway);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// DELETE /catways/:id
async function deleteCatway(req, res) {
    try {
        const catway = await catwayService.deleteCatway(req.params.id);
        if (!catway) return res.status(404).json({ message: "Catway not found" });
        res.json({ message: "Catway deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getAllCatways,
    getCatwayById,
    createCatway,
    updateCatway,
    deleteCatway
};
