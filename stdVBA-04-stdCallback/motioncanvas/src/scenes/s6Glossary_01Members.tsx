import {
  Code,
  CodeRange,
  CubicBezier,
  insert,
  makeScene2D,
  remove,
  replace,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  DEFAULT,
  Direction,
  slideTransition,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { VBA } from "../libs/vba-highlighter";
import { TypedText } from "../libs/TypedText";

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

  yield* slideTransition(Direction.Right, 1);
  yield* tt().typeText("Glossary", 1);
  yield* waitFor(1);
  yield* all(
    tt().typeText("Constructor Methods", 2),
    tt().fontSize(130, 1),
    tt().y(-400, 1)
  );

  const main = (
    <Code
      fontSize={55}
      x={0}
      y={-150}
      highlighter={VBA}
      code={"CreateFromModule(moduleName, methodName)"}
      opacity={0}
    />
  ) as Code;
  view.add(main);

  const example = (
    <Code
      fontSize={40}
      x={0}
      y={() => example.height() / 2 - 50}
      highlighter={VBA}
      code={`\
'Example
Public Sub TestCB()
  Dim cb as stdCallback
  set cb = stdCallback.CreateFromModule("MyModule", "Test")
  Call cb("world") 'hello world
End Sub
Public Sub Test(ByVal name as string)
  Debug.Print "hello " & name
End Sub`}
      opacity={0}
    />
  ) as Code;

  view.add(example);
  yield* waitUntil("s6G_01_Create1");
  yield* all(main.opacity(1, 1), example.opacity(1, 1));
  yield* waitUntil("s6G_01_Create2");
  yield* all(
    main.code.edit(1)`CreateFrom${replace(
      "Module(moduleName, methodName)",
      "WorkbookModule(workbookPath, moduleName, methodName)"
    )}`,
    example.code(
      `\
Public Sub TestCB()
  Dim cb as stdCallback
  set cb = stdCallback.CreateFromWorkbookModule( _ 
    "C:\\Path\\To\\Workbook.xlsm", _
    "MyModule", _
    "Test" _
  )
  Call cb("world") 'hello world
End Sub`,
      1
    )
  );
  yield* waitUntil("s6G_01_Create3");
  yield* all(
    main.code.edit(1)`CreateFrom${replace(
      "WorkbookModule(workbookPath, moduleName, methodName)",
      "ObjectMethod(object, methodName)"
    )}`,
    example.code(
      `\
Public Sub TestCB()
  Dim cb as stdCallback
  set cb = stdCallback.CreateFromObjectMethod(Me, "Test")
  Call cb("world") 'hello world
End Sub
Public Sub Test()
  Debug.Print "hello " & name
End Sub
`,
      1
    )
  );
  yield* waitUntil("s6G_01_Create4");
  yield* all(
    main.code.edit(1)`CreateFrom${replace(
      "ObjectMethod(object, methodName)",
      "ObjectProperty(object, methodName, callType)"
    )}`,
    example.code(
      `\
Public Sub TestCB()
  Dim o: set o = CreateObject("Scripting.Dictionary")
  Dim setName as stdCallback
  set setName = stdCallback.CreateFromObjectProperty(o, "Item", vbLet).bind("name")
  Call setName("Fred")
  Debug.Print o("Name") 'Fred
End Sub`,
      1
    )
  );
  yield* waitUntil("s6G_01_Create5");
  yield* all(
    main.code.edit(1)`CreateFrom${replace(
      "ObjectProperty(object, methodName, callType)",
      "Pointer(address, returnType, parameterTypes())"
    )}`,
    example.code(
      `\
Public Sub TestCB()
  Dim cb as stdCallback
  set cb = stdCallback.CreateFromPointer(AddressOf Test, vbString, Array(vbString))
  Debug.Print cb("world") 'hello world
End Sub
Private Function Test(ByVal name as string) as string
  Debug.Print "hello " & name
End Sub`,
      1
    )
  );

  yield* waitUntil("s6G_01_Instance1");
  yield* all(
    tt().typeText("Instance Methods", 2),
    main.code.edit(1)`${replace(
      "CreateFromPointer(address, returnType, parameterTypes())",
      "Run(ParamArray params())"
    )}`,
    example.code(
      `\
Public Sub TestCB()
  Dim cb as stdCallback
  set cb = stdCallback.CreateFromObjectMethod(Me, "Test")
  Call cb.Run("hello","world")
End Sub
Public Sub Test(ByVal a as string, ByVal b as string)
  Debug.Print a & " " & b
End Sub
`,
      1
    )
  );

  yield* waitUntil("s6G_01_Instance1a");
  yield* all(
    example.code(
      `\
Public Sub TestCB()
  Dim cb as stdCallback
  set cb = stdCallback.CreateFromObjectMethod(Me, "Test")
  Call cb("hello","world")
End Sub
Public Sub Test(ByVal a as string, ByVal b as string)
  Debug.Print a & " " & b
End Sub
`,
      1
    )
  );

  yield* waitUntil("s6G_01_Instance2");
  yield* all(
    main.code.edit(1)`Run${insert("Ex")}(${replace(
      "ParamArray ",
      ""
    )}params())`,
    example.code(
      `\
Public Sub TestCB()
  Dim cb as stdCallback
  set cb = stdCallback.CreateFromObjectMethod(Me, "Test")
  Call cb.RunEx(Array("hello","world"))
End Sub
Public Sub Test(ByVal a as string, ByVal b as string)
  Debug.Print a & " " & b
End Sub
`,
      1
    )
  );

  yield* waitUntil("s6G_01_Instance3");
  yield* all(
    main.code.edit(1)`${replace(
      "RunEx(params())",
      "Bind(ParamArray params())"
    )}`,
    example.code(
      `\
Public Sub TestCB()
  Dim cb as stdCallback
  set cb = stdCallback.CreateFromObjectMethod(Me, "Test")
  set cb = cb.Bind("hello","world")
  Call cb() 'hello world
End Sub
Public Sub Test(ByVal a as string, ByVal b as string)
  Debug.Print a & " " & b
End Sub
`,
      1
    )
  );
  yield* waitUntil("s6G_01_Instance4");
  yield* all(
    main.code.edit(1)`Bind${insert("Ex")}(${replace(
      "ParamArray ",
      ""
    )}params())`,
    example.code(
      `\
Public Sub TestCB()
  Dim cb as stdCallback
  set cb = stdCallback.CreateFromObjectMethod(Me, "Test")
  set cb = cb.BindEx(Array("hello","world"))
  Call cb() 'hello world
End Sub
Public Sub Test(ByVal a as string, ByVal b as string)
  Debug.Print a & " " & b
End Sub
`,
      1
    )
  );

  yield* waitUntil("s6G_01_Interface1");
  yield* all(
    tt().typeText("stdICallable Methods", 2),
    main.code.edit(1)`${replace("BindEx", "Run")}(${insert(
      "ParamArray "
    )}params())`,
    example.code(
      `\
Public Sub TestCB()
  Dim cb as stdICallable
  set cb = stdCallback.CreateFromObjectMethod(Me, "Test")
  Call cb.Run("hello","world")
End Sub
Public Sub Test(ByVal a as string, ByVal b as string)
  Debug.Print a & " " & b
End Sub
`,
      1
    )
  );

  yield* waitUntil("s6G_01_Interface2");
  yield* all(
    main.code.edit(1)`Run${insert("Ex")}(${remove("ParamArray ")}params())`,
    example.code(
      `\
Public Sub TestCB()
  Dim cb as stdICallable
  set cb = stdCallback.CreateFromObjectMethod(Me, "Test")
  Call cb.RunEx(Array("hello","world"))
End Sub
Public Sub Test(ByVal a as string, ByVal b as string)
  Debug.Print a & " " & b
End Sub
`,
      1
    )
  );

  yield* waitUntil("s6G_01_Interface3");
  yield* all(
    main.code.edit(1)`${replace("RunEx", "Bind")}(${insert(
      "ParamArray "
    )}params())`,
    example.code(
      `\
Public Sub TestCB()
  Dim cb as stdICallable
  set cb = stdCallback.CreateFromObjectMethod(Me, "Test")
  set cb = cb.Bind("hello","world")
  Call cb()
End Sub
Public Sub Test(ByVal a as string, ByVal b as string)
  Debug.Print a & " " & b
End Sub
`,
      1
    )
  );

  yield* waitUntil("s6G_01_Interface4");
  yield* all(
    main.code.edit(1)`${replace("Bind", "SendMessage")}(${replace(
      "ParamArray",
      "message, ByRef success,"
    )} params())`,
    example.code(
      `\
Public Sub TestCB()
  Dim cbI as stdICallable
  set cbI = stdCallback.CreateFromObjectMethod(Me, "Test")

  Dim cb as stdCallback: set cb = cbI.SendMessage("obj")
  Debug.Print cbI.SendMessage("className") '"stdCallback"
End Sub`,
      1
    )
  );

  //BeforeRun(ByRef callback, ByRef params())
  yield* waitUntil("s6G_01_Events1");
  yield* all(
    tt().typeText("Events", 1),
    main.code.edit(1)`${replace("SendMessage", "BeforeRun")}(${replace(
      "message, ByRef success,",
      "ByRef callback, ByRef"
    )} params())`,
    example.code(
      `\
Private WithEvents cb as stdCallback
Public Sub TestCB()
  set cb = stdCallback.CreateFromObjectMethod(Me, "Test")
  cb("Hello","world")
End Sub
Public Sub Test(ByVal a as string, ByVal b as string)
  Debug.Print a & " " & b  '==> Hello WORLD
End Sub
Public Sub cb_BeforeRun(ByRef callback As stdCallback, ByRef args As Variant)
  args(1) = ucase(args(1)) 'capitalise 2nd arg
End Sub`,
      1
    )
  );

  //AfterRun(ByRef callback As stdCallback, ByRef result As Variant)
  yield* waitUntil("s6G_01_Events2");
  yield* all(
    main.code.edit(1)`${replace(
      "Before",
      "After"
    )}Run(ByRef callback, ByRef ${replace("params()", "result")})`,
    example.code(
      `\
Private WithEvents cb as stdCallback
Public Sub TestCB()
  set cb = stdCallback.CreateFromObjectMethod(Me, "Test")
  Debug.Print cb("Hello","world")  '==> HELLO WORLD
End Sub
Public Function Test(ByVal a as string, ByVal b as string) as string
  Test = a & " " & b
End Sub
Public Sub cb_AfterRun(ByRef callback As stdCallback, ByRef result As Variant)
  result = ucase(result)  'Capitalise result
End Sub`,
      1
    )
  );

  yield* waitUntil("s6_01End");
});
