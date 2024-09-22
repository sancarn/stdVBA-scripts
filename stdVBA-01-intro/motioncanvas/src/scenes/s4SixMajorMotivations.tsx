import { makeScene2D, Txt, Icon, Rect, Node } from "@motion-canvas/2d";
import {
  BBox,
  fadeTransition,
  useDuration,
  waitUntil,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  let elements = [
    {
      name: "Mature",
      pos: { x: -500, y: -200 },
      icon: "healthicons:old-man",
    },
    {
      name: "Stable",
      pos: { x: 0, y: -200 },
      icon: "material-symbols:balance",
    },
    {
      name: "Actively Maintained",
      pos: { x: 500, y: -200 },
      icon: "game-icons:spanner",
    },
    {
      name: "Familiar",
      pos: { x: -500, y: 200 },
      icon: "bxl:javascript",
    },
    {
      name: "Extensive",
      pos: { x: 0, y: 200 },
      icon: "material-symbols:full-stacked-bar-chart",
      description: "24 classes\n447 methods",
    },
    {
      name: "Open Source",
      pos: { x: 500, y: 200 },
      icon: "ri:open-arm-line",
    },
  ];
  const initialOffset = 100,
    lineOffset = 60,
    genericYOffset = 100;
  const namedElements: { [key: string]: Node } = {};

  elements.forEach((element) => {
    let combined = (
      <Rect opacity={0.0}>
        <Icon
          icon={element.icon}
          x={element.pos.x}
          y={element.pos.y - genericYOffset}
          width={100}
        />
        <Txt
          text={element.name}
          x={element.pos.x}
          y={element.pos.y + initialOffset - genericYOffset}
          fill={"white"}
        />
        {element?.description?.split("\n")?.map((line, index) => (
          <Txt
            text={line}
            x={element.pos.x}
            y={
              element.pos.y +
              (index + 1) * lineOffset +
              initialOffset * 1.2 -
              genericYOffset
            }
            fill={"white"}
          />
        ))}
      </Rect>
    );
    namedElements[element.name] = combined;
    view.add(combined);
  });

  yield* waitUntil("s4Mature");
  yield* namedElements["Mature"].opacity(1, 1);
  yield* waitUntil("s4Stable");
  yield* namedElements["Stable"].opacity(1, 1);
  yield* waitUntil("s4ActivelyMaintained");
  yield* namedElements["Actively Maintained"].opacity(1, 1);
  yield* waitUntil("s4Familiar");
  yield* namedElements["Familiar"].opacity(1, 1);
  yield* waitUntil("s4Extensive");
  yield* namedElements["Extensive"].opacity(1, 1);
  yield* waitUntil("s4OpenSource");
  yield* namedElements["Open Source"].opacity(1, 1);
  yield* waitUntil("s4End");
});
