"use strict";

let stored = null;
let lastOpPressed = null;
let pressedEqual = false;
let lastValueEntered = null;
let pressedDigit = false;

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
    get formula() {
        return document.getElementById("formula");
    }
}

function setUpEntryButtons() {
    for (let [digit, button] of Object.entries(elements.digitButtons))
        button.addEventListener("click", function () {
            if (!pressedDigit && stored && stored.sign == -1) {
                // We are dealing with a negative number here
                elements.formula.textContent += "(-"
                lastValueEntered = "-"
            }
            if (!lastValueEntered)
                lastValueEntered = digit;
            else
                lastValueEntered += digit;
            elements.formula.textContent += digit;
            if (stored && stored.text && stored.text != "")
                elements.display.textContent = calculate();
            else
                // We are on the very first number that is being typed
                elements.display.textContent = lastValueEntered;
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
        lastValueEntered = null;
        lastOpPressed = null;
        elements.formula.textContent = "";
        elements.formula.style.display = "block";
    });
}

function calculate() {
    const [first, second] = [stored.text, lastValueEntered]
        .map((text) => parseFloat(text));
    console.log(first, second, stored.opCode);
    return operations[stored.opCode](first, second);
}

function calculateOnEqual() {
    const [first, second] = [elements.display.textContent, lastValueEntered]
        .map((text) => parseFloat(text));
    // Adding these operations to the formula field
    elements.formula.textContent += lastOpPressed;
    if (second < 0)
        elements.formula.textContent += ["(", second, ")"].join();
    else
        elements.formula.textContent += lastValueEntered;
    return operations[lastOpPressed](first, second);
}

function setUpOperationButtons() {
    for (let [opCode, button] of Object.entries(elements.operationButtons))
        button.addEventListener("click", function () {
            let sign = 1;
            let opCodeToStore = opCode;
            if (!pressedEqual)
                elements.display.textContent = lastValueEntered; 
            let text = elements.display.textContent;

            if (stored && stored.sign == -1)
                // Closing the brackets for negative numbers.
                elements.formula.textContent += ")"
            if (stored && stored.text && stored.opCode)
                text = calculate();
            if (opCode == '-' && !pressedDigit) {
                sign = -1;
                text = stored ? stored.text : null;
                opCodeToStore = lastOpPressed ? lastOpPressed : null;
            }
            if (opCodeToStore && sign != -1) {
                elements.formula.textContent += opCodeToStore;
                lastValueEntered = "";
            }
            if (text)
                elements.display.textContent = text;
            stored = {
                text,
                opCode: opCodeToStore,
                sign,
            };
            elements.formula.style.display = "block";
            pressedEqual = false;
            pressedDigit = false;
            lastOpPressed = opCodeToStore;
        });
}

function setUpCalculateButton() {
    elements.calculateButton.addEventListener("click", function () {
        elements.formula.style.display = "none";
        if (pressedEqual) {
            elements.display.textContent = calculateOnEqual();
            return;
        }
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
