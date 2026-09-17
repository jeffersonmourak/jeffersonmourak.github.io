/* Prism language plugin for the `circ` hardware-description DSL.
   Port of the TextMate grammar at circ-compiler/site/src/utils/circ-lang.mjs
   (whose keyword/builtin tables live in circ-tokens.mjs), translated to
   Prism patterns so that ```circ fenced blocks in the blog get tokenized
   client-side and pick up the Shiki-derived palette in syntax.css.

   Token mapping (TextMate scope → Prism token → syntax.css color):
     comment.line                → comment     → --muted, italic
     string.quoted               → string      → --syntax-literal
     keyword.declaration         → keyword     → --syntax-keyword, bold
                                                 (input / output / import)
     support.type.builtin        → builtin     → --syntax-keyword
                                                 (and / not / wire / led / or /
                                                  nand / nor / xor / xnor /
                                                  bus / rom / ram)
     constant.numeric            → number      → --syntax-literal
     keyword.operator.*          → operator    → --accent  (<>  ..  =)
     entity.name.function        → function    → --accent-soft
                                                 (an instance name before `(`)
     variable.parameter          → variable    → --fg
                                                 (`<W>` params, `in=` port names)
     variable.other.member       → variable    → --fg      (`.out` port access)
     punctuation.*               → punctuation → --muted

   Keep the keyword and builtin lists in step with circ-tokens.mjs
   (DECLARATION_KEYWORDS / BUILTIN_TYPES) when the language grows.
*/
Prism.languages.circ = {
  comment: {
    pattern: /\/\/.*/,
    greedy: true,
  },
  string: {
    pattern: /"[^"\r\n]*"/,
    greedy: true,
  },
  keyword: /\b(?:input|output|import)\b/,
  builtin: /\b(?:and|not|wire|led|or|nand|nor|xor|xnor|bus|rom|ram)\b/,
  number: /\b[0-9]+\b/,
  // `<W, N>` parameter introductions. Matched before `operator` so the
  // opening `<` is never mistaken for half a `<>` connection; `<>` itself
  // has no identifier inside and so never matches here.
  parameters: {
    pattern: /<\s*[a-zA-Z_][a-zA-Z0-9_]*(?:\s*,\s*[a-zA-Z_][a-zA-Z0-9_]*)*\s*>/,
    inside: {
      variable: /[a-zA-Z_][a-zA-Z0-9_]*/,
      punctuation: /[<>,]/,
    },
  },
  operator: /<>|\.\.|=/,
  // An instance / sub-circuit name immediately before `(`.
  function: /\b[a-zA-Z_][a-zA-Z0-9_]*\b(?=\s*\()/,
  variable: [
    // `.port` member access.
    {
      pattern: /\.[a-zA-Z_][a-zA-Z0-9_]*\b/,
      alias: 'port',
    },
    // A named port argument: the identifier before `=`.
    {
      pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*\b(?=\s*=)/,
      alias: 'parameter-name',
    },
  ],
  punctuation: /[,()[\]{}]/,
};
