import { ref } from 'vue';

const TIMER_TIME_LIMIT = 10;
const TIMER_INTERVAL = 1000;

export function useTimer(onTimeUp: () => void) {
  const timeLeft = ref<number>(TIMER_TIME_LIMIT);
  let timerReference: number;

  function startTimer() {
    timerReference = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        stopTimer()
        onTimeUp();
      }
    }, TIMER_INTERVAL);
  }

  function stopTimer() {
    clearInterval(timerReference);
  }

  function resetTimer() {
    stopTimer();
    timeLeft.value = TIMER_TIME_LIMIT;
    startTimer();
  }

  return { timeLeft, startTimer, stopTimer, resetTimer };
}
