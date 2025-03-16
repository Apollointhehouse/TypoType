import { ref, onMounted, onUnmounted } from 'vue';
import * as Tone from 'tone';

const DEFAULT_NOTE_DURATION = '50n';
const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

export function useSound() {
    const synth = new Tone.Synth().toDestination();

    async function playRandomNote(duration = DEFAULT_NOTE_DURATION) {
        await Tone.start();
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

    function playMusic() {
        setInterval(() => {
            playRandomNote();
        }, 500);
    }

    return { setUpSoundEventListeners, playMusic };
}
