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
showFullContent: false
readingTime: true
hideComments: true
draft: false
contentLanguage: "pt"
description: "Já imaginou como computadores transformam letras, números e emojis em zeros e uns que eles possam entender? Assim como nós, humanos, atribuímos significados às letras do alfabeto, o computador faz o mesmo. Vamos explorar aqui dois dos padrões mais populares de codificação de texto."

versions:
  - name: English
    url: /blog/unicode/english
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

<iframe width="100%" height="1026" frameborder="0"
  src="https://observablehq.com/embed/62a48ff7bbb43b02@440?cells=ascii"></iframe>

_... enquanto isso no resto do mundo ..._

<div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/3oz8xQBcUXftkrlmmc" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/southparkgifs-3oz8xQBcUXftkrlmmc">via GIPHY</a></p>

Como já era de imaginar, com o avanço da tecnologia e da capacidade dos computadores, cada país utilizou essa capacidade extra para codificar seus próprios caracteres. O Japão, por exemplo, nem o ASCII usou. Outros codificadores, como o Shift JIS, utilizavam múltiplos bytes, e com tudo isso gerou-se uma gigantesca incompatibilidade.

> Curiosidade:
> No Japão, existe a palavra mojibake (文字化け), que significa "caractere distorcido". Isso acontecia devido aos problemas de codificação entre todos os alfabetos japoneses e também o latino.

Porém, mesmo com toda essa incompatibilidade durante os anos 1980 e 1990, quais eram as chances de uma empresa de Londres ter que mandar documentos constantemente para o Japão? Naquela época, a solução era simples: imprima e envie por fax!

<div style="width:100%;height:0;padding-bottom:76%;position:relative;"><iframe src="https://giphy.com/embed/xT5LMKZ9tnioMLEjBe" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/season-7-the-simpsons-7x15-xT5LMKZ9tnioMLEjBe">via GIPHY</a></p>

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

<iframe width="100%" height="965" frameborder="0" style="background-color: var(--foreground); border-radius: 10px;"
  src="https://observablehq.com/embed/62a48ff7bbb43b02@442?cells=viewof+character%2Ccodepoint%2CencodingVisualizer"></iframe>

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
