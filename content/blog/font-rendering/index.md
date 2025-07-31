---
title: A Tela é o Quadro - Desenhando fontes com matemática
date: 2025-07-31T10:29:04-03:00
author: Jefferson Oliveira
cover: ""
tags:
  - PT-BR
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
contentLanguage: "pt"
description: "Como os computadores desenham fontes? Este artigo explora o processo de renderização de fontes, desde a conversão de texto para formas geométricas até a renderização de fontes em tempo real. Aprenda sobre os algoritmos de renderização de fontes e como eles são usados para criar interfaces de usuário e documentos."
---
<div id="elevenlabs-audionative-widget" data-height="90" data-width="100%" data-frameborder="no" data-scrolling="no" data-publicuserid="2be4d6242c862832d6b47ec70f7d7daf2c9f1306c933439f7083622af43fe99f" data-playerurl="https://elevenlabs.io/player/index.html" >Loading the <a href="https://elevenlabs.io/text-to-speech" target="_blank" rel="noopener">Elevenlabs Text to Speech</a> AudioNative Player...</div><script src="https://elevenlabs.io/player/audioNativeHelper.js" type="text/javascript"></script>
No sábado, 26 de julho de 2025, apresentei uma palestra sobre renderização de fontes no Google I/O Extended Natal. Devido à correria do dia a dia, não consegui mostrar muitos exemplos práticos interativos. Este artigo serve justamente para isso: vamos explorar um pouco sobre como o texto que você está lendo é formado na sua tela.

Para começar, falaremos sobre Bitmaps. Esta é a forma mais ingênua de desenhar fontes, pois um bitmap nada mais é do que uma imagem pronta. Abaixo, por exemplo, temos uma letra que ocupa um espaço de 6 pixels de altura por 6 pixels de largura.

No momento, você consegue visualizar facilmente porque o tamanho dos pixels está em 10 pixels. No entanto, se você alterar o tamanho para 1 pixel, verá que não é possível ler o que está na tela."

<iframe width="100%" height="660" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1185?cells=baseExample%2Cviewof+glyph%2Cviewof+pixelSizeLabel%2Cviewof+pixelSize"></iframe>

Como mostrado, o maior problema das fontes de bitmap é que elas não são escaláveis. Ou seja, para que possamos mudar o tamanho das fontes, teríamos que:

- Criar uma nova fonte com cada uma das letras desenhadas no novo tamanho.

- Rasterizar a fonte em uma outra escala.

Vamos ver o que acontece na segunda opção.

Essa é uma função simples de escala. Ela recebe como parâmetros os dados da letra que você quer desenhar e a escala na qual deseja aumentar.

Ela funciona simplesmente duplicando os pixels existentes tanto no eixo _X_ quanto no _Y_.

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

O problema desse tipo de escala é que as fontes acabam obtendo um aspecto de bloco, o que traz a sensação de uma imagem com baixa resolução.

Outra forma é aplicando uma escala utilizando interpolação linear. Essa técnica consiste em tirar uma média de todos os pontos originais ao redor, em vez de simplesmente copiar o bloco inteiro, repetindo cegamente o que há no pixel. No entanto, isso agora resulta em um aspecto de imagem borrada, e essa característica se acentua quanto maior a diferença entre o tamanho original e o tamanho final.

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

Com isso temos os exemplos a baixo,

<iframe width="100%" height="759" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1193?cells=viewof+glyph%2Cviewof+pixelSizeLabel%2Cviewof+pixelSize%2CscaleExamples%2Cviewof+hardScaleLabel%2Cviewof+hardScale"></iframe>

### Como utilizar uma só fonte para vários tamanhos?

Na matemática, existem equações que desenham um gráfico na tela. Os exemplos mais comuns são:

#### Função quadrática

<div style="background-color: #b097d1; border-radius: 4px;">
<iframe width="100%" height="476" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1193?cells=viewof+quadraticFunctionBase"></iframe>
</div>

#### Função inversa multiplicativa

<div style="background-color: #b097d1; border-radius: 4px;">
<iframe width="100%" height="476" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1193?cells=viewof+iverseFunction"></iframe>
</div>

Para mover nossas equações, podemos somar um valor qualquer após o resultado da exponenciação e, assim, movemos nossa equação no eixo _Y_

<div style="background-color: #b097d1; border-radius: 4px;">
<iframe width="100%" height="574" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1195?cells=viewof+yOffsetQuadratic%2Cviewof+quadraticYOffsetLabel%2Cviewof+quadraticYOffset"></iframe>
</div>

Para mover nossa equação na horizontal, adicionamos esse valor antes de elevá-lo ao quadrado.

