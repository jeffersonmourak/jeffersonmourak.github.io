---
title: Lembra de mim?
date: 2025-01-19T08:27:04-03:00
author: Jefferson Oliveira
cover: ""
tags:
  - PT-BR
  - CPU
  - Memory
  - Combinational
  - Sequential
keywords:
  - CPU
  - Memory
  - Combinational
  - Sequential
showFullContent: false
readingTime: true
hideComments: true
draft: false
contentLanguage: "pt"
description: "Já se perguntou como seu computador \"lembra\" de tudo? Este artigo desvenda o segredo por trás da memória digital, explorando desde os chips combinacionais e sequenciais até o papel crucial dos flip-flops e registradores. Uma jornada fascinante para entender como a informação é guardada no coração da sua máquina."

versions:
  - name: English
    url: /blog/memory-en
  - name: Português (BR)
    url: /blog/memory
---
> Olá todo mundo, este é o terceiro artigo na série sobre computadores, e também o último com esse cabeçalho aqui, pois daqui para a frente é recomendado que você já tenha lido os dois artigos anteriores:
>
> - [Portas lógicas](https://jeffersonmourak.com/blog/logic-gates/).
> - [Prazer, Binário.](https://jeffersonmourak.com/blog/the-binary/).

Nos artigos anteriores, nós vimos como portas lógicas podem ser usadas para fazer comparações e também calcular operações aritméticas, porém ainda não vimos como o computador pode guardar uma informação ao longo do tempo.

Outra coisa que também iremos fazer aqui é categorizar cada tipo de chip: os que foram mostrados anteriormente são ***combinacionais***, o que significa que eles não precisam de nada além de sinais nas suas entradas para poder computar um resultado, mas existem também os ***sequenciais***. A diferença entre eles é que o sequencial depende não só dos sinais das entradas, mas também do valor anteriormente processado.

Um jeito muito prático de usar portas lógicas para guardar informações é usando um chip chamado de ***flip-flop***, que está representado abaixo. Ele contém 2 entradas: a de cima `set` e a de baixo `reset` (você pode clicar no circuito abaixo para interagir com eles).

```circ
import or "<builtin>/or.circ"

input set, reset

not _not_b_(in=reset.out)
and _and_(a=_or_.out, b=_not_b_.out)
or _or_(a=_and_.out, b=set.out)
led out(in=_and_.out)
```

Se parar para analisar, é bem simples: seguindo a trilha do `set`, verá que há duas portas lógicas no caminho, uma `OR` e uma `AND`. Uma das entradas da porta `OR` está ligada com o resultado da `AND` lá no fim do chip. Essa combinação faz com que, quando temos **0** e é nos dado um valor **1**, a porta `OR` vai resultar em **1**, e a `AND` também.

Porém, quando removemos o sinal do `set`, o valor que foi anteriormente colocado é persistido porque agora o `OR` está mantendo o estado que mantém o `AND` também no estado anterior. Problema resolvido, certo? Não! Perceba que nosso circuito agora está travado, pois não há como sair desse estado a não ser que o `AND` passe a ter um outro valor, e é para isso que serve a porta `reset`: ela está ligada a um `NOT`, ou seja, enquanto ela estiver desligada (0), o seu resultado vai ser 1 (ligado), e vice-versa.

Uma evolução que podemos fazer no ***flip-flop*** é transformá-lo em um ***Registrador***. No registrador, podemos escolher se é ou não a hora de ler o nosso sinal e guardá-lo, e subsequentemente reescrevê-lo, e tudo isso ao nosso bel-prazer. Existem muitas formas de atingir esse chip, então vou usar a implementação demonstrada pelo [Sebastian Lague](https://www.youtube.com/watch?v=I0-izyq6q5s).

Nela, a gente só precisa adicionar mais 3 portas lógicas e pronto!

```circ
input data, enabled

not _not_a_(in=data.out)

and _and_sp_(a=data.out, b=enabled.out)
not _sp_(in=_and_sp_.out)

and _and_rp_(a=_not_a_.out, b=enabled.out)
not _rp_(in=_and_rp_.out)

and _and_q_(a=_sp_.out, b=_qbar_.out)
not _q_(in=_and_q_.out)

and _and_qbar_(a=_rp_.out, b=_q_.out)
not _qbar_(in=_and_qbar_.out)

led out(in=_q_.out)
```

Se a gente destrinchar um pouco, o que acontece é o seguinte: a entrada superior, que agora chamaremos de `data`, só será salva no ***flip-flop*** quando a entrada inferior, que também mudou o nome, agora se chama `enabled`. Ou seja, em vez de usar duas entradas, uma para salvar e outra para apagar, essa combinação de `AND`s e `NOT` escolhe qual operação será feita.

- Se `data` = 1 e `enabled` = 1, então é a mesma coisa que ligar a entrada `set` do ***flip-flop***.
- Se `data` = 0 e `enabled` = 1, então é a mesma coisa que ligar a entrada `reset` do ***flip-flop***.
Perceba que o `enabled` precisa sempre estar ativado para que possa salvar o sinal que foi colocado em `data`.

Uma outra coisa que podemos fazer é pegar inspiração no artigo anterior, que no final a gente aprende que, se juntarmos vários Adders, nós podemos fazer contas com múltiplos dígitos. Na memória é do mesmo jeito: juntando vários registradores, você pode fornecer uma entrada para cada `data` e compartilhar o sinal do `enabled`, e assim você pode salvar os valores de um número binário inteiro.

Por enquanto, a gente se despede por aqui, até a próxima 😄

![Xauzinho!](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXlucmJmbW5mZWp4MGRpOXhpZWZwczdma2xmemIxZGVjZ3hiZG5sciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/m9eG1qVjvN56H0MXt8/giphy.gif)

## Referências

- [How Do Computers Remember? (YouTube)](https://www.youtube.com/watch?v=I0-izyq6q5s)
- [SR latch (YouTube)](https://www.youtube.com/watch?v=KM0DdEaY5sY)
- [D latch](https://www.youtube.com/watch?v=peCh_859q7Q)
- [HOW TRANSISTORS RUN CODE? (YouTube)](https://www.youtube.com/watch?v=HjneAhCy2N4)
- [From Nand to Tetris](https://www.nand2tetris.org/)
