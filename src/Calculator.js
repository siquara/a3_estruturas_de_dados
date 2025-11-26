const readline = require('readline');
const Complex = require('./Complex.js');
const { tokenize, parse } = require('./Parser.js');
const prompts = require('prompts');
const chalk = require('chalk');


const variableValues = new Map();

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

async function askQuestion(query) {
    const response = await prompts({ type: 'text', name: 'value', message: query });
    return response.value;
}

async function main() {
    console.log(chalk.magenta.bold('\n--- Calculadora Científica de Números Complexos ---'));
    console.log(`${chalk.yellow('Operadores:')} ${chalk.green('+')} ${chalk.green('-')} ${chalk.green('*')} ${chalk.green('/')} ${chalk.green('**')}`);
    console.log(`${chalk.yellow('Funções:')} ${chalk.cyan('conj(z)')} ${chalk.cyan('sqrt(z)')}`);
    console.log(`${chalk.yellow("Comandos:")} ${chalk.green("igual(expr1, expr2)")}`);
    console.log(`${chalk.yellow('Exemplo:')} ${chalk.cyan('(3+4i) * (1-2i)')} ${chalk.grey('ou')} ${chalk.cyan('sqrt(conj(x))')}`);

    let running = true;
    while (running) {
        variableValues.clear();

        const { action } = await prompts({
            type: 'select',
            name: 'action',
            message: 'Escolha uma opção:',
            choices: [
                { title: 'Inserir expressão', value: 'inserir' },
                { title: 'Sair', value: 'sair' }
            ]
        });

        if (action === 'sair') {
            running = false;
            break;
        }

        const { input } = await prompts({ type: 'text', name: 'input', message: '\n> Digite sua expressão:' });

        if (!input) continue;

        try {

            const equalityMatch = input.match(/^igual\s*\((.+),(.+)\)$/i);
            if (equalityMatch) {
                const expr1 = equalityMatch[1].trim();
                const expr2 = equalityMatch[2].trim();

                console.log(chalk.blue.bold('\nAvaliando primeira expressão:'), chalk.white.bold(expr1));
                const ast1 = parse(tokenize(expr1));
                const result1 = await evaluate(ast1);
                
                variableValues.clear();

                console.log(chalk.blue.bold('Avaliando segunda expressão:'), chalk.white.bold(expr2));
                const ast2 = parse(tokenize(expr2));
                const result2 = await evaluate(ast2);

                if (result1.equals(result2)) {
                    console.log(chalk.green.bold('\nResultado: As expressões são IGUAIS.'));
                    console.log(chalk.green(`(${expr1}) = ${result1.toString()}`));
                    console.log(chalk.green(`(${expr2}) = ${result2.toString()}`));
                } else {
                    console.log(chalk.red.bold('\nResultado: As expressões são DIFERENTES.'));
                    console.log(chalk.yellow(`(${expr1}) = ${result1.toString()}`));
                    console.log(chalk.yellow(`(${expr2}) = ${result2.toString()}`));
                }

            } else {

                        const tokens = tokenize(input);
                        const ast = parse(tokens);
                        console.log(chalk.cyan('\nÁrvore Sintática (LISP-like):'));
                        console.log(chalk.yellow(JSON.stringify(ast, null, 2)));

                        const result = await evaluate(ast);
                        console.log(chalk.green.bold('\nResultado:'), chalk.bold.white(result.toString()));
            }

        } catch (error) {
            console.error(chalk.red('Erro:'), error.message);
        }
    }

}

module.exports = { evaluate, variableValues, tokenize, parse, askQuestion };

if (require.main === module) {
    main();
}