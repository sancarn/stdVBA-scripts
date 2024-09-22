import { CubicBezier, Img, Line, makeScene2D } from "@motion-canvas/2d";
import { TypedText } from "../libs/TypedText";
import {
  all,
  createRef,
  easeInOutCubic,
  fadeTransition,
  tween,
  useDuration,
  waitUntil,
} from "@motion-canvas/core";
import retired from "../resources/DALLE-RetiredMan.webp";
import logistics from "../resources/DALLE-LogisticsMan.webp";

export default makeScene2D(function* (view) {
  const retireeElement = createRef<Img>();
  view.add(<Img src={retired} ref={retireeElement} />);
  const logisticsElement = createRef<Img>();
  view.add(<Img src={logistics} ref={logisticsElement} opacity={0} />);
  //In this series, we'll go over everything you need to know to get started with stdVBA
  yield* fadeTransition(2);
  yield* waitUntil("s3LogisticsFade");
  yield* logisticsElement().opacity(1, 3);
  yield* waitUntil("s3CreateTheGap");
  const bridgeTheGap = useDuration("s3BridgeThisGap");
  const imageWidth = 600;
  const imageOffset = 600;
  yield* all(
    retireeElement().x(-1 * imageOffset, bridgeTheGap),
    retireeElement().width(imageWidth, bridgeTheGap),
    logisticsElement().x(imageOffset, bridgeTheGap),
    logisticsElement().width(imageWidth, bridgeTheGap)
  );

  const bezier = createRef<CubicBezier>();
  const line = createRef<Line>();
  const text = createRef<TypedText>();
  const lineWidth = 10;
  view.add(
    <>
      <CubicBezier
        ref={bezier}
        p0={[-1 * imageOffset + imageWidth / 2, 0]}
        p1={[0, -100]}
        p2={[0, -100]}
        p3={[1 * imageOffset - imageWidth / 2, 0]}
        stroke={"#fff"}
        lineWidth={lineWidth}
      />
      <Line
        ref={line}
        points={[
          [
            -1 * imageOffset + imageWidth / 2,
            (-1 * logisticsElement().height()) / 2 + lineWidth / 2,
          ],
          [
            1 * imageOffset - imageWidth / 2,
            (-1 * logisticsElement().height()) / 2 + lineWidth / 2,
          ],
        ]}
        stroke={"#fff"}
        lineWidth={lineWidth}
      />
      <TypedText
        ref={text}
        x={0}
        y={-110}
        fontFamily={"Consolas"}
        fontSize={30}
        fill="#fff"
      />
    </>
  );
  bezier().end(0);
  line().end(0);
  yield* bezier().end(1, 0.5);
  yield* line().end(1, 0.3);
  yield* text().typeText("stdVBA", 0.5);
  yield* waitUntil("s3FadeOut");
  const fadeOutDuration = useDuration("s3End");
  yield* all(
    text().opacity(0, fadeOutDuration),
    line().opacity(0, fadeOutDuration),
    bezier().opacity(0, fadeOutDuration),
    logisticsElement().opacity(0, fadeOutDuration),
    retireeElement().opacity(0, fadeOutDuration)
  );
});
