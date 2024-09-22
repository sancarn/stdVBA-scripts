import { makeScene2D, Circle, Img, Node, View2D, Txt } from "@motion-canvas/2d";
import { all, createRef, waitFor, waitUntil } from "@motion-canvas/core";
import ws1 from "./resources/sweet-1.png";
import ws2 from "./resources/sweet-2.png";
import ws3 from "./resources/sweet-3.png";
import fileSpreadSheet from "./resources/file-spreadsheet.png";
import fileFolder from "./resources/file-folder.png";
import { Wrapper } from "./libs/Wrapper";

//In many professional settings, data is king.

export default makeScene2D(function* (view) {
  view.fill("#242424");
  const pws1 = new Wrapper<Img>(view, (<Img x={2000} y={0} width={600} src={ws1} />) as Img);
  const pws2 = new Wrapper<Img>(view, (<Img x={2000} y={0} width={600} src={ws2} />) as Img);
  const pws3 = new Wrapper<Img>(view, (<Img x={2000} y={0} width={600} src={ws3} />) as Img);

  const spreadsheets = [1, 2, 3].map(
    (e) => new Wrapper<Img>(view, (<Img x={2000} y={0} width={600} opacity={1} src={fileSpreadSheet} />) as Img)
  );

  const folders = [1, 2, 3].map(
    (e) => new Wrapper<Img>(view, (<Img x={2000} y={0} width={600} opacity={0} src={fileFolder} />) as Img)
  );

  //script: And often, this data is scattered across multiple different tabs...
  yield* waitUntil("scene2-worksheets");

  yield* all(...pws1.moveTo(0, 0));
  yield* all(...pws1.move(-300, 0), ...pws2.moveTo(300, 0));
  yield* all(...pws1.move(-300, 0), ...pws2.move(-300, 0), ...pws3.moveTo(600, 0));

  //script: of multiple different spreadsheets
  yield* waitUntil("scene2-spreadsheets");
  yield* all(spreadsheets[0].opacity(0, 0), ...spreadsheets[0].moveTo(0, 0, 0));
  yield* all(pws1.opacity(0, 1), pws2.opacity(0, 1), pws3.opacity(0, 1), spreadsheets[0].opacity(1, 1));
  yield* all(...spreadsheets[0].move(-300, 0), ...spreadsheets[1].moveTo(300, 0));
  yield* all(...spreadsheets[0].move(-300, 0), ...spreadsheets[1].move(-300, 0), ...spreadsheets[2].moveTo(600, 0));

  //script: across multiple different versions
  yield* waitUntil("scene2-versions");

  const iVersions = [1, 1, 2];
  const versions = spreadsheets.map(
    (spreadsheet, index) =>
      new Wrapper(
        view,
        (
          <Txt x={spreadsheet.x} opacity={0} fontSize={150} fontWeight={1000} fill={"fff"}>
            {"v" + iVersions[index].toString()}
          </Txt>
        )
      )
  );
  yield* all(
    ...spreadsheets.flatMap((e, i) => e.move(0, -200, 0.5, 0.3 * i)),
    ...versions.flatMap((e, i) => e.move(0, 200, 0.5, 0.3 * i)),
    ...versions.flatMap((e, i) => e.opacity(1, 0.3 * (i + 2)))
  );

  //script: across many different directories
  yield* waitUntil("scene2-folders");

  yield* all(
    ...spreadsheets.flatMap((e) => e.opacity(0, 0.5)),
    ...versions.flatMap((e) => e.opacity(0, 0.5)),
    ...folders[0].moveTo(0, 0, 0),
    ...folders.map((e) => e.opacity(1, 0.5))
  );
  yield* all(...folders[0].move(-300, 0), ...folders[1].moveTo(300, 0));
  yield* all(...folders[0].move(-300, 0), ...folders[1].move(-300, 0), ...folders[2].moveTo(600, 0));
  yield* waitFor(1);
  yield* all(...folders.map((e) => e.opacity(0, 0.5)));
});
