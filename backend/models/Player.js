const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  flowers: { type: Number, default: 0 },
  ecoMaterials: { type: Number, default: 0 },
  modaks: { type: Number, default: 0 },
  diyas: { type: Number, default: 0 },
  decorations: { type: Number, default: 0 },
  leaves: { type: Number, default: 0 },
});

const characterSchema = new mongoose.Schema({
  name: { type: String, default: 'Player' },
  hairstyle: { type: Number, default: 0 },
  outfit: { type: Number, default: 0 },
  accessories: { type: Number, default: 0 },
  footwear: { type: Number, default: 0 },
});

const settingsSchema = new mongoose.Schema({
  musicVolume: { type: Number, default: 0.7 },
  sfxVolume: { type: Number, default: 0.8 },
  vibration: { type: Boolean, default: true },
  graphicsQuality: { type: String, default: 'medium', enum: ['low', 'medium', 'high', 'ultra'] },
  controlSensitivity: { type: Number, default: 1.0 },
  language: { type: String, default: 'en' },
  autoRun: { type: Boolean, default: false },
  autoInteract: { type: Boolean, default: false },
  cameraAssist: { type: Boolean, default: true },
  largerButtons: { type: Boolean, default: false },
  reducedSensitivity: { type: Boolean, default: false },
  objectiveMarkers: { type: Boolean, default: true },
});

const playerSchema = new mongoose.Schema({
  playerId: { type: String, required: true, unique: true, index: true },
  score: { type: Number, default: 0 },
  ecoScore: { type: Number, default: 0 },
  currentLevel: { type: Number, default: 1 },
  completedLevels: { type: [Number], default: [] },
  unlockedRewards: { type: [String], default: [] },
  completedMissions: { type: [String], default: [] },
  inventory: { type: inventorySchema, default: () => ({}) },
  character: { type: characterSchema, default: () => ({}) },
  settings: { type: settingsSchema, default: () => ({}) },
  selectedGanesha: { type: String, default: 'basic', enum: ['basic', 'festival', 'divine', 'golden'] },
  gameMode: { type: String, default: 'playing' },
  lastSaved: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
