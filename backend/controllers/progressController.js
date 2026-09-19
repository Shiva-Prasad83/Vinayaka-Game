const Player = require('../models/Player');

// GET /api/progress/:playerId
const getProgress = async (req, res) => {
  try {
    const { playerId } = req.params;
    let player = await Player.findOne({ playerId });
    if (!player) {
      player = await Player.create({ playerId });
    }
    return res.json({ success: true, data: player });
  } catch (err) {
    console.error('getProgress error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/progress/save
const saveProgress = async (req, res) => {
  try {
    const {
      playerId, score, ecoScore, currentLevel, completedLevels,
      unlockedRewards, completedMissions, inventory, character,
      settings, selectedGanesha, gameMode
    } = req.body;

    if (!playerId) {
      return res.status(400).json({ success: false, message: 'playerId is required' });
    }

    // Server-side sanity checks — scores can't go negative
    const safeScore = Math.max(0, Number(score) || 0);
    const safeEcoScore = Math.max(0, Math.min(1000, Number(ecoScore) || 0));
    const safeLevel = Math.max(1, Math.min(5, Number(currentLevel) || 1));

    const update = {
      score: safeScore,
      ecoScore: safeEcoScore,
      currentLevel: safeLevel,
      completedLevels: Array.isArray(completedLevels) ? completedLevels.filter(n => n >= 1 && n <= 5) : [],
      unlockedRewards: Array.isArray(unlockedRewards) ? unlockedRewards : [],
      completedMissions: Array.isArray(completedMissions) ? completedMissions : [],
      inventory: inventory || {},
      character: character || {},
      settings: settings || {},
      selectedGanesha: ['basic', 'festival', 'divine', 'golden'].includes(selectedGanesha) ? selectedGanesha : 'basic',
      gameMode: gameMode || 'playing',
      lastSaved: Date.now(),
    };

    const player = await Player.findOneAndUpdate(
      { playerId },
      { $set: update },
      { upsert: true, new: true, runValidators: true }
    );

    return res.json({ success: true, data: player });
  } catch (err) {
    console.error('saveProgress error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/progress/reset
const resetProgress = async (req, res) => {
  try {
    const { playerId } = req.body;
    if (!playerId) {
      return res.status(400).json({ success: false, message: 'playerId is required' });
    }
    await Player.findOneAndDelete({ playerId });
    const fresh = await Player.create({ playerId });
    return res.json({ success: true, data: fresh });
  } catch (err) {
    console.error('resetProgress error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getProgress, saveProgress, resetProgress };
