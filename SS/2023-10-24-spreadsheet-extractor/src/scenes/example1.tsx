import { makeScene2D, Circle } from "@motion-canvas/2d";
import { all, createRef, waitFor } from "@motion-canvas/core";

//cloneElement
export default makeScene2D(function* (view) {
  const circle = <Circle width={140} height={140} fill="#e13238" />;
  view.add(circle);
  //x(fromValue, delayTilOperation).to(newValue, overTimeInSeconds)
  yield* circle.position.x(0, 0).to(100, 0.3);
  yield* circle.position.y(0, 0).to(100, 0.3);
  yield* circle.position.x(100, 0).to(-100, 0.3);
  yield* circle.position.y(100, 0).to(-100, 0.3);
  yield* circle.position.x(-100, 0).to(0, 0.3);
  yield* circle.position.y(-100, 0).to(0, 0.3);
});
