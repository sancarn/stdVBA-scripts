import { makeProject } from "@motion-canvas/core";
import scene1 from "./scenes/scene1?scene";
import scene2 from "./scenes/scene2?scene";
import scene3 from "./scenes/scene3?scene";
import scene4 from "./scenes/scene4?scene";
import audio from "../audacity/output.mp3";

export default makeProject({
  scenes: [scene1, scene2, scene3, scene4],
  audio: audio,
});
