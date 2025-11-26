function imaginaryNumber(){
    return /^([+-]?(?:\d+\.?\d*|\.\d+))?i$/i
}

function realWithImag(){
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

function identifierVariables(){
    return /^[a-zA-Z]+$/
}

function removeWhiteSpace(){
    return /\s+/
}

module.exports = { imaginaryNumber, realWithImag, realNumber, singleI, negativeI, separators, identifierVariables, removeWhiteSpace};
