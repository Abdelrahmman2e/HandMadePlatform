const express = require("express");

const {
  chatBotInfo,
  checkHealth,
  getArtisansStats,
  getCategoriesStats,
  getLocationsStats,
  sendMessage,
} = require("../controller/chatBotController");

const router = express.Router();

// GET /api/chatbot/health
router.get("/health", async (req, res) => {
  try {
    const result = await checkHealth();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(`/chat`, async (req, res) => {
  try {
    const msg = req.body.message;
    const reply = await sendMessage(msg);
    res.json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/info", async (req, res) => {
  try {
    const info = await chatBotInfo();
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/chatbot/categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await getCategoriesStats();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/chatbot/artisans
router.get("/artisans", async (req, res) => {
  try {
    const artisans = await getArtisansStats();
    res.json(artisans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/chatbot/locations
router.get("/locations", async (req, res) => {
  try {
    const locations = await getLocationsStats();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
