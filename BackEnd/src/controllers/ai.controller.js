const aiService = require('../services/ai.service');

module.exports.getReview = async (req, res) => {
  try {
    const code = req.body.code;

    if (!code) {
      return res.status(400).json({
        error: "Prompt is required"
      });
    }

    const response = await aiService(code);

    return res.status(200).json(response);

  } catch (error) {
     console.error("AI Service Error FULL:", error);

  return res.status(503).json({
    error: error.message || "AI service error"
  });
  }
};
