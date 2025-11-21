const readline = require('readline');
const Complex = require('./Complex.js');
const { tokenize, parse } = require('./Parser.js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const variableValues = new Map();

// Função recursiva para avaliar a árvore sintática
async function evaluate(node) {
    if (node.variable) {
        const varName = node.variable;
        if (variableValues.has(varName)) {
            return variableValues.get(varName);
        }
        const valueStr = await askQuestion(`Por favor, insira o valor para a variável '${varName}' (formato a+bi): `);
        try {
            const parsedValue = await evaluate(parse(tokenize(valueStr)));
            variableValues.set(varName, parsedValue);
            return parsedValue;
        } catch (e) {
            throw new Error(`Valor inválido para a variável '${varName}': ${valueStr}`);
        }
    }

    if (typeof node.a !== 'undefined') {
        return new Complex(node.a, node.b);
    }

    if (Array.isArray(node)) {
        const [op, ...args] = node;
        const evaluatedArgs = await Promise.all(args.map(arg => evaluate(arg)));

        switch (op) {
            case '+':
                return evaluatedArgs[0].add(evaluatedArgs[1]);
            case '-':
                return evaluatedArgs[0].subtract(evaluatedArgs[1]);
            case '*':
                return evaluatedArgs[0].multiply(evaluatedArgs[1]);
            case '/':
                return evaluatedArgs[0].divide(evaluatedArgs[1]);
            case '**':
                // exponenciação: espera expoente inteiro não-negativo
                if (typeof evaluatedArgs[1].a !== 'undefined' && evaluatedArgs[1].b === 0) {
                    const n = evaluatedArgs[1].a;
                    return evaluatedArgs[0].pow(n);
                }
                throw new Error("Expoente deve ser um número inteiro real (ex: 2)");
            case 'conj':
                return evaluatedArgs[0].conjugate();
            case 'sqrt':
                return evaluatedArgs[0].sqrt();
            default:
                throw new Error(`Operador desconhecido: ${op}`);
        }
    }
    throw new Error('Nó da árvore inválido');
}

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
    console.log("--- Calculadora Científica de Números Complexos ---");
    console.log("Operadores: +, -, *, /, **");
    console.log("Funções: conj(z), sqrt(z)");
    console.log("Use 'igual(expr1, expr2)' para verificar igualdade.");
    console.log("Use 'sair' para fechar a calculadora.");
    console.log("Exemplos: (3+4i) * (1-2i) ou sqrt(conj(x))");

    while (true) {
        variableValues.clear(); // Limpa variáveis a cada nova expressão
        const input = await askQuestion('\n> Digite sua expressão: ');

        if (input.toLowerCase() === 'sair') {
            break;
        }

        try {
             // Tratamento para a função de igualdade
            const equalityMatch = input.match(/^igual\s*\((.+),(.+)\)$/i);
            if (equalityMatch) {
                const expr1 = equalityMatch[1].trim();
                const expr2 = equalityMatch[2].trim();

                console.log("Avaliando primeira expressão:", expr1);
                const ast1 = parse(tokenize(expr1));
                const result1 = await evaluate(ast1);
                
                variableValues.clear(); // Limpa para a segunda avaliação

                console.log("Avaliando segunda expressão:", expr2);
                const ast2 = parse(tokenize(expr2));
                const result2 = await evaluate(ast2);

                if (result1.equals(result2)) {
                    console.log(`Resultado: As expressões são IGUAIS.`);
                    console.log(`(${expr1}) = ${result1.toString()}`);
                    console.log(`(${expr2}) = ${result2.toString()}`);
                } else {
                    console.log(`Resultado: As expressões são DIFERENTES.`);
                    console.log(`(${expr1}) = ${result1.toString()}`);
                    console.log(`(${expr2}) = ${result2.toString()}`);
                }

            } else {
                // Execução normal da expressão
                const tokens = tokenize(input);
                const ast = parse(tokens); // AST = Abstract Syntax Tree (Árvore Sintática Abstrata)
                console.log("Árvore Sintática (LISP-like):", JSON.stringify(ast));

                const result = await evaluate(ast);
                console.log("Resultado:", result.toString());
            }

        } catch (error) {
            console.error("Erro:", error.message);
        }
    }

    rl.close();
}

// Exportações para permitir testes automatizados
module.exports = { evaluate, variableValues, tokenize, parse, askQuestion };

if (require.main === module) {
    main();
}