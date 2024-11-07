+++
title = "Portas lógicas"
date = "2024-11-07T08:27:04-03:00"
author = "Jefferson Oliveira"
cover = ""
tags = ["PT-BR", "CPU", "Logic Gates"]
keywords = ["CPU", "Logic Gates", "Portas lógicas", "Computação"]
description = "As portas lógicas são a base da computação, com elas podemos fazer operações binárias que calculam desde a soma de dois números até a execução de um programa."
showFullContent = false
readingTime = true
hideComments = true
draft = false
+++

O primeiro conceito que temos que aprender é o de portas lógicas, elas são a base de toda computação, com elas nós podemos fazer certas operações que recebe como entrada um ou mais valores e terá outro valor como resultado.

Mas o que são esses valores? O número 42? O nome da minha mãe?, esses “valores” são energia, mais especificamente a presença e ausência dela. Como todos sabem computadores trabalham com números binários, ou seja essas maquinas só entendem 0 e 1 ou “Tem energia” e “Não tem energia”, no entanto, não iremos chamar esses zeros e uns de energia, para o computador eles são sinais.

Quando sinais são combinados e/ou comparados nós chamamos de operação lógica, por exemplo.

“[Sons de harpa de inicio de história]”

Um dia você contrata uma empresa de elétrica para instalar dois interruptores em um corredor da sua casa, e por um erro de desenho acabou que foi instalado da seguinte forma.
O fio passa pelo primeiro interruptor (vamos chamar de interruptor A) e o fio vai direto para o segundo interruptor (B para os íntimos) e em seguida sai para a lâmpada.

![][CPUImageFrame1]

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

![][CPUImageFrame5]

E se escrevermos ela numa tabela verdade teremos isso aqui.

| ¬ | 0 | 1 |
| :-----: | :-----: | :-----: |
|  | 1 | 0 |

Então, vamos fazer uma pausa e revisar o que a gente já sabe, Primeiro é o nome de algumas operações e como representar elas numa tabela, pra simplificar vamos transformar eles em símbolos, toda vez que nos referirmos ao AND esse será isso ![][Group41] e o NOT ![][Group51]

Com essas duas operações lógicas já podemos combinar os seus resultados e criar uma terceira porta lógica chamada NAND, ou Not AND

também iremos representado dessa forma ![][Group8]

![][Frame5]

A tabela-verdade dela é idêntica ao do AND porém com os resultados invertidos.

| ¬∧ | 0 | 1 |
| :-----: | :-----: | :-----: |
| 0 | 1 | 1 |
| 1 | 1 | 0 |

Se usarmos a mesma lógica de combinar essas portas, podemos fazer o seguinte. Usando uma porta NAND, e invertendo a entrada de cada interruptor com um NOT você terá algo assim.

![][Frame52]

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

[CPUImageFrame1]: CPUImageFrame1.png

[CPUImageFrame5]: CPUImageFrame5.png
<!-- width=443px height=148px -->

[Group41]: Group41.png
<!-- width=30px height=25px -->

[Group51]: Group51.png
<!-- width=31px height=25px -->

[Group8]: Group8.png
<!-- width=38px height=25px -->

[Frame5]: Frame5.png
<!-- width=555px height=192px -->

[Frame52]: Frame52.png
<!-- width=552px height=191px -->
