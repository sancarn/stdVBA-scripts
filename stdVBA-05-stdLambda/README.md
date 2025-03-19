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
htto://localhost:9000
```

### To publish

Run the editor and then publish to file.

## Audacity

Audacity is used for audio capture, removing silence between clips, and removing noise from clips.

## Kdenlive

Kdenlive is used to snip all the clips together

## Script

In the previous episode we discussed how `stdCallback` can be used to simplify a filtering function for selecting shapes of a specific type and color.

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

This approach works well, but we still need separate function definitions (`isColor` and `isType`). Wouldn't it be even better if we could define these filters directly where they're used, without needing extra function definitions?

With `stdLambda`, we can write in-line expressions that act as VBA functions, removing the need for separate function definitions.

### Creating a simple lambda expression

The `Create` method allows us to define a one-line function on the fly:

```vb
set myLambda = stdLambda.Create("$1 + $2")
Debug.Print myLambda(10, 5)  ' Outputs: 15
```

Here, `$1` and `$2` represent placeholders for the first and second arguments passed to the function. When we call `myLambda(10, 5)`, `$1` is replaced with `10`, and `$2` is replaced with `5`, so it evaluates as `10 + 5 = 15`.

### `bind` with `stdLambda`

Now that we understand how to create a basic `stdLambda` expression, let's predefine one of its arguments with `bind`, just like we did with `stdCallback`. The `bind` method prepends arguments to the start of a lambda function call, allowing us to create specialized versions of generic functions.

For example, let’s say we want to create a function that adds 10 to any number:

```vb
set add = stdLambda.Create("$1 + $2")
set add10 = add.bind(10)

Debug.Print add10(5)  'Outputs: 15
Debug.Print add10(20) 'Outputs: 30

```

After binding `add10` becomes the equivalent of `10 + $1`, such that new parameters called simply provide the sum of the parameter appleid to it.

We can apply the same technique to filtering shapes by color or type, without needing seperate functions!

```vb
set isColor = stdLambda.Create("$2.color = $1")
set isRed = isColor.bind("red")

set isType = stdLambda.Create("$2.type = $1")
set isTriangle = isType.bind("triangle")
```

It's important to note that `bind`, like in `stdCallback`, prepends arguments to the front of the parameter list. That is:

```vb
set callback = stdLambda.Create("$1 & "","" & $2 & "","" & $3")
Debug.Print callback.bind(1) _
                    .bind(2) _
                    .bind(3) _
                    .run()
'Outputs: 3,2,1
```

It's also imporant to note that you don't always need to use bind, and you can use constants directly in expressions to. Use `bind` specifically where you want to reuse the functions with different values, e.g. `isRed` and `isBlue` can use the same base function, with different bound parameters. However if the value is always the same, like `add10`, simply use a constant: `$1 + 10`

### `stdLambda` Operators

`stdLambda` has the same operators as VBA. A simple greater than expression can be created as follows:

```vb
set greaterThan10 = stdLambda.Create("$1 > 10")
Debug.Print greaterThan10.run(15) ' Output: True
Debug.Print greaterThan10.run(5)  ' Output: False
```

And more complicated expressions can be created too as follows:

```vb
set isRedTriangle = stdLambda.Create("$2.color = ""red"" AND $2.type = ""triangle""")
set shapes = FilterShapes(shapes, isRedTriangle)
```

`stdLambda` also comes with a sluthe of useful built-in functions, again mostly inspired by functions in VBA already. A list of functions and how to use them can be found in the documentation:

```
dict
abs
int
fix
exp
log
sqr
sgn
rnd
cos
sin
tan
atn
asin
acos
array
createobject
getobject
iff
cbool
cbyte
ccur
cdate
csng
cdbl
cint
clng
cstr
cvar
cverr
asc
chr
format
hex
oct
str
val
trim
lcase
ucase
right
left
len
mid
now
switch
any
eval
lambda
isnumeric
isobject
string
space
```

And it also comes with a set of constants

```vb
Application
ThisWorkbook
vbCrLf
vbCr
vbLf
vbNewline
vbNullChar
vbNullString
vbObjectError
vbTab
vbBack
vbFormFeed
vbVerticalTab
null
nothing
empty
missing
```

You can also add custom functions to a lambda using `bindGlobal`

```vb
set x = new stdLambda
Dim add1 as stdLambda: set add1 = stdLambda.Create("$1+1")
Call x.bindGlobal("add1", add1)
Debug.Print x.Create("add1(10)")() '11
```

### Back to the shapes example

TODO: detail

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

Sub main()
    set shapes = getShapes()
    set shapes = FilterShapes(shapes, stdLambda.Create("$2.color = $1").bind("red"))
    set shapes = FilterShapes(shapes, stdLambda.Create("$2.type = $1").bind("triangle"))
End Function
```
