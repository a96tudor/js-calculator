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

/**
 *  Setup all buttons that are used as digit inputs.
 */
function setupDigitButtons() {
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
}

/**
 *  Setup the floating-point separator button.
 */
function setupSeparatorButton() {
    elements.separatorButton.addEventListener("click", function () {
        const text = elements.display.textContent;
        if (text.length && text.indexOf(".") === -1)
            elements.display.textContent += ".";
    });
}

/**
 *  Setup the clear button (`C`).
 */
function setupClearButton() {
    elements.clearButton.addEventListener("click", function () {
        elements.display.textContent = "";
        stored = null;
        lastValueEntered = null;
        lastOpPressed = null;
        elements.formula.textContent = "";
        elements.formula.style.display = "block";
    });
}

/**
 * Apply the appropriate operation and get the result.
 * 
 * @return {int} the result of applying the opperation.
 */
function calculate() {
    const [first, second] = [stored.text, lastValueEntered]
        .map((text) => parseFloat(text));
    return operations[stored.opCode](first, second);
}

/**
 * Re-apply the last operation.
 * 
 * This implementation should be used to addres Problem 3, part 1.
 * 
 * @return {int} the result of applying the opperation.
 */
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

/**
 * Find the correct fields for the new `stored` value.
 * 
 * This function should be called when an operation button
 * was pressed.
 * 
 * @param {string} opCode The opCode that was pressed.
 *
 */
function setNewStoredValue(opCode) {
    let sign = 1;
    let text = elements.display.textContent;

    if (opCode == '-' && !pressedDigit) {
        // This `-` represents the start of a negative number
        sign = -1;
        text = stored ? stored.text : null;
        opCode = lastOpPressed ? lastOpPressed : null; 
    }

    stored = {
        text,
        opCode,
        sign
    };
}

/**
 *  Define actions that need to be taken when an operation button is pressed.
 */
function setUpOperationButtons() {
    for (let [opCode, button] of Object.entries(elements.operationButtons))
        button.addEventListener("click", function () {
            if (!pressedEqual)
                // This is the default value that is added to `display`.
                elements.display.textContent = lastValueEntered; 

            if (stored && stored.sign == -1)
                // Closing the brackets for negative numbers.
                elements.formula.textContent += ")"

            // Renewing the value of `stored`.
            setNewStoredValue(opCode);

            if (stored.opCode && stored.sign != -1) {
                // Adding the opCode element to the formula.
                elements.formula.textContent += stored.opCode;
                lastValueEntered = "";
            }
            if (stored.text)
                // Updating the value of the display, if necessary.
                elements.display.textContent = stored.text;

            elements.formula.style.display = "block";

            // Setting constants.
            pressedEqual = false;
            pressedDigit = false;
            lastOpPressed = stored.opCode;
        });
}

/**
 *  Define how the pressing of the `=` button is handled.
 */
function setUpCalculateButton() {
    elements.calculateButton.addEventListener("click", function () {
        // Hide the formula
        elements.formula.style.display = "none";

        // If `=` has already been pressed once before, then we need to
        // perform the actions described in Problem #3, part 1 - repeat
        // the last operation that was done.
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

/**
 *  Setup all event listeners.
 */
function setup() {
    setupDigitButtons();
    setupSeparatorButton();
    setupClearButton();
    setUpOperationButtons();
    setUpCalculateButton();
}

setup();
