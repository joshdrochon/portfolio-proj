let skills = [,,,'javascript', 'csharp', 'html5', 'css3', 'github', 'mysql','python','react', 'bitbucket']

let cursorInterval,
cursorTimeout

function cursorBlink() {
    let cursor = document.getElementById("cursor")
    if (cursor.classList.contains("invisible")) {
        cursor.classList.remove("invisible")
        return
    }
    cursor.classList.add("invisible")
}

(function typeWriter(text) {
    let i = 0

    function step() {
        if (i < text.length) {
            let welcome = document.getElementById("welcome-text")
            welcome.innerHTML += text.charAt(i)
    
            let cursor = document.getElementById("cursor"),
    
                bClientRect = welcome.getBoundingClientRect()
    
            cursor.style.left = text.charAt(i) == " " ?
                bClientRect.width + 10 + 'px' :
                bClientRect.width + 'px'
    
            i += 1
            setTimeout(step, i == 3 ? 300 : 100)
        }
    }

    window.setTimeout(() => {
        step()
        cursorTimeout = window.setTimeout(() => {
            cursorInterval = window.setInterval(cursorBlink, 530)
        }, 1500)
    }, 500)
})("Hi. I'm Josh.")

function handleClick() {
    let welcomeCont = document.getElementsByClassName('welcome-cont')[0]
    welcomeCont.style.display = "none"
    window.clearInterval(cursorInterval)    
    window.clearTimeout(cursorTimeout)
    initGame()
}

//collected skills
let collectables = []

const WORLD_TILES = {
    0: '#7393b3',
    1: new Image(),
    2: new Image(),
}

WORLD_TILES["1"].src = './assets/img/pixelblock.png'
WORLD_TILES["2"].src = './assets/img/pixelgrass.png'

function createSkills() {
    for (let i = 3; i < skills.length; i+=1) {
        let img = new Image()
        img.src = `./assets/img/pixel${skills[i]}.png`
        WORLD_TILES[i] = img
    }
}

createSkills()

let rainBackground

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
const numOfCols = 72
const sqSize = 50
const emptySq = '#7393b3'

let canvas,
    context
function createGameWorld() {
    canvas = document.querySelector('#game-world')
    context = canvas.getContext('2d')
    drawWorld()
}

let gameGrid = [], skillsIndex = 3
for (let r = numOfRows - 1; r >= 0; r -= 1) {
    gameGrid[r] = []
    for (let c = numOfCols - 1; c >= 0; c -= 1) {
        //empty = 0
        //soil = 1
        //grass = 2
        //skill = 3
        gameGrid[r][c] = 0

        if (r== 3) {
            if (c==2||c==9||c==15||c==27||c==39||c==48||c==54||c==65||c==70) {
                gameGrid[r][c] = skillsIndex++
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
    
    pattern > 0 ?
    context.drawImage(WORLD_TILES[pattern], x * sqSize, y * sqSize, 50, 50) : 
    context.fillStyle = WORLD_TILES[pattern]
}

function drawPlayer() {
    context.strokeRect(player.x, player.y, 50, 100)
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

        keyListener (e) {
            e.preventDefault()

            let key_state = e.type == "keydown"
            switch (e.keyCode) {
                case 37:
                    controller.left = key_state;
                    break;
                case 32:
                    JUMPSOUND.play()
                    controller.up = key_state;
                    break;
                case 40:
                    controller.down = key_state;
                    break;
                case 39:
                    controller.right = key_state;
                    break;
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

        //player grid locations
        let pGridX = Math.ceil(player.x /50)
        let pGridY = Math.floor(player.y /50) + 1

        //player left of block
        if (gameGrid[pGridY][pGridX] == 2) {
            player.x_velocity = 0
            player.x = (pGridX * 50) - 50
            controller.right = false
        }
        //player right of block
        if (gameGrid[pGridY][pGridX -1] == 2) {
            player.x_velocity = 0
            player.x = (pGridX * 50)
            controller.left = false
        }

        //player top of block
        if (gameGrid[pGridY+1][pGridX] == 2 || gameGrid[pGridY+1][pGridX -1] == 2) {
            if ((pGridX * 50) - player.x > 0) {
                player.jumping = false;
                player.y_velocity = 0
                if (player.y < 250) {
                    player.y = (pGridY * 50) - 50
                }
            }
        }

        //skill collision
        if ((gameGrid[pGridY - 1][pGridX] || gameGrid[pGridY - 1][pGridX - 1]) > 2) {

            let collectable = gameGrid[pGridY - 1][pGridX] || 
            gameGrid[pGridY - 1][pGridX - 1]

            collectables.push(collectable)

            gameGrid[pGridY - 1][pGridX - 1] === 0 ? 
            gameGrid[pGridY - 1][pGridX] = 0 : 
            gameGrid[pGridY - 1][pGridX - 1] = 0

            COLLECTSOUND.play()

            console.log(collectables)
        }

        rainBackground.style.left = worldXPosition + 'px'
        canvas.style.left = worldXPosition + 'px'
        
        drawWorld()
        drawPlayer()

        requestAnimationFrame(gameLoop);
    }

    window.addEventListener("keydown", controller.keyListener)
    window.addEventListener("keyup", controller.keyListener);
    window.requestAnimationFrame(gameLoop);
}






