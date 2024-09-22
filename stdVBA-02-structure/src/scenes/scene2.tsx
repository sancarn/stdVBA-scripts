import { makeScene2D, Txt, Rect, CubicBezier, Camera } from "@motion-canvas/2d";
import {
  all,
  createRef,
  waitUntil,
  Reference,
  map,
  useDuration,
  slideTransition,
  Direction,
  waitFor,
} from "@motion-canvas/core";
import project from "../project";
import { Callout } from "./libs/Callout";

//cloneElement
export default makeScene2D(function* (view) {
  const seperation: number = 70;
  const rectWidth: number = 400;
  const rectHeight: number = 60;
  const offset: number = 600;
  const children = [];
  const rectRefs: { [key: string]: Reference<Rect> } = {};

  //stdICallable - Interface
  const refStdICallable = createRef<Rect>();
  const stdICallable = (
    <Rect ref={refStdICallable} x={0} y={0} width={rectWidth} height={rectHeight} fill={"#A02B93"}>
      <Txt text="stdICallable" fontFamily="Consolas" fontSize={50} fill="#fff" />
    </Rect>
  );
  children.push(stdICallable);
  rectRefs["stdICallable"] = refStdICallable;

  //stdICallable - Requirees
  const requireCallables =
    "stdAcc,stdArray,stdEnumerator,stdFiber,stdHTTP,stdProcess,stdTimer,stdUIElement,stdWebsocket,stdWindow".split(",");
  const boxesCallables = requireCallables.map((e, i) => {
    const rect = createRef<Rect>();
    rectRefs[e] = rect;
    const bezier = createRef<CubicBezier>();
    return (
      <>
        <Rect
          ref={rect}
          x={() => refStdICallable().x() - offset}
          y={(-1 * requireCallables.length * seperation) / 2 + rectHeight / 2 + i * seperation}
          width={rectWidth}
          height={rectHeight}
          fill={"#00B050"}
        >
          <Txt text={e} fontFamily="Consolas" fontSize={50} fill="#fff" />
        </Rect>
        <CubicBezier
          ref={bezier}
          lineWidth={6}
          stroke={"#fff"}
          endArrow={true}
          arrowSize={15}
          p0X={() => rect().x() + rectWidth / 2}
          p0Y={rect().y()}
          p1X={() => bezier().p0().x + (1 / 2) * (bezier().p3().x - bezier().p0().x)}
          p1Y={() => bezier().p0().y}
          p2X={() => bezier().p3().x - (2 / 3) * (bezier().p3().x - bezier().p0().x)}
          p2Y={() => bezier().p3().y}
          p3X={() => refStdICallable().x() - rectWidth / 2}
          p3Y={() => refStdICallable().y()}
        />
      </>
    );
  });
  boxesCallables.forEach((e) => {
    children.push(e);
  });

  //stdICallable - Implementors
  const implementors = "stdLambda,stdCallback".split(",");
  const boxesImplementors = implementors.map((e, i) => {
    const rect = createRef<Rect>();
    rectRefs[e] = rect;
    const bezier = createRef<CubicBezier>();
    return (
      <>
        <Rect
          ref={rect}
          x={() => refStdICallable().x() + offset}
          y={(-1 * implementors.length * seperation) / 2 + rectHeight / 2 + i * seperation}
          width={rectWidth}
          height={rectHeight}
          fill={"#000098"}
        >
          <Txt text={e} fontFamily="Consolas" fontSize={50} fill="#fff" />
        </Rect>
        <CubicBezier
          ref={bezier}
          lineWidth={6}
          stroke={"#fff"}
          endArrow={true}
          arrowSize={15}
          p0X={() => refStdICallable().x() + rectWidth / 2}
          p0Y={() => refStdICallable().y()}
          p1X={() => bezier().p0().x + (1 / 2) * (bezier().p3().x - bezier().p0().x)}
          p1Y={() => bezier().p0().y}
          p2X={() => bezier().p3().x - (1 / 2) * (bezier().p3().x - bezier().p0().x)}
          p2Y={() => bezier().p3().y}
          p3X={() => rect().x() - rectWidth / 2}
          p3Y={rect().y()}
        />
      </>
    );
  });
  boxesImplementors.forEach((e) => {
    children.push(e);
  });

  const otherClasses =
    "stdClipboard,stdCOM,stdImage,stdJSON,stdPerformance,stdQuadTree,stdRefArray,stdReg,stdRegex".split(",");
  const boxOtherClasses = otherClasses
    .map((e, i) => {
      const rect = createRef<Rect>();
      rectRefs[e] = rect;
      return (
        <Rect
          ref={rect}
          x={view.width() - rectWidth * 2 + 40}
          y={(-1 * otherClasses.length * seperation) / 2 + rectHeight / 2 + i * seperation}
          width={rectWidth}
          height={rectHeight}
          fill={"#C04F15"}
        >
          <Txt text={e} fontFamily="Consolas" fontSize={50} fill="#fff" />
        </Rect>
      );
    })
    .forEach((e) => children.push(e));

  let camera = createRef<Camera>();
  view.add(<Camera ref={camera}>{...children}</Camera>);

  const shadowRect = <Rect fill={"rgb(26,26,26)"} width={offset * 2 + rectWidth + 2} height={view.height()} />;
  //const shadowRect = <Rect fill={"rgba(255,0,0,0.5)"} width={offset * 2 + rectWidth + 2} height={view.height()} />;
  view.add(shadowRect);

  const calloutIterators = createRef<Callout>();
  view.add(
    <Callout
      ref={calloutIterators}
      finalScale={1.1}
      stroke="yellow"
      x={-747}
      y={0}
      width={350}
      height={600}
      radius={20}
    />
  );
  const calloutImplementors = createRef<Callout>();
  view.add(
    <Callout
      ref={calloutImplementors}
      finalScale={1.1}
      stroke="yellow"
      x={273}
      y={0}
      width={350}
      height={200}
      radius={20}
    />
  );

  const calloutStdICallable = createRef<Callout>();
  view.add(
    <Callout
      ref={calloutStdICallable}
      finalScale={1.1}
      stroke="yellow"
      x={-238}
      y={0}
      width={350}
      height={100}
      radius={20}
    />
  );

  yield* slideTransition(Direction.Right);

  //stdVBA is comprised of several iterators
  yield* waitUntil("revealDependencies");
  yield* shadowRect.position.x(rectWidth, 0.2);

  //Iterators require callbacks, which are implemented with stdICallable interface
  yield* waitUntil("beforeRevealStdICallable");
  yield* shadowRect.position.x(rectWidth + 600, useDuration("afterRevealStdICallable"));

  //And stdVBA comes with 2 standard callback types, `stdLambda` and `stdCallback`.
  yield* waitUntil("beforeRevealImplementors");
  yield* shadowRect.position.x(rectWidth + 1200, useDuration("afterRevealImplementors"));
  yield* shadowRect.position.x(view.width(), 0);

  //Additionally there are a set of other floating classes with no direct dependencies.
  yield* all(
    camera().zoom(0.85, 2),
    camera().x(280, 2)
    //yield* all(boxes.map((e) => e.toPromise(10, 0)));
  );

  //If you want to use any of these classes
  yield* waitUntil("calloutGreenBlue");
  yield* all(calloutIterators().callout(0.5), calloutImplementors().callout(0.5));

  //you must remember to also import `stdICallable` into your project too
  yield* waitUntil("calloutStdICallable");
  yield* calloutStdICallable().callout(0.5);

  //Most classes in stdVBA have a set of constructors or factory methods.
  yield* waitUntil("removeNonFactories");
  yield* all(rectRefs["stdPerformance"]().x(view.width(), 1), rectRefs["stdClipboard"]().x(view.width(), 1));
  yield* waitUntil("afterRemoveNonFactories");
});
