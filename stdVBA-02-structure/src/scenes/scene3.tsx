import { Layout, makeScene2D, Rect, Txt, View2D } from "@motion-canvas/2d";
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

/**
 * @context
 * Most classes in stdVBA have a set of factory methods or constructors.
 * ... (fade out stdPerformance and stdClipboard)
 * ... (fade out all)
 */
export default makeScene2D(function* (view) {
  yield* slideTransition(Direction.Right, 1);

  const tt = createRef<TypedText>();

  const intellisenseText =
    "CreateFromPoint\nCreateFromHwnd\nCreateFromApplication\nCreateFromDesktop\nCreateFromIAccessible\nCreateFromPath" +
    "\nDefaultAction\nDescription\nDoDefaultAction\nFindAll\nFindFirst\nFocus\nGetDescendents\ngetPath\nHelp\nHelpTopic" +
    "\nHitTest\nhwnd\nIdentity\nKeyboardShortcut\nLocation\nname\nParent\nPrintChildTexts\nPrintDescTexts\nprotAccessible" +
    "\nprotGetLookups\nprotInitWithProxy";
  const intellisense = createRef<Txt>();
  const offsetX = 150;
  const offsetY = 500;
  view.add(
    <>
      <Txt
        ref={intellisense}
        text={intellisenseText}
        fill="#fff"
        fontFamily={"Consolas"}
        fontSize={70}
        height={30}
        x={423}
        y={60}
        opacity={0}
      />
      <Rect
        fill="rgb(26,26,26)"
        x={423 + offsetX / 2}
        width={810 + offsetX}
        y={(-1 * offsetY) / 2}
        height={100 + offsetY}
      ></Rect>
      <TypedText ref={tt} fontFamily="Consolas" fontSize={70} fill="#fff" />
    </>
  );

  //These can be found by intellisense, simply write the class name
  yield* waitUntil("beforeWriteClass");
  yield* tt().typeText("stdAcc", 0.5);

  //dot create...
  yield* waitUntil("beforeDotCreate");
  yield* tt().addText(".Create", 0.5);

  //All methods prefixed with "Create" are factory methods for the class
  // yield* waitUntil("showIntellisense");
  yield* intellisense().opacity(0.5, 0.5);

  //Protected methods of classes have the prefix `prot`
  yield* waitUntil("showProtectedMethods");
  yield* intellisense().y(-1 * intellisense().childAs<TxtLeaf>(0).height() + 320, 1);
  yield* waitUntil("beforeScene4");

  //? Finally, all functions in stdVBA are documented at the function level.
  //? If ever you want to find out how to use a function, simply search for it in the class
});
