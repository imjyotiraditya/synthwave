/**
 * Main script for SynthWave
 * Initializes the application and handles audio synthesis
 */

import AudioEngine from "./audio.js";
import UI from "./ui.js";

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Create audio engine
  const audioEngine = new AudioEngine();

  // Initialize UI with the audio engine
  UI.init(audioEngine);
});
