# Calculadora de Números Complexos ⚙️

Projeto para a disciplina: Estruturas de Dados e Algoritmos

Professor: Wellington Lacerda Silveira da Silva

## ✨ Contribuidores 

- Alisson Lucas Alves de Oliveira — RA: 1272322139
- Alisson Bezerra Brito — RA: 1272326397
- Beatriz Andrade Siquara — RA: 1272321172

## 📝 Resumo 

Este repositório contém uma calculadora de números complexos que: representa complexos na forma a + bi, avalia expressões, constrói e mostra a árvore sintática (AST), e executa operações como soma, subtração, multiplicação, divisão, conjugado, potenciação e raiz quadrada. Suporta também variáveis em expressões (valores solicitados interativamente) e compara a igualdade entre expressões.

## 📚 Conteúdo rápido 

- Código principal: `src/Complex.js`, `src/Parser.js`, `src/Calculator.js`
- Testes: `src/Calculator.test.js` (cobertura de operações e funções básicas)
- Como executar: consulte a seção "Como testar / usar" abaixo

## 📑 Índice 

1. [Funcionalidades](#funcionalidades)
2. [Como testar / usar](#como-testar--usar)
3. [Estrutura do projeto](#estrutura-do-projeto)
4. [Casos de teste cobertos](#casos-de-teste-cobertos)
5. [Próximos passos sugeridos](#próximos-passos-sugeridos)

## 🚀 Funcionalidades 

- Representação de números complexos (a + bi / a - bi)
- Operações aritméticas: +, -, \*, /
- Funções: conj(x), sqrt(x), potenciação com `**`
- Parser/tokenizador que gera uma AST e valida sintaxe
- Impressão da árvore sintática (formato LISP-like) antes da avaliação
- Suporte a variáveis (valores solicitados em tempo de execução)
- Detecção de erros básicos (divisão por zero, sintaxe inválida)

## ▶️ Como testar / usar 

1. Instale dependências (Node.js e npm precisam estar instalados):

```bash
npm install
```

2. Execute os testes unitários:

```bash
npm test
```

3. Usar a calculadora (modo interativo)

- Execute o arquivo principal (dependendo de como o `package.json` está configurado, pode haver um script `start` ou `node src/Calculator.js`).
- Ao avaliar expressões com variáveis, a calculadora solicitará os valores ao usuário.

Exemplos de expressões suportadas:

- (3+2i) + (1+2i)
- conj(1-i)
- (1+i) \*\* 2
- sqrt(3+4i)

## 🗂️ Estrutura do projeto 

- `src/Complex.js` — Classe e operações para números complexos
- `src/Parser.js` — Tokenizador e parser que constrói a AST
- `src/Calculator.js` — Avaliador da AST, interface de execução e utilitários
- `src/Calculator.test.js` — Testes unitários

## ✅ Casos de teste cobertos (resumo) 

Os testes incluem múltiplos casos para cada operação. Exemplos:

- Soma: (3+2i) + (1+2i) => 4 + 4i
- Subtração: (3+2i) - (1+2i) => 2 + 0i
- Multiplicação: (3+2i) \* (1+2i) => -1 + 8i
- Divisão: (3+2i) / (1+2i) => 7/5 - 4/5 i
- Conjugado: conj(3+2i) => 3 - 2i
- Potenciação: (1+i) \*\* 2 => 0 + 2i
- Raiz: sqrt(3+4i) => 2 + 1i

Para detalhes completos, veja `src/Calculator.test.js`.
