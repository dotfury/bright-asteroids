function isMobileAgent() {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}

function hasTouchSupport() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function isMobileDevice() {
  if ('userAgentData' in navigator) {
    return navigator.userAgentData.mobile;
  }

  return isMobileAgent() && hasTouchSupport();
}
