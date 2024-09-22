import { Camera, Circle, Line, makeScene2D, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  Direction,
  easeInOutCubic,
  easeOutCubic,
  linear,
  map,
  slideTransition,
  tween,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

const TIMELINE_LENGTH: number = 1600;
const timeline = {
  bounds: {
    min: 1993,
    max: 2024,
  },
  events: [
    { year: 1993, tip: "VBA 1.0", size: 10, color: "#DC7B2E", showTip: true },
    { year: 1994, tip: "VBA 2.0", size: 6 },
    { year: 1995, tip: "VBA 3.0", size: 6 },
    { year: 1996, tip: "VBA 4.0", size: 10, color: "#DFD400", showTip: true },
    { year: 1997, tip: "VBA 5.0", size: 6 },
    {
      year: 1998 + 10 / 12,
      tip: "VBA 6.0",
      size: 10,
      color: "#6583C1",
      showTip: true,
    },
    { year: 1999 + 6 / 12, tip: "VBA 6.1", size: 6 }, //Can't find date, but assuming june
    { year: 2000 + 6 / 12, tip: "VBA 6.2", size: 6 }, //Can't find date, but assuming june
    { year: 2001 + 3 / 12, tip: "VBA 6.3", size: 6 }, //Office XP = Mar 01
    { year: 2003 + 10 / 12, tip: "VBA 6.4", size: 6 }, //Office 2003 = Oct 03
    { year: 2006 + 11 / 12, tip: "VBA 6.5", size: 6 }, //Office 2007 = Nov 06
    {
      year: 2010 + 4 / 12,
      tip: "VBA 7.0",
      size: 10,
      color: "#952780",
      showTip: true,
    }, //Office 2010 = Apr 10
    { year: 2012 + 10 / 12, tip: "VBA 7.1", size: 6 }, //Office 2013 = Oct 12
  ],
};

export default makeScene2D(function* (view) {
  const children = [];
  const line = createRef<Line>();
  children.push(
    <Line
      ref={line}
      stroke={"#fff"}
      lineWidth={30}
      points={[
        [(-1 * TIMELINE_LENGTH) / 2, 0],
        [(-1 * TIMELINE_LENGTH) / 2, 0],
      ]}
    ></Line>
  );

  const tweener = (
    xStamp: number,
    start: number,
    end: number,
    durationDist: number,
    halt?: boolean
  ) => {
    return () => {
      let farthestX = line().size().x;
      if (farthestX < xStamp) return 0;
      let timestep = farthestX - xStamp;
      let factor = timestep / durationDist;
      let final = (end - start) * factor + start;
      if (halt && start < end && final > end) return end;
      if (halt && start > end && final < end) return end;
      return final;
    };
  };

  const timelineSize = timeline.bounds.max - timeline.bounds.min;
  const radiusFactor = 7;
  timeline.events
    .sort((a, b) => (a.size < b.size ? -1 : 0))
    .forEach(function (event) {
      let time = event.year - timeline.bounds.min;
      let xStamp = (time / timelineSize) * TIMELINE_LENGTH;
      let x = xStamp - TIMELINE_LENGTH / 2;

      children.push(
        <>
          {event.showTip ? (
            <Txt
              text={event.tip}
              fill={"#fff"}
              x={x}
              y={-100}
              fontSize={30}
              opacity={tweener(xStamp, 0, 1, 50)}
            />
          ) : undefined}
          <Circle
            x={x}
            y={0}
            width={event.size * radiusFactor}
            height={event.size * radiusFactor}
            fill={event.color ?? "#8aa"}
            scaleX={tweener(xStamp, 0, 1, 10, true)}
            scaleY={tweener(xStamp, 0, 1, 10, true)}
          />
          <Circle
            x={x}
            y={0}
            width={tweener(xStamp, 0, 20 * event.size * radiusFactor, 200)}
            height={tweener(xStamp, 0, 20 * event.size * radiusFactor, 200)}
            stroke={event.color ?? "#8aa"}
            lineWidth={5}
            opacity={tweener(xStamp, 0.5, 0, 200)}
          />
        </>
      );
    });

  let timesegs = [
    ...Array(timeline.bounds.max - timeline.bounds.min + 1).keys(),
  ]
    .filter((e) => e % 5 == 0)
    .map((e) => e + timeline.bounds.min);
  timesegs.forEach((year) => {
    let time = year - timeline.bounds.min;
    let xStamp = (time / timelineSize) * TIMELINE_LENGTH;
    let x = xStamp - TIMELINE_LENGTH / 2;
    children.unshift(
      <>
        <Line
          stroke={"#fff"}
          lineWidth={5}
          points={[
            [x, 0],
            [x, 30],
          ]}
          opacity={tweener(xStamp, 0, 1, 50)}
        />
        <Txt
          text={year.toString()}
          fill={"#fff"}
          x={x}
          y={100}
          opacity={tweener(xStamp, 0, 1, 50)}
        />
      </>
    );
  });

  // view.add(<>{...children}</>)
  const camera = createRef<Camera>();
  view.add(<Camera ref={camera}>{...children}</Camera>);

  //@FIX. See: https://github.com/motion-canvas/motion-canvas/issues/1057#issuecomment-2126540039
  camera().scene().position(view.size().div(2));
  camera().zoom(3).x(-800);

  const duration: number = 10.681;
  yield* slideTransition(Direction.Right);
  yield* all(
    tween(duration, (value) =>
      line().points([
        [(-1 * TIMELINE_LENGTH) / 2, 0],
        [(-1 * TIMELINE_LENGTH) / 2 + value * TIMELINE_LENGTH, 0],
      ])
    ),
    tween(duration * 0.75, (value) => camera().zoom(easeOutCubic(value, 3, 1))),
    tween(duration * 0.75, (value) =>
      camera().x(easeInOutCubic(value, -800, 0))
    )
  );
  yield* waitUntil("endScene2");
});
