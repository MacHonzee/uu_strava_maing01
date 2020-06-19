function _padNum(num) {
  return num < 10 ? "0" + num : num;
}

const BrickTools = {
  formatDuration(seconds) {
    let hours = Math.floor(seconds / 3600);
    let secondsLeft = seconds % 3600;
    let minutes = Math.floor(secondsLeft / 60);
    let lastSeconds = secondsLeft % 60;
    return `${_padNum(hours)}:${_padNum(minutes)}:${_padNum(lastSeconds)}`;
  },

  countPace(seconds, distance) {
    return +(seconds / 60 / (distance / 1000)).toFixed(2);
  },

  formatPace(pace) {
    let mins = Math.floor(pace);
    let lastSeconds = Math.round((pace % 1) * 60);
    return `${_padNum(mins)}:${_padNum(lastSeconds)}/km`;
  }
};

export default BrickTools;
