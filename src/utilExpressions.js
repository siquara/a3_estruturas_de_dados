function imaginaryNumber(){
    return /^([+-]?(?:\d+\.?\d*|\.\d+))?i$/i
}

function divideRealAndImag(){
    return /^([+-]?(?:\d+\.?\d*|\.\d+))([+-](?:\d+\.?\d*|\.\d+))i$/i
}

function realNumber(){
    return /^([+-]?(?:\d+\.?\d*|\.\d+))$/
}

function singleI(){
    return /^i$/i
}

function negativeI(){
    return /^-i$/i
}

function separators(){
    return /(\*\*|[\(\)\+\-\*\/\,])/g
}

function identifier(){
    return /^[a-zA-Z]+$/
}

module.exports = { imaginaryNumber, divideRealAndImag, realNumber, singleI, negativeI, separators, identifier };
