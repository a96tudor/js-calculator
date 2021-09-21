In this file, I will describe my work and how I went about solving the problems I chose.

## 1. Problem #3

In order to solve this problem, I first introduced a set of new global variables as follows:

|     Variable     |      Type     |                                                                                      Comments                                                                                     |
|:----------------:|:-------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|   lastOpPressed  |     string    |                             The last operation that was pressed (One of `/` `*` `+` `-`). This is used to re-apply the operation when `=` is pressed.                             |
| lastValueEntered | string/ float |                                                      The last value that was entered. For the same reason as `lastOpPressed`                                                      |
|   pressedEqual   |    boolean    | Whether the last op that was pressed was `=`. This is used to decide whether we calculate the result using the value in `stored` or the  `lastOpPressed`-`lastValueEntered` pair. |
|   pressedDigit   |    boolean    |       Whether the last digit that was pressed was a digit or not.  This is used to distinguish between the two uses of `-`:  as an operation or as a negative number marker.      |
|    stored.sign   |     float     |                                                  One of `1` and `-1`. Represents the sign of the next value that will be entered.                                                 |

I also defined a new function `calculateOnEqual`, which has a similar functionality to `calculate`, but uses the `lastOpPressed`-`lastValueEntered` pair to perform the calculation, instead of `stored`.

## 2. Problem #4
In order to solve this, I first created a new HTML elementm with the same stlye as `display`, where the formula will be displayed. When a user enters a new value, the formula will be updated live, just like the partial result in `display`.

Another functionality that was added here is the fact that the formula is remembered until `C` is pressed. In other words, if the user performs the following set of commands.

Also, for readibility, the negative values are stored in paranthesis. So the multiplying `1` with `-1`, the formula field will look like `1*(-1)`.