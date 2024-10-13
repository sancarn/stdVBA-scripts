import {
  Code,
  makeScene2D,
  Polygon,
  LezerHighlighter,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  Direction,
  linear,
  loop,
  slideTransition,
  spawn,
  useThread,
  waitUntil,
} from "@motion-canvas/core";
import { VBA } from "../libs/vba-highlighter";

const shapes = [
  { type: "triangle", color: "blue", x: 0.46, y: 0.85, rot: 0.1 },
  { type: "triangle", color: "red", x: 0.21, y: 0.79, rot: 0.4 },
  { type: "triangle", color: "red", x: 0.4, y: 0.18, rot: 0.4 },
  { type: "triangle", color: "yellow", x: 0.69, y: 0.5, rot: 0.2 },
  { type: "triangle", color: "green", x: 0.51, y: 0.6, rot: 0.4 },
  { type: "square", color: "blue", x: 0.79, y: 0.21, rot: 0.1 },
  { type: "triangle", color: "red", x: 0.05, y: 0.5, rot: 0.1 },
  { type: "square", color: "yellow", x: 0.71, y: 0.94, rot: 0.2 },
  { type: "triangle", color: "yellow", x: 0.9, y: 0.8, rot: 0.4 },
  { type: "square", color: "red", x: 0.3, y: 0.4, rot: 0.2 },
];
const typeToSides: { [key: string]: number } = {
  triangle: 3,
  square: 4,
};

export default makeScene2D(function* (view) {
  const thread = useThread();
  let elements = shapes.map((shape) => {
    let sides = typeToSides[shape.type as any];
    let ref = createRef<Polygon>();
    let element = (
      <Polygon
        sides={sides}
        ref={ref}
        size={160}
        fill={shape.color}
        x={(1920 / 2) * 0.9 * (shape.x * 2 - 1)}
        y={(1080 / 2) * 0.8 * (shape.y * 2 - 1)}
        rotation={() => thread.time() * 90 * shape.rot}
      />
    );
    return { ...shape, element };
  });
  elements.forEach((v) => view.add(v.element));
  yield* slideTransition(Direction.Right);
  yield* waitUntil("s2MakeCollection");
  yield* all(
    ...elements.map(({ element }, i) =>
      element.x((1920 / 2) * 0.9 * ((i / (shapes.length - 1)) * 2 - 1), 1)
    ),
    ...elements.map(({ element }) => element.y((1080 / 2) * 0.8 * -1, 1))
  );
  yield* waitUntil("s2FilterSquare");
  let codeRef = createRef<Code>();
  let code = (
    <Code
      ref={codeRef}
      highlighter={VBA}
      opacity={0}
      code={`\
Function filterSquares(shapes as Collection) as Collection
    set filterSquares = new Collection
    Dim shp as Shape
    For each shp in shapes
        if shp.type = "square" then
            Call filterSquares.add(shp)
        end if
    next
End Function`}
    />
  );
  view.add(code);
  yield* all(
    code.opacity(1, 1),
    ...elements.map((e) => e.element.opacity(0.1, 1)),
    ...elements
      .filter((e) => e.type == "square")
      .map((e) => e.element.opacity(1, 1))
  );
  yield* waitUntil("s2FilterTriangles");
  yield* all(
    codeRef().code(
      `\
Function filterTriangles(shapes as Collection) as Collection
    set filterTriangles = new Collection
    Dim shp as Shape
    For each shp in shapes
        if shp.type = "triangle" then
            Call filterTriangles.add(shp)
        end if
    next
End Function`,
      1
    ),
    ...elements.map((e) => e.element.opacity(0.1, 1)),
    ...elements
      .filter((e) => e.type == "triangle")
      .map((e) => e.element.opacity(1, 1))
  );
  yield* waitUntil("s2FilterYellow");
  yield* all(
    codeRef().code(
      `\
Function filterYellow(shapes as Collection) as Collection
    set filterYellow = new Collection
    Dim shp as Shape
    For each shp in shapes
        if shp.color = "yellow" then
            Call filterYellow.add(shp)
        end if
    next
End Function`,
      1
    ),
    ...elements.map((e) => e.element.opacity(0.1, 1)),
    ...elements
      .filter((e) => e.color == "yellow")
      .map((e) => e.element.opacity(1, 1))
  );
  yield* waitUntil("s2FilterRedTriangles");
  yield* all(
    codeRef().code(
      `\
Function filterRedTriangles(shapes as Collection) as Collection
    set filterRedTriangles = new Collection
    Dim shp as Shape
    For each shp in shapes
        if shp.type = "triangle" and shp.color = "red" then
            Call filterRedTriangles.add(shp)
        end if
    next
End Function`,
      1
    ),
    ...elements.map((e) => e.element.opacity(0.1, 1)),
    ...elements
      .filter((e) => e.type == "triangle" && e.color == "red")
      .map((e) => e.element.opacity(1, 1))
  );
  yield* waitUntil("s2End");
});
