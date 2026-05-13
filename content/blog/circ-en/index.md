---
title: Pleasure to meet you, circ!
date: 2026-05-12T08:27:04-02:01
author: Jefferson Oliveira
cover: ""
tags:
  - EN
  - Compilers
  - Languages
  - WebAssembly
  - DSL
keywords:
  - Compiler
  - DSL
  - WebAssembly
  - Zig
showFullContent: false
readingTime: true
hideComments: true
draft: false
contentLanguage: "en"
description: "Ever wondered what powers the interactive circuits scattered across this series? Meet circ, a small language I built so the diagrams in this blog could actually run in your browser. A short letter introducing the language, the compiler behind it, and why a tiny thing can be a joy."

versions:
  - name: English
    url: /blog/circ-en
  - name: Português (BR)
    url: /blog/circ
---
Hey y'all! If you've been following the fundamentals of computing series here, you've noticed those little widgets. You can click them, toggle the switches, watch the LEDs light up, peek at the circuit topology. Today I want to tell you what's actually running in them, because I made it.

It's called `circ`. It's a small language for describing digital circuits, and a compiler that turns the description into something your browser can run. First of all I want you to understand this isn't a serious systems language (_yet_), and I believe it's great for this blog but not ready for production. For now it exists for the sole purpose of having the circuits here _actually work_, instead of being static drawings or handcrafted simulators.

## How it reads

I think the best way to introduce a language is to let you look at it. Here's a half-adder written in `.circ`:

```
input a, b

xor s(a=a, b=b)
and c(a=a, b=b)

output sum(in=s.out)
output carry(in=c.out)
```

That's the whole file. You declare your inputs, you instantiate gates and give them names, you wire each gate's ports to the signals that drive them, and you declare which signals leave through the outputs. Doesn't it read a little like a recipe? _Take two inputs. Combine `a` and `b` with an XOR, call it `s`. Combine the same two with an AND, call it `c`. Send `s.out` to the `sum` output, `c.out` to the `carry`._ That's it.

The primitives are deliberately tiny: `input`, `output`, `and`, `not`, `wire`, `led`. Six things. Everything else is built from those.

And here's a detail I'm a little smug about: the built-in gates `or`, `nand`, `nor`, `xor`, `xnor` are themselves written in `.circ`. The compiler's entire "standard library" is five tiny files that look exactly like the one above. When you write `xor s(a=a, b=b)`, the compiler quietly pulls in a five-line file that defines XOR in terms of AND, OR, and NAND. The language is small enough to be its own standard library, and that makes me unreasonably happy.

## Where it came from

`circ` didn't start as a language. It started as me wanting to draw circuits.

I'd been writing this series for a while, and every circuit in every post was a static SVG I'd hand-drawn or coaxed out of a TypeScript renderer I kept patching. The drawings worked, but they were _just drawings_. You couldn't toggle a switch and watch the LED change. You couldn't ask "what does this circuit _do_, exactly?" and get an answer. They were illustrations of computers, not computers.

Around the same time I bought [_The Elements of Computing Systems_](https://www.amazon.com/Elements-Computing-Systems-Building-Principles/dp/0262640686/ref=ed_oe_p), and this book hexed me (pun intended) with the curse of curiosity, which led me right into [_Nand to Tetris_](https://www.nand2tetris.org/). In it, you build everything from a single NAND gate, in a tiny language called HDL, and every component you write actually runs. The combination of "describe a circuit in a few lines" and "now press play and watch it work" is how circuits should feel when you're learning about them. So I wanted that, for this blog, for you. The widgets in the posts you've already read are the result.

The name is the most boring part of the story: `circ` is short for circuit (_I am not a poet, sorry._)

## The two things I love most

Once the compiler started working, two things fell out of it that I didn't expect to love as much as I do.

The first is that `circ` can draw itself. Hand it a circuit and it'll produce an ASCII schematic, complete with rounded corners, fan-out dots, and wires that detour politely around gates that sit in their way. Here's the half-adder from earlier, rendered by the compiler itself:

```
╭───╮     ╭───╮         ╭───────╮
│ a ├○─●─▶┤   │ ╭──────▶┤ carry │
╰───╯  │  │AND├○╯       ╰───────╯
      ╭┼─▶┤   │
      ││  ╰───╯
      ││
╭───╮ ││  ╭───────╮     ╭─────╮
│ b ├○●╰─▶┤       │ ╭──▶┤ sum │
╰───╯ │   │[xor:s]├○╯   ╰─────╯
      ╰──▶┤       │
          ╰───────╯
```

The second is that `circ` can tabulate itself. Hand it the same file and ask for `--truth-table`, and you get:

|a|b|sum|cout|
|---|---|---|---|
|0|0|0|0|
|1|0|1|0|
|0|1|1|0|
|1|1|0|1|

That's the beauty of it: using only 5 lines you have a circuit description, a picture of itself, and proof that it does what it claims. Every interactive widget in every post of this series has been `circ` doing this quietly in the background, three times over. Once to render the schematic you see, once to run the simulation when you toggle a switch, once to prove the gates behave the way I said they would.

## Until we meet again

That's just the surface of it. There's a parser, a resolver, a validator with stable error codes, a tiny WebAssembly runtime that the compiler embeds inside every artifact so the whole thing runs in your browser without needing any toolchain on your machine. But those are stories for other days.

If you want to dig deeper, the language has a home of its own at [circ-lang.org](https://circ-lang.org/), with the full reference and more examples than I could fit here.

For now, the next time you click on a widget in one of these posts, you'll know what you're looking at. It's `circ`. Pleasure to meet you.

### Special thanks

Before we say goodbye, I want to give a special shoutout to [@clarete](https://clarete.li/). He is the brain behind [langlang](https://clarete.li/langlang/), the parser generator that powers this language. He has been hammering my ears about langlang for years and I couldn't be more proud of what he has done.

## References

- [`circ-compiler` on GitHub](https://github.com/jeffersonmourak/circ-compiler)
- [circ-lang.org](https://circ-lang.org/), the language reference and examples
- [Zig](https://ziglang.org/)
- [langlang](https://clarete.li/langlang/), the PEG parser generator that builds the `.circ` grammar
- [From Nand to Tetris](https://www.nand2tetris.org/)