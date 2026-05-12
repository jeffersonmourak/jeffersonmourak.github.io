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
    url: /blog/unicode-en
  - name: Português (Brasileiro)
    url: /blog/unicode
---
<div id="elevenlabs-audionative-widget" data-height="90" data-width="100%" data-frameborder="no" data-scrolling="no" data-publicuserid="2be4d6242c862832d6b47ec70f7d7daf2c9f1306c933439f7083622af43fe99f" data-playerurl="https://elevenlabs.io/player/index.html" data-projectid="h3hAFoSE8EurzeNTiAzV" >Loading the <a href="https://elevenlabs.io/text-to-speech" target="_blank" rel="noopener">Elevenlabs Text to Speech</a> AudioNative Player...</div><script src="https://elevenlabs.io/player/audioNativeHelper.js" type="text/javascript"></script>

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

```observable:notebook
<script id="1" type="ojs" hidden>
mutable ascii_message = [72, 101, 108, 108, 111]
</script>
<script id="2" type="ojs">
ascii = {
  const buttons = [];
  for (let i = 32; i <= 127; i++) {
    const button = html`<button class="ascii-button">
      <span class="ascii-button-char">${i === 127 ? "DEL" : String.fromCharCode(i)}</span>
      <span class="ascii-button-info">${i} 0x${i.toString(16)}</span>
    </button>`;

    button.addEventListener("click", () => {
      if (i === 127) {
        const k = [...ascii_message];
        k.pop();
        mutable ascii_message = [...k];
        return;
      }
      mutable ascii_message = [...ascii_message, i];
    });

    buttons.push(button);
  }

  // Tooltip portal: a single popup mounted on <body> so it escapes the
  // .ascii-view scroll container's clip box (CSS can't mix overflow-x:
  // auto with overflow-y: visible on one element). The cell positions
  // it with getBoundingClientRect() on hover, and cleans it up via
  // invalidation when the cell re-renders.
  const tooltip = document.createElement("div");
  tooltip.className = "ascii-hex-info";
  document.body.appendChild(tooltip);
  invalidation.then(() => tooltip.remove());

  const showTooltip = (cell, code) => {
    tooltip.innerHTML =
      `<span>Dec</span><span>Bin</span>` +
      `<span>${code}</span><span>${code.toString(2).padStart(8, "0")}</span>`;
    const rect = cell.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.bottom + 8}px`;
    tooltip.dataset.visible = "true";
  };
  const hideTooltip = () => { tooltip.dataset.visible = "false"; };

  const charCells = ascii_message.map(
    (code) => html`<span class="ascii-cell">${String.fromCharCode(code)}</span>`,
  );

  const memoryCells = ascii_message.map((code) => {
    const cell = html`<div class="ascii-cell">${code.toString(16).toUpperCase()}</div>`;
    cell.addEventListener("mouseenter", () => showTooltip(cell, code));
    cell.addEventListener("mouseleave", hideTooltip);
    return cell;
  });

  // Build the view as its own node so we can pin scrollLeft after the
  // cell mounts. The cell re-runs (fresh DOM, scrollLeft starts at 0) on
  // every ascii_message mutation, so this jumps to the rightmost edge
  // each time — the newest character/byte stays in view as the message
  // grows past the embed width. requestAnimationFrame guarantees the
  // node is in the document and laid out before we read scrollWidth.
  const view = html`<div class="ascii-view">
    <div class="ascii-display">
      <div class="ascii-display-row">${charCells}</div>
      <div class="ascii-display-row">${memoryCells}</div>
    </div>
  </div>`;
  requestAnimationFrame(() => { view.scrollLeft = view.scrollWidth; });

  return html`<div class="ascii-keyboard">
    ${view}
    <div class="ascii-grid">${buttons}</div>
  </div>`;
}
</script>
```

_... meanwhile in the rest of the world ..._

<img width="100%" src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzNvcXQ4aTBpNGs5YWI3czdjeXBuaTU0dmw3eG44aWNxbTFxbzBieSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oz8xQBcUXftkrlmmc/giphy.gif">

As you might imagine, with the advancement of technology and computer capacity, each country used this extra capacity to encode their own characters. Japan, for example, didn't even use ASCII. Other encoders, like Shift JIS, used multiple bytes, and with all this, a gigantic incompatibility was generated.

> Fun fact:
> In Japan, there's the word mojibake (文字化け), which means "distorted character". This happened due to encoding problems between all Japanese alphabets and also the Latin one.

However, even with all this incompatibility during the 1980s and 1990s, what were the chances of a London company having to constantly send documents to Japan? At that time, the solution was simple: print and send by fax!

<img width="100%" src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2IzdGtqeHVmemRsZ2cwYTliY2trM2Zla3M2bXZndHF1eHE5b2NkciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT5LMKZ9tnioMLEjBe/giphy.gif">

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

```observable:notebook
  <script id="3" type="ojs">
