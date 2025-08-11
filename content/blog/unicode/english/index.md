---
title: The Evolution of Digital Writing - From ASCII to the Wonders of UTF-8
date: 2025-08-07T10:29:04-02:00
author: Jefferson Oliveira
cover: ""
tags:
  - EN
  - Unicode
  - ASCII
  - UTF-8

keywords:
  - Unicode
  - ASCII
  - UTF-8
showFullContent: false
readingTime: true
hideComments: true
draft: false
contentLanguage: "en"
description: "Have you ever wondered how computers transform letters, numbers, and emojis into zeros and ones that they can understand? Just like us humans assign meanings to letters of the alphabet, the computer does the same. Let's explore here two of the most popular text encoding standards."

versions:
  - name: English
    url: /blog/unicode/english
  - name: Português (Brasileiro)
    url: /blog/unicode
---
<div id="elevenlabs-audionative-widget" data-height="90" data-width="100%" data-frameborder="no" data-scrolling="no" data-publicuserid="2be4d6242c862832d6b47ec70f7d7daf2c9f1306c933439f7083622af43fe99f" data-playerurl="https://elevenlabs.io/player/index.html" data-projectid="vXqUPGWRArVCy0iXsuvH" >Loading the <a href="https://elevenlabs.io/text-to-speech" target="_blank" rel="noopener">Elevenlabs Text to Speech</a> AudioNative Player...</div><script src="https://elevenlabs.io/player/audioNativeHelper.js" type="text/javascript"></script>

> Hey Y'all! This is a translation of my blog post originally written in Portuguese.
> If you want to read that version, [click here](/blog/unicode/).

Have you ever wondered how computers transform letters, numbers, and emojis into zeros and ones that they can understand? Just like us humans assign meanings to letters of the alphabet, the computer does the same. Let's explore here two of the most popular text encoding standards.

### ASCII

Developed in the 1960s, ASCII (American Standard Code for Information Interchange) has a very simple premise: using only 7 bits, you can represent 127 numbers, reserving the first 32 numbers in the sequence for important writing commands. The rest is filled with letters, numbers, and some punctuation marks.

The people involved in developing the standard did it in such a way that the alphabet sequence could help with decoding.

For example, the character for the number "0" is **48**, which, represented in 7 bits, becomes `011 0000`.
Just like:

1 → `011 0001`

2 → `011 0010`

3 → `011 0011`

If you notice, the last 4 bits are in sequence. So, to find out what the integer is in ASCII, you just subtract 011 0000 (decimal: 48).

In the same way, the letters of the alphabet: "A" is **65** → 100 0001 and "a" is **97** → 110 0001. With this, it was possible to encode all the letters of the English alphabet 🇬🇧.

<iframe width="100%" height="1026" frameborder="0"
  src="https://observablehq.com/embed/62a48ff7bbb43b02@440?cells=ascii"></iframe>

_... meanwhile in the rest of the world ..._

<div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/3oz8xQBcUXftkrlmmc" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/southparkgifs-3oz8xQBcUXftkrlmmc">via GIPHY</a></p>

As you might imagine, with the advancement of technology and computer capacity, each country used this extra capacity to encode their own characters. Japan, for example, didn't even use ASCII. Other encoders, like Shift JIS, used multiple bytes, and with all this, a gigantic incompatibility was generated.

> Fun fact:
> In Japan, there's the word mojibake (文字化け), which means "distorted character". This happened due to encoding problems between all Japanese alphabets and also the Latin one.

However, even with all this incompatibility during the 1980s and 1990s, what were the chances of a London company having to constantly send documents to Japan? At that time, the solution was simple: print and send by fax!

<div style="width:100%;height:0;padding-bottom:76%;position:relative;"><iframe src="https://giphy.com/embed/xT5LMKZ9tnioMLEjBe" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/season-7-the-simpsons-7x15-xT5LMKZ9tnioMLEjBe">via GIPHY</a></p>

Then the internet came, and what was bad got even worse... Now we have to deal with documents being constantly sent over the internet, and over time the following was formed:

## Unicode Consortium

And as in an event that could be called a miracle of common sense, over the last few decades, a standard was formed with 154,998 characters, covering every language you can imagine: Arabic, Japanese, Cyrillic, Chinese, Korean, and even Egyptian hieroglyphs.

What they did in a simplified way was take hundreds of thousands of numbers and assign them to hundreds of thousands of characters, that is, the number 35307 will represent the Japanese character 觫, the number 963 will represent σ, and so on.

### UTF-8

Perfect, now we have hundreds of thousands of numbers to represent every possible character, but how are we going to do this with binary?

To represent a number in these proportions, we'll need at least 32 bits to represent any number of that magnitude, which now brought problems for the English alphabet, because Unicode is compatible with ASCII, meaning "A" is still **65** and "a" is still **97**. But when we look at the 32-bit binary of these numbers, we now use 4x more space to represent the same characters.

|   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **1** | 0 | 0 | 0 | 0 | 0 | **1** |  | **A** |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **1** | **1** | 0 | 0 | 0 | 0 | **1** |  | **a** |

Counting above, there are 25 consecutive zeros that will be present in every text that uses Latin characters, and that's just the first of our problems. The second is that some old systems interpret a sequence of 8 zeros [`NULL`] as the end of a character, the famous `\0` in C.

So UTF-8 comes in. The first thing is: if the letter has a number below 127, then you represent it exactly the same as ASCII.

So the first problem is solved: "A" is still **65** and fits in 8 bits. `01000001`.

And for numbers greater than 127? For that, you'll break your binary into 2 bytes.

| 1 | 2 |
|---|---|
|`110xxxxx`|`10xxxxxx`|

In byte 1, you have the header `110`, which means this character was broken into 2 bytes.
In byte 2, you start with the continuation header `10`. All other remaining bits you'll fill with the number you want to represent.

To calculate, just remove the headers, join all the bits, and the resulting number is the Unicode character. You can do this up to 4096. Beyond that? No problem! Using the header `1110` + 2 bytes, you have 16 bits.

| 1 | 2 | 3 |
|---|---|---|
|`1110xxxx`|`10xxxxxx`|`10xxxxxx`|

Want to go further? That's fine! The standard supports up to the header `1111110x` + 6 continuation bytes.

### Encoding UTF-8

<iframe width="100%" height="965" frameborder="0" style="background-color: var(--foreground); border-radius: 10px;"
  src="https://observablehq.com/embed/62a48ff7bbb43b02@442?cells=viewof+character%2Ccodepoint%2CencodingVisualizer"></iframe>

It's amazing how this standard manages to deliver:

- It's compatible with previous systems;

- It doesn't waste space;

- And at no point in life will there be 8 consecutive zeros in any part of any byte.

Additionally, another reason that made it become the world standard today is that, to move between characters, if you don't know where you are, you just look for the next header, you don't need an index.

It's been several years since UTF-8 became the standard in all internet communication, and the fact that today the average Japanese person doesn't need to worry about mojibake anymore is because of this brilliant method of encoding text.

### References

- [Characters, Symbols and the Unicode Miracle - Computerphile (YouTube)](https://www.youtube.com/watch?v=MijmeoH9LT4)
- [UTF-8, a transformation format of ISO 10646 - ietf.org](https://datatracker.ietf.org/doc/html/rfc3629)
- [The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets (No Excuses!) - Joel Spolsky](https://joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/)
