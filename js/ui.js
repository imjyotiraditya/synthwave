/**
 * UI management module for SynthWave
 * Handles all DOM interactions and UI updates
 */

const UI = {
  elements: {
    // Control elements
    waveformSelect: document.getElementById("waveform"),
    attackSlider: document.getElementById("attack"),
    releaseSlider: document.getElementById("release"),
    attackValue: document.getElementById("attack-value"),
    releaseValue: document.getElementById("release-value"),

    // Button containers
    noteButtonsContainer: document.getElementById("note-buttons"),
    chordButtonsContainer: document.getElementById("chord-buttons"),
  },

  // Sound data
  data: {
    // Notes and chords definitions
    notes: [
      "C3",
      "D3",
      "E3",
      "F3",
      "G3",
      "A3",
      "B3",
      "C4",
      "D4",
      "E4",
      "F4",
      "G4",
      "A4",
      "B4",
      "C5",
    ],
    chords: {
      "C Major": ["C4", "E4", "G4"],
      "G Major": ["G3", "B3", "D4"],
      "A Minor": ["A3", "C4", "E4"],
      "F Major": ["F3", "A3", "C4"],
      "D Minor": ["D3", "F3", "A3"],
      "E Minor": ["E3", "G3", "B3"],
      "D Major": ["D3", "F#3", "A3"],
      "G Minor": ["G3", "Bb3", "D4"],
    },
  },

  /**
   * Initialize UI event listeners
   * @param {Object} audioEngine - Audio engine instance
   */
  init(audioEngine) {
    this.audioEngine = audioEngine;

    // Create UI elements
    this.createNoteButtons();
    this.createChordButtons();

    // Set up event listeners
    this.setupEventListeners();
  },

  /**
   * Set up event listeners for UI controls
   */
  setupEventListeners() {
    // Waveform select change
    this.elements.waveformSelect.addEventListener("change", () => {
      this.audioEngine.updateSettings({
        waveform: this.elements.waveformSelect.value,
      });
    });

    // Attack slider change
    this.elements.attackSlider.addEventListener("input", () => {
      const attackValue = this.elements.attackSlider.value;
      this.elements.attackValue.textContent = attackValue;
      this.audioEngine.updateSettings({
        attack: parseFloat(attackValue),
      });
    });

    // Release slider change
    this.elements.releaseSlider.addEventListener("input", () => {
      const releaseValue = this.elements.releaseSlider.value;
      this.elements.releaseValue.textContent = releaseValue;
      this.audioEngine.updateSettings({
        release: parseFloat(releaseValue),
      });
    });
  },

  /**
   * Create note buttons
   */
  createNoteButtons() {
    this.elements.noteButtonsContainer.innerHTML = "";

    this.data.notes.forEach((note) => {
      const button = document.createElement("button");
      button.className = "sound-button note-button";
      button.textContent = note;
      button.addEventListener("click", () =>
        this.handleNoteButtonClick(note, button)
      );
      this.elements.noteButtonsContainer.appendChild(button);
    });
  },

  /**
   * Create chord buttons
   */
  createChordButtons() {
    this.elements.chordButtonsContainer.innerHTML = "";

    Object.entries(this.data.chords).forEach(([name, notes]) => {
      const button = document.createElement("button");
      button.className = "sound-button chord-button";
      button.textContent = name;
      button.addEventListener("click", () =>
        this.handleChordButtonClick(notes, button)
      );
      this.elements.chordButtonsContainer.appendChild(button);
    });
  },

  /**
   * Handle note button click
   * @param {string} note - Note name
   * @param {HTMLElement} button - Button element
   */
  handleNoteButtonClick(note, button) {
    const result = this.audioEngine.playNote(note);

    if (result) {
      // Visual feedback
      button.style.backgroundColor = "#444";
      setTimeout(() => {
        button.style.backgroundColor = "";
      }, result.duration * 1000);
    }
  },

  /**
   * Handle chord button click
   * @param {Array} notes - Array of note names
   * @param {HTMLElement} button - Button element
   */
  handleChordButtonClick(notes, button) {
    this.audioEngine.playChord(notes);

    // Visual feedback
    button.style.backgroundColor = "#444";
    setTimeout(() => {
      button.style.backgroundColor = "";
    }, 500);
  },
};

export default UI;
