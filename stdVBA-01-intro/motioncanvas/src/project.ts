import { makeProject } from "@motion-canvas/core";

import audio from "../../audacity/voiceover.mp3";
import s1Title from "./scenes/s1Title?scene";
import s2VBATimeline from "./scenes/s2VBATimeline?scene";
import s3RetiredLogistics from "./scenes/s3RetiredLogistics?scene";
import s4SixMajorMotivations from "./scenes/s4SixMajorMotivations?scene";
import s5SeriesSummary from "./scenes/s5SeriesSummary?scene";
import s6Intermediate from "./scenes/s6Intermediate?scene";

export default makeProject({
  scenes: [
    s1Title,
    s2VBATimeline,
    s3RetiredLogistics,
    s4SixMajorMotivations,
    s5SeriesSummary,
    s6Intermediate,
  ],
  audio: audio,
});
