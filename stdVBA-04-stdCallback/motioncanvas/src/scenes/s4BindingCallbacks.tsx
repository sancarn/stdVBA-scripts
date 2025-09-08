import { Code, makeScene2D, View2D } from "@motion-canvas/2d";
import { TypedText } from "../libs/TypedText";

import {
  all,
  createRef,
  Direction,
  slideTransition,
  waitUntil,
} from "@motion-canvas/core";
import { VBA } from "../libs/vba-highlighter";

export default makeScene2D(function* (view: View2D) {
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

  /**
   * So this is pretty good, but it can be made better still by utilising
   */

  yield* slideTransition(Direction.Right, 1);
  yield* waitUntil("s4BeforeTitle");

  /**
   * the `bind` method.
   *
   * Instead of writing a separate function for each individual condition,
   *
   */

  yield* tt().typeText("bind", 0.5);
  yield* waitUntil("s4FadeTitle");
  yield* tt().opacity(0, 1);

  /**
   * we can create a generic condition function that can be applied to multiple filtering operations.
   *
   * Using `bind`, we can prepends parameters to the start of `stdCallback` function calls. This allows
   * us to dynamically generate filters without needing to define separate functions like `isGreen` or
   * `isSquare`. With this approach, we can eliminate all those additional function definitions while
   * keeping the code flexible and maintainable.
   */
  const codeRef = createRef<Code>();
  view.add(
    (
      <Code
        ref={codeRef}
        opacity={0}
        fontSize={40}
        x={0}
        y={0}
        highlighter={VBA}
        code={`\
Function isColor(ByVal color as string, ByVal shape as Shape) as Boolean  
  isColor = shape.color = color
End Function

Public Sub Main()
  set isYellow = stdCallback.CreateFromModule("","isColor").bind("yellow")
End Sub

'  Usage:
  isGreen(shp) 
    ==> isColor.bind("green")(shp)  
    ==>  isColor("green", shp)
`}
      />
    ) as Code
  );

  yield* codeRef().opacity(1, 1);
  const colors = [
    "yellow",
    "red",
    "blue",
    "green",
    "orange",
    "purple",
    "pink",
    "brown",
    "black",
    "white",
    "gray",
    "cyan",
    "magenta",
    "beige",
    "teal",
    "lavender",
    "maroon",
    "olive",
    "navy",
    "gold",
    "yellow",
    "red",
    "blue",
    "green",
    "orange",
    "purple",
    "pink",
    "brown",
    "black",
    "white",
    "gray",
    "cyan",
  ];
  var index = -1;
  for (var colorOld of colors.slice(undefined, colors.length - 1)) {
    index = index + 1;
    let colorNew = colors[index + 1];
    let varNameOld = "is" + colorOld[0].toUpperCase() + colorOld.slice(1);
    let varNameNew = "is" + colorNew[0].toUpperCase() + colorNew.slice(1);
    yield* all(
      codeRef().code.replace(
        codeRef().findFirstRange(varNameOld),
        varNameNew,
        1
      ),
      codeRef().code.replace(
        codeRef().findFirstRange('"' + colorOld + '"'),
        '"' + colorNew + '"',
        1
      )
    );
  }

  yield* waitUntil("s4End");
});
