import { makeScene2D } from "@motion-canvas/2d";
import { TypedText } from "../libs/TypedText";
import { createRef, waitUntil } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const tt = createRef<TypedText>();
  view.add(
    <TypedText
      ref={tt}
      fontFamily="Consolas"
      fontSize={200}
      fill="#fff"
      x={0}
      y={0}
    />
  );

  //Getting started
  //First let's download the stdVBA library to disk.
  //1. Google stdVBA, and navigate accordingly to my github repo
  //2. Click `<> Code`, and select `Download Zip`
  //3. In windows explorer, right click the downloaded file and select `Extract All`
  //4. Navigate down to the `src` folder
  //When you want to use a stdVBA module it couldn't be easier.
  //  Simply drag and drop desired modules into the `VBAProject` in your VBA Editor
  //  Remember, if you want to import any of these modules, you must also import `stdICallable`.
  yield* waitUntil("beforeTitle");
  yield* tt().typeText("Getting started", 1);
  yield* waitUntil("afterTitle");
});
