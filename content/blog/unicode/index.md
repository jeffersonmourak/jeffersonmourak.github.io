---
title: A Evolução da Escrita Digital - Do ASCII às Maravilhas do UTF-8
date: 2025-08-07T10:29:04-03:00
author: Jefferson Oliveira
cover: ""
tags:
  - PT-BR
  - Unicode
  - ASCII
  - UTF-8

keywords:
  - Unicode
  - ASCII
  - UTF-8
  - Data types
  - Data encoding
  - Character encoding
  - Binary
  - Shift JIS
  - Mojibake
  - Unicode Consortium
  
showFullContent: false
readingTime: true
hideComments: true
draft: false
contentLanguage: "pt"
description: "Já imaginou como computadores transformam letras, números e emojis em zeros e uns que eles possam entender? Assim como nós, humanos, atribuímos significados às letras do alfabeto, o computador faz o mesmo. Vamos explorar aqui dois dos padrões mais populares de codificação de texto."

versions:
  - name: English
    url: /blog/unicode-en
  - name: Português (Brasileiro)
    url: /blog/unicode

---
<div id="elevenlabs-audionative-widget" data-height="90" data-width="100%" data-frameborder="no" data-scrolling="no" data-publicuserid="2be4d6242c862832d6b47ec70f7d7daf2c9f1306c933439f7083622af43fe99f" data-playerurl="https://elevenlabs.io/player/index.html" data-projectid="vXqUPGWRArVCy0iXsuvH" >Loading the <a href="https://elevenlabs.io/text-to-speech" target="_blank" rel="noopener">Elevenlabs Text to Speech</a> AudioNative Player...</div><script src="https://elevenlabs.io/player/audioNativeHelper.js" type="text/javascript"></script>

Já imaginou como computadores transformam letras, números e emojis em zeros e uns que eles possam entender? Assim como nós, humanos, atribuímos significados às letras do alfabeto, o computador faz o mesmo. Vamos explorar aqui dois dos padrões mais populares de codificação de texto.

### ASCII

Desenvolvido na década de 1960, o ASCII (American Standard Code for Information Interchange) tem uma premissa bem simples: usando apenas 7 bits, consegue-se representar 127 números, deixando reservados os primeiros 32 números da sequência para comandos importantes de escrita. O restante é preenchido com letras, números e alguns caracteres de pontuação.

As pessoas envolvidas no desenvolvimento do padrão fizeram de tal forma que a sequência do alfabeto pudesse ajudar na decodificação.

Por exemplo, o caractere do número "0" é o número **48**, que, representado em 7 bits, fica `011 0000`.
Assim como:

1 → `011 0001`

2 → `011 0010`

3 → `011 0011`

Se notarem, os últimos 4 bits estão em sequência. Logo, para descobrir em ASCII qual o inteiro, é só subtrair 011 0000 (decimal: 48).

Da mesma forma, as letras do alfabeto: "A" é **65** → 100 0001 e o "a" é **97** → 110 0001. Com isso, era possível codificar todas as letras do alfabeto inglês 🇬🇧.

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

<!-- {{< observable notebook="unicode" cells="ascii" >}} -->

_... enquanto isso no resto do mundo ..._

<img width="100%" src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzNvcXQ4aTBpNGs5YWI3czdjeXBuaTU0dmw3eG44aWNxbTFxbzBieSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oz8xQBcUXftkrlmmc/giphy.gif">

Como já era de imaginar, com o avanço da tecnologia e da capacidade dos computadores, cada país utilizou essa capacidade extra para codificar seus próprios caracteres. O Japão, por exemplo, nem o ASCII usou. Outros codificadores, como o Shift JIS, utilizavam múltiplos bytes, e com tudo isso gerou-se uma gigantesca incompatibilidade.

> Curiosidade:
> No Japão, existe a palavra mojibake (文字化け), que significa "caractere distorcido". Isso acontecia devido aos problemas de codificação entre todos os alfabetos japoneses e também o latino.

Porém, mesmo com toda essa incompatibilidade durante os anos 1980 e 1990, quais eram as chances de uma empresa de Londres ter que mandar documentos constantemente para o Japão? Naquela época, a solução era simples: imprima e envie por fax!

