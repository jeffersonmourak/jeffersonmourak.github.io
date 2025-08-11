---
title: "Logic Gates"
date: "2024-11-07T08:27:04-03:00"
author: "Jefferson Oliveira"
cover: ""
tags: ["EN", "CPU", "Logic Gates"]
keywords: ["CPU", "Logic Gates", "Logic Gates", "Computing"]
description: "Curious to know how computers make decisions? This article is your starting point! Unveil the universe of logic gates, the building blocks that allow machines to process binary information. Discover how simple 'yes' and 'no' operations transform into the artificial intelligence of your daily life."
showFullContent: false
readingTime: true
hideComments: true
draft: false
contentLanguage: "en"

versions:
  - name: English
    url: /blog/logic-gates/english
  - name: Português (Brasileiro)
    url: /blog/logic-gates
---
> Hey Y'all! This is a translation of my blog post originally written in Portuguese.
> If you want to read that version, [click here](/blog/logic-gates/).

> Revised [11/12/2024]
>
> Hi folks, so I had to make some changes here in the post to add some interactive widgets,
> and I took the opportunity to give a bit more context to the content.

<div id="elevenlabs-audionative-widget" data-height="90" data-width="100%" data-frameborder="no" data-scrolling="no" data-publicuserid="2be4d6242c862832d6b47ec70f7d7daf2c9f1306c933439f7083622af43fe99f" data-playerurl="https://elevenlabs.io/player/index.html" >Loading the <a href="https://elevenlabs.io/text-to-speech" target="_blank" rel="noopener">Elevenlabs Text to Speech</a> AudioNative Player...</div><script src="https://elevenlabs.io/player/audioNativeHelper.js" type="text/javascript"></script>

Hello, this is the first article in a series about the fundamentals of computing. The idea is to demonstrate in a simple and practical way how this device transforms zeros and ones into practically anything, the functioning of CPUs and other interesting subjects. So, to start, the first concept we have to learn is that of logic gates: they are the foundation of all computing, with them we can do certain operations that receive as input one or more values and will have another value as a result.

But what are these values? The number 42? My mother's name? These "values" are energy, more specifically the presence and absence of it. As mentioned in the introduction, computers work using binary digits, meaning these machines only understand 0 and 1 or "Has energy" and "No energy". However, we won't call these zeros and ones energy, for the computer they are signals.

When signals are combined and/or compared, we call it a logical operation, for example.

"[Harp sounds of story beginning]"

One day you hire an electrical company to install two switches in a hallway of your house, but due to a design error, the installation ends up like this: the wire passes through the first switch (let's call it switch A), goes straight to the second switch (B for intimates) and then exits to the lamp.

![](./CPUImageFrame1.png)

Did you notice that the lamp only lights up if both switches are on at the same time? If either one is turned off, the light goes out immediately! Well, this residential electrical atrocity can be explained, in mathematics, from one of its branches called boolean algebra, and in it we can demonstrate this with a table:

| ∧ | 0 | 1 |
| :-----: | :-----: | :-----: |
| 0 | 0 | 0 |
| 1 | 0 | 1 |

Writing this another way looks like this:

| ∧ | A off | A on |
| :----- | :----- | :----- |
| B off | Light off | Light off |
| B on | Light off | Light on |

If you noticed well, now we have a way to represent what we want to happen with two switches and a lamp, and this example shown above is the first logic gate we're getting to know, the AND or Conjunction, and this table, demonstrated above in different forms, is called a Truth Table.

Ok, but what about my house light? How is it going to be? I need the light to turn on when A OR B is on. How do you do that?

The answer is in the question itself! 😉 We'll need another logic gate, the OR or Disjunction, and to understand how it works, let's use a truth table that fits these conditions:

| ? | 0 | 1 |
| :-----: | :-----: | :-----: |
| 0 | 0 | 1 |
| 1 | 1 | 1 |

But before talking about OR, let's take a look at the NOT gate (or Negation). It's quite simple, but it will be important later on.
{{< loadCirc "sample.circ" 720 270 6 >}}

And if we write it in a truth table we'll have this here:

| ¬ | 0 | 1 |
| :-----: | :-----: | :-----: |
|  | 1 | 0 |

So, let's take a break and review what we already know. First, the operations and how to represent them in a table. To simplify, let's transform these operations into symbols. Every time we refer to AND, this will be the symbol:

{{< loadCirc "and.circ" 232 192 4 >}}

and the NOT:

{{< loadCirc "not.circ" 232 192 4 >}}

With these two logical operations (AND and NOT), we can already combine their results and create a third logic gate: the NAND (or Not AND).

It can be represented like this:

{{< loadCirc "nand.circ" 272 192 4 >}}

{{< loadCirc "example1.circ" 650 290 3 >}}

Its truth table is identical to AND's, but with the results inverted.

| ¬∧ | 0 | 1 |
| :-----: | :-----: | :-----: |
| 0 | 1 | 1 |
| 1 | 1 | 0 |

Following this same logic of combining gates, we can use a NAND gate and invert each switch input with a NOT. Thus, we'll have the following:

{{< loadCirc "example2.circ" 650 290 3 >}}

Analyzing the diagram above, we see that when both switches are off, both signals will be inverted by the NOT, and the NAND will result in ¬∧(1, 1) = 0. So with both off, the lamp turns off. But what happens when we have ¬∧(1, 0) or ¬∧(0, 1)? To find out, let's analyze the truth table:

| ∨ | 0 | 1 |
| :-----: | :-----: | :-----: |
| 0 | 0 | 1 |
| 1 | 1 | 1 |

<div style="width:100%;height:0;padding-bottom:75%;position:relative;"><iframe src="https://giphy.com/embed/n9h61thJkq6Xe" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div>

But wait a minute, I have the impression that I've seen this table before? Yes! This is the OR logic gate we were looking for. Quite a journey, isn't it? Now that we know how to fix the lamp wiring, we can take a break here. This is just the first article in a series about computers. Later on, we'll address other logic gates and other computing concepts.

References

* [Boolean algebra (Wikipedia)](https://pt.wikipedia.org/wiki/%C3%81lgebra_booliana)
* [Boolean Algebra (Wikipedia)](https://en.wikipedia.org/wiki/Boolean_algebra)
* [Truth table (Wikipedia)](https://pt.wikipedia.org/wiki/Tabela-verdade)
* [Exploring How Computers Work (YouTube)](https://www.youtube.com/watch?v=QZwneRb-zqA)
* [Making logic gates from transistors (YouTube)](https://www.youtube.com/watch?v=sTu3LwpF6XI)
* [HOW TRANSISTORS RUN CODE? (YouTube)](https://www.youtube.com/watch?v=HjneAhCy2N4)
