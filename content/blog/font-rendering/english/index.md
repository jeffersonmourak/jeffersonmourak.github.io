---
title: The Screen is the Canvas - Drawing Fonts with Mathematics
date: 2025-07-31T10:29:04-02:00
author: Jefferson Oliveira
cover: ""
tags:
  - EN
  - Font Rendering
  - Font
  - Computer Graphics

keywords:
  - Font Rendering
  - Font
  - Computer Graphics
showFullContent: false
readingTime: true
hideComments: true
draft: false
contentLanguage: "en"
description: "How do computers draw fonts? This article explores the font rendering process, from converting text to geometric shapes to rendering fonts in real-time. Learn about font rendering algorithms and how they are used to create user interfaces and documents."

versions:
  - name: English
    url: /blog/font-rendering/english
  - name: Português (Brasileiro)
    url: /blog/font-rendering
---
<div id="elevenlabs-audionative-widget" data-height="90" data-width="100%" data-frameborder="no" data-scrolling="no" data-publicuserid="2be4d6242c862832d6b47ec70f7d7daf2c9f1306c933439f7083622af43fe99f" data-playerurl="https://elevenlabs.io/player/index.html" data-projectid="N6yVs0fxb7RGLHGXjKsT" >Loading the <a href="https://elevenlabs.io/text-to-speech" target="_blank" rel="noopener">Elevenlabs Text to Speech</a> AudioNative Player...</div><script src="https://elevenlabs.io/player/audioNativeHelper.js" type="text/javascript"></script>

> Hey Y'all! This is a translation of my blog post originally written in Portuguese.
> If you want to read that version, [click here](/blog/font-rendering/).

On Saturday, July 26, 2025, I presented a lecture on font rendering at Google I/O Extended Natal. Due to the rush of daily life, I couldn't show many interactive practical examples. This article serves exactly that purpose: let's explore a bit about how the text you're reading is formed on your screen.

To start, we'll talk about Bitmaps. This is the most naive way to draw fonts, as a bitmap is nothing more than a ready-made image. Below, for example, we have a letter that occupies a space of 6 pixels in height by 6 pixels in width.

At the moment, you can easily visualize it because the pixel size is set to 10 pixels. However, if you change the size to 1 pixel, you'll see that it's not possible to read what's on the screen.

<iframe width="100%" height="660" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1185?cells=baseExample%2Cviewof+glyph%2Cviewof+pixelSizeLabel%2Cviewof+pixelSize"></iframe>

As shown, the biggest problem with bitmap fonts is that they are not scalable. That is, to change the font size, we would have to:

- Create a new font with each letter drawn in the new size.

- Rasterize the font at another scale.

Let's see what happens in the second option.

This is a simple scaling function. It receives as parameters the data of the letter you want to draw and the scale at which you want to increase it.

It works simply by duplicating existing pixels on both the _X_ and _Y_ axes.

```javascript
function scaleGlyph (glyph, scale) {
  const newWidth = Math.ceil(glyph.width * scale);
  const newHeight = Math.ceil(glyph.height * scale);
  const newPixels = Array.from({ length: newHeight }, () =>
    Array(newWidth).fill(0)
  );

  for (let y = 0; y < glyph.height; y++) {
    for (let x = 0; x < glyph.width; x++) {
      const value = glyph.pixels[y][x];
      const newX = Math.floor(x * scale);
      const newY = Math.floor(y * scale);
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          if (newY + dy < newHeight && newX + dx < newWidth) {
            newPixels[newY + dy][newX + dx] = value;
          }
        }
      }
    }
  }
  return {
    width: newWidth,
    height: newHeight,
    pixels: newPixels,
  };
};
```

The problem with this type of scaling is that fonts end up getting a blocky appearance, which brings the feeling of a low-resolution image.

Another way is by applying scaling using linear interpolation. This technique consists of taking an average of all the original points around, instead of simply copying the entire block, blindly repeating what's in the pixel. However, this now results in a blurred image appearance, and this characteristic becomes more pronounced the greater the difference between the original size and the final size.

```javascript
function lerp(x0, v0, x1, v1, x) {
  if (x0 === x1) {
    return v0;
  }
  return v0 + (v1 - v0) * ((x - x0) / (x1 - x0));
}
```

```javascript
function bilinearInterpolate(Q11, Q21, Q12, Q22, x, y) {
  if (
    Q11.x !== Q12.x ||
    Q21.x !== Q22.x ||
    Q11.y !== Q21.y ||
    Q12.y !== Q22.y
  ) {
    console.error(
      "Error: The provided points do not form a proper rectangle for bilinear interpolation."
    );
  }

  const x1 = Q11.x;
  const x2 = Q21.x;
  const y1 = Q11.y;
  const y2 = Q12.y;

  const R1 = lerp(x1, Q11.value, x2, Q21.value, x);
  const R2 = lerp(x1, Q12.value, x2, Q22.value, x);
  const P = lerp(y1, R1, y2, R2, y);

  return P;
}
```

With this we have the examples below:

