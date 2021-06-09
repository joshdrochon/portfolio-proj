const HEADERTEXT = "Hi. I'm Josh."
let i = 0

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

window.setTimeout(()=> {
    typeWriter()
    window.setTimeout(()=> {
        cursorBlink()
    }, 1500)
}, 500)

function cursorBlink() {
    window.setInterval(()=> {
        let cursor = document.getElementById("cursor")
        if (cursor.classList.contains("invisible")) {
            cursor.classList.remove("invisible")
            return
        }
        cursor.classList.add("invisible")
    }, 530)
}

function handleClick(){
    let welcomeCont = document.getElementsByClassName('welcome-cont')[0]
    welcomeCont.style.display = "none"
    startGame()
}

function startGame() {
    console.log("starting game")
    document.getElementById('story').style.display = "block"
}



