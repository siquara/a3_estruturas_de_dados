class Complex {
    constructor(a = 0, b = 0) {
        this.a = a; 
        this.b = b; 
    }

    add(other) {
        return new Complex(this.a + other.a, this.b + other.b);
    }

    subtract(other) {
        return new Complex(this.a - other.a, this.b - other.b);
    }

    multiply(other) {
        const a = this.a * other.a - this.b * other.b;
        const b = this.a * other.b + this.b * other.a;
        return new Complex(a, b);
    }

    divide(other) {
        const denominator = other.a * other.a + other.b * other.b;
        if (denominator === 0) {
            throw new Error("Divisão por zero (0+0i) não é permitida.");
        }
        const a = (this.a * other.a + this.b * other.b) / denominator;
        const b = (this.b * other.a - this.a * other.b) / denominator;
        return new Complex(a, b);
    }

    conjugate() {
        return new Complex(this.a, -this.b);
    }

    sqrt() {
        const r = Math.sqrt(this.a * this.a + this.b * this.b);
        const a_part = Math.sqrt((r + this.a) / 2);
        const b_part = Math.sign(this.b) * Math.sqrt((r - this.a) / 2);
        return new Complex(a_part, b_part || 0);
    }

    pow(n) {
        if (typeof n === 'number' && Number.isInteger(n) && n >= 0) {
            let result = new Complex(1, 0);
            for (let i = 0; i < n; i++) result = result.multiply(this);
            return result;
        }
        throw new Error("Potência suportada apenas para expoentes inteiros não-negativos nesta versão.");
    }
    
    equals(other) {
        const tolerance = 1e-9; 
        return Math.abs(this.a - other.a) < tolerance && Math.abs(this.b - other.b) < tolerance;
    }

    toString() {
        if (this.b === 0) {
            return `${this.a}`;
        }
        if (this.a === 0) {
            return this.b === 1 ? 'i' : (this.b === -1 ? '-i' : `${this.b}i`);
        }
        if (this.b > 0) {
            return `${this.a} + ${this.b === 1 ? '' : this.b}i`;
        }
        return `${this.a} - ${this.b === -1 ? '' : Math.abs(this.b)}i`;
    }
}

module.exports = Complex;