<iframe width="100%" height="759" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1193?cells=viewof+glyph%2Cviewof+pixelSizeLabel%2Cviewof+pixelSize%2CscaleExamples%2Cviewof+hardScaleLabel%2Cviewof+hardScale"></iframe>

### How to use one font for multiple sizes?

In mathematics, there are equations that draw a graph on the screen. The most common examples are:

#### Quadratic function

<div style="background-color: #b097d1; border-radius: 4px;">
<iframe width="100%" height="476" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1193?cells=viewof+quadraticFunctionBase"></iframe>
</div>

#### Multiplicative inverse function

<div style="background-color: #b097d1; border-radius: 4px;">
<iframe width="100%" height="476" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1193?cells=viewof+iverseFunction"></iframe>
</div>

To move our equations, we can add any value after the result of the exponentiation, and thus we move our equation on the _Y_ axis.

<div style="background-color: #b097d1; border-radius: 4px;">
<iframe width="100%" height="574" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1195?cells=viewof+yOffsetQuadratic%2Cviewof+quadraticYOffsetLabel%2Cviewof+quadraticYOffset"></iframe>
</div>

To move our equation horizontally, we add that value before squaring it.

<div style="background-color: #b097d1; border-radius: 4px;">
<iframe width="100%" height="574" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1195?cells=viewof+horizonralOffsetQuadratic%2Cviewof+quadraticXOffsetLabel%2Cviewof+quadraticXOffset"></iframe>
</div>

So, we already have a way to represent our curves using mathematical equations.

But before we draw, let's learn about one more thing: Bézier curves. It's a polynomial curve expressed as the linear interpolation between some representative points, called control points.

In the example below, we have 3 points: _P0_, _P1_ and _P2_, where _P0_ and _P2_ are the representative points and _P1_ is the control point.

You can move the examples below and see the result.

<iframe width="100%" height="476" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1195?cells=bezierExample"></iframe>

### Drawing a letter with vectors

With the Bézier concept, it becomes quite intuitive how we can draw a letter using mathematics: just organize points in sequence and mix straight lines with Bézier curves, making the _P2_ of one end exactly where the _P0_ of the other begins.

By the way, a straight line can also be made with Bézier; just align all the points. This way, it becomes even clearer how interpolation acts on the Bézier curve.

<iframe width="100%" height="276" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1195?cells=vectorExample"></iframe>

With this, we can now think about how to transform this into a bitmap. To do this, we first need to rasterize this font, starting by translating the Bézier curves into lines compatible with the screen resolution. This happens because the computer screen is a matrix of pixels; therefore, we need to transform curves into pixels readable to the human eye.

<iframe width="100%" height="673" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1196?cells=unfilledVector%2Cviewof+decomposeResolutionLabel%2Cviewof+decomposeResolution%2Cviewof+rasterizationScaleLabel%2Cviewof+rasterizationScale"></iframe>

Once this is done, the last thing needed is to fill the letter. This part can be done by a process called scanline, which consists of launching a ray and counting how many times that ray will touch one of the walls of the letter. If the number of touches is even, the pixel is represented outside the letter; if it's odd, it's inside.

<iframe width="100%" height="532" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1196?cells=viewof+scanlineExample"></iframe>

Notice that in the example of the letter 'O', there's a rendering flaw. It's there on purpose: the process of rendering fonts is complicated and full of edge cases that only increase the more we delve into the subject.

What I want to demonstrate with this flaw is that, besides counting how many times your line cuts the letter, you should also be aware if the line is cutting itself again.

<iframe width="100%" height="673" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1196?cells=viewof+decomposeResolutionLabel%2Cviewof+decomposeResolution%2CfilledVector%2Cviewof+rasterizationScaleLabel%2Cviewof+rasterizationScale"></iframe>

Well, and with this, we conclude this stage of the font rendering process. In a few days, I'll publish two more articles on the topic to complement the lecture subject. They will be about Unicode and Text Shaping.

Thank you very much, and see you next time! 😊

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 440px; overflow: hidden;">
<div style="width:50%;height:0;padding-bottom:98%;position:relative;"><iframe src="https://giphy.com/embed/1jkVi22T6iUrQJUNqk" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/fallontonight-nope-bye-1jkVi22T6iUrQJUNqk">via GIPHY</a></p>
</div>

## References

- [A Brief look at Text Rendering - VoxelRifts (YouTube)](https://www.youtube.com/watch?v=qcMuyHzhvpI)
- [Coding Adventure: Rendering Text -Sebastian Lague (YouTube)](https://www.youtube.com/watch?v=SO83KQuuZvg)
- [The Math Behind Font Rasterization | How it Works - GamesWithGame (YouTube)](https://www.youtube.com/watch?v=LaYPoMPRSlk)
- [Text Rendering Hates You - Aria Desires](https://faultlore.com/blah/text-hates-you/)
- [Multi-channel signed distance field generator - Viktor Chlumský\[Valve\] (GitHub)](https://github.com/Chlumsky/msdfgen)
- [Harfbuzz\[Google\] - (GitHub)](https://github.com/harfbuzz/harfbuzz)
