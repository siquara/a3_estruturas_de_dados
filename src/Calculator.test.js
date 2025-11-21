const Complex = require('./Complex');
const { tokenize, parse } = require('./Parser');
const { evaluate, variableValues } = require('./Calculator');

beforeEach(() => {
    variableValues.clear();
});

describe('Operações com números complexos (3 casos por operação)', () => {
    // Soma
    test('soma 1: (3+2i) + (1+2i)', async () => {
        const ast = parse(tokenize('(3+2i) + (1+2i)'));
        const res = await evaluate(ast);
        expect(res.equals(new Complex(4,4))).toBe(true);
    });
    test('soma 2: (1+i) + (2+3i)', async () => {
        const ast = parse(tokenize('(1+i) + (2+3i)'));
        const res = await evaluate(ast);
        expect(res.equals(new Complex(3,4))).toBe(true);
    });
    test('soma 3: 2*i + 3', async () => {
        const ast = parse(tokenize('2*i + 3'));
        const res = await evaluate(ast);
        expect(res.equals(new Complex(3,2))).toBe(true);
    });

    // Subtração
    test('subtração 1: (3+2i) - (1+2i)', async () => {
        const ast = parse(tokenize('(3+2i) - (1+2i)'));
        const res = await evaluate(ast);
        expect(res.equals(new Complex(2,0))).toBe(true);
    });
    test('subtração 2: (1+i) - (2+3i)', async () => {
        const ast = parse(tokenize('(1+i) - (2+3i)'));
        const res = await evaluate(ast);
        expect(res.equals(new Complex(-1,-2))).toBe(true);
    });
    test('subtração 3: 5 - 2*i', async () => {
        const ast = parse(tokenize('5 - 2*i'));
        const res = await evaluate(ast);
        expect(res.equals(new Complex(5,-2))).toBe(true);
    });

    // Multiplicação
    test('multiplicação 1: (3+2i) * (1+2i)', async () => {
        const ast = parse(tokenize('(3+2i) * (1+2i)'));
        const res = await evaluate(ast);
        // (3+2i)*(1+2i) = 3 + 6i + 2i + 4i^2 = (3-4) + 8i = -1 + 8i
        expect(res.equals(new Complex(-1,8))).toBe(true);
    });
    test('multiplicação 2: (1+i) * (1-i)', async () => {
        const ast = parse(tokenize('(1+i) * (1-i)'));
        const res = await evaluate(ast);
        expect(res.equals(new Complex(2,0))).toBe(true);
    });
    test('multiplicação 3: 2*i * 3', async () => {
        const ast = parse(tokenize('2*i * 3'));
        const res = await evaluate(ast);
        expect(res.equals(new Complex(0,6))).toBe(true);
    });

    // Divisão
    test('divisão 1: (3+2i) / (1+2i)', async () => {
        const ast = parse(tokenize('(3+2i) / (1+2i)'));
        const res = await evaluate(ast);
        // manual: ((3+2i)*(1-2i))/5 = (3 -6i +2i -4i^2)/5 = (3+4 -4i)/5 = (7 -4i)/5
        expect(res.equals(new Complex(7/5, -4/5))).toBe(true);
    });
    test('divisão 2: (1+i) / (1-i)', async () => {
        const ast = parse(tokenize('(1+i) / (1-i)'));
        const res = await evaluate(ast);
        expect(res.equals(new Complex(0,1))).toBe(true);
    });
    test('divisão 3: 2*i / 2', async () => {
        const ast = parse(tokenize('2*i / 2'));
        const res = await evaluate(ast);
        expect(res.equals(new Complex(0,1))).toBe(true);
    });

    // Conjugado
    test('conjugado 1: conj(3+2i)', async () => {
        const ast = parse(tokenize('conj(3+2i)'));
        const res = await evaluate(ast);
        expect(res.equals(new Complex(3,-2))).toBe(true);
    });
    test('conjugado 2: conj(1-i)', async () => {
        const ast = parse(tokenize('conj(1-i)'));
        const res = await evaluate(ast);
        expect(res.equals(new Complex(1,1))).toBe(true);
    });
    test('conjugado 3: conj(2*i)', async () => {
        const ast = parse(tokenize('conj(2i)'));
        const res = await evaluate(ast);
        expect(res.equals(new Complex(0,-2))).toBe(true);
    });

    // Exponenciação **
    test('potência 1: (1+i) ** 2', async () => {
        const ast = parse(tokenize('(1+i) ** 2'));
        const res = await evaluate(ast);
        // (1+i)^2 = 1 + 2i + i^2 = 0 + 2i
        expect(res.equals(new Complex(0,2))).toBe(true);
    });
    test('potência 2: (0+1i) ** 2', async () => {
        const ast = parse(tokenize('(i) ** 2'));
        const res = await evaluate(ast);
        expect(res.equals(new Complex(-1,0))).toBe(true);
    });
    test('potência 3: (2+0i) ** 3', async () => {
        const ast = parse(tokenize('(2) ** 3'));
        const res = await evaluate(ast);
        expect(res.equals(new Complex(8,0))).toBe(true);
    });

    // Raiz (sqrt)
    test('raiz 1: sqrt(4+0i)', async () => {
        const ast = parse(tokenize('sqrt(4)'));
        const res = await evaluate(ast);
        expect(res.equals(new Complex(2,0))).toBe(true);
    });
    test('raiz 2: sqrt(0+1i)', async () => {
        const ast = parse(tokenize('sqrt(i)'));
        const res = await evaluate(ast);
        // sqrt(i) = (1/sqrt(2)) + (1/sqrt(2)) i
        const val = 1/Math.sqrt(2);
        expect(res.equals(new Complex(val, val))).toBe(true);
    });
    test('raiz 3: sqrt(3+4i)', async () => {
        const ast = parse(tokenize('sqrt(3+4i)'));
        const res = await evaluate(ast);
        // sqrt(3+4i) = 2 + i  (porque (2+i)^2 = 4 + 4i + i^2 = 3 +4i)
        expect(res.equals(new Complex(2,1))).toBe(true);
    });
});