<img width="100%" src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2IzdGtqeHVmemRsZ2cwYTliY2trM2Zla3M2bXZndHF1eHE5b2NkciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT5LMKZ9tnioMLEjBe/giphy.gif">

Então chegou a internet, e o que era ruim ficou ainda pior... Agora temos que lidar com documentos sendo enviados pela internet constantemente, e com o tempo foi formado o:

## Unicode Consortium

E como em um evento que pode se chamar de milagre do bom senso, durante as últimas décadas, foi formado um padrão com 154.998 caracteres, que cobre toda e qualquer língua que você possa imaginar: árabe, japonês, cirílico, chinês, coreano e até hieróglifos egípcios.

O que eles fizeram de forma simplificada foi pegar centenas de milhares de números e atribuí-los a centenas de milhares de caracteres, ou seja, o número 35307 representará o caractere japonês 觫, o número 963 representará σ e assim por diante.

### UTF-8

Perfeito, agora nós temos centenas de milhares de números para representar todo e qualquer caractere, mas como vamos fazer isso com binário?

Para representar um número nessas proporções, vamos precisar de pelo menos 32 bits para representar qualquer número dessa magnitude, o que agora trouxe problemas para o alfabeto inglês, porque o Unicode é compatível com ASCII, ou seja, "A" ainda é **65** e "a" ainda é **97**. Mas quando olhamos para o binário de 32 bits desses números, agora usamos 4x mais espaço para representar os mesmos caracteres.

|   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **1** | 0 | 0 | 0 | 0 | 0 | **1** |  | **A** |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **1** | **1** | 0 | 0 | 0 | 0 | **1** |  | **a** |

Contando acima, há 25 zeros seguidos que estarão presentes em todo texto que utilizar caracteres latinos, e esse é só o primeiro dos nossos problemas. O segundo é que alguns sistemas antigos interpretam uma sequência de 8 zeros [`NULL`] como fim de caractere, o famoso `\0` do C.

Então entra o UTF-8. A primeira coisa é: se a letra tiver numeração abaixo de 127, então você representa exatamente igual ao ASCII.

Logo, o primeiro problema está resolvido: "A" ainda é **65** e cabe em 8 bits. `01000001`.

E para números maiores que 127? Para isso você vai quebrar seu binário em 2 bytes.

| 1 | 2 |
|---|---|
|`110xxxxx`|`10xxxxxx`|

No byte 1, você tem o cabeçalho `110`, que significa que esse caractere foi quebrado em 2 bytes.
No byte 2, você começa com o cabeçalho de continuidade `10`. Todos os outros bits restantes você vai preencher com o número que você quer representar.

Para calcular, é só remover os cabeçalhos, unir todos os bits e o número resultante é o caractere Unicode. Você pode fazer isso até 4096. Passou disso? Sem problemas! Usando o cabeçalho `1110` + 2 bytes, você tem 16 bits.

| 1 | 2 | 3 |
|---|---|---|
|`1110xxxx`|`10xxxxxx`|`10xxxxxx`|

Quer ir além? Tudo bem! O padrão suporta até o cabeçalho `1111110x` + 6 bytes de continuidade.

### Codificando UTF-8

