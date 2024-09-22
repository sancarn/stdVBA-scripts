import { Txt, makeScene2D } from "@motion-canvas/2d";
import { waitFor, waitUntil } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  view.fill("#242424");
  //script: In many professional settings, data is king.
  const title = (
    <Txt fontSize={150} fontWeight={1000} textAlign={"center"} fill={"fff"}>
      {"Extracting data from\r\nSpreadsheets"}
    </Txt>
  );
  view.add(title);
  yield* waitFor(1);
  yield* waitUntil("scene1-end");
  yield* title.opacity(0, 1);
});
