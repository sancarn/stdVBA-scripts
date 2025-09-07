# stdVBA Workspace

## Motion Canvas

Motion Canvas is used for most of the animations within stdVBA videos.

### Run the editor

Run the following in the `motioncanvas` folder:

```bash
npm run serve
```

Then navigate to:

```
http://localhost:9000
```

### To publish

Run the editor and then publish to file.

## Audacity

Audacity is used for audio capture, removing silence between clips, and removing noise from clips.

## Kdenlive

Kdenlive is used to snip all the clips together

## Script

**stdCallback**

`stdCallback` is a way of implementing callbacks in VBA. Callbacks are mechanisms that allow deferred (late-bound) execution of code. Typically callbacks are implemented using first-class functions, which isn't something we have access to in VBA. Instead we can use `stdCallback` to define callable objects from existing functions.

Imagine you have a collection of shapes and it's your job to filter out a specific subset of shapes.

First your asked to filter out squares.
Then triangles.
Then yellow shapes.
Then red triangles.

```vb
' Module: ShapeFilters
Function filterSquares(shapes as Collection) as Collection
    set filterSquares = new Collection
    Dim shp as Shape
    For each shp in shapes
        if shp.type = "square" then
            Call filterSquares.add(shp)
        end if
    next
End Function
Function filterTriangles(shapes as Collection) as Collection
    set filterTriangles = new Collection
    Dim shp as Shape
    For each shp in shapes
        if shp.type = "triangle" then
            Call filterTriangles.add(shp)
        end if
    next
End Function
Function filterYellow(shapes as Collection) as Collection
    set filterYellow = new Collection
    Dim shp as Shape
    For each shp in shapes
        if shp.color = "yellow" then
            Call filterYellow.add(shp)
        end if
    next
End Function

' Module: Any
Sub main()
    set shapes = getShapes()
    set shapes = filterRedTriangles(shapes)
End Function
```

You might find yourselves frustrated that each time you write a report to filter down these objects, you create another 7 lines of "the same kind of code" and you only really modify one line, the condition.

Well, imagine for a moment that we could bake these conditions into specific functions. And then pass that function as a parameter to a generic filter function "FilterShapes".

```vb
' Module: ShapeFilters
Function FilterShapes(shapes as Collection, filterCondition as Function) as Collection
    set FilterShapes = new Collection
    Dim shp as Shape
    For each shp in shapes
        if filterCondition(shp) then
            Call FilterShapes.add(shp)
        end if
    next
End Function

Function isSquare(shp as Shape) as Boolean
    isSquare = shp.type = "square"
End Function
Function isTriangle(shp as Shape) as Boolean
    isTriangle = shp.type = "triangle"
End Function
Function isYellow(shp as Shape) as Boolean
    isYellow = shp.color = "yellow"
End Function

' Module: Any
Sub main()
    set shapes = getShapes()
    set shapes = FilterShapes(shapes, isYellow)
End Function
```

`isYellow` here is a callback because it is passed as an argument to another function (`FilterShapes`), which later calls it during execution. Callbacks, used in this way, help decouple logic, improving readability and maintainability by reducing code duplication.

Unfortunately, VBA does not natively support passing functions as arguments. However, `stdCallback`, allows us to encapsulate functions into callable objects, making it possible to pass them as parameters.

With a few tweaks, our code becomes valid VBA.

```vb
' Module: ShapeFilters
Function FilterShapes(shapes as Collection, filterCondition as stdCallback) as Collection
    set FilterShapes = new Collection
    Dim shp as Shape
    For each shp in shapes
        if filterCondition(shp) then
            Call FilterShapes.add(shp)
        end if
    next
End Function

Function isSquare(shp as Shape) as Boolean
    isSquare = shp.type = "square"
End Function
Function isTriangle(shp as Shape) as Boolean
    isTriangle = shp.type = "triangle"
End Function
Function isYellow(shp as Shape) as Boolean
    isYellow = shp.color = "yellow"
End Function

' Module: Any
Sub main()
    set shapes = getShapes()
    set shapes = FilterShapes(shapes, stdCallback.CreateFromModule("ShapeFilters", "isRedTriangle"))
End Function
```

So this is pretty good, but it can be made better still by utilising the `bind` method. Instead of writing a separate function for each individual condition, we can create generic condition functions that can be applied to multiple filtering operations.

