import {
  StreamLanguage,
  StreamParser,
  StringStream,
} from "@codemirror/language";
import { LezerHighlighter } from "@motion-canvas/2d";

var ERRORCLASS = "error";

function wordRegexp(words: string[]) {
  return new RegExp("^((" + words.join(")|(") + "))\\b", "i");
}

var singleOperators = new RegExp("^[\\+\\-\\*/&\\\\=\\^<>]");
var singleDelimiters = new RegExp("^[\\(\\)\\[\\]\\{\\},;\\.!]");
var doubleOperators = new RegExp("^((<>)|(<=)|(>=)|(><)|(:=))");
var identifiers = new RegExp("^[_A-Za-z][_A-Za-z0-9]*");

var openingKeywords = [
  "sub",
  "enum",

  "select",
  "while",
  "do",
  "for",
  "if",
  "function",
  "event",
  "get",
  "set",
  "let",
  "property",
  "on",
  "error",
  "with",
];
var middleKeywords = [
  "each",
  "step",
  "else",
  "elseif",
  "case",
  "until",
  "then",
];
var endKeywords = ["next", "loop", "end"];

var operatorKeywords = ["and", "or", "xor", "not", "is", "like", "mod"];
var wordOperators = wordRegexp(operatorKeywords);

var commonKeywords = [
  "#const",
  "#else",
  "#elseif",
  "#end",
  "#if",
  "addressof",
  "as",
  "byref",
  "byval",
  "const",
  "declare",
  "ptrsafe",
  "lib",
  "alias",
  "dim",
  "redim",
  "each",
  "in",
  "erase",
  "error",
  "withevents",
  "exit",
  "option",
  "explicit",
  "for",
  "friend",
  "public",
  "private",
  "static",
  "goto",
  "resume",
  "gosub",
  "return",
  "implements",
  "me",
  "empty",
  "null",
  "nothing",
  "false",
  "true",
  "of",
  "off",
  "on",
  "optional",
  "open",
  "close",
  "paramarray",
  "raiseevent",
  "step",
  "stop",
  "to",
  "typeof",
  "call",
  "new",
];

var standardFunctions = [
  "cbool",
  "cdate",
  "cdbl",
  "cdec",
  "cint",
  "clng",
  "csng",
  "cbyte",
  "cstr",
];

var commontypes = [
  "object",
  "iunknown",
  "boolean",
  "string",
  "byte",
  "long",
  "longlong",
  "longptr",
  "decimal",
  "single",
  "double",
  "date",
  "collection",
];
var stdVBATypes = ["stdICallable", "stdCallback", "stdLambda"];

var keywords = wordRegexp(commonKeywords);
var types = wordRegexp([...commontypes, ...stdVBATypes]);
var stringPrefixes = '"';

var opening = wordRegexp(openingKeywords);
var middle = wordRegexp(middleKeywords);
var closing = wordRegexp(endKeywords);

var doOpening = wordRegexp(["do"]);

var indentInfo: null | "dedent" = null;
var functions = wordRegexp(standardFunctions);

function indent(_stream: StringStream, state: any) {
  state.currentIndent++;
}