// Cell 1: A view-of cell creates a UI element (a text input).
// The value of this cell is bound to the `character` variable.
viewof character = {
  const form = Inputs.text({
    label: "Enter a character",
    value: "😊", // Default value to demonstrate a multi-byte character
    placeholder: "e.g.: A, €, 😊",
    width: "3rem", // input clamps to a single code point, so a 3rem field is enough; Inputs.text propagates this to --input-width for its layout math
  });

  // Clamp the input to a single code point. The HTML `maxlength`
  // attribute counts UTF-16 code units, so `maxlength=1` would reject
  // emoji like "😊" (a surrogate pair, length 2). Array.from / spread
  // iterates by code point, so [...str][0] is the first user-visible
  // character whether it's ASCII, BMP, or astral-plane.
  const input = form.querySelector("input");
  input.addEventListener("input", () => {
    const first = [...input.value][0] ?? "";
    if (input.value !== first) input.value = first;
  });

  return form;
}
  </script>
  <script id="4" type="ojs">
// viewof exposes the table element to the embed while keeping `codepoint`
// (used by encodingVisualizer below) resolved to element.value — the same
// data shape as before, so downstream cells need no changes.
viewof codepoint = {
  const cp = character.codePointAt(0);
  const defaultChar = "😊";
  const data = !cp
    ? {
        character: defaultChar,
        decimal: defaultChar.codePointAt(0),
        hex: `U+${defaultChar.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`,
      }
    : {
        character,
        decimal: cp,
        hex: `U+${cp.toString(16).toUpperCase().padStart(4, "0")}`,
      };

  const element = html`<table class="utf8-codepoint">
    <thead>
      <tr><th>Character</th><th>Decimal</th><th>Hexadecimal</th></tr>
    </thead>
    <tbody>
      <tr>
        <td class="utf8-codepoint-char">${data.character}</td>
        <td>${data.decimal}</td>
        <td><code>${data.hex}</code></td>
      </tr>
    </tbody>
  </table>`;

  element.value = data;
  return element;
}
  </script>
  <script id="5" type="ojs">
