import { Img, Layout, makeScene2D, Rect, Txt, View2D } from "@motion-canvas/2d";
import {
  createRef,
  Direction,
  fadeTransition,
  slideTransition,
  waitFor,
  waitUntil,
  zoomInTransition,
} from "@motion-canvas/core";
import { TypedText } from "./libs/TypedText";
import { TxtLeaf } from "@motion-canvas/2d/lib/components/TxtLeaf";
import documentationExample from "./resources/DocumentationExample.png";

/**
 * @context
 * These can be found by intellisense, simply write the class name dot create...
 * All methods prefixed with "Create" are factory methods for the class
 * Protected methods of classes have the prefix `prot`
 */
export default makeScene2D(function* (view) {
  const ref = createRef<Img>();
  view.add(<Img ref={ref} src={documentationExample} width={1500} />);

  yield* slideTransition(Direction.Right, 1);
  yield* waitUntil("endVideo");

  //? Finally, all functions in stdVBA are documented at the function level.
  //? If ever you want to find out how to use a function, simply search for it in the class
});
