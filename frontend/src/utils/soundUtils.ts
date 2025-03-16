import { ref, onMounted, onUnmounted } from 'vue';
import { Synth, start } from 'tone';

const DEFAULT_NOTE_DURATION = '8n';
const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

export function useSound() {
  const synth = new Synth().toDestination();

  async function playRandomNote(duration = DEFAULT_NOTE_DURATION) {
    await start();
    const note = notes[Math.floor(Math.random() * notes.length)];
    synth.triggerAttackRelease(note, duration);
  }

  function handleKeydown(event: KeyboardEvent) {
    playRandomNote();
  }

  function setUpSoundEventListeners() {
    onMounted(() => {
      window.addEventListener('keydown', handleKeydown);
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeydown);
    });
  }

  function playMusic(interval = 500) {
    setInterval(() => {
      playRandomNote();
    }, interval);
  }

  return { playRandomNote, setUpSoundEventListeners, playMusic };
}