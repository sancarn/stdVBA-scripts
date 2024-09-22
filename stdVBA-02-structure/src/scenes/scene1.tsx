import { makeScene2D, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  waitFor,
  Reference,
  waitUntil,
  useDuration,
  slideTransition,
  Direction,
} from "@motion-canvas/core";
import { TypedText } from "./libs/TypedText";

//cloneElement
export default makeScene2D(function* (view) {
  const tt = createRef<TypedText>();
  view.add(<TypedText ref={tt} fontFamily="Consolas" fontSize={300} fill="#fff" x={0} y={0} />);
  //Hello and welcome everyone to stdVBA, the gateway to modern VBA programming
  yield* waitUntil("beforeTitle");
  yield* tt().typeText("stdVBA", 1.2);
  yield* waitUntil("afterTitle");

  //In this episode, the structure of stdVBA
  yield* waitUntil("beforeStructure");
  yield* tt().typeText("Structure", 1);
  yield* waitUntil("afterStructure");
});
