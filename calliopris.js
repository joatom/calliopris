let im: Image = null
im = images.createImage(`
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    `)

let gameover = false
let ts = game.currentTime()
let lvl = 0
let score = 0
let blocks = 0

let cursorPosX = 2
let cursorPosY = 0
let cursorPrevPosX = 2
let cursorPrevPosY = -1
let c_leftBound = 0
let c_rightBound = 4
let c_upperBound = 0
let c_lowerBound = 4

basic.showString("Calliopris")
resetCalliopris()

function evalField() {
    // check if cursor could not move down anymore
    if (cursorPosY == cursorPrevPosY) {
        // => Game Over
        if (cursorPosY == 0) {
            basic.setLedColor(Colors.Red)
            led.setBrightness(255)
            gameover = true
        }
        else {
            // check whether line is complete
            if (cursorPosY == c_lowerBound &&
                im.pixel(0, c_lowerBound) && im.pixel(0, c_lowerBound) && im.pixel(2, c_lowerBound)
                && im.pixel(3, c_lowerBound) && im.pixel(4, c_lowerBound)) {
                // remove complete line and move the ones above down
                for (let px = c_leftBound; px <= c_rightBound; px++) {
                    for (let py = c_lowerBound; py > c_upperBound; py--) {
                        im.setPixel(px, py, im.pixel(px, py - 1));
                    }
                    // clean first line
                    im.setPixel(px, c_upperBound, false);
                }
                score++;
                led.setBrightness(led.brightness() + 15)
                basic.setLedColor(Colors.Indigo)
            }
            // set new cursor to the top
            cursorPosY = 0;
            cursorPrevPosY = -1;
            cursorPrevPosX = 2;
            cursorPosX = 2;
            blocks++;

        }
    }

}

/**
 * move cursor down 
 *  
 **/
function moveY(steps: number) {
    cursorPrevPosY = cursorPosY;
    cursorPrevPosX = cursorPosX;
    // check if destination stays in bounds 
    if (cursorPosY + steps <= c_lowerBound) {
        // check if destination is still empty
        if (!im.pixel(cursorPosX, cursorPosY + steps)) {
            cursorPosY = cursorPosY + steps;
        }
    }
    evalField();
    draw();
}

/**
 * move cursor left or right‚ 
 *  
 **/
function moveX(steps: number) {
    // check if destination stays in bounds 
    if (cursorPosX + steps >= c_leftBound && cursorPosX + steps <= c_rightBound) {
        // check if destination is still empty
        if (!im.pixel(cursorPosX + steps, cursorPosY)) {
            cursorPrevPosX = cursorPosX;
            cursorPosX = cursorPosX + steps;
            draw();
        }
    }
}

/** 
 * move one step to the left 
 **/
input.onButtonPressed(Button.A, () => {
    if (!gameover) {
        moveX(-1);
    }
})

/** 
 * move one step to the right
 **/
input.onButtonPressed(Button.B, () => {
    if (!gameover) {
        moveX(1)
    }
})

/** 
 * move down quickly
 **/
input.onButtonPressed(Button.AB, () => {
    if (!gameover) {
        while (true) {
            moveY(1);
            if (cursorPosY == 0) {
                break;
            }
        }
    }
})

/**
 * restart 
 **/
input.onPinPressed(TouchPin.P0, () => {
    resetCalliopris()
})

function draw() {
    // erase old position
    if (cursorPrevPosY >= 0) {
        im.setPixel(cursorPrevPosX, cursorPrevPosY, false);
    }
    // draw new position
    if (cursorPosY >= 0) {
        im.setPixel(cursorPrevPosX, cursorPosY, false);
        im.setPixel(cursorPosX, cursorPosY, true);
    }

    // draw
    im.plotImage()
}

function resetCalliopris() {

    gameover = false
    ts = game.currentTime()
    lvl = 0
    score = 0
    blocks = 0

    cursorPosX = 2
    cursorPosY = 0
    cursorPrevPosX = 2
    cursorPrevPosY = -1

    basic.setLedColor(0)
    im = images.createImage(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)

    draw()
}


basic.forever(() => {
    if (!gameover) {
        if (game.currentTime() - ts > 1000 - (lvl * 70)) {
            moveY(1);
            ts = game.currentTime()
            basic.setLedColor(0)
        }
        if (lvl < score) {
            lvl++
        }
    }
    else {
        basic.showString(score + " + " + blocks)
    }
})
