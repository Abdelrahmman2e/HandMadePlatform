const express = require("express");
const {
  getRecommendations,
  getPopularProducts,
  checkHealth,
  triggerModelTraining,
} = require("../controller/recommendationController");

const router = express.Router();

router.get("/popular", async (req, res) => {
  try {
    const data = await getPopularProducts();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/train", async (req, res) => {
  try {
    const result = await triggerModelTraining();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/recommendation/health
router.get("/health", async (req, res) => {
  try {
    const result = await checkHealth();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get(`/recommend/:userId`, async (req, res) => {
  try {
    const data = await getRecommendations(req.params.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
