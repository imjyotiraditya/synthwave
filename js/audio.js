/**
 * Audio Engine module for SynthWave
 * Handles Web Audio API interactions and sound synthesis
 */

class AudioEngine {
  constructor() {
    // Create audio context
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    // Create main gain node
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0.5;
    this.gainNode.connect(this.audioContext.destination);

    // Default settings
    this.settings = {
      waveform: "sine",
      attack: 0.1,
      release: 0.5,
    };
  }

  /**
   * Note frequency conversion
   * Converts a note name to its frequency in Hz
   * @param {string} note - Note name (e.g. 'C4', 'A#3', etc.)
   * @returns {number|null} - Frequency in Hz or null if invalid
   */
  noteToFreq(note) {
    const noteMap = {
      C: 0,
      "C#": 1,
      Db: 1,
      D: 2,
      "D#": 3,
      Eb: 3,
      E: 4,
      F: 5,
      "F#": 6,
      Gb: 6,
      G: 7,
      "G#": 8,
      Ab: 8,
      A: 9,
      "A#": 10,
      Bb: 10,
      B: 11,
    };

    // Handle special case for flat notes
    let noteMatch;
    if (note.includes("b")) {
      noteMatch = note.match(/^([A-G]b)(\d)$/);
    } else {
      noteMatch = note.match(/^([A-G]#?)(\d)$/);
    }

    if (!noteMatch) return null;

    const noteName = noteMatch[1];
    const octave = parseInt(noteMatch[2]);

    const noteIndex = noteMap[noteName];
    if (noteIndex === undefined) return null;

    // A4 = 440Hz standard tuning
    return 440 * Math.pow(2, (noteIndex - 9) / 12 + (octave - 4));
  }

  /**
   * Update synth settings
   * @param {Object} settings - Settings object with properties to update
   */
  updateSettings(settings) {
    this.settings = { ...this.settings, ...settings };
  }

  /**
   * Play a single note
   * @param {string} note - Note name (e.g. 'C4', 'A#3', etc.)
   * @returns {Object} - Object with duration info for visual feedback
   */
  playNote(note) {
    // Resume audio context if it was suspended (browser policy)
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    const frequency = this.noteToFreq(note);
    if (!frequency) return null;

    const oscillator = this.audioContext.createOscillator();
    const noteGain = this.audioContext.createGain();

    // Configure oscillator
    oscillator.type = this.settings.waveform;
    oscillator.frequency.value = frequency;

    // Configure envelope
    const attackTime = parseFloat(this.settings.attack);
    const releaseTime = parseFloat(this.settings.release);

    noteGain.gain.value = 0;
    oscillator.connect(noteGain);
    noteGain.connect(this.gainNode);

    // Start oscillator
    oscillator.start();

    // Attack phase
    noteGain.gain.linearRampToValueAtTime(
      0.7,
      this.audioContext.currentTime + attackTime
    );

    // Release phase
    noteGain.gain.linearRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + attackTime + releaseTime
    );

    // Stop oscillator after release
    oscillator.stop(
      this.audioContext.currentTime + attackTime + releaseTime + 0.1
    );

    return {
      duration: attackTime + releaseTime,
    };
  }

  /**
   * Play a chord (multiple notes simultaneously)
   * @param {Array} notes - Array of note names to play
   */
  playChord(notes) {
    // Resume audio context if it was suspended (browser policy)
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    notes.forEach((note) => this.playNote(note));
  }
}

export default AudioEngine;
