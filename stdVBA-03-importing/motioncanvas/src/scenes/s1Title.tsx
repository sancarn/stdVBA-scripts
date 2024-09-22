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

  //In this series, we'll go over everything you need to know to get started with stdVBA
  yield* waitUntil("beforeTitle");
  yield* tt().typeText("Motivation", 2);
  yield* waitUntil("afterTitle");
});
