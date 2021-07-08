let debugMode = false

const HEADERTEXT = "Hi. I'm Josh."
let i = 0

const WORLD_TILES = {
    0: '#7393b3',
    1: new Image(),
    2: new Image(),
    3: new Image(),
}

const SKILL_TILES = {}

let tileCoords = []

// function randomize() {
//     for (let i = 0; i < 1; i+=1) {
//         let img = new Image()
//         img.src = './assets/img/pixeljavascript.png'
//         SKILL_TILES[i] = img
//     }
// }

// randomize()

let rainBackground

WORLD_TILES["1"].src = './assets/img/pixelblock.png'
WORLD_TILES["2"].src = './assets/img/pixelgrass.png'
WORLD_TILES["3"].src = './assets/img/pixeljavascript.png'

console.log(WORLD_TILES)

const HERO_IMAGES = {
    0: new Image(),
    1: new Image(),
}

HERO_IMAGES["0"].src = './assets/img/pixeljosh.png'
HERO_IMAGES["1"].src = './assets/img/pixeljosh2.png'

const RAINSOUND = new Audio('./assets/audio/rain-and-thunder.mp3')
RAINSOUND.volume = .5
const THEMEMUSIC = new Audio('./assets/audio/theme-music.mp3')
THEMEMUSIC.loop = true
const JUMPSOUND = new Audio('./assets/audio/jump.wav')
const COLLECTSOUND = new Audio('./assets/audio/collect.wav')

let hero, 
worldXPosition = 0

const numOfRows = 8
const numOfCols = 36
const sqSize = 50
const emptySq = '#7393b3'

let canvas,
    context
function createGameWorld() {
    canvas = document.querySelector('#game-world')
    context = canvas.getContext('2d')
    drawWorld()
}

let gameGrid = []
for (let r = numOfRows - 1; r >= 0; r -= 1) {
    gameGrid[r] = []
    for (let c = numOfCols - 1; c >= 0; c -= 1) {
        //empty = 0
        //soil = 1
        //grass = 2
        //skill = 3
        gameGrid[r][c] = 0

        if (r== 3) {
            if (c == 2 || c == 5 || c == 9 || c == 17 || c == 21) {
                gameGrid[r][c] = 3
            }
        }
        if (r == 6) {
            //soil below
            if (gameGrid[r + 1][c] == 1) {
                //place grass above
                gameGrid[r][c] = 2
            }
        }
        if (r == 7) {
            //50% chance of truthy
            if (Math.floor(Math.random() * 2))
                //grass or soil
                gameGrid[r][c] = Math.floor(Math.random() * 2) + 1
            else {
                //grass
                gameGrid[r][c] = 2
            }
        }
    }
}
console.log(gameGrid)

function drawWorld() {
    for (let r = 0; r < numOfRows; r++) {
        for (let c = 0; c < numOfCols; c++) {
            drawSquares(c, r, gameGrid[r][c])
        }
    }
}

function drawSquares(x, y, pattern) {
    context.fillRect(x * sqSize, y * sqSize, sqSize, sqSize)
    //empty
    if (pattern == 0) {
        context.fillStyle = WORLD_TILES["0"]
    }
    //soil
    if (pattern == 1) {
        context.drawImage(WORLD_TILES["1"], x * sqSize, y * sqSize, 50, 50)
    }
    //grass
    if (pattern == 2) {
        context.drawImage(WORLD_TILES["2"], x * sqSize, y * sqSize, 50, 50)
    }
    //skill
    if (pattern == 3) {
        context.drawImage(WORLD_TILES["3"], x * sqSize, y * sqSize, 50, 50)
    }
    //TODO remove before deployment
    // context.strokeStyle = "black"
    // context.strokeRect(x * sqSize, y * sqSize, sqSize, sqSize)
    //TODO remove before deployment
    // context.strokeStyle = "#FF0000"
}

function drawPlayer() {
    // context.strokeRect(player.x, player.y, 50, 100)
    //image comes add odd dimensions
    context.drawImage(HERO_IMAGES[player.heroStance], player.x - 15, player.y - 10)
}   

