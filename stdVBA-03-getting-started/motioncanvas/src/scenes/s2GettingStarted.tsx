import { makeScene2D } from "@motion-canvas/2d";
import { TypedText } from "../libs/TypedText";
import { createRef, waitUntil } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const tt = createRef<TypedText>();
  view.add(
    <TypedText
      ref={tt}
      fontFamily="Consolas"
      fontSize={300}
      fill="#fff"
      x={0}
      y={0}
    />
  );

  //The first step to using stdVBA is downloading the library to disk.
  //1. Navigate to http://github.com/sancarn/stdVBA alternatively google stdVBA, and navigate accordingly
  //2. Click `<> Code`, and select `Download Zip`
  //3. In windows explorer, right click the downloaded file and select `Extract All`
  //4. Navigate down to the `src` folder
  //When you want to use a stdVBA module it couldn't be easier.
  //  Simply drag and drop desired modules into the `VBAProject` in your VBA Editor
  //  Remember, if I'm wanting to import any of these modules, we must also import stdICallable.
  yield* waitUntil("beforeTitle");
  yield* tt().typeText("Getting started", 2);
  yield* waitUntil("afterTitle");
});
