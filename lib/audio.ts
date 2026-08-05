type ToneShape = "sine" | "triangle" | "sawtooth" | "square";

interface ToneOptions {
  frequency: number;
  duration: number;
  shape?: ToneShape;
  volume?: number;
  glideTo?: number;
  delay?: number;
}

const CHORDS: number[][] = [
  [261.63, 329.63, 392.0, 493.88], // Cmaj7
  [220.0, 261.63, 329.63, 440.0], // Am7
  [174.61, 220.0, 261.63, 349.23], // Fmaj7
  [196.0, 246.94, 293.66, 392.0], // G7
];

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientNodes: {
    padOscillators: OscillatorNode[];
    padGain: GainNode;
    arpeggioInterval: ReturnType<typeof setInterval>;
    chordInterval: ReturnType<typeof setInterval>;
    lfo: OscillatorNode;
    lfoGain: GainNode;
    chordIndex: number;
  } | null = null;
  private muted = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        ((window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.35;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : 0.35;
    }
  }

  private tone({
    frequency,
    duration,
    shape = "sine",
    volume = 0.3,
    glideTo,
    delay = 0,
  }: ToneOptions) {
    const ctx = this.getContext();
    if (!ctx || !this.masterGain || this.muted) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = shape;
    const startTime = ctx.currentTime + delay;
    osc.frequency.setValueAtTime(frequency, startTime);
    if (glideTo) {
      osc.frequency.exponentialRampToValueAtTime(glideTo, startTime + duration);
    }
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  click() {
    this.tone({ frequency: 720, duration: 0.09, shape: "sine", volume: 0.18 });
  }

  hover() {
    this.tone({ frequency: 980, duration: 0.06, shape: "sine", volume: 0.08 });
  }

  select() {
    this.tone({
      frequency: 520,
      duration: 0.22,
      shape: "triangle",
      glideTo: 880,
      volume: 0.22,
    });
  }

  whoosh() {
    this.tone({
      frequency: 220,
      duration: 0.5,
      shape: "sine",
      glideTo: 60,
      volume: 0.15,
    });
  }

  confirm() {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      this.tone({
        frequency: freq,
        duration: 0.35,
        shape: "sine",
        volume: 0.16,
        delay: i * 0.09,
      });
    });
  }

  celebrate() {
    const notes = [392, 523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((freq, i) => {
      this.tone({
        frequency: freq,
        duration: 0.6,
        shape: "triangle",
        volume: 0.14,
        delay: i * 0.11,
      });
    });
  }

  private ensureContext() {
    const ctx = this.getContext();
    if (ctx && ctx.state === "suspended") {
      void ctx.resume();
    }
  }

  startAmbient() {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.ambientNodes) return;

    const ctx = this.ctx;
    const master = this.masterGain;
    const padGain = ctx.createGain();
    padGain.gain.value = 0;
    padGain.connect(master);

    const padOscillators: OscillatorNode[] = [];
    const initialChord = CHORDS[0];
    initialChord.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const noteGain = ctx.createGain();
      noteGain.gain.value = 0.015;
      osc.connect(noteGain);
      noteGain.connect(padGain);
      osc.start();
      padOscillators.push(osc);
    });

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 0.018;
    lfo.connect(lfoGain);
    lfoGain.connect(padGain.gain);
    lfo.start();

    padGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2.5);

    let chordIndex = 0;

    const chordInterval = setInterval(() => {
      chordIndex = (chordIndex + 1) % CHORDS.length;
      const chord = CHORDS[chordIndex];
      const now = ctx.currentTime;
      padOscillators.forEach((osc, i) => {
        const targetFreq = chord[i] ?? osc.frequency.value;
        osc.frequency.cancelScheduledValues(now);
        osc.frequency.setValueAtTime(osc.frequency.value, now);
        osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 1.5);
      });
    }, 8000);

    const arpeggioInterval = setInterval(() => {
      if (this.muted) return;
      const chord = CHORDS[chordIndex];
      const note = chord[Math.floor(Math.random() * chord.length)];
      if (!note) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = note * (Math.random() > 0.7 ? 2 : 1);
      gain.gain.value = 0;
      const now = ctx.currentTime;
      gain.gain.linearRampToValueAtTime(0.035, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 1.8);
    }, 1600);

    this.ambientNodes = {
      padOscillators,
      padGain,
      arpeggioInterval,
      chordInterval,
      lfo,
      lfoGain,
      chordIndex,
    };
  }

  stopAmbient() {
    const nodes = this.ambientNodes;
    if (!nodes || !this.ctx) return;

    const { padOscillators, padGain, arpeggioInterval, chordInterval, lfo, lfoGain } = nodes;
    clearInterval(arpeggioInterval);
    clearInterval(chordInterval);

    const now = this.ctx.currentTime;
    padGain.gain.cancelScheduledValues(now);
    padGain.gain.setValueAtTime(padGain.gain.value, now);
    padGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    setTimeout(() => {
      padOscillators.forEach((osc) => osc.stop());
      lfo.stop();
      lfoGain.disconnect();
      padGain.disconnect();
    }, 1600);

    this.ambientNodes = null;
  }
}

export const audioEngine = new AudioEngine();
