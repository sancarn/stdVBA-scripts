import {
  Code,
  CodeRange,
  CubicBezier,
  insert,
  makeScene2D,
  remove,
  replace,
} from "@motion-canvas/2d";
import {
  all,
  DEFAULT,
  Direction,
  slideTransition,
  waitUntil,
} from "@motion-canvas/core";
import { VBA } from "../libs/vba-highlighter";

export default makeScene2D(function* (view) {
  const mainCode1 = `\
Function isSquare(ByVal shp as Shape) as Boolean
    isSquare = shp.type = "square"
End Function

Function isTriangle(ByVal shp as Shape) as Boolean
    isTriangle = shp.type = "triangle"
End Function

Function isYellow(ByVal shp as Shape) as Boolean
    isYellow = shp.color = "yellow"
End Function

Function isRed(ByVal shp as Shape) as Boolean
    isRed = shp.color = "red"
End Function

Function FilterShapes(ByVal shapes as Collection, ByVal filter as stdCallback) as Collection
  set FilterShapes = new Collection
  Dim shp as Shape
  For each shp in shapes
    if filter(shp) then
      Call FilterShapes.add(shp)
    end if
  next
End Function

Sub MainRedTriangles()
  set shapes = getShapes()
  set shapes = FilterShapes(shapes, stdCallback.CreateFromModule("","isRed"))
  set shapes = FilterShapes(shapes, stdCallback.CreateFromModule("","isTriangle"))
End Sub`;
  const main = (
    <Code fontSize={28} x={0} y={0} highlighter={VBA} code={mainCode1} />
  ) as Code;
  view.add(main);

  yield* slideTransition(Direction.Right, 1);

  //Let's define a generic `isColor` and `isType` function to check the color and shape type respectively.
  yield* waitUntil("s5ReplaceCode");
  yield* all(
    main.code.edit(2)`\
Function ${replace("isSquare", "isType")}(${insert(
      "ByVal sType as string, "
    )}ByVal shp as Shape) as Boolean
    ${replace("isSquare", "isType")} = shp.type = ${replace(
      '"square"',
      "sType"
    )}
End Function

${remove(`Function isTriangle(ByVal shp as Shape) as Boolean
    isTriangle = shp.type = "triangle"
End Function

`)}Function ${replace("isYellow", "isColor")}(${insert(
      "ByVal sColor as string, "
    )}ByVal shp as Shape) as Boolean
    ${replace("isYellow", "isColor")} = shp.color = ${replace(
      '"yellow"',
      "sColor"
    )}
End Function

${remove(`Function isRed(ByVal shp as Shape) as Boolean
    isRed = shp.color = "red"
End Function

`)}Function FilterShapes(ByVal shapes as Collection, ByVal filter as stdCallback) as Collection
  set FilterShapes = new Collection
  Dim shp as Shape
  For each shp in shapes
    if filter(shp) then
      Call FilterShapes.add(shp)
    end if
  next
End Function

Sub MainRedTriangles()
  set shapes = getShapes()
  set shapes = FilterShapes(shapes, stdCallback.CreateFromModule("","${replace(
    "isRed",
    "isColor"
  )}"))${insert('.bind("red")')}
  set shapes = FilterShapes(shapes, stdCallback.CreateFromModule("","${replace(
    "isTriangle",
    "isType"
  )}"))${insert('.bind("triangle")')}
End Sub`,
    main.fontSize(34, 2)
  );

  /**
   * And just like that you can see we've trimmed down our initial growing code block,
   * to a small set of flexible, unitary components.
   */
  const originalCode = `\
Function filterSquares(shapes as Collection) as Collection
    set filterSquares = new Collection
    Dim shp as Shape
    For each shp in shapes
        if shp.type = "square" then
            Call filterSquares.add(shp)
        end if
    next
End Function
Function filterTriangles(shapes as Collection) as Collection
    set filterTriangles = new Collection
    Dim shp as Shape
    For each shp in shapes
        if shp.type = "triangle" then
            Call filterTriangles.add(shp)
        end if
    next
End Function
Function filterYellow(shapes as Collection) as Collection
    set filterYellow = new Collection
    Dim shp as Shape
    For each shp in shapes
        if shp.color = "yellow" then
            Call filterYellow.add(shp)
        end if
    next
End Function
Function filterRed(shapes as Collection) as Collection
    set filterRed = new Collection
    Dim shp as Shape
    For each shp in shapes
        if shp.color = "red" then
            Call filterRed.add(shp)
        end if
    next
End Function
Function filterRedTriangles(shapes as Collection) as Collection
    set filterRedTriangles = new Collection
    Dim shp as Shape
    For each shp in shapes
        if shp.type = "triangle" and shp.color = "red" then
            Call filterRedTriangles.add(shp)
        end if
    next
End Function`;
  const original = (
    <Code fontSize={20} x={-1600} y={0} highlighter={VBA} code={originalCode} />
  ) as Code;
  view.add(original);
  yield* waitUntil("s5Comparrison");
  yield* all(original.x(-600, 1), main.x(400, 1), main.fontSize(20, 1));

  yield* waitUntil("s5Lambda");
  yield* all(original.x(-1300, 1), main.x(0, 1), main.fontSize(32, 1));
  yield* waitUntil("s5Lambda2");
  yield* main.code(
    `\
Function FilterShapes(ByVal shapes as Collection, ByVal filter as stdICallable) as Collection
  set FilterShapes = new Collection
  Dim shp as Shape
  For each shp in shapes
    if filter(shp) then
      Call FilterShapes.add(shp)
    end if
  next
End Function

Sub MainRedTriangles()
  set shapes = getShapes()
  set shapes = FilterShapes(shapes, stdLambda.Create("$1.color = ""red"" and $1.type = ""triangle"""))
End Sub
`,
    1
  );

  /**
   * But we're not done yet, join us next time to see how this code could be improved further with `stdLambda`.
   */

  yield* waitUntil("s5End");
});