let controller, 
player, 
gameLoop;
function initGame() {
    RAINSOUND.play()
    THEMEMUSIC.play()
    createGameWorld()
    document.getElementById('story').style.display = "block"
    rainBackground = document.getElementById('rain')

    player = {
        height: 100,
        jumping: false,
        width: 50,
        x: 100,
        x_velocity: 0,
        y: 250,
        y_velocity: 0,
        counter: 0,
        
        heroStance: 0,

        animate(controller) {

            if (controller.up) this.counter = 0

            if (controller.right || controller.left) {
                this.counter +=1
                if (this.counter >= 10) {
                    this.heroStance = this.heroStance === 0 ? 1 : 0
                    this.counter = 0
                }
            }
        },
    }

    controller = {
        left: false,
        right: false,
        up: false,
        down: false,
        keyListener: function (event) {
            let keyMap = {}
            keyMap[event.keyCode] = event.type == "keydown"
            
            let key_state = event.type == "keydown" ? 
            true : 
            false;

            switch (event.keyCode) {
                case 37:
                    event.preventDefault()
                    controller.left = key_state;
                    break;
                case 32:
                    event.preventDefault()
                    JUMPSOUND.play()
                    controller.up = key_state;
                    break;
                case 40:
                    event.preventDefault()
                    controller.down = key_state;
                    break;
                case 39:
                    event.preventDefault()
                    controller.right = key_state;
                    break;
                default:
                    event.preventDefault()

            }

        }

    };

    gameLoop = function () {

        player.animate(controller)

        if (controller.up && player.jumping == false) {
            player.y_velocity -= 20;
            player.jumping = true;
        }
        if (controller.left) {
            player.x_velocity -= 0.2;
        }
        if (controller.right) {
            player.x_velocity += 0.2;
        }
        player.y_velocity += 1.5;// gravity
        player.x += player.x_velocity;
        player.y += player.y_velocity;
        
        //friction
        player.x_velocity = Math.abs(player.x_velocity) < 0.2 ? 
        0 : 
        player.x_velocity *= 0.9

        player.y_velocity = Math.abs(player.y_velocity) < 0.2 ? 
        0 : 
        player.y_velocity *= 0.9

        // if player is falling below floor line
        if (player.y > 250) {
            player.jumping = false;
            player.y = 250;
            player.y_velocity = 0;
        }

        //if player goes less than bounds
        if (player.x <= 0) {
            player.x_velocity = 0
            player.x = 0
        }
        if (player.x >= 250) {
            worldXPosition = 250 - Math.round(player.x)
        }
        if (player.x < 250) {
            worldXPosition = 0
        }
        
        let playerGridX = Math.ceil(player.x /50)
        let playerGridY = Math.floor(player.y /50) + 1

        //player left of block
        if (gameGrid[playerGridY][playerGridX] == 2) {
            player.x_velocity = 0
            player.x = (playerGridX * 50) - 50
            controller.right = false
        }
        //player right of block
        if (gameGrid[playerGridY][playerGridX -1] == 2) {
            player.x_velocity = 0
            player.x = (playerGridX * 50)
            controller.left = false
        }

        //player top of block
        if (gameGrid[playerGridY+1][playerGridX] == 2 || gameGrid[playerGridY+1][playerGridX -1] == 2) {
            if ((playerGridX * 50) - player.x > 0) {
                player.jumping = false;
                player.y_velocity = 0
                if (player.y < 250) {
                    player.y = (playerGridY * 50) - 50
                }
            }
        }

        if (gameGrid[playerGridY - 1][playerGridX] == 3) {
            COLLECTSOUND.play()
            gameGrid[playerGridY - 1][playerGridX] = 0
        }
        if (gameGrid[playerGridY - 1][playerGridX - 1] == 3) {
            COLLECTSOUND.play()
            gameGrid[playerGridY - 1][playerGridX - 1] = 0
        }


        rainBackground.style.left = worldXPosition + 'px'
        canvas.style.left = worldXPosition + 'px'
        
        drawWorld()
        drawPlayer()

        setTimeout(() => {
            requestAnimationFrame(gameLoop);
        }, debugMode ? 500 : 1);
    }

    window.addEventListener("keydown", controller.keyListener)
    window.addEventListener("keyup", controller.keyListener);
    window.requestAnimationFrame(gameLoop);
}











//first screen
function typeWriter() {
    if (i < HEADERTEXT.length) {
        let welcome = document.getElementById("welcome-text")
        welcome.innerHTML += HEADERTEXT.charAt(i)

        let cursor = document.getElementById("cursor"),

            bClientRect = welcome.getBoundingClientRect()

        cursor.style.left = HEADERTEXT.charAt(i) == " " ?
            bClientRect.width + 10 + 'px' :
            bClientRect.width + 'px'

        i += 1
        setTimeout(typeWriter, i == 3 ? 300 : 100)
    }
}

let cursorInterval;
let cursorTimeout;

window.setTimeout(() => {
    typeWriter()
    cursorTimeout = window.setTimeout(() => {
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

function handleClick() {
    let welcomeCont = document.getElementsByClassName('welcome-cont')[0]
    welcomeCont.style.display = "none"
    window.clearInterval(cursorInterval)    
    window.clearTimeout(cursorTimeout)
    initGame()
}

document.getElementById('debug').addEventListener('click', setDebugMode)

function setDebugMode(e) {
    e.preventDefault()
    if (debugMode == true) {
        debugMode = false
    }
    else {
        debugMode = true
    }
}


