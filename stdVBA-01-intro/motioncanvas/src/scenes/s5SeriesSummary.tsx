import {
  Code,
  Icon,
  Layout,
  Line,
  makeScene2D,
  Rect,
  Txt,
} from "@motion-canvas/2d";
import { all, createRef, useDuration, waitUntil } from "@motion-canvas/core";

//codicon:symbol-class
let classes = [
  "stdImage",
  "stdJSON",
  "stdLambda",
  "stdPerformance",
  "stdProcess",
  "stdQuadTree",
  "stdRefArray",
  "stdReg",
  "stdRegex",
  "stdSentry",
  "stdTimer",
  "stdUIElement",
  "stdWebSocket",
  "stdWindow",
  "stdAcc",
  "stdArray",
  "stdCallback",
  "stdClipboard",
  "stdCOM",
  "stdEnumerator",
  "stdFiber",
  "stdHTTP",
  "stdICallable",
].sort();

export default makeScene2D(function* (view) {
  const classListStartX = -300;
  let highlightRect = (
    <Rect fill={"#050"} width={500} height={60} x={classListStartX} y={-720} />
  );
  let classList = (
    <Layout direction={"column"} x={classListStartX} y={150} opacity={0} layout>
      {classes.map((klass) => (
        <Rect>
          <Icon
            icon="codicon:symbol-class"
            width={50}
            height={50}
            marginRight={20}
            color={"#fa0"}
          />
          <Txt text={klass} fill={"white"} fontFamily={"consolas"} />
        </Rect>
      ))}
    </Layout>
  );
  let featureArrows = [
    <Line
      points={[
        [classListStartX + 250, -85],
        [classListStartX + 500, -85 - 150],
      ]}
      stroke={"white"}
      lineWidth={10}
      end={0}
      endArrow
    />,
    <Line
      points={[
        [classListStartX + 250, -85],
        [classListStartX + 500, -85],
      ]}
      stroke={"white"}
      lineWidth={10}
      end={0}
      endArrow
    />,
    <Line
      points={[
        [classListStartX + 250, -85],
        [classListStartX + 500, -85 + 150],
      ]}
      stroke={"white"}
      lineWidth={10}
      end={0}
      endArrow
    />,
  ];
  let featureTexts = [
    <Txt
      text="Create"
      x={classListStartX + 500 + 100}
      y={-85 - 150}
      fill={"white"}
      opacity={0}
    />,
    <Txt
      text="CreateOptions"
      x={classListStartX + 500 + 180}
      y={-85}
      fill={"white"}
      opacity={0}
    />,
    <Txt
      text="ResponseText"
      x={classListStartX + 500 + 180}
      y={-85 + 150}
      fill={"white"}
      opacity={0}
    />,
  ];
  let codeBlock = (
    <Code
      x={2000}
      code={`\
Sub GetData()
  Dim request: Set request = CreateObject("MSXML2.ServerXMLHTTP")
  request.Open "GET", "http://goolge.com", false
  request.Send ""
  Debug.Print request.ResponseText
End Sub
    `}
    />
  );
  view.add(highlightRect);
  view.add(classList);
  view.add(featureArrows);
  view.add(featureTexts);
  view.add(codeBlock);
  yield* classList.opacity(1, 1);
  yield* highlightRect.y(-85, useDuration("s5Select"));
  yield* all(
    ...featureArrows.map((line: Line) => line.end(1, 1)),
    ...featureTexts.map((txt: Txt) => txt.opacity(1, 1))
  );
  yield* waitUntil("s5MoveToCode");

  yield* all(
    ...featureArrows.map((line: Line) => line.x(-2000 + 250, 1)),
    featureTexts[0].x(0, 1),
    featureTexts[0].y(-400, 1),
    featureTexts[1].x(-2000 + classListStartX + 500 + 180, 1),
    featureTexts[2].x(-2000 + classListStartX + 500 + 180, 1),
    highlightRect.x(-2000 + classListStartX, 1),
    classList.x(-2000 + classListStartX, 1),
    codeBlock.x(0, 1)
  );
  yield* all(
    featureTexts[0].y(0, 1),
    featureTexts[0].opacity(0, 1),
    (codeBlock as Code).code(
      `\
Sub GetData()
  Debug.Print stdHTTP.Create("http://goolge.com").ResponseText
End Sub
    `,
      1
    )
  );
  yield* waitUntil("s5End");
});
