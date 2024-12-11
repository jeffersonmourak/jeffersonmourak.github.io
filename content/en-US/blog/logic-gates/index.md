---
title: "Portas lógicas"
date: "2024-11-07T08:27:04-03:00"
author: "Jefferson Oliveira"
cover: ""
tags: ["PT-BR", "CPU", "Logic Gates"]
keywords: ["CPU", "Logic Gates", "Portas lógicas", "Computação"]
description: "As portas lógicas são a base da computação, com elas podemos fazer operações binárias que calculam desde a soma de dois números até a execução um programa."
showFullContent: false
readingTime: true
hideComments: true
draft: false
---
> Revisado [11/12/2024]
>
> Oi pessoal, então tive que fazer umas mudanças aqui no post pra adicionar alguns widgets
> interativos, e aproveitei para dar um pouco mais de contexto ao conteúdo.

Olá, esse daqui é o primeiro artigo de uma série sobre os fundamentos da computação, a ideia é demonstrar de forma simples e prática, como que esse dispositivo transforma zeros e uns em praticamente qualquer coisa, como que CPUs funcionam e outros assunstos interessantes. Então para começar  primeiro conceito que temos que aprender é o de portas lógicas, elas são a base de toda computação, com elas nós podemos fazer certas operações que recebe como entrada um ou mais valores e terá outro valor como resultado.

Mas o que são esses valores? O número 42? O nome da minha mãe?, esses “valores” são energia, mais especificamente a presença e ausência dela. Como foi falado na introdução computadores funcionam utilizando dígitos binários, ou seja essas maquinas só entendem 0 e 1 ou “Tem energia” e  “Não tem energia”, no entanto, não iremos chamar esses zeros e uns de energia, para o computador eles são sinais.

Quando sinais são combinados e/ou comparados nós chamamos de operação lógica, por exemplo.

“[Sons de harpa de inicio de história]”

Um dia você contrata uma empresa de elétrica para instalar dois interruptores em um corredor da sua casa, e por um erro de desenho acabou que foi instalado da seguinte forma.
O fio passa pelo primeiro interruptor (vamos chamar de interruptor A) e o fio vai direto para o segundo interruptor (B para os íntimos) e em seguida sai para a lâmpada.

![](./CPUImageFrame1.png)

Se você notar bem, só vai ter como eu ligar a lâmpada se os dois interruptores estiverem ligados ao mesmo tempo, no momento que qualquer um desligar, a luz apagará também. Pois é, essa atrocidade da elétrica residencial pode ser explicada na matemática a partir de um de seus ramos chamado de álgebra booleana e nela, podemos demonstrar isso com uma tabela

| ∧ | 0 | 1 |
| :-----: | :-----: | :-----: |
| 0 | 0 | 0 |
| 1 | 0 | 1 |

Escrevendo isso de outro modo fica assim.

| ∧ | A desligado | A ligado |
| :----- | :----- | :----- |
| B desligado | Luz apagada | Luz apagada |
| B ligado | Luz apagada | Luz acesa |

Se você percebeu bem, agora temos um jeito de representar o que queremos que aconteça com dois interruptores e uma lâmpada, e esse exemplo mostrado a cima é a primeira porta lógica que estamos conhecendo, o AND ou Conjunção, e essa tabela demonstrada a cima de formas diferentes se chama Tabela-verdade.

“Ok, mas e a luz da minha casa? Como que vai ficar? Eu preciso que a luz acenda quando o A OU B estiverem ligados. como que faz isso?”

A resposta está na pergunta, vamos precisar de uma outra porta lógica chamada de OR ou Disjunção, então pra ilustrar o que estamos procurando é uma tabela verdade que se encaixe nessas condições.

| ? | 0 | 1 |
| :-----: | :-----: | :-----: |
| 0 | 0 | 1 |
| 1 | 1 | 1 |

mas antes de chegar nela, vamos ver um outra porta que inicialmente não parece muito importante mas iremos precisar dela, é a Negação ou NOT, e é a mais simples de todas.

{{< loadCirc "sample.circ" 650 290 6 >}}

E se escrevermos ela numa tabela verdade teremos isso aqui.

| ¬ | 0 | 1 |
| :-----: | :-----: | :-----: |
|  | 1 | 0 |

Então, vamos fazer uma pausa e revisar o que a gente já sabe, Primeiro é o nome de algumas operações e como representar elas numa tabela, pra simplificar vamos transformar eles em símbolos, toda vez que nos referirmos ao AND esse será isso

{{< loadCirc "and.circ" 200 175 3 >}}

e o NOT

{{< loadCirc "not.circ" 110 110 3 >}}

Com essas duas operações lógicas já podemos combinar os seus resultados e criar uma terceira porta lógica chamada NAND, ou Not AND

também iremos representado dessa forma

{{< loadCirc "nand.circ" 200 175 3 >}}

{{< loadCirc "example1.circ" 650 290 3 >}}

A tabela-verdade dela é idêntica ao do AND porém com os resultados invertidos.

| ¬∧ | 0 | 1 |
| :-----: | :-----: | :-----: |
| 0 | 1 | 1 |
| 1 | 1 | 0 |

Se usarmos a mesma lógica de combinar essas portas, podemos fazer o seguinte. Usando uma porta NAND, e invertendo a entrada de cada interruptor com um NOT você terá algo assim.

{{< loadCirc "example2.circ" 650 290 3 >}}

Agora vamos analisar um pouco esse diagrama acima, podemos ver que quando os dois estiverem desligados, ambos serão invertidos pelo NOT e o NAND irá cair na condição ¬∧(1, 1) = 0 ou seja, quando ambos estiverem desligados a lambada apagará, porém o que acontece quando ¬∧(1, 0) ou ¬∧(0, 1)? Vamos então descrever a tabela-verdade dessa imagem.

| ∨ | 0 | 1 |
| :-----: | :-----: | :-----: |
| 0 | 0 | 1 |
| 1 | 1 | 1 |

Mas espera um pouco, eu tenho a impressão de que eu já vi essa tabela antes? Sim. Essa a porta lógica OR que estávamos procurando, uma viagem e tanto não é? Agora que temos o conhecimento pra consertar a instalação da lâmpada podemos parar um pouco por aqui. Esse é somente o primeiro artigo de uma série que estou escrevendo sobre computadores, então mais pra a frente iremos abordar outras portas lógicas e outros conceitos da computação.

Referências

* [Álgebra booliana (Wikipédia)](https://pt.wikipedia.org/wiki/%C3%81lgebra_booliana)
* [Boolean Algebra (Wikipédia)](https://en.wikipedia.org/wiki/Boolean_algebra)
* [Tabela-verdade  (Wikipédia)](https://pt.wikipedia.org/wiki/Tabela-verdade)
* [Exploring How Computers Work (YouTube)](https://www.youtube.com/watch?v=QZwneRb-zqA)
* [Making logic gates from transistors (YouTube)](https://www.youtube.com/watch?v=sTu3LwpF6XI)
* [HOW TRANSISTORS RUN CODE? (YouTube)](https://www.youtube.com/watch?v=HjneAhCy2N4)
