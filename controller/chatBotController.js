const axios = require("axios");

const BASE_URL = process.env.CHATBOT_URL;

exports.sendMessage = async (message) => {
  try {
    const response = await axios.post(`${BASE_URL}/chat`, { message });
    return response.data;
  } catch (err) {
    console.error("Chatbot Error:", err.message);
    throw new Error("Failed to get chatbot response");
  }
};

exports.chatBotInfo = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/info`);
    return response.data;
  } catch (err) {
    console.error("Chatbot Info Error:", err.message);
    throw new Error("Failed to fetch chatbot info");
  }
};

exports.getCategoriesStats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/categories`);
    return response.data;
  } catch (err) {
    console.error("Categories Error:", err.message);
    throw new Error("Failed to fetch categories data");
  }
};
exports.getArtisansStats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/artisans`);
    return response.data;
  } catch (err) {
    console.error("Artisans Error:", err.message);
    throw new Error("Failed to fetch artisans data");
  }
};

exports.getLocationsStats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/locations`);
    return response.data;
  } catch (err) {
    console.error("Locations Error:", err.message);
    throw new Error("Failed to fetch locations data");
  }
};
exports.checkHealth = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    return response.data;
  } catch (err) {
    console.error("Chatbot Service Health Check Failed:", err.message);
    throw new Error("Chatbot health check failed");
  }
};
