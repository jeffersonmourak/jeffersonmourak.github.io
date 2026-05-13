---
title: Prazer, circ!
date: 2026-05-12T08:27:04-02:00
author: Jefferson Oliveira
cover: ""
tags:
  - PT
  - Compiladores
  - Linguagens
  - WebAssembly
  - DSL
keywords:
  - Compiladores
  - DSL
  - WebAssembly
  - Zig
showFullContent: false
readingTime: true
hideComments: true
draft: false
contentLanguage: "pt"
description: "Já se perguntou o que faz funcionar aqueles circuitos interativos espalhados por essa série? Conheça o circ, uma linguagenzinha que criei pra que os diagramas desse blog pudessem rodar de verdade no seu navegador. Uma carta curta apresentando a linguagem, o compilador por trás dela, e por que uma coisa pequena pode ser uma alegria."

versions:
  - name: English
    url: /blog/circ-en
  - name: Português (BR)
    url: /blog/circ
---
Olá pessoal, tudo bom? Se vocês têm acompanhado a série de fundamentos da computação aqui, com certeza notaram aqueles circuitinhos. Dá pra clicar neles, mexer nos interruptores, ver os LEDs acendendo, espiar a topologia do circuito. Hoje eu quero contar o que de verdade está rodando neles, porque fui eu que fiz.

Ele se chama `circ`. É uma linguagem pra descrever circuitos digitais, e um compilador que transforma essa descrição em algo que o seu navegador consegue rodar. Antes de mais nada, quero deixar claro: isso não é uma linguagem séria de sistemas (_ainda_), e eu acredito que é ótima pra esse blog mas não está pronta pra produção. Por enquanto ela existe pelo único motivo de fazer os circuitos daqui _funcionarem de verdade_, em vez de serem desenhos estáticos ou simuladores feitos na mão.

## Aprendendo a ler

Eu acho que a melhor forma de apresentar uma linguagem é deixar você olhar pra ela. Aqui está um meio-somador (_half-adder_) escrito em `.circ`:

```
input a, b

xor s(a=a, b=b)
and c(a=a, b=b)

output sum(in=s.out)
output carry(in=c.out)
```

É o arquivo inteiro. Você declara as suas entradas, instancia as portas e dá um nome pra elas, conecta as portas de cada uma aos sinais que as alimentam, e declara quais sinais saem pelas saídas. Não parece um pouco com uma receita? _Pegue duas entradas. Combine `a` e `b` com um XOR, chame de `s`. Combine as mesmas duas com um AND, chame de `c`. Mande `s.out` pra saída `sum`, e `c.out` pra `carry`._ É isso.

As primitivas são propositalmente minúsculas: `input`, `output`, `and`, `not`, `wire`, `led`. Seis coisas. Todo o resto é construído a partir delas.

E aqui vai um detalhe do qual eu me orgulho um pouco: as portas `or`, `nand`, `nor`, `xor`, `xnor` também são escritas em `.circ`. A "biblioteca padrão" inteira do compilador são cinco arquivos que se parecem exatamente com o de cima. Quando você escreve `xor s(a=a, b=b)`, o compilador silenciosamente puxa um arquivo de cinco linhas que define XOR em termos de AND, OR e NAND. A linguagem é pequena o suficiente pra ser a sua própria biblioteca padrão, e isso pra mim é fascinante.

## Senta que lá vem história

`circ` não começou como uma linguagem. Começou como eu querendo desenhar circuitos.

Eu vinha escrevendo essa série há um tempo, e todo circuito de todo post era um SVG estático que eu tinha desenhado na mão ou arrancado de um renderizador em TypeScript que eu não parava de remendar. Os desenhos funcionavam, mas eram _só desenhos_. Você não podia mexer numa chave e ver o LED mudar. Você não podia perguntar "o que esse circuito _faz_, exatamente?" e receber uma resposta. Eram ilustrações de computadores, não computadores.

Mais ou menos na mesma época eu comprei o [_The Elements of Computing Systems_](https://www.amazon.com/Elements-Computing-Systems-Building-Principles/dp/0262640686/ref=ed_oe_p), e esse livro explodiu minha cabeça e me levou direto pro [_Nand to Tetris_](https://www.nand2tetris.org/). Nele, você constrói tudo a partir de uma única porta NAND, numa linguagenzinha chamada HDL, e cada componente que você escreve realmente roda. A combinação de "descreva um circuito em poucas linhas" e "agora aperte play e veja funcionar" é como deveria ser quando você está aprendendo sobre circuitos. Então eu quis isso, pra esse blog, pra você. Os widgets dos posts que você já leu são o resultado.

O nome é a parte mais sem graça da história: `circ` é abreviação de _circuit_ (_não sou poeta, desculpa._)

## As cerejas do bolo

Assim que o compilador começou a funcionar, duas coisas saíram dele que eu não esperava amar tanto quanto amo.

A primeira é que o `circ` consegue se desenhar. Entrega um circuito pra ele e ele produz um esquema em ASCII, completo com cantos arredondados, pontos de fan-out, e fios que desviam educadamente das portas que estão no caminho. Aqui está o meio-somador de antes, renderizado pelo próprio compilador:

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

A segunda é que o `circ` consegue se tabular. Entrega o mesmo arquivo pra ele e peça `--truth-table`, e você recebe:

|a|b|sum|cout|
|---|---|---|---|
|0|0|0|0|
|1|0|1|0|
|0|1|1|0|
|1|1|0|1|

Essa é a beleza da coisa: usando só 5 linhas você tem a descrição do circuito, uma imagem dele mesmo, e a prova de que ele faz o que diz que faz. Cada widget interativo de cada post dessa série tem sido o `circ` fazendo isso silenciosamente no fundo, três vezes seguidas. Uma vez pra renderizar o esquema que você vê, uma vez pra rodar a simulação quando você mexe numa chave, e uma vez pra provar que as portas se comportam do jeito que eu disse que iam se comportar.

## Até a próxima

Isso é só a superfície. Tem um parser, um resolvedor, um validador com códigos de erro estáveis, um pequeno runtime em WebAssembly que o compilador injeta dentro de cada artefato pra que tudo rode no seu navegador sem precisar de toolchain nenhum na sua máquina. Mas essas são histórias pra outros dias.

Se quiser se aprofundar, a linguagem tem um site só pra ela em [circ-lang.org](https://circ-lang.org/), com a referência completa e mais exemplos do que coube aqui.

Por enquanto, da próxima vez que você clicar num widget em um desses posts, você vai saber o que está vendo. É o `circ`. Prazer em te conhecer.

### Agradecimentos especiais

Antes de nos despedirmos, eu quero dar um agradecimento especial pro [@clarete](https://clarete.li/). Ele é o cérebro por trás do [langlang](https://clarete.li/langlang/), o gerador de parsers que dá vida pra essa linguagem. Ele vem martelando meus ouvidos sobre o langlang há anos, e eu não poderia estar mais orgulhoso do que ele construiu.

## Referências

- [`circ-compiler` no GitHub](https://github.com/jeffersonmourak/circ-compiler)
- [circ-lang.org](https://circ-lang.org/), a referência da linguagem e exemplos
- [Zig](https://ziglang.org/)
- [langlang](https://clarete.li/langlang/), o gerador de parser PEG que constrói a gramática do `.circ`
- [From Nand to Tetris](https://www.nand2tetris.org/)