function dedent(_stream: StringStream, state: any): boolean {
  state.currentIndent--;
  return false;
}
// tokenizers
function tokenBase(stream: StringStream, state: any) {
  if (stream.eatSpace()) {
    return null;
  }

  var ch = stream.peek();

  // Handle Comments
  if (ch === "'") {
    stream.skipToEnd();
    return "comment";
  }

  // Handle Number Literals
  if (stream.match(/^((&H)|(&O))?[0-9\.a-f]/i, false)) {
    var floatLiteral = false;
    // Floats
    if (stream.match(/^\d*\.\d+F?/i)) {
      floatLiteral = true;
    } else if (stream.match(/^\d+\.\d*F?/)) {
      floatLiteral = true;
    } else if (stream.match(/^\.\d+F?/)) {
      floatLiteral = true;
    }

    if (floatLiteral) {
      // Float literals may be "imaginary"
      stream.eat(/J/i);
      return "number";
    }
    // Integers
    var intLiteral = false;
    // Hex
    if (stream.match(/^&H[0-9a-f]+/i)) {
      intLiteral = true;
    }
    // Octal
    else if (stream.match(/^&O[0-7]+/i)) {
      intLiteral = true;
    }
    // Decimal
    else if (stream.match(/^[1-9]\d*F?/)) {
      // Decimal literals may be "imaginary"
      stream.eat(/J/i);
      // TODO - Can you have imaginary longs?
      intLiteral = true;
    }
    // Zero by itself with no other piece of number.
    else if (stream.match(/^0(?![\dx])/i)) {
      intLiteral = true;
    }
    if (intLiteral) {
      // Integer literals may be "long"
      stream.eat(/L/i);
      return "number";
    }
  }

  // Handle Strings
  if (stream.match(stringPrefixes)) {
    state.tokenize = tokenStringFactory(stream.current());
    return state.tokenize(stream, state);
  }

  // Handle operators and Delimiters
  if (
    stream.match(doubleOperators) ||
    stream.match(singleOperators) ||
    stream.match(wordOperators)
  ) {
    // return "operator";
    return null;
  }
  if (stream.match(singleDelimiters)) {
    return null;
  }
  if (stream.match(doOpening)) {
    indent(stream, state);
    state.doInCurrentLine = true;
    return "keyword";
  }
  if (stream.match(opening)) {
    if (!state.doInCurrentLine) indent(stream, state);
    else state.doInCurrentLine = false;
    return "keyword";
  }
  if (stream.match(middle)) {
    return "keyword";
  }
  if (stream.match(closing)) {
    dedent(stream, state);
    return "keyword";
  }

  if (stream.match(types)) {
    return "keyword";
  }

  if (stream.match(keywords)) {
    return "keyword";
  }
  if (stream.match(functions)) {
    return "builtin";
  }
  if (stream.match(identifiers)) {
    return "variable";
  }

  // Handle non-detected items
  stream.next();
  return ERRORCLASS;
}

function tokenStringFactory(delimiter: string) {
  var singleline = delimiter.length == 1;
  var OUTCLASS = "string";

  return function (stream: StringStream, state: any) {
    while (!stream.eol()) {
      stream.eatWhile(/[^'"]/);
      if (stream.match(delimiter)) {
        state.tokenize = tokenBase;
        return OUTCLASS;
      } else {
        stream.eat(/['"]/);
      }
    }
    if (singleline) {
      state.tokenize = tokenBase;
    }
    return OUTCLASS;
  };
}

function tokenLexer(stream: StringStream, state: any) {
  var style = state.tokenize(stream, state);
  var current = stream.current();

  // Handle '.' connected identifiers
  if (current === ".") {
    style = state.tokenize(stream, state);
    if (style === "variable") {
      return "variable";
    } else {
      return ERRORCLASS;
    }
  }

  var delimiter_index = "[({".indexOf(current);
  if (delimiter_index !== -1) {
    indent(stream, state);
  }
  if (indentInfo === "dedent") {
    if (dedent(stream, state)) {
      return ERRORCLASS;
    }
  }
  delimiter_index = "])}".indexOf(current);
  if (delimiter_index !== -1) {
    if (dedent(stream, state)) {
      return ERRORCLASS;
    }
  }

  return style;
}

export const vba_: StreamParser<any> = {
  name: "vba",

  startState: function () {
    return {
      tokenize: tokenBase,
      lastToken: null,
      currentIndent: 0,
      nextLineIndent: 0,
      doInCurrentLine: false,
    };
  },

  token: function (stream, state) {
    if (stream.sol()) {
      state.currentIndent += state.nextLineIndent;
      state.nextLineIndent = 0;
      state.doInCurrentLine = 0;
    }
    var style = tokenLexer(stream, state);

    state.lastToken = { style: style, content: stream.current() };

    return style;
  },

  indent: function (state, textAfter, cx) {
    var trueText = textAfter.replace(/^\s+|\s+$/g, "");
    if (trueText.match(closing) || trueText.match(middle))
      return cx.unit * (state.currentIndent - 1);
    if (state.currentIndent < 0) return 0;
    return state.currentIndent * cx.unit;
  },

  languageData: {
    closeBrackets: { brackets: ["(", "[", "{", '"'] },
    commentTokens: { line: "'" },
    autocomplete: openingKeywords
      .concat(middleKeywords)
      .concat(endKeywords)
      .concat(operatorKeywords)
      .concat(commonKeywords)
      .concat(commontypes)
      .concat(stdVBATypes)
      .concat(standardFunctions),
  },
};

export const VBA = new LezerHighlighter(StreamLanguage.define(vba_).parser);
