import { Code, makeScene2D } from "@motion-canvas/2d";
import {
  all,
  DEFAULT,
  Direction,
  slideTransition,
  waitUntil,
} from "@motion-canvas/core";
import { VBA } from "../libs/vba-highlighter";

export default makeScene2D(function* (view) {
  //TODO - how to highlight persistent code
  const c1: Code[] = [
    (
      <Code
        fontSize={30}
        x={-450}
        y={-335}
        highlighter={VBA}
        code={`\
Function filter ... (shapes as Collection ) as Collection
    set filter ...  = new Collection
    Dim shp as Shape
    For each shp in shapes
        if shp.type = "square" then
            Call filter ... .add(shp)
        end if
    next
End Function`}
      />
    ) as Code,
    (
      <Code
        fontSize={30}
        x={-450}
        y={0}
        highlighter={VBA}
        code={`\
Function filter ... (shapes as Collection ) as Collection
    set filter ...  = new Collection
    Dim shp as Shape
    For each shp in shapes
        if shp.type = "triangle" then
            Call filter ... .add(shp)
        end if
    next
End Function`}
      />
    ) as Code,
    (
      <Code
        fontSize={30}
        x={-450}
        y={335}
        highlighter={VBA}
        code={`\
Function filter ... (shapes as Collection ) as Collection
    set filter ...  = new Collection
    Dim shp as Shape
    For each shp in shapes
        if shp.color = "yellow" then
            Call filter ... .add(shp)
        end if
    next
End Function`}
      />
    ) as Code,
  ];

  c1.forEach((e) => view.add(e));

  yield* slideTransition(Direction.Right, 1);
  yield* waitUntil("s3HighlightDifferent");
  yield* all(
    ...c1.map((e) => e.selection(e.findAllRanges(/shp\.\w+ = "\w+"/gi), 1))
  );
  yield* waitUntil("s3Compose");
  yield* all(
    c1[0].code(
      `\
Function isSquare(shape as Shape) as Boolean  
  isSquare = shape.type = "square"
End Function`,
      1
    ),
    c1[1].code(
      `\
Function isTriangle(shape as Shape) as Boolean
  isTriangle = shape.type = "triangle"
End Function`,
      1
    ),
    c1[2].code(
      `\
Function isYellow(shape as Shape) as Boolean  
  isYellow = shape.color = "yellow"
End Function`,
      1
    ),
    ...c1.map((e) => e.x(400 - e.width(), 1)),
    ...c1.map((e, i) => e.y(-400 + i * 150, 1)),
    ...c1.map((e) => e.selection(DEFAULT, 0.5))
  );
  const cenumerator = (
    <Code
      opacity={0}
      fontSize={30}
      x={-380}
      y={200}
      highlighter={VBA}
      code={`\
Function FilterShapes( shapes as Collection, _
                      filterCondition as Function ) as Collection
  set FilterShapes = new Collection
  Dim shp as Shape
  For each shp in shapes
      if filterCondition(shp) then
          Call FilterShapes.add(shp)
      end if
  next
End Function`}
    />
  );
  view.add(cenumerator);
  yield* cenumerator.opacity(1, 1);
  yield* waitUntil("s3Main");
  const cmain = (
    <Code
      opacity={0}
      fontSize={40}
      x={380}
      y={300}
      highlighter={VBA}
      code={`\
Sub main()
  set shapes = getShapes()
  set shapes = FilterShapes(shapes, isSquare )
End Function`}
    />
  ) as Code;
  view.add(cmain);
  yield* cmain.opacity(1, 1);
  yield* cmain.code.replace(
    cmain.findFirstRange(/isSquare/gi),
    "isTriangle",
    1
  );
  yield* cmain.code.replace(
    cmain.findFirstRange(/isTriangle/gi),
    "isYellow",
    1
  );
  yield* waitUntil("s3End");
});
