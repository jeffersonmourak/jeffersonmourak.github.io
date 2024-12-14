---
title: "Prazer, Binário."
date: "2024-12-14T08:27:04-03:00"
auth: "Jefferson Oliveira"
cover: ""
tags: ["PT-BR", "CPU", "Binary", "Numeric-Systems"]
keywords: ["CPU", "Binary", "Computação", "Binário"]
showFullContent: false
readingTime: true
hideComments: true
draft: false
---
>Olá pessoas dessa internet, pra quem tá chegando aqui agora, esse é o segundo artigo de
>uma série que estou fazendo pra falar sobre os fundamentos da computação, recomendo ler o
>primeiro sobre [portas lógicas](https://jeffersonmourak.com/blog/logic-gates/).
>E pra quem já leu o primeiro artigo, dá um pulinho lá por que eu fiz uma revisão no artigo recomendo bastante dar uma olhada 😊

Vamos nos aprofundar um pouco mais e explorar alguns conceitos de matemática e também da história humana.

A matemática veio da necessidade de contar e medir do raça humana tem - quantos animais a Maria cuida, quantos dias até o próximo solsticio... Com o tempo e a expansão humana, povos antigos criaram vários sistemas de numeração para o seu dia a dia, Jogos como _Grand Theft Auto V_, _Call of  Duty: Black Ops III_, _Dragon Quest XI_ são exemplos de uso do sistema numeral que os romanos usavam, e o _Ching_ um antigo texto chinês tem raizes em representações binárias.

Porém não somente as antigas civilizações usavam outros sistemas numericos, as horas de um dia são dividas entre 12 horas do perído da manhã e 12 horas do peródo da tarde, ou uma dúzia de ovos, na lingua francesa ainda existem requicios de um sistema com base vigesimal (20), exemplo o numero 80 se diz _quatre-vingts_ (quatro vintes), e por uma das mais recentes é o Braille, que também tem raizes em representações binárias.

Nos dias atuais, utilizamos a representação decimal, e o motivo é bem simples a média de dedos em mão humanas são incriveis 10 dedos, sendo assim fica mais fácil contar usando somente as mãos.

## ☝️ + ☝️ = ✌️

Essa representação em base 10 é posicional, ou seja, a posição os digitos são "desenhados" muda a quantidade que se está representando, _70_ representa dez vez mais que _07_, daí vem o ditado popular "zero à esquerda", na escola aprendemos as casas decimais - _unidades_, _dezenas_, _centenas_... elas servem pra representar qual é a posição desse digito.

| Dezena | Unidade |
| :----: | ------- |
|   7    | 0       |
|   0    | 7       |

E em cima dessa ordem existe uma formula matemática que converte um número de qualquer base para decimal. pra facilitar.

- **Digito**: Simbolo que representa uma quantidade unica.
  _Ex.: 1, 2, 3, 4, 5, 6, 7, 8, 9, 0_
- **Número**: Digitos organizados ordem de _**posição**_
  _Ex.: 10, 144, 999, 42, 37, `0x8A6C`, `0b101010`_
- **Base**:  Quantidade máxima de dígitos pode ser representada.
  Ex.: binário(`0b`) 2, decimal 10, hexadecimal(`0x`)
- **Índice**: A magnitude do dígito na posição.
  Ex.: 10 o 1 em 10 tem _Índice 1_ e o 0 tem _Índice 0_ (é meio contra intuitivo mas faz sentido)
  Em outras palavras o indice é a posição da direita para a esqueda, começando em 0.

A formula é bem simples _**(d)igito × (b)ase<sup>(Í)ndice</sup>**_ no exemplo que estamos fazendo essa é a formula de converter 70 em decimal pra 70 em decimal. **7 × 10<sup>1</sup> + 0 × 10<sup>0</sup> = 70**

{{< binaryCounter "counter" 10 3 800 700>}}
Quando falamos de números dessa forma, fica mais fácil representar o binário, que nada mais é que a quantidade que pode ser representado pela formula _**d × 2<sup>i</sup>**_

{{< binaryCounter "counter" 2 6 800 700>}}
E essa forma de representar quantidades também pode ser manipulada com opeações matemáticas, A adição 35 + 7, é resolvida algo parecido com isso.

```
1
2 5
1 7
--- +
4 2
```

No exemplo a cima tem alguns elementos que precisam ser destacados.

1. Um _dígito_ só pode ser somado com outro _dígito_ que estiver no mesmo _índice_
2. Quando a soma não puder ser representada com apenas um dígito, o menor indice é mantido como _resultado_, e o _resto_ é mandado pra o próximo índice.
3. O _resultado_ de uma soma será sempre a soma dos _**digitos**_ do _**índice**_ + o _**resto**_ que veio do _**dígito**_ no _**indice**_ anterior.

Com esses mesmos passos podemos aplicar a soma em qualquer base.

```
    1 1 1       |  1      |  
1 0 0 0 1 1     |  2 5    |  1 9
0 0 0 1 1 1     |  1 7    |  1 1
------------ +  |  --- +  |  --- +
1 0 1 0 1 0     |  4 2    |  2 A 
```

![Cálculo de 25 + 19 em bases Binária, Decimal e Hexadecimal](./hand.jpeg)

{{< binaryCounter "counter" 2 6 800 700>}}

Agora que já nos conhecemos, como que podemos fazer para o computador me conhecer também?

## Brincando de tradução

Lembrando do [artigo anteiror](https://jeffersonmourak.com/blog/logic-gates/), vamos isolar a soma de dois dígitos em tabelas, a primeira vamos olhar para o resultado apenas temos essa tabela que se assemelha muito com a tabela da porta OR, exceto por essa pequena mudança no final.

<div style="display: flex; gap: 16px;">
<span>
<table>
<tr><td colspan="3">Resultado</td></tr>
<tr>
 <td>?</td>
 <td>0</td>
 <td>1</td>
</tr>
<tr>
 <td>0</td>
 <td>0</td>
 <td>1</td>
</tr>
<tr>
 <td>1</td>
 <td>1</td>
 <td>0</td>
</tr>
</table>
</span>
<span>
<table>
<tr><td colspan="3">OR</td></tr>
<tr>
 <td>∨</td>
 <td>0</td>
 <td>1</td>
</tr>
<tr>
 <td>0</td>
 <td>0</td>
 <td>1</td>
</tr>
<tr>
 <td>1</td>
 <td>1</td>
 <td>1</td>
</tr>
</table>
</span>
</div>

Para isso nós podemos combinar o resultado das portas que já vimos anteriormente em um só circuito chamado "OU Exclusivo" ou "XOR"
{{< loadCirc "XOR.circ" 800 400 4 >}}

 Agora vamos olhar também para a tabela do resto da nossa soma e se percebe que é uma cópia exata da porta AND.

<div style="display: flex; gap: 16px;">
<span>
<table>
<tr><td colspan="3">Resto</td></tr>
<tr>
 <td>?</td>
 <td>0</td>
 <td>1</td>
</tr>
<tr>
 <td>0</td>
 <td>0</td>
 <td>0</td>
</tr>
<tr>
 <td>1</td>
 <td>0</td>
 <td>1</td>
</tr>
</table>
</span>
<span>
<table>
<tr><td colspan="3">AND</td></tr>
<tr>
 <td>∧</td>
 <td>0</td>
 <td>1</td>
</tr>
<tr>
 <td>0</td>
 <td>0</td>
 <td>0</td>
</tr>
<tr>
 <td>1</td>
 <td>0</td>
 <td>1</td>
</tr>
</table>
</span>
</div>

E assim como o Capitão Planeta, "Pela união dos seus poderes" nós vamos conseguir fazer a operação de soma de dois digitos em binário, e esse componente é chamado de "Somador" ou "Adder".

{{< loadCirc "ADDER.circ" 800 500 3.5 >}}
Com essa combinação de portas lógicas um computador já consegue fazer as incriveis somas de: `0 + 0`,  `1 + 0`, `0 + 1`,  `1 + 1` mas além disso ele consegue também dizer quanto que houve de resto da soma. e quando combinados vários ADDERs a gente consegue fazer uma soma de números mais complexos como o 42. mas essa nós vamos ver no próximo artigo.

Por hoje é só isso pessoal.

<div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/xUPOqo6E1XvWXwlCyQ" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/spacejam-space-jam-movie-xUPOqo6E1XvWXwlCyQ">via GIPHY</a></p>

Referências

- [A brief history of numerical systems (Youtube)](https://pt.wikipedia.org/wiki/%C3%81lgebra_booliana)
- [Numeral system (Wikipédia)](https://en.wikipedia.org/wiki/Numeral_system)
- [Sistema de numeração (Wikipédia)](https://pt.wikipedia.org/wiki/Sistema_de_numera%C3%A7%C3%A3o)
- [Exploring How Computers Work (YouTube)](https://www.youtube.com/watch?v=QZwneRb-zqA)
- [Making logic gates from transistors (YouTube)](https://www.youtube.com/watch?v=sTu3LwpF6XI)
- [HOW TRANSISTORS RUN CODE? (YouTube)](https://www.youtube.com/watch?v=HjneAhCy2N4)
- [From Nand to Tetris](https://www.nand2tetris.org/)
