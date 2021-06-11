const HEADERTEXT = "Hi. I'm Josh."
let i = 0

class Sprite {
    constructor(x, y) {
        this.x = x;
        this.y = y
    }
}

//here position
const JOSH = new Sprite(250, 250)
//canvas position
const GAMEWORLD = new Sprite(0, 0)

const numOfRows = 8
const numOfCols = 36
const sqSize = 50
const emptySq = '#0597f2'

function createGameWorld() {
    const canvas = document.querySelector('#game-world')
    const context = canvas.getContext('2d')
    drawWorld(context)
}

function drawSquares(x, y, color, ctx) {
    if (y == 7) {
        let dirt = new Image()
        dirt.src = "./assets/img/pixelgrass.png"
        dirt.onload = function() {
            ctx.drawImage(this, x*sqSize, y*sqSize, 50, 50)
        }
    }
    else if (y == 3 && x == 5) {
        let js = new Image()
        js.src = "./assets/img/pixeljavascript.png"
        js.onload = function() {
            ctx.drawImage(this, x*sqSize, y*sqSize, 50, 50)
        }
    }
    else {
        ctx.fillStyle = color
    }
    ctx.fillRect(x*sqSize, y*sqSize, sqSize, sqSize)
    // ctx.strokeStyle = "#000000"
    ctx.strokeRect(x*sqSize, y*sqSize, sqSize, sqSize)
}

let board = []
for (let r = 0; r < numOfRows; r++){
    board[r] = []
    for (let c = 0; c < numOfCols; c++){
        board[r][c] = emptySq
    }
}

function drawWorld(context){
    
    for (let r = 0; r < numOfRows; r++){
        for (let c = 0; c < numOfCols; c++){
            drawSquares(c, r, board[r][c], context)
        }
    }
}

function typeWriter() {
    if (i < HEADERTEXT.length) {
        let welcome = document.getElementById("welcome-text")
        welcome.innerHTML += HEADERTEXT.charAt(i)

        let cursor = document.getElementById("cursor"),
        
        bClientRect = welcome.getBoundingClientRect()

        cursor.style.left = HEADERTEXT.charAt(i) == " " ? 
        bClientRect.width + 10 + 'px' : 
        bClientRect.width + 'px'

        i+=1
        setTimeout(typeWriter, i == 3 ? 300 : 100)
    }
}

let cursorInterval;
let cursorTimeout;

window.setTimeout(()=> {
    typeWriter()
    cursorTimeout = window.setTimeout(()=> {
        cursorInterval = window.setInterval(cursorBlink, 530)
    }, 1500)
}, 500)



function cursorBlink() {
    let cursor = document.getElementById("cursor")
    if (cursor.classList.contains("invisible")) {
        cursor.classList.remove("invisible")
        return
    }
    cursor.classList.add("invisible")
}

function handleClick(){
    let welcomeCont = document.getElementsByClassName('welcome-cont')[0]
    welcomeCont.style.display = "none"
    window.clearInterval(cursorInterval)
    window.clearTimeout(cursorTimeout)
    initGame()
}

function initGame() {
    document.getElementById('story').style.display = "block"
    createGameWorld()
    document.addEventListener("keydown", control)
}

function control(e) {
    e.preventDefault()

    let hero = document.getElementById("hero"),
    gameworld = document.getElementById("game-world"),
    rain = document.getElementById("rain")

    if (e.keyCode === 32) {
        console.log("i am jumping")
    }
    //move left
    if (e.keyCode === 37) {
        hero.style.transform = "scaleX(-1)"
        if (GAMEWORLD.x === 0) {
            if (JOSH.x > 0) {
                JOSH.x -= 10
            }
        }
        if (GAMEWORLD.x < 0) {
            if (JOSH.x === 250) {
                GAMEWORLD.x += 10
            }
            if (GAMEWORLD.x === -1200) {
                if (JOSH.x > 250) {
                    JOSH.x -= 10
                }
            }
        }
    }
    //move right
    if (e.keyCode === 39) {
        hero.style.transform = "scaleX(1)"
        if (JOSH.x >= 250) {
            if (GAMEWORLD.x === -1200) {
                if (JOSH.x < 550) {
                    JOSH.x += 10
                }
            }
            if (GAMEWORLD.x > -1200) {
                GAMEWORLD.x -= 10
            }
        }
        if (JOSH.x < 250) {
            JOSH.x += 10
        }
    }
    console.log("WORLD:", GAMEWORLD.x)
    console.log("JOSH:", JOSH.x)
    hero.style.left = JOSH.x + 'px'
    hero.style.top = JOSH.y + 'px'
    gameworld.style.left = GAMEWORLD.x + 'px'
    rain.style.left = GAMEWORLD.x + 'px'
}



