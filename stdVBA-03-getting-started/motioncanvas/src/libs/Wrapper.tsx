import { Node, View2D } from "@motion-canvas/2d";
import { Reference, createRef } from "@motion-canvas/core";

export class Wrapper<T extends Node> {
  public element: T;
  public x: number;
  public y: number;
  constructor(view: View2D, node: T) {
    this.element = node;
    this.x = this.element.position.x();
    this.y = this.element.position.y();
    view.add(this.element);
  }
  opacity(opacity: number, delay: number) {
    return this.element.opacity(opacity, delay);
  }
  move(dx: number, dy: number, duration: number = 0.5, delay: number = 0) {
    let ret = [
      this.element.position.x(this.x, delay).to(this.x + dx, duration),
      this.element.position.y(this.y, delay).to(this.y + dy, duration),
    ];
    this.x = this.x + dx;
    this.y = this.y + dy;
    return ret;
  }
  moveTo(x: number, y: number, duration: number = 0.5, delay: number = 0) {
    let ret = [
      this.element.position.x(this.x, delay).to(x, duration),
      this.element.position.y(this.y, delay).to(y, duration),
    ];
    this.x = x;
    this.y = y;
    return ret;
  }
}

// function test(){
//     const xx = createRefEx<Img>(<Img x={0} /> as Img)
//     xx.current().size(2,1)
// }
