import { makeProject } from "@motion-canvas/core";

import s1Title from "./scenes/s1Title?scene";
import s2Shapes from "./scenes/s2Shapes?scene";
import s3BoilerplateIdentification from "./scenes/s3BoilerplateIdentification?scene";
import s4BindingCallbacks from "./scenes/s4BindingCallbacks?scene";
import s5CodeAfterBind from "./scenes/s5CodeAfterBind?scene";
import s6Glossary_01Members from "./scenes/s6Glossary_01Members?scene";
import s7NoteOnBind from "./scenes/s7NoteOnBind?scene";
import audio from "./../../voiceover/Exports/stdCallback.mp3";

export default makeProject({
  scenes: [
    s1Title,
    s2Shapes,
    s3BoilerplateIdentification,
    s4BindingCallbacks,
    s5CodeAfterBind,
  ],
  audio: audio,
});
