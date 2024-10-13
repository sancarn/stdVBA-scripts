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

In order to understand stdCallback we first have to look at 1st class functions.

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
Function filterRedTriangles(shapes as Collection) as Collection
    set filterRedTriangles = new Collection
    Dim shp as Shape
    For each shp in shapes
        if shp.type = "triangle" and shp.color = "red" then
            Call filterRedTriangles.add(shp)
        end if
    next
End Function

' Module: Any
Sub main()
    set shapes = getShapes()
    set shapes = filterRedTriangles(shapes)
End Function
```

You might find yourselves frustrated that each time you write a report to filter down these objects, you create another 7 lines of "the same kind of code".

Well, imagine for a moment that we could bake "the condition" into a variable, or more specifically a function as a variable. Then we would be able to do this...
We could rename this code "FilterShapes" and now all our other filter conditions can be quickly rewritten too.

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
Function isRedTriangle(shp as Shape) as Boolean
    isRedTriangle = shp.color = "red" and shp.type = "triangle"
End Function

' Module: Any
Sub main()
    set shapes = getShapes()
    set shapes = FilterShapes(shapes, isRedTriangle)
End Function
```

This is what we mean by first class functions.

//TODO: Add small paragraph about the increased maintainability of using 1-class functs.

Unfortunately, VBA does not natively support passing functions as arguments. However, `stdCallback`, allows us to pass functions as parameters by encapsulating them into callable objects.

With a few tweaks of our code, this becomes valid VBA code.

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
Function isRedTriangle(shp as Shape) as Boolean
    isRedTriangle = shp.color = "red" and shp.type = "triangle"
End Function

' Module: Any
Sub main()
    set shapes = getShapes()
    set shapes = FilterShapes(shapes, stdCallback.CreateFromModule("ShapeFilters", "isRedTriangle"))
End Function
```

However wouldn't it be better still if instead of writing 1 function to check each individual condition we instead wrote a generic condition which could be applied to many different filter queries? Indeed it would and this is where `bind` comes in. Let's make an `isColor` function, which will take a color and a shape and check if the color of the shape matches that which was passed. We can then use `bind` to bind parameters to the start of stdCallback function calls. If we do this for `isType` too, we can now abolish all of these additional function definitions.



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

It is important to note that the `bind` method binds the attached parameter onto the start of the calling function. successively bound parameters will be bound in "reverse" order.

```vb
Sub printOut(a,b,c)
  Debug.Print a & "," & b & "," & c
End Sub

Sub main()
    set callback = stdCallback.CreateFromModule("", "printOut")
    callback.bind(1) _
            .bind(2) _
            .bind(3) _
            .run()  'prints 3,2,1
End Sub
```

And just like that you can see we've trimmed down our initial growing code block of 40 lines, to a fixed 20 or so lines of elegant code.
