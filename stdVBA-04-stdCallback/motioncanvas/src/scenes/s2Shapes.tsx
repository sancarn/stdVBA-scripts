import { makeScene2D, Polygon } from "@motion-canvas/2d";
import { createRef, waitUntil } from "@motion-canvas/core";

const shapes = [
  { type: "triangle", color: "blue" },
  { type: "triangle", color: "red" },
  { type: "triangle", color: "red" },
  { type: "triangle", color: "yellow" },
  { type: "triangle", color: "green" },
  { type: "square", color: "blue" },
  { type: "triangle", color: "red" },
  { type: "square", color: "yellow" },
  { type: "triangle", color: "yellow" },
  { type: "square", color: "green" },
];
const typeToSides : [key: string]: number = {
  triangle: 3,
  square: 4,
};

export default makeScene2D(function* (view) {
  let views = shapes.map((shape) => {
    let sides = typeToSides[shape.type as any];
    let view = <Polygon sides={sides} size={100} fill={shape.color} />;
  });
  views.forEach((v) => view.add(v));
});
