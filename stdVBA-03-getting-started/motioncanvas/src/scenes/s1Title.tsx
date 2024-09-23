import { makeScene2D } from "@motion-canvas/2d";
import { TypedText } from "../libs/TypedText";
import { createRef, waitUntil } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const tt = createRef<TypedText>();
  view.add(
    <TypedText
      ref={tt}
      fontFamily="Consolas"
      fontSize={300}
      fill="#fff"
      x={0}
      y={0}
    />
  );

  //Getting started
  yield* waitUntil("beforeTitle");
  yield* tt().typeText("Getting started", 2);
  yield* waitUntil("afterTitle");
});
