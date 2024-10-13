import { makeProject } from "@motion-canvas/core";

import s1Title from "./scenes/s1Title?scene";
import s2Shapes from "./scenes/s2Shapes?scene";
import s3BoilerplateIdentification from "./scenes/s3BoilerplateIdentification?scene";

export default makeProject({
  scenes: [s1Title, s2Shapes, s3BoilerplateIdentification],
});
