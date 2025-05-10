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
  createRef,
  DEFAULT,
  Direction,
  slideTransition,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { VBA } from "../libs/vba-highlighter";
import { TypedText } from "../libs/TypedText";

export default makeScene2D(function* (view) {
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

  yield* slideTransition(Direction.Right, 1);
  yield* tt().typeText("notes on\nbind", 1);
  yield* waitFor(1);
  yield* all(tt().opacity(0, 1));

  //==> 3,2,1,4,5
  const example = (
    <Code
      fontSize={40}
      x={0}
      y={() => (-1 * example.height()) / 2 + 50}
      highlighter={VBA}
      code={`\
'Example
Sub main()
    set callback = stdCallback.CreateFromModule("", "printOut")
    callback.bind(1,2) _
            .bind(3,4) _
            .bind(5,6) _
            .run(7,8)
End Sub
Sub printOut(ParamArray v())
  Debug.Print Join(v,"-")
End Sub`}
      opacity={0}
    />
  ) as Code;
  view.add(example);
  const exampleRT = (
    <Code fontSize={40} x={0} y={250} highlighter={VBA} code="" />
  ) as Code;
  view.add(exampleRT);
  yield* all(example.opacity(1, 1));
  yield* all(
    exampleRT.code.edit(1)`${insert("(1,2)")}`,
    example.selection(example.findFirstRange(/bind\(1,2\)/g), 1)
  );
  yield* all(
    exampleRT.code.edit(1)`(1,2${insert(",3,4")})`,
    example.selection(example.findFirstRange(/bind\(3,4\)/g), 1)
  );
  yield* all(
    exampleRT.code.edit(1)`(1,2,3,4${insert(",5,6")})`,
    example.selection(example.findFirstRange(/bind\(5,6\)/g), 1)
  );
  yield* all(
    exampleRT.code.edit(1)`${insert("Run")}(1,2,3,4,5,6${insert(",7,8")})`,
    example.selection(example.findFirstRange(/run\(7,8\)/g), 1)
  );
  yield* waitUntil("s7_Eval");
  yield* all(
    exampleRT.code.edit(1)`${replace(
      "Run(",
      'Result: "'
    )}1,2,3,4,5,6,7,8${replace(")", '"')}`,
    example.selection(DEFAULT, 1)
  );

  yield* waitUntil("s7End");
});
