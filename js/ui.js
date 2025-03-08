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
      C: ["C4", "E4", "G4"],
      Cm: ["C4", "Eb4", "G4"],
      C7: ["C4", "E4", "G4", "Bb4"],
      Cm7: ["C4", "Eb4", "G4", "Bb4"],
      Cmaj7: ["C4", "E4", "G4", "B4"],
      G: ["G3", "B3", "D4"],
      Gm: ["G3", "Bb3", "D4"],
      G7: ["G3", "B3", "D4", "F4"],
      Gm7: ["G3", "Bb3", "D4", "F4"],
      Gmaj7: ["G3", "B3", "D4", "F#4"],
      D: ["D3", "F#3", "A3"],
      Dm: ["D3", "F3", "A3"],
      D7: ["D3", "F#3", "A3", "C4"],
      Dm7: ["D3", "F3", "A3", "C4"],
      Dmaj7: ["D3", "F#3", "A3", "C#4"],
      A: ["A3", "C#4", "E4"],
      Am: ["A3", "C4", "E4"],
      A7: ["A3", "C#4", "E4", "G4"],
      Am7: ["A3", "C4", "E4", "G4"],
      Amaj7: ["A3", "C#4", "E4", "G#4"],
      E: ["E3", "G#3", "B3"],
      Em: ["E3", "G3", "B3"],
      E7: ["E3", "G#3", "B3", "D4"],
      Em7: ["E3", "G3", "B3", "D4"],
      Emaj7: ["E3", "G#3", "B3", "D#4"],
      F: ["F3", "A3", "C4"],
      Fm: ["F3", "Ab3", "C4"],
      F7: ["F3", "A3", "C4", "Eb4"],
      Fm7: ["F3", "Ab3", "C4", "Eb4"],
      Fmaj7: ["F3", "A3", "C4", "E4"],
      B: ["B3", "D#4", "F#4"],
      Bm: ["B3", "D4", "F#4"],
      B7: ["B3", "D#4", "F#4", "A4"],
      Bm7: ["B3", "D4", "F#4", "A4"],
      Bmaj7: ["B3", "D#4", "F#4", "A#4"],
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
