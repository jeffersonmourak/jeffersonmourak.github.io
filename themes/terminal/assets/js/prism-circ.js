/* Prism language plugin for the `circ` hardware-description DSL.
   Direct port of the TextMate grammar at
   circ-compiler/site/src/utils/circ-lang.mjs, translated to Prism
   patterns so that ```circ fenced blocks in the blog get tokenized
   client-side and pick up the Shiki-derived palette in syntax.css.

   Token mapping (Prism → syntax.css color):
     comment  → --muted, italic
     string   → --syntax-literal
     keyword  → --syntax-keyword, bold   (input / output / import)
     builtin  → --syntax-keyword         (and / not / wire / led / ...)
     variable → --fg                     (port access `.foo`)

   `variable` matches the Shiki theme's `variable.other` → fg
   mapping for port access; not `property` (which is accent-soft).
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
  builtin: /\b(?:and|not|wire|led|or|nand|nor|xor|xnor)\b/,
  variable: {
    pattern: /\.[a-zA-Z_][a-zA-Z0-9_]*\b/,
    alias: 'port',
  },
  punctuation: /[,()]/,
};
