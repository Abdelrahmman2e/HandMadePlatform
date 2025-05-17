const axios = require("axios");
const BASE_URL = process.env.RECOMMENDATION_URL;

exports.getRecommendations = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/recommend/${userId}`);
    return response.data;
  } catch (err) {
    console.error("Recommendation Error:", err.message);
    throw new Error("Failed to fetch recommendations");
  }
};

exports.getPopularProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/popular`);
    return response.data;
  } catch (err) {
    console.error("Popular Products Error:", err.message);
    throw new Error("Failed to fetch popular products");
  }
};

exports.triggerModelTraining = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/train`);
    return response.data;
  } catch (err) {
    console.error("Model Training Error:", err.message);
    throw new Error("Failed to trigger model training");
  }
};

exports.checkHealth = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    return response.data;
  } catch (err) {
    console.error("Recommendation Service Health Check Failed:", err.message);
    throw new Error("Health check failed");
  }
};
