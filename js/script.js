const HEADERTEXT = "Hi. I'm Josh."
let i = 0

const HERO_IMAGES = {
    0: new Image(),
    1: new Image(),
}

HERO_IMAGES["0"].src = './assets/img/pixeljosh.png'
HERO_IMAGES["1"].src = './assets/img/pixeljosh2.png'

class Sprite {
    constructor(x, y, relativeX = 0, relativeY = 0) {
        this.x = x;
        this.y = y
        this.relativeX = relativeX
        this.relativeY = relativeY
        this.state = 0
    }
    moveLeft() {
        this.relativeX = +(this.relativeX - .2).toFixed(1)
    }
    moveRight() {
        this.relativeX = +(this.relativeX + .2).toFixed(1)
    }
    changeState() {
        this.state = this.state === 0 ? 1 : 0
        return this.state
    }
}

const rainSound = new Audio('./assets/audio/rain-and-thunder.mp3')
rainSound.volume = .5
const themeMusic = new Audio('./assets/audio/theme-music.mp3')
themeMusic.loop = true

let hero

//hero position
const JOSH = new Sprite(100, 250, 2, 5)
//canvas position
const GAMEWORLD = new Sprite(0, 0)

const numOfRows = 8
const numOfCols = 36
const sqSize = 50
const emptySq = '#7393b3'

function createGameWorld() {
    hero = document.getElementById('hero')

    hero.appendChild(HERO_IMAGES["0"])

    const canvas = document.querySelector('#game-world')
    const context = canvas.getContext('2d')
    drawWorld(context)
}

let gameGrid = []
for (let r = numOfRows - 1; r >= 0; r-=1){
    gameGrid[r] = []
    for (let c = numOfCols - 1; c >= 0; c-=1){
        //empty = 0
        //soil = 1
        //grass = 2
        gameGrid[r][c] = 0
        if (r == 6) {
            //soil below
            if (gameGrid[r+1][c] == 1) {
                //place grass above
                gameGrid[r][c] = 2
            }
        }
        if (r == 7) {
            //50% chance of truthy
            if (Math.floor(Math.random()*2))
                //grass or soil
                gameGrid[r][c] = Math.floor(Math.random() * 2) + 1
            else {
                //grass
                gameGrid[r][c] = 2
            }
        }
    }
}

function drawWorld(context) {
    for (let r = 0; r < numOfRows; r++){
        for (let c = 0; c < numOfCols; c++){
            drawSquares(c, r, gameGrid[r][c], context)
        }
    }
}

function drawSquares(x, y, pattern, ctx) {
    //grass
    if (pattern == 2) {
        let grass = new Image()
        grass.src = "./assets/img/pixelgrass.png"
        grass.onload = function() {
            ctx.drawImage(this, x*sqSize, y*sqSize, 50, 50)
        }
    }
    //soil
    if (pattern == 1) {
        let dirt = new Image()
        dirt.src = "./assets/img/pixelblock.png"
        dirt.onload = function() {
            ctx.drawImage(this, x*sqSize, y*sqSize, 50, 50)
        }
    }
    //empty
    if (pattern == 0) {
        ctx.fillStyle = emptySq
    }
    
    if (y == 3 && x == 5) {
        let js = new Image()
        js.src = "./assets/img/pixeljavascript.png"
        js.onload = function() {
            ctx.drawImage(this, x*sqSize, y*sqSize, 50, 50)
        }
    }


    ctx.fillRect(x*sqSize, y*sqSize, sqSize, sqSize)
    // ctx.strokeStyle = "#000000"
    // ctx.strokeRect(x*sqSize, y*sqSize, sqSize, sqSize)
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
    rainSound.play()
    themeMusic.play()
    document.getElementById('story').style.display = "block"
    createGameWorld()
    document.addEventListener("keydown", control)
}

function control(e) {
    e.preventDefault()

    //remove current state node
    hero.removeChild(HERO_IMAGES[JOSH.state])

    //set and get new state 
    let characterState = JOSH.changeState()

    //set new state
    hero.appendChild(HERO_IMAGES[characterState])
    
    let gameworld = document.getElementById("game-world"),
    rain = document.getElementById("rain")

    if (e.keyCode === 32) {

        jumpLoop()

        console.log("i am jumping")

        
    }
    
    //move left
    if (e.keyCode === 37) {
        hero.style.transform = "scaleX(-1)"

        let nextLeftPosition = Math.ceil(JOSH.relativeX) - 1
        
        if (gameGrid[JOSH.relativeY + 1][nextLeftPosition] === 0) {
            JOSH.moveLeft()
            
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
    }
    //move right
    if (e.keyCode === 39) {
        hero.style.transform = "scaleX(1)"

        let nextRightPosition = Math.floor(JOSH.relativeX) + 1

        if (gameGrid[JOSH.relativeY + 1][nextRightPosition] === 0) {
            JOSH.moveRight()
        
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
        
    }
    hero.style.left = JOSH.x + 'px'
    hero.style.top = JOSH.y + 'px'
    gameworld.style.left = GAMEWORLD.x + 'px'
    rain.style.left = GAMEWORLD.x + 'px'
}



