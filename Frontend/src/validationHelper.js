const containsSpecialChars = (str) => {
    if (typeof str !== 'string') {
        return "Given parameter is not a string"
    }
    const specialChars = /[`!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
    return specialChars.test(str);
};

const containsOnlyNumbers = (str) => {
    if (typeof str !== 'number') {
        return "Given parameter is not a number"
    }
    const number = /^[0-9]\d*(\.\d+)?$/;
    return number.test(str);
};


const containsNumAlpha = (str) => {
    if (typeof str !== 'string') {
        return "Given parameter is not a string"
    }
    const numberAlpha = /^[a-zA-Z0-9 ]*$/;
    return numberAlpha.test(str);
};

const containsOnlyAlphabets = (str) => {
    const Alphabet = /^[A-Za-z\s]*$/;
    return Alphabet.test(str);
};

const CamelCaseConverter = (str) => {
    if (typeof str !== 'string') {
        return "Given parameter is not a string"
    }
    return str.split(" ").filter((y) => y).map((z) => z.charAt(0).toUpperCase() + z.slice(1).toLowerCase()).join(" ");
}

export {
    containsSpecialChars,
    containsOnlyNumbers,
    containsNumAlpha,
    containsOnlyAlphabets,
    CamelCaseConverter
}