```observable:notebook
  <script id="3" type="ojs">
// Célula 1: Uma célula view-of cria um elemento de UI (uma caixa de texto).
// O valor desta célula está vinculado à variável `character`.
viewof character = {
  const form = Inputs.text({
    label: "Insira um Caractere",
    value: "😊", // Valor padrão para demonstrar um caractere multi-byte
    placeholder: "ex: A, €, 😊",
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
      <tr><th>Caractere</th><th>Decimal</th><th>Hexadecimal</th></tr>
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
  // Função auxiliar para formatar um número como uma string binária com preenchimento de zeros
  const toBinary = (num, length) => num.toString(2).padStart(length, "0");

  let htmlOutput = "";
  const cp = codepoint.decimal;

  htmlOutput += `<h3>1. Caractere & Codepoint</h3>`;
  htmlOutput += `<p>O caractere <strong>"${character}"</strong> corresponde ao codepoint Unicode <strong>${
    codepoint.decimal
  }</strong> (em decimal) ou <strong>${
    codepoint.hex
  }</strong> (em hexadecimal).</p>`;

  let bytes = [];
  let explanation = "";
  let binaryVis = "";

  htmlOutput += `<h3>2. Determinar o Número de Bytes</h3>`;

  // Caso 1: Sequência de 1 byte (para caracteres ASCII padrão)
  if (cp <= 0x7f) {
    bytes.push(cp);
    explanation = `
      <p>O codepoint ${cp} é ≤ 127 (0x7F), então ele cabe em um <strong>único byte</strong>.</p>
      <p>O padrão para uma sequência de 1 byte é <code><span class="byte-prefix">0</span><span class="payload">xxxxxxx</span></code>, onde os bits 'x' são o próprio codepoint.</p>
    `;
    const binaryCp = toBinary(cp, 7);
    binaryVis = `
      <div class="byte-vis">
        <span class="byte-prefix" title="Prefixo de 1 byte">0</span><span class="payload" title="Bits do codepoint">${binaryCp}</span>
      </div>
    `;
  }
  // Caso 2: Sequência de 2 bytes
  else if (cp <= 0x7ff) {
    bytes.push(0b11000000 | (cp >> 6));
    bytes.push(0b10000000 | (cp & 0b00111111));
    explanation = `
      <p>O codepoint ${cp} está entre 128 (0x80) e 2047 (0x7FF), então ele requer uma <strong>sequência de 2 bytes</strong>.</p>
      <p>O padrão é <code><span class="byte-prefix">110</span><span class="payload">xxxxx</span> <span class="byte-prefix">10</span><span class="payload-alt">xxxxxx</span></code>. Isso fornece 5 + 6 = 11 bits para o codepoint.</p>
    `;
    const binaryCp = toBinary(cp, 11);
    const part1 = binaryCp.slice(0, 5);
    const part2 = binaryCp.slice(5);
    binaryVis = `
      <p>Codepoint em binário (11 bits): <span class="payload">${part1}</span><span class="payload-alt">${part2}</span></p>
      <div class="byte-vis-container">
        <div class="byte-vis">
          <span class="byte-prefix" title="Prefixo do primeiro byte">110</span><span class="payload" title="Primeiros 5 bits do codepoint">${part1}</span>
        </div>
        <div class="byte-vis">
          <span class="byte-prefix" title="Prefixo de byte de continuação">10</span><span class="payload-alt" title="Últimos 6 bits do codepoint">${part2}</span>
        </div>
      </div>
    `;
  }
  // Caso 3: Sequência de 3 bytes (inclui a maioria dos caracteres multilíngues comuns)
  else if (cp <= 0xffff) {
    bytes.push(0b11100000 | (cp >> 12));
    bytes.push(0b10000000 | ((cp >> 6) & 0b00111111));
    bytes.push(0b10000000 | (cp & 0b00111111));
    explanation = `
      <p>O codepoint ${cp} está entre 2048 (0x800) e 65535 (0xFFFF), então ele requer uma <strong>sequência de 3 bytes</strong>.</p>
      <p>O padrão é <code><span class="byte-prefix">1110</span><span class="payload">xxxx</span> <span class="byte-prefix">10</span><span class="payload-alt">xxxxxx</span> <span class="byte-prefix">10</span><span class="payload">xxxxxx</span></code>. Isso fornece 4 + 6 + 6 = 16 bits.</p>
    `;
    const binaryCp = toBinary(cp, 16);
    const part1 = binaryCp.slice(0, 4);
    const part2 = binaryCp.slice(4, 10);
    const part3 = binaryCp.slice(10);
    binaryVis = `
      <p>Codepoint em binário (16 bits): <span class="payload">${part1}</span><span class="payload-alt">${part2}</span><span class="payload">${part3}</span></p>
      <div class="byte-vis-container">
        <div class="byte-vis">
          <span class="byte-prefix" title="Prefixo do primeiro byte">1110</span><span class="payload" title="Primeiros 4 bits do codepoint">${part1}</span>
        </div>
        <div class="byte-vis">
          <span class="byte-prefix" title="Prefixo de byte de continuação">10</span><span class="payload-alt" title="Próximos 6 bits do codepoint">${part2}</span>
        </div>
        <div class="byte-vis">
          <span class="byte-prefix" title="Prefixo de byte de continuação">10</span><span class="payload" title="Últimos 6 bits do codepoint">${part3}</span>
        </div>
      </div>
    `;
  }
  // Caso 4: Sequência de 4 bytes (para emojis, escritas históricas, etc.)
  else if (cp <= 0x10ffff) {
    bytes.push(0b11110000 | (cp >> 18));
    bytes.push(0b10000000 | ((cp >> 12) & 0b00111111));
    bytes.push(0b10000000 | ((cp >> 6) & 0b00111111));
    bytes.push(0b10000000 | (cp & 0b00111111));
    explanation = `
      <p>O codepoint ${cp} é > 65535 (0x10000), então ele requer uma <strong>sequência de 4 bytes</strong>.</p>
      <p>O padrão é <code><span class="byte-prefix">11110</span><span class="payload">xxx</span> <span class="byte-prefix">10</span><span class="payload-alt">xxxxxx</span> <span class="byte-prefix">10</span><span class="payload">xxxxxx</span> <span class="byte-prefix">10</span><span class="payload-alt">xxxxxx</span></code>. Isso fornece 3 + 6 + 6 + 6 = 21 bits.</p>
    `;
    const binaryCp = toBinary(cp, 21);
    const part1 = binaryCp.slice(0, 3);
    const part2 = binaryCp.slice(3, 9);
    const part3 = binaryCp.slice(9, 15);
    const part4 = binaryCp.slice(15);
    binaryVis = `
      <p>Codepoint em binário (21 bits): <span class="payload">${part1}</span><span class="payload-alt">${part2}</span><span class="payload">${part3}</span><span class="payload-alt">${part4}</span></p>
      <div class="byte-vis-container">
        <div class="byte-vis">
          <span class="byte-prefix" title="Prefixo do primeiro byte">11110</span><span class="payload" title="Primeiros 3 bits do codepoint">${part1}</span>
        </div>
        <div class="byte-vis">
          <span class="byte-prefix" title="Prefixo de byte de continuação">10</span><span class="payload-alt" title="Próximos 6 bits do codepoint">${part2}</span>
        </div>
        <div class="byte-vis">
          <span class="byte-prefix" title="Prefixo de byte de continuação">10</span><span class="payload" title="Próximos 6 bits do codepoint">${part3}</span>
        </div>
        <div class="byte-vis">
          <span class="byte-prefix" title="Prefixo de byte de continuação">10</span><span class="payload-alt" title="Últimos 6 bits do codepoint">${part4}</span>
        </div>
      </div>
    `;
  }

  htmlOutput += explanation;
  htmlOutput += `<h3>3. Preencher os Bits</h3>`;
  htmlOutput += binaryVis;

  // Resultado Final
  if (bytes.length > 0) {
    const hexBytes = bytes
      .map((b) => b.toString(16).toUpperCase().padStart(2, "0"))
      .join(" ");
    const binaryBytes = bytes.map((b) => toBinary(b, 8)).join(" ");
    htmlOutput += `
      <hr>
      <h3>4. Resultado Final</h3>
      <p>A sequência de bytes UTF-8 final para "${character}" é:</p>
      <p><strong>Binário:</strong> <code>${binaryBytes}</code></p>
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

É incrível como esse padrão consegue entregar:

- É compatível com os sistemas anteriores;

- Não gasta espaço;

- E em nenhum momento na vida haverá 8 zeros seguidos em nenhuma parte de qualquer byte.

Além disso, outra razão que o fez se tornar o padrão mundial hoje em dia é que, para se mover entre caracteres, se você não sabe onde está, é só procurar o próximo cabeçalho, não precisa de índice.

Já fazem alguns anos que o UTF-8 virou o padrão em toda comunicação pela internet, e o fato de hoje a pessoa japonesa média não precisar se preocupar com mojibake mais é por causa desse método genial de codificar texto.

### Referencias

- [Characters, Symbols and the Unicode Miracle - Computerphile (YouTube)](https://www.youtube.com/watch?v=MijmeoH9LT4)
- [UTF-8, a transformation format of ISO 10646 - ietf.org](https://datatracker.ietf.org/doc/html/rfc3629)
- [The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets (No Excuses!) - Joel Spolsky](https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/)
