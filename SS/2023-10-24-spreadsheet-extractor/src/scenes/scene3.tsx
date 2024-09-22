import { Txt, makeScene2D } from "@motion-canvas/2d";
import { waitFor, waitUntil } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  view.fill("#242424");
  //script: The challenge? How can we write a tool which will be able to handle data extraction from all this data?
  const title1 = (
    <Txt fontSize={150} fontWeight={1000} textAlign={"center"} fill={"fff"}>
      {"How?"}
    </Txt>
  );
  view.add(title1);
  yield* waitFor(1);
  yield* waitUntil("scene1-end");
  yield* title1.opacity(0, 1);

  //script: Many people's first go-to is PowerQuery

  //script: You'll run into an issue because you'll need to handle this awful datastructure.
  //        I have seen some people handle this type of data structure before but it can be
  //        quite mind bending, and you'll have to do a different transformation for each
  //        version type. Surely there's an easier way?!

  //script: The solution is using VBA
});
