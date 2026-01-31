
class SoundService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private musicInterval: any = null;
  private musicActive: boolean = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setEnabled(val: boolean) {
    this.enabled = val;
    if (!val) this.stopIntroMusic();
  }

  playImpact() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx!.currentTime;
    
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    osc.start();
    osc.stop(now + 0.3);

    const click = this.ctx!.createOscillator();
    const clickGain = this.ctx!.createGain();
    click.type = 'square';
    click.frequency.setValueAtTime(800, now);
    clickGain.gain.setValueAtTime(0.1, now);
    clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    click.connect(clickGain);
    clickGain.connect(this.ctx!.destination);
    click.start();
    click.stop(now + 0.05);
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx!.currentTime;
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.1);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    osc.start();
    osc.stop(now + 0.1);
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx!.currentTime;
    [440, 554, 659, 880].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.1, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.3);
    });
  }

  playSparkle() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx!.currentTime;
    for (let i = 0; i < 8; i++) {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1500 + Math.random() * 2000, now + i * 0.05);
      gain.gain.setValueAtTime(0, now + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.05, now + i * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.1);
    }
  }

  playMunch() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx!.currentTime;
    for (let i = 0; i < 3; i++) {
      const noise = this.ctx!.createBufferSource();
      const buffer = this.ctx!.createBuffer(1, this.ctx!.sampleRate * 0.05, this.ctx!.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < data.length; j++) data[j] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      const gain = this.ctx!.createGain();
      gain.gain.setValueAtTime(0.1, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.05);
      noise.connect(gain);
      gain.connect(this.ctx!.destination);
      noise.start(now + i * 0.1);
    }
  }

  playSqueak() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx!.currentTime;
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.05);
    osc.frequency.linearRampToValueAtTime(1000, now + 0.1);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    osc.start();
    osc.stop(now + 0.15);
  }

  playIntroMusic() {
    if (!this.enabled || this.musicActive) return;
    this.init();
    this.musicActive = true;
    
    let step = 0;
    const tempo = 135;
    const stepDuration = 60 / tempo / 2; // Eighth notes

    this.musicInterval = setInterval(() => {
      const now = this.ctx!.currentTime;
      
      // Kick drum on 1 and 3
      if (step % 4 === 0) {
        const kick = this.ctx!.createOscillator();
        const kGain = this.ctx!.createGain();
        kick.frequency.setValueAtTime(120, now);
        kick.frequency.exponentialRampToValueAtTime(40, now + 0.1);
        kGain.gain.setValueAtTime(0.3, now);
        kGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        kick.connect(kGain);
        kGain.connect(this.ctx!.destination);
        kick.start();
        kick.stop(now + 0.15);
      }

      // Snare on 2 and 4
      if (step % 4 === 2) {
        const noise = this.ctx!.createBufferSource();
        const buffer = this.ctx!.createBuffer(1, this.ctx!.sampleRate * 0.1, this.ctx!.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < data.length; j++) data[j] = Math.random() * 2 - 1;
        noise.buffer = buffer;
        const sGain = this.ctx!.createGain();
        sGain.gain.setValueAtTime(0.1, now);
        sGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        noise.connect(sGain);
        sGain.connect(this.ctx!.destination);
        noise.start();
      }

      // Bouncy Bass
      const bassNotes = [110, 164.81, 110, 164.81]; // A2, E3
      const bassFreq = bassNotes[Math.floor(step / 2) % 4];
      if (step % 2 === 0) {
        const bass = this.ctx!.createOscillator();
        const bGain = this.ctx!.createGain();
        bass.type = 'triangle';
        bass.frequency.setValueAtTime(bassFreq, now);
        bGain.gain.setValueAtTime(0.15, now);
        bGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        bass.connect(bGain);
        bGain.connect(this.ctx!.destination);
        bass.start();
        bass.stop(now + 0.2);
      }

      // Quirky Kazoo Melody
      const melody = [440, 0, 440, 493, 523, 0, 523, 587, 659, 0, 659, 587, 523, 0, 493, 440];
      const freq = melody[step % 16];
      if (freq > 0) {
        const mel = this.ctx!.createOscillator();
        const mGain = this.ctx!.createGain();
        mel.type = 'square';
        mel.frequency.setValueAtTime(freq, now);
        mGain.gain.setValueAtTime(0.03, now);
        mGain.gain.exponentialRampToValueAtTime(0.005, now + 0.15);
        mel.connect(mGain);
        mGain.connect(this.ctx!.destination);
        mel.start();
        mel.stop(now + 0.15);
      }

      step++;
    }, stepDuration * 1000);
  }

  stopIntroMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.musicActive = false;
  }
}

export const soundService = new SoundService();
