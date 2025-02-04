// Sound effect URLs from mixkit.co (free sound effects)
export const SOUNDS = {
  correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  wrong: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
  gameOver: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  tick: 'https://assets.mixkit.co/active_storage/sfx/1859/1859-preview.mp3',
  background: 'https://assets.mixkit.co/active_storage/sfx/123/123-preview.mp3'
};

class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private isMuted = false;

  constructor() {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      this.sounds[key] = new Audio(url);
      if (key === 'background') {
        this.sounds[key].loop = true;
        this.sounds[key].volume = 0.3;
      }
    });
  }

  play(soundName: keyof typeof SOUNDS) {
    if (this.isMuted) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }

  stopAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAll();
    } else {
      this.playBackground();
    }
    return this.isMuted;
  }

  playBackground() {
    if (!this.isMuted) {
      this.sounds.background.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }
}

export const soundManager = new SoundManager();