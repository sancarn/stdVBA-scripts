import { Code, CubicBezier, makeScene2D } from "@motion-canvas/2d";
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
  ) as Code;
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
  let rangeMain = cmain.findFirstRange(/isYellow/gi);
  let rangeConditionDefinition = c1[2].findFirstRange(/isYellow/gi);
  let rangeConditionUsage = cenumerator.findFirstRange(
    /filterCondition\(shp\)/gi
  );

  const bezConditionToMain = (
    <CubicBezier
      lineWidth={6}
      stroke="lightseagreen"
      p0={[-621, -141]}
      p1={[-164, -139]}
      p2={[489, 8]}
      p3={[658, 280]}
      end={0}
      endArrow
    />
  ) as CubicBezier;
  view.add(bezConditionToMain);
  const bezMainToUsage = (
    <CubicBezier
      lineWidth={6}
      stroke="lightseagreen"
      p0={[626, 307]}
      p1={[328, 182]}
      p2={[-86, 192]}
      p3={[-412, 212]}
      end={0}
      endArrow
    />
  ) as CubicBezier;
  view.add(bezMainToUsage);

  yield* waitUntil("s3Arrows1");
  yield* all(
    cmain.selection(rangeMain, 1),
    c1[0].opacity(0.2, 1),
    c1[1].opacity(0.2, 1),
    c1[2].selection(rangeConditionDefinition, 1),
    cenumerator.selection(rangeConditionUsage, 1),
    bezConditionToMain.end(1, 1)
  );
  yield* waitUntil("s3Arrows2");
  yield* bezMainToUsage.end(1, 1);
  yield* waitUntil("s3ArrowsFade");
  yield* all(
    cmain.selection(DEFAULT, 1),
    c1[0].opacity(1, 1),
    c1[1].opacity(1, 1),
    c1[2].selection(DEFAULT, 1),
    cenumerator.selection(DEFAULT, 1),
    bezConditionToMain.opacity(0, 1),
    bezMainToUsage.opacity(0, 1)
  );

  /**
   * Unfortunately, VBA does not natively support passing functions as arguments.
   * However, `stdCallback`, allows us to encapsulate functions into callable objects,
   * making it possible to pass them as parameters.
   *
   * With a few tweaks, our code becomes valid VBA.
   */

  yield* waitUntil("s3VBACompatible");
  yield* all(
    cmain.code.replace(
      cmain.findFirstRange(/isYellow/gi),
      '_\r\n      stdCallback.CreateFromModule("","isYellow")',
      1
    ),
    cenumerator.code.replace(
      cenumerator.findFirstRange(/as Function/gi),
      "as stdCallback",
      1
    ),
    cenumerator.x(-355, 1)
  );

  /**
   * So this is pretty good, but it can be made better still by utilising the `bind` method.
   * Instead of writing a separate function for each individual condition,
   * we can create a generic condition function that can be applied to multiple filtering operations.
   *
   *
   */

  yield* waitUntil("s3End");
});
