---
title: Remember me?
date: 2025-01-19T08:27:04-02:00
author: Jefferson Oliveira
cover: ""
tags:
  - EN
  - CPU
  - Memory
  - Combinational
  - Sequential
keywords:
  - CPU
  - Memory
  - Combinational
  - Sequential
showFullContent: false
readingTime: true
hideComments: true
draft: false
contentLanguage: "en"
description: "Have you ever wondered how your computer 'remembers' everything? This article unveils the secret behind digital memory, exploring from combinational and sequential chips to the crucial role of flip-flops and registers. A fascinating journey to understand how information is stored in the heart of your machine."

versions:
  - name: English
    url: /blog/memory/english
  - name: Português (Brasileiro)
    url: /blog/memory
---
> Hey Y'all! This is a translation of my blog post originally written in Portuguese.
> If you want to read that version, [click here](/blog/memory/).

> Hello everyone, this is the third article in the series about computers, and also the last one with this header here, because from here on it's recommended that you have already read the two previous articles:
>
> - [Logic gates](https://jeffersonmourak.com/blog/logic-gates/).
> - [Pleasure to meet you, Binary.](https://jeffersonmourak.com/blog/the-binary/).

<div id="elevenlabs-audionative-widget" data-height="90" data-width="100%" data-frameborder="no" data-scrolling="no" data-publicuserid="2be4d6242c862832d6b47ec70f7d7daf2c9f1306c933439f7083622af43fe99f" data-playerurl="https://elevenlabs.io/player/index.html" >Loading the <a href="https://elevenlabs.io/text-to-speech" target="_blank" rel="noopener">Elevenlabs Text to Speech</a> AudioNative Player...</div><script src="https://elevenlabs.io/player/audioNativeHelper.js" type="text/javascript"></script>

In the previous articles, we saw how logic gates can be used to make comparisons and also calculate arithmetic operations, but we haven't yet seen how the computer can store information over time.

Another thing we'll do here is categorize each type of chip: the ones shown previously are ***combinational***, which means they don't need anything beyond signals at their inputs to be able to compute a result, but there are also ***sequential*** ones. The difference between them is that sequential depends not only on the input signals, but also on the previously processed value.

A very practical way to use logic gates to store information is using a chip called ***flip-flop***, which is represented below. It contains 2 inputs: the top one `set` and the bottom one `reset` (you can click on the circuit below to interact with them).
{{< loadCirc "dff.circ" 800 355 3.5 >}}
If you stop to analyze, it's quite simple: following the `set` trail, you'll see there are two logic gates in the path, an `OR` and an `AND`. One of the `OR` gate inputs is connected to the result of the `AND` at the end of the chip. This combination makes it so that when we have **0** and are given a value **1**, the `OR` gate will result in **1**, and the `AND` will also.

However, when we remove the signal from `set`, the value that was previously placed is persisted because now the `OR` is maintaining the state that keeps the `AND` also in the previous state. Problem solved, right? No! Notice that our circuit is now locked, as there's no way to get out of this state unless the `AND` gets another value, and that's what the `reset` gate is for: it's connected to a `NOT`, meaning while it's off (0), its result will be 1 (on), and vice versa.

An evolution we can make to the ***flip-flop*** is to transform it into a ***Register***. In the register, we can choose whether it's time or not to read our signal and store it, and subsequently rewrite it, all at our leisure. There are many ways to achieve this chip, so I'll use the implementation demonstrated by [Sebastian Lague](https://www.youtube.com/watch?v=I0-izyq6q5s).

In it, we just need to add 3 more logic gates and that's it!
{{< loadCirc "mux.circ" 800 355 3.5 >}}
If we break it down a bit, what happens is the following: the upper input, which we'll now call `data`, will only be saved in the ***flip-flop*** when the lower input, which also changed names, now called `enabled`. So instead of using two inputs, one to save and another to erase, this combination of `AND`s and `NOT` chooses which operation will be performed.

- If `data` = 1 and `enabled` = 1, then it's the same as turning on the `set` input of the ***flip-flop***.
- If `data` = 0 and `enabled` = 1, then it's the same as turning on the `reset` input of the ***flip-flop***.
Notice that `enabled` always needs to be activated so that it can save the signal that was placed in `data`.

Another thing we can do is take inspiration from the previous article, where at the end we learned that if we combine several Adders, we can do calculations with multiple digits. In memory it's the same way: combining several registers, you can provide an input for each `data` and share the `enabled` signal, and thus you can save the values of an entire binary number.

For now, we say goodbye here, see you next time 😄

<iframe src="https://giphy.com/embed/m9eG1qVjvN56H0MXt8" width="300px" height="400px" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>

References

- [How Do Computers Remember? (YouTube)](https://www.youtube.com/watch?v=I0-izyq6q5s)
- [SR latch (YouTube)](https://www.youtube.com/watch?v=KM0DdEaY5sY)
- [D latch](https://www.youtube.com/watch?v=peCh_859q7Q)
- [HOW TRANSISTORS RUN CODE? (YouTube)](https://www.youtube.com/watch?v=HjneAhCy2N4)
- [From Nand to Tetris](https://www.nand2tetris.org/)