<div style="background-color: #b097d1; border-radius: 4px;">
<iframe width="100%" height="574" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1195?cells=viewof+horizonralOffsetQuadratic%2Cviewof+quadraticXOffsetLabel%2Cviewof+quadraticXOffset"></iframe>
</div>

Então, já temos uma maneira de representar nossas curvas utilizando equações matemáticas.

Mas antes de desenharmos, vamos aprender sobre mais uma coisa: curvas de Bézier. Ela é uma curva polinomial expressa como a interpolação linear entre alguns pontos representativos, chamados de pontos de controle.

No exemplo abaixo, temos 3 pontos: _P0_, _P1_ e _P2_, onde _P0_ e _P2_ são os pontos representativos e _P1_ é o ponto de controle.

Você pode mover os exemplos abaixo e ver o resultado.

<iframe width="100%" height="476" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1195?cells=bezierExample"></iframe>

### Desenhando uma letra com vetores

Com o conceito de Bézier, fica até intuitivo como podemos desenhar uma letra usando matemática: basta organizar pontos em sequência e misturar linhas retas com curvas de Bézier, fazendo com que o _P2_ de uma termine exatamente onde começa o _P0_ da outra.

Aliás, uma reta também pode ser feita com Bézier; basta alinhar todos os pontos. Dessa forma, fica ainda mais claro como a interpolação atua na curva de Bézier.

<iframe width="100%" height="276" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1195?cells=vectorExample"></iframe>

Com isso, já podemos agora pensar em como transformar isso em um bitmap. Para fazer isso, precisamos primeiramente rasterizar essa fonte, começando por traduzir as curvas de Bézier em linhas compatíveis com a resolução da tela. Isso acontece porque a tela do computador é uma matriz de pixels; logo, precisamos transformar curvas em pixels legíveis ao olho humano.

<iframe width="100%" height="673" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1196?cells=unfilledVector%2Cviewof+decomposeResolutionLabel%2Cviewof+decomposeResolution%2Cviewof+rasterizationScaleLabel%2Cviewof+rasterizationScale"></iframe>

Feito isso, a última coisa que se precisa é preencher a letra. Essa parte pode ser feita por um processo chamado scanline, que consiste em lançar um raio e contar quantas vezes esse raio vai tocar uma das paredes da letra. Se o número de toques for par, o pixel está representado fora da letra; se for ímpar, ele está dentro.

<iframe width="100%" height="532" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1196?cells=viewof+scanlineExample"></iframe>

Perceba que, no exemplo da letra 'O', há uma falha na renderização. Ela está aí de propósito: o processo de renderizar fontes é complicado e cheio de edge cases que só aumentam quanto mais aprofundamos no assunto.

O que quero demonstrar com essa falha é que, além de contar quantas vezes sua linha corta a letra, deve-se também estar ciente se a linha está cortando ela mesma novamente.

<iframe width="100%" height="673" frameborder="0"
  src="https://observablehq.com/embed/@jeffs-mind/font-rendering@1196?cells=viewof+decomposeResolutionLabel%2Cviewof+decomposeResolution%2CfilledVector%2Cviewof+rasterizationScaleLabel%2Cviewof+rasterizationScale"></iframe>

Bem, e com isso, concluímos esta etapa do processo de renderização das fontes. Daqui a uns dias, vou publicar outros dois artigos sobre o tema para complementar o assunto da palestra. Eles serão sobre Unicode e Text Shaping.

Muito obrigado, e até a próxima! 😊

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 440px; overflow: hidden;">
<div style="width:50%;height:0;padding-bottom:98%;position:relative;"><iframe src="https://giphy.com/embed/1jkVi22T6iUrQJUNqk" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/fallontonight-nope-bye-1jkVi22T6iUrQJUNqk">via GIPHY</a></p>
</div>

## Referencias

- [A Brief look at Text Rendering - VoxelRifts (YouTube)](https://www.youtube.com/watch?v=qcMuyHzhvpI)
- [Coding Adventure: Rendering Text -Sebastian Lague (YouTube)](https://www.youtube.com/watch?v=SO83KQuuZvg)
- [The Math Behind Font Rasterization | How it Works - GamesWithGame (YouTube)](https://www.youtube.com/watch?v=LaYPoMPRSlk)
- [Text Rendering Hates You - Aria Desires](https://faultlore.com/blah/text-hates-you/)
- [Multi-channel signed distance field generator - Viktor Chlumský\[Valve\] (GitHub)](https://github.com/Chlumsky/msdfgen)
- [Harfbuzz\[Google\] - (GitHub)](https://github.com/harfbuzz/harfbuzz)
