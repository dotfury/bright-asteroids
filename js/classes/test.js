import p5 from "p5/lib/p5";

export default class Test {
	constructor() {
		console.log("HI");
		this.position = p5.Vector.random2D();
	}

	display() {
		ellipse(this.position.x, this.position.y, 200);
	}
}
