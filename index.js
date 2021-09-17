"use strict";

let stored = null;
let lastOpPressed = null;
let pressedEqual = false;
let lastValueEntered = null;
let lastSign = null;
let pressedDigit = false;
let previewValues = [];

const digits = [...Array(10).keys()].map((key) => key.toString());

const operations = {
    "+": (first, second) => first + second,
    "-": (first, second) => first - second,
    "*": (first, second) => first * second,
    "/": (first, second) => first / second
};

const elements = {
    get display() {
        return document.getElementById("display");
    },
    digitButtons: (() => {
        const buttons = {};
        for (let digit of digits)
            Object.defineProperty(buttons, digit, {
                enumerable: true,
                get: () => document.getElementById(`btn-${digit}`)
            });
        return buttons;
    })(),
    get separatorButton() {
        return document.getElementById("btn-separator");
    },
    get clearButton() {
        return document.getElementById("btn-clear");
    },
    operationButtons: (() => {
        const buttons = {};
        for (let opCode of Object.keys(operations))
            Object.defineProperty(buttons, opCode, {
                enumerable: true,
                get: () => document.getElementById({
                    "+": "btn-add",
                    "-": "btn-subtract",
                    "*": "btn-multiply",
                    "/": "btn-divide"
                }[opCode])
            });
        return buttons;
    })(),
    get calculateButton() {
        return document.getElementById("btn-calculate");
    },
    get preview() {
        return document.getElementById("preview");
    }
}

function setUpEntryButtons() {
    for (let [digit, button] of Object.entries(elements.digitButtons))
        button.addEventListener("click", function () {
            elements.display.textContent += digit;
            pressedDigit = true;
        });

    elements.separatorButton.addEventListener("click", function () {
        const text = elements.display.textContent;
        if (text.length && text.indexOf(".") === -1)
            elements.display.textContent += ".";
    });

    elements.clearButton.addEventListener("click", function () {
        elements.display.textContent = "";
        stored = null;
    });
}

function calculate() {
    const [first, second] = [stored.text, elements.display.textContent]
        .map((text) => parseFloat(text));
    return operations[stored.opCode](first, stored.sign * second);
}

function calculateOnEqual() {
    const [first, second] = [elements.display.textContent, lastValueEntered]
        .map((text) => parseFloat(text));
    return operations[lastOpPressed](first, lastSign * second);
}

function addPreviewValues(sign, opCode) {
    if (!opCode)
        return
    let value = elements.display.textContent;
    if (value == "")
        return
    if (sign == -1 && !pressedEqual)
        // Displaying negative values as (-1) instead of -1 in order
        // to improve preview readibility.
        previewValues.push(["(-", value, ")"].join(''));
    else if (!pressedEqual)
        previewValues.push(value);
    if (opCode != 'none') 
        previewValues.push(opCode);
}

function setUpOperationButtons() {
    for (let [opCode, button] of Object.entries(elements.operationButtons))
        button.addEventListener("click", function () {
            let sign = 1;
            let text = elements.display.textContent;
            let opCodeToStore = opCode;
            let previousSign = 1;
            if (stored)
                previousSign = stored.sign;
            if (stored && stored.text && stored.opCode)
                text = calculate();
            if (opCode == '-' && !pressedDigit) {
                sign = -1;
                text = stored ? stored.text : null;
                opCodeToStore = lastOpPressed ? lastOpPressed : null;
            }
            if (stored && stored.text === null && stored.sign == -1)
                // We are in the case where we have a negative number
                // at the beginning, so we 
                text = '-'.concat(elements.display.textContent);
            addPreviewValues(previousSign, opCodeToStore);
            stored = {
                text,
                opCode: opCodeToStore,
                sign,
            };
            elements.preview.style.display = "block";
            elements.preview.textContent = previewValues.join('');
            pressedEqual = false;
            pressedDigit = false;
            lastOpPressed = opCodeToStore;
            lastSign = sign;
            elements.display.textContent = "";
        });
}

function setUpCalculateButton() {
    elements.calculateButton.addEventListener("click", function () {
        if (!pressedEqual)
            addPreviewValues(stored.sign, 'none');
        elements.preview.style.display = "none";
        if (pressedEqual) {
            elements.display.textContent = calculateOnEqual();
            return;
        }
        lastValueEntered = elements.display.textContent;
        pressedEqual = true;
        if (!stored)
            return;
        elements.display.textContent = calculate();
        stored = null;
    });
}

(() => {
    setUpEntryButtons();
    setUpOperationButtons();
    setUpCalculateButton();
})();