Using `bind`, we can prepends parameters to the start of `stdCallback` calls. This allows us to dynamically generate filters without needing to define separate functions like `isGreen` or `isSquare`. With this approach, we can eliminate all those additional function definitions while keeping the code flexible and maintainable.

Let's define a generic `isColor` and `isType` function to check the color and shape type respectively.

```vb
' Module: ShapeFilters
Function FilterShapes(shapes as Collection, filterCondition as stdCallback) as Collection
    set FilterShapes = new Collection
    Dim shp as Shape
    For each shp in shapes
        if filterCondition(shp) then
            Call FilterShapes.add(shp)
        end if
    next
End Function

Function isColor(ByVal color as string, shp as shape) as Boolean
    isColor = shp.color = color
End Function

Function isType(ByVal shapeType as string, shp as shape) as Boolean
    isType = shp.type = shapeType
End Function

' Module: Any
Sub main()
    set shapes = getShapes()
    set shapes = FilterShapes(shapes, stdCallback.CreateFromModule("ShapeFilters", "isColor").bind("red"))
    set shapes = FilterShapes(shapes, stdCallback.CreateFromModule("ShapeFilters", "isType").bind("triangle"))
End Function
```

And just like that you can see we've trimmed down our initial growing code block of 40 lines, to a fixed 20 lines of elegant code.

But we're not done yet, join us next time to see how this code could be improved further with `stdLambda`.

---

### Glossary:

#### Members

##### Constructor Methods

There are 5 mechanisms which can be used to build new stdCallback objects.

- `CreateFromModule` - Creates a callback to a public method in a standard module. If the module name is empty all standard modules will be searched, and the callback is bound to the first matching method.
- `CreateFromWorkbookModule` - Creates a callback to a public method in a standard module within an external workbook. If the module name is empty all standard modules will be searched, and the callback is bound to the first matching method.
- `CreateFromObjectMethod` - Creates a callback to a public method in an object.
- `CreateFromObjectProperty` - Creates a callback to get or set a public property. `VbCallType` specifies whether to get or set the property.
- `CreateFromPointer` - Creates a callback to a loaded function address (e.g., a Windows API function), or a module function address obtained via the `AddressOf` method.

##### Instance Methods

Once the callback is created, you can use any of the following methods to modify and use it.

- `Run` - Executes the callback with the provided parameters.
- `RunEx` - Executes the callback with an array of parameters.
- `Bind` - Prepends a parameter to the callback.
- `BindEx` - Binds multiple parameters from an array.

##### `stdICallable` Methods

`stdCallback` also implements the `stdICallable` interface, and thusly implements all of the following methods.

- `Run` - as above
- `RunEx` - as above
- `Bind` - as above
- `SendMessage` - Can be used to retrieve specified information from the object.

##### Events

`stdCallback` supports two events that allow interception and modification of callback execution:

- `BeforeRun` - Triggers before a callback is executed. Can be used to detect calls and modify parameters before execution.
- `AfterRun` - Triggers after a callback is executed. Can be used to alter the return value of a callback.

#### A note on `bind`

Note: The `bind` and `bindex` methods, append the arguments to an internal list which is then prepended to the called arguments when `run` or `runex` is called.

Arguments are executed in the same order that they are bound.

Ultimately, in this example:

```vb
Sub printOut(ParamArray params())
  Debug.Print join(params, ",")
End Sub

Sub main()
    set callback = stdCallback.CreateFromModule("", "printOut")
    callback.bind(1,2) _
            .bind(3,4) _
            .run(5,6)
End Sub
```

The arguments are called in the same order, i.e. 1,2,3,4,5,6

#### //Debugging

Since stdCallback introduces some complex runtime behavior, users may struggle to debug it.

### TODO

- "Instead we can use `stdCallback` to define callable objects from existing functions." - Maybe we should have an animation here?
- "however stdCallback, allows us to encapsulate functions into callable objects, making it possible to pass them as parameters." - Maybe use the same animation as above?
- `s3Main` cycle should maybe be a bit longer
- "Join us next time to see how this code could be improved further with `stdLambda`." - Maybe we should have an animation here?
- Is it even worthwhile having the `s6Glossary` section? It might be better to just link to [stdVBA-docs.github.io](https://sancarn.github.io/stdVBA-docs/)...
