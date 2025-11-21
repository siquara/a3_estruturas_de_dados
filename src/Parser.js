function tokenize(expression) {
    const spacedExpression = expression.replace(/(\*\*|[\(\)\+\-\*\/,])/g, ' $1 ');
    return spacedExpression.trim().split(/\s+/);
}

function tokenToComplex(token) {
    token = token.trim();


    if (/^i$/i.test(token)) return { a: 0, b: 1 };
    if (/^-i$/i.test(token)) return { a: 0, b: -1 };

    let m;


    if ((m = token.match(/^([+-]?(?:\d+\.?\d*|\.\d+))?i$/i))) {
        const numStr = m[1];
        const b = (numStr === undefined || numStr === '' || numStr === '+') ? 1
                : (numStr === '-' ? -1 : parseFloat(numStr));
        return { a: 0, b };
    }

    if ((m = token.match(/^([+-]?(?:\d+\.?\d*|\.\d+))([+-](?:\d+\.?\d*|\.\d+))i$/i))) {
        const a = parseFloat(m[1]);
        const b = parseFloat(m[2]);
        return { a, b };
    }


    if ((m = token.match(/^([+-]?(?:\d+\.?\d*|\.\d+))$/))) {
        return { a: parseFloat(m[1]), b: 0 };
    }

    return null; 
}

function parse(tokens) {
    let index = 0;

    function parseExpression() {
        let left = parseTerm();
        while (index < tokens.length && (tokens[index] === '+' || tokens[index] === '-')) {
            const operator = tokens[index++];
            const right = parseTerm();
            left = [operator, left, right];
        }
        return left;
    }

    function parseTerm() {
        let left = parsePower();
        while (index < tokens.length && (tokens[index] === '*' || tokens[index] === '/')) {
            const operator = tokens[index++];
            const right = parsePower();
            left = [operator, left, right];
        }
        return left;
    }


    function parsePower() {
        let left = parseFactor();
        if (index < tokens.length && tokens[index] === '**') {
            index++;
            const right = parsePower();
            return ['**', left, right];
        }
        return left;
    }

    function parseFactor() {
        let token = tokens[index++];


        if (token === '+') {
            return parseFactor();
        }
        if (token === '-') {
            const factor = parseFactor();
            return ['*', { a: -1, b: 0 }, factor];
        }

        if (token === '(') {
            const result = parseExpression();
            if (tokens[index++] !== ')') {
                throw new Error("Parêntese de fechamento ')' esperado.");
            }
            return result;
        }

        if (token.toLowerCase() === 'conj' || token.toLowerCase() === 'sqrt') {
            if (tokens[index++] !== '(') {
                throw new Error("Função deve ser seguida por '('. Ex: sqrt(1+i)");
            }
            const arg = parseExpression();
            if (tokens[index++] !== ')') {
                throw new Error("Parêntese de fechamento ')' esperado após argumento da função.");
            }
            return [token.toLowerCase(), arg];
        }
        
        const complex = tokenToComplex(token);
        if (complex) {
            return complex;
        }
        

        if (token.match(/^[a-zA-Z]+$/)) {
            return { variable: token };
        }

        throw new Error(`Token inesperado: ${token}`);
    }

    const ast = parseExpression();
    if (index < tokens.length) {
        throw new Error(`Entrada extra não esperada no final da expressão: ${tokens.slice(index).join(' ')}`);
    }
    return ast;
}

module.exports = { tokenize, parse };