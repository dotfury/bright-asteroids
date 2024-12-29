import { isMobileDevice } from "@/utils/device";

export default {
	frameRate: 50,
	duration: 30,
	width: 600,
	height: 600,
	clearScreen: true,
	animate: true,
	interations: 100,
	pixelDensity: 1,
	isMobile: isMobileDevice(),
};
