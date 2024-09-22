import { Icon, makeScene2D, Txt } from "@motion-canvas/2d";
import { waitUntil } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  view.add(
    <Icon
      icon={"material-symbols:warning"}
      x={0}
      y={-200}
      height={250}
      width={250}
      color={"rgb(255,180,0)"}
    />
  );
  view.add(
    <Txt
      text="Not for beginner developers"
      fill={"white"}
      fontSize={90}
      y={20}
    />
  );
  view.add(
    <Txt
      text="(Resources for beginners will be linked in the description)"
      fill={"white"}
      fontSize={60}
      y={200}
    />
  );
  yield* waitUntil("s6End");
});
