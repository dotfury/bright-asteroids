import { isMobileDevice } from '@/utils/device';

export default {
  frameRate: 50,
  duration: 30,
  width: window.innerWidth - 10,
  height: window.innerHeight - 10,
  clearScreen: true,
  animate: true,
  interations: 100,
  pixelDensity: 1,
  isMobile: isMobileDevice(),
};