encodingVisualizer = {
  // Helper function to format a number as a binary string with zero padding
  const toBinary = (num, length) => num.toString(2).padStart(length, "0");

  let htmlOutput = "";
  const cp = codepoint.decimal;

  htmlOutput += `<h3>1. Character & Codepoint</h3>`;
  htmlOutput += `<p>The character <strong>"${character}"</strong> corresponds to the Unicode codepoint <strong>${
    codepoint.decimal
  }</strong> (in decimal) or <strong>${
    codepoint.hex
  }</strong> (in hexadecimal).</p>`;

  let bytes = [];
  let explanation = "";
  let binaryVis = "";

  htmlOutput += `<h3>2. Determine the Number of Bytes</h3>`;

  // Case 1: 1-byte sequence (for standard ASCII characters)
  if (cp <= 0x7f) {
    bytes.push(cp);
    explanation = `
      <p>Codepoint ${cp} is ≤ 127 (0x7F), so it fits in a <strong>single byte</strong>.</p>
      <p>The pattern for a 1-byte sequence is <code><span class="byte-prefix">0</span><span class="payload">xxxxxxx</span></code>, where the 'x' bits are the codepoint itself.</p>
    `;
    const binaryCp = toBinary(cp, 7);
    binaryVis = `
      <div class="byte-vis">
        <span class="byte-prefix" title="1-byte prefix">0</span><span class="payload" title="Codepoint bits">${binaryCp}</span>
      </div>
    `;
  }
  // Case 2: 2-byte sequence
  else if (cp <= 0x7ff) {
    bytes.push(0b11000000 | (cp >> 6));
    bytes.push(0b10000000 | (cp & 0b00111111));
    explanation = `
      <p>Codepoint ${cp} is between 128 (0x80) and 2047 (0x7FF), so it requires a <strong>2-byte sequence</strong>.</p>
      <p>The pattern is <code><span class="byte-prefix">110</span><span class="payload">xxxxx</span> <span class="byte-prefix">10</span><span class="payload-alt">xxxxxx</span></code>. This provides 5 + 6 = 11 bits for the codepoint.</p>
    `;
    const binaryCp = toBinary(cp, 11);
    const part1 = binaryCp.slice(0, 5);
    const part2 = binaryCp.slice(5);
    binaryVis = `
      <p>Codepoint in binary (11 bits): <span class="payload">${part1}</span><span class="payload-alt">${part2}</span></p>
      <div class="byte-vis-container">
        <div class="byte-vis">
          <span class="byte-prefix" title="First byte prefix">110</span><span class="payload" title="First 5 bits of the codepoint">${part1}</span>
        </div>
        <div class="byte-vis">
          <span class="byte-prefix" title="Continuation byte prefix">10</span><span class="payload-alt" title="Last 6 bits of the codepoint">${part2}</span>
        </div>
      </div>
    `;
  }
  // Case 3: 3-byte sequence (includes most common multilingual characters)
  else if (cp <= 0xffff) {
    bytes.push(0b11100000 | (cp >> 12));
    bytes.push(0b10000000 | ((cp >> 6) & 0b00111111));
    bytes.push(0b10000000 | (cp & 0b00111111));
    explanation = `
      <p>Codepoint ${cp} is between 2048 (0x800) and 65535 (0xFFFF), so it requires a <strong>3-byte sequence</strong>.</p>
      <p>The pattern is <code><span class="byte-prefix">1110</span><span class="payload">xxxx</span> <span class="byte-prefix">10</span><span class="payload-alt">xxxxxx</span> <span class="byte-prefix">10</span><span class="payload">xxxxxx</span></code>. This provides 4 + 6 + 6 = 16 bits.</p>
    `;
    const binaryCp = toBinary(cp, 16);
    const part1 = binaryCp.slice(0, 4);
    const part2 = binaryCp.slice(4, 10);
    const part3 = binaryCp.slice(10);
    binaryVis = `
      <p>Codepoint in binary (16 bits): <span class="payload">${part1}</span><span class="payload-alt">${part2}</span><span class="payload">${part3}</span></p>
      <div class="byte-vis-container">
        <div class="byte-vis">
          <span class="byte-prefix" title="First byte prefix">1110</span><span class="payload" title="First 4 bits of the codepoint">${part1}</span>
        </div>
        <div class="byte-vis">
          <span class="byte-prefix" title="Continuation byte prefix">10</span><span class="payload-alt" title="Next 6 bits of the codepoint">${part2}</span>
        </div>
        <div class="byte-vis">
          <span class="byte-prefix" title="Continuation byte prefix">10</span><span class="payload" title="Last 6 bits of the codepoint">${part3}</span>
        </div>
      </div>
    `;
  }
  // Case 4: 4-byte sequence (for emojis, historical scripts, etc.)
  else if (cp <= 0x10ffff) {
    bytes.push(0b11110000 | (cp >> 18));
    bytes.push(0b10000000 | ((cp >> 12) & 0b00111111));
    bytes.push(0b10000000 | ((cp >> 6) & 0b00111111));
    bytes.push(0b10000000 | (cp & 0b00111111));
    explanation = `
      <p>Codepoint ${cp} is > 65535 (0x10000), so it requires a <strong>4-byte sequence</strong>.</p>
      <p>The pattern is <code><span class="byte-prefix">11110</span><span class="payload">xxx</span> <span class="byte-prefix">10</span><span class="payload-alt">xxxxxx</span> <span class="byte-prefix">10</span><span class="payload">xxxxxx</span> <span class="byte-prefix">10</span><span class="payload-alt">xxxxxx</span></code>. This provides 3 + 6 + 6 + 6 = 21 bits.</p>
    `;
    const binaryCp = toBinary(cp, 21);
    const part1 = binaryCp.slice(0, 3);
    const part2 = binaryCp.slice(3, 9);
    const part3 = binaryCp.slice(9, 15);
    const part4 = binaryCp.slice(15);
    binaryVis = `
      <p>Codepoint in binary (21 bits): <span class="payload">${part1}</span><span class="payload-alt">${part2}</span><span class="payload">${part3}</span><span class="payload-alt">${part4}</span></p>
      <div class="byte-vis-container">
        <div class="byte-vis">
          <span class="byte-prefix" title="First byte prefix">11110</span><span class="payload" title="First 3 bits of the codepoint">${part1}</span>
        </div>
        <div class="byte-vis">
          <span class="byte-prefix" title="Continuation byte prefix">10</span><span class="payload-alt" title="Next 6 bits of the codepoint">${part2}</span>
        </div>
        <div class="byte-vis">
          <span class="byte-prefix" title="Continuation byte prefix">10</span><span class="payload" title="Next 6 bits of the codepoint">${part3}</span>
        </div>
        <div class="byte-vis">
          <span class="byte-prefix" title="Continuation byte prefix">10</span><span class="payload-alt" title="Last 6 bits of the codepoint">${part4}</span>
        </div>
      </div>
    `;
  }

  htmlOutput += explanation;
  htmlOutput += `<h3>3. Fill in the Bits</h3>`;
  htmlOutput += binaryVis;

  // Final Result
  if (bytes.length > 0) {
    const hexBytes = bytes
      .map((b) => b.toString(16).toUpperCase().padStart(2, "0"))
      .join(" ");
    const binaryBytes = bytes.map((b) => toBinary(b, 8)).join(" ");
    htmlOutput += `
      <hr>
      <h3>4. Final Result</h3>
      <p>The final UTF-8 byte sequence for "${character}" is:</p>
      <p><strong>Binary:</strong> <code>${binaryBytes}</code></p>
      <p><strong>Hexadecimal:</strong> <code>${hexBytes}</code></p>
    `;
  }

  const content = document.createElement("div");
  content.className = "utf8-encoder";
  content.innerHTML = htmlOutput;

  return content;
}
  </script>
```

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
