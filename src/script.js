const platform = "https://github.com/kureisamu/LillyRunGameImgs/blob/main/platform.png?raw=true"
const background = "https://github.com/kureisamu/LillyRunGameImgs/blob/main/background.png?raw=true"
const clouds = "https://github.com/kureisamu/LillyRunGameImgs/blob/main/clouds.png?raw=true"
const foothills = "https://github.com/kureisamu/LillyRunGameImgs/blob/main/foothills.png?raw=true"
const mountain = "https://github.com/kureisamu/LillyRunGameImgs/blob/main/mountain.png?raw=true"
const foreground = "https://github.com/kureisamu/LillyRunGameImgs/blob/main/foreground.png?raw=true"
const platform2 = "https://github.com/kureisamu/LillyRunGameImgs/blob/main/platformSmallTall.png?raw=true"
const spriteStandRight = "https://github.com/kureisamu/LillyRunGameImgs/blob/main/lillyStandRight.png?raw=true"
const spriteStandLeft = "https://github.com/kureisamu/LillyRunGameImgs/blob/main/lillyStandLeft.png?raw=true"
const spriteRunRight = "https://github.com/kureisamu/LillyRunGameImgs/blob/main/lillyRunRight.png?raw=true"
const spriteRunLeft = "https://github.com/kureisamu/LillyRunGameImgs/blob/main/lillyRunLeft.png?raw=true"
const tulip = "https://github.com/kureisamu/LillyRunGameImgs/blob/main/singleTulip.png?raw=true"
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 2000
canvas.height = 576

const gravity = 1.5

class Player {
    constructor() {
        this.speed = 10
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }

        this.width = 66
        this.height = 150

        this.image = createImage(spriteStandRight)
        this.frames = 0
        this.sprites = {
            stand: {
                right: createImage(spriteStandRight),
                left: createImage(spriteStandLeft),
                cropWidth: 177,
                width: 66
            },
            run: {
                right: createImage(spriteRunRight),
                left: createImage(spriteRunLeft),
                cropWidth: 341,
                width: 127.875
            }
        }

        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177
    }

    draw() {
        c.drawImage(
            this.currentSprite,
            this.currentCropWidth*this.frames,
            0,
            this.currentCropWidth,
            400,
            this.position.x,
            this.position.y,
            this.width,
            this.height
            )
    }

    update() {
        this.frames++
        if (this.frames > 59 &&
            (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left))
        this.frames = 0
        else if (this.frames > 29 &&
            (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left))
        this.frames = 0

        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
    }
}

class Platform {
    constructor({x, y, image}) {
        this.position = {
            x,
            y
        }

        this.image = image
        this.height = image.height
        this.width = image.width
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({x, y, image}) {
        this.position = {
            x,
            y
        }

        this.image = image
        this.width = image.width
        this.height = image.height

    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function createImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc
    return image
}

// lets

let tulipImage = createImage(tulip)
let platformImage = createImage(platform)
let platform2Image = createImage(platform2)
let player = new Player()
let platforms = []
let genericObjects = []
let lastKey

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    up: {
        pressed: false
    }
}

let scrollOffset = 0

// init

function init() {
 platformImage = createImage(platform)

 player = new Player()


 platforms = [

    // tulips
    new Platform({x: 2250, y: 400, image: tulipImage}),
    new Platform({x: 2600, y: 350, image: tulipImage}),

    // smallTall platforms
    new Platform({x: 3000, y: 350, image: platform2Image}),
    new Platform({x: 5690, y: 400, image: platform2Image}),
    new Platform({x: 5980, y: 450, image: platform2Image}),
    new Platform({x: 6270, y: 500, image: platform2Image}),

    // long platforms
    new Platform({x: -10, y: 525, image: platformImage}),
    new Platform({x: platformImage.width-50, y: 525, image: platformImage}),
    new Platform({x: 1400, y: 525, image: platformImage}),
    new Platform({x: 3600, y: 525, image: platformImage}),
    new Platform({x: 4500, y: 525, image: platformImage}),
    new Platform({x: 5000, y: 525, image: platformImage}),

]

 genericObjects = [
    new GenericObject ({
        x: -1,
        y: -1,
        image: createImage(background)
    }),
    new GenericObject ({
        x: -1,
        y: -200,
        image: createImage(clouds)
    }),
    new GenericObject ({
        x: 8545,
        y: -1,
        image: createImage(mountain)
    }),
    new GenericObject ({
        x: -1,
        y: -1,
        image: createImage(foothills)
    }),
    new GenericObject ({
        x: -1,
        y: -120,
        image: createImage(foreground)
    })

]
 scrollOffset = 0

}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0,0, canvas.width, canvas.height)
    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })
    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if ((keys.left.pressed && player.position.x > 100) ||
    keys.left.pressed && scrollOffset === 0 && player.position.x > 0) {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0
    
        if (keys.right.pressed) {
            scrollOffset += player.speed

            platforms.forEach((platform) => {
                platform.position.x -= player.speed
            })

            genericObjects.forEach((genericObject) => {
                genericObjects[0].position.x -= player.speed*.2
                genericObjects[1].position.x -= player.speed*.18
                genericObjects[2].position.x -= player.speed*.2
                genericObjects[3].position.x -= player.speed*.22
                genericObjects[4].position.x -= player.speed*.24
        })
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed

            platforms.forEach((platform) => {
                platform.position.x += player.speed
            })
            
            genericObjects.forEach((genericObject) => {
                genericObjects[0].position.x += player.speed*.2
                genericObjects[1].position.x += player.speed*.18
                genericObjects[2].position.x += player.speed*.2
                genericObjects[3].position.x += player.speed*.22
                genericObjects[4].position.x += player.speed*.24
            })
        }
    }

    // platform collision detection

    platforms.forEach(platform => {
    if (
        player.position.y + player.height <= platform.position.y &&
        player.position.y + player.height + player.velocity.y >= platform.position.y &&
        player.position.x + player.width >= platform.position.x &&
        player.position.x <= platform.position.x + platform.width) {
        player.velocity.y = 0
    }
})

    // sprite switching

    if (
        keys.right.pressed &&
        lastKey === 'right' && player.currentSprite !==
    player.sprites.run.right) {
        player.frames = 1
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (
        keys.left.pressed &&
        lastKey === 'left' && player.currentSprite !== player.sprites.run.left
        ) {
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (
        !keys.left.pressed &&
        lastKey === 'left' && player.currentSprite !== player.sprites.stand.left
        ) {
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    } else if (
        !keys.right.pressed &&
        lastKey === 'right' && player.currentSprite !== player.sprites.stand.right
        ) {
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }


    // win condition

    if (scrollOffset > 9260) {
        console.log('aye nice job bud')
    }

    // lose condition

    if (player.position.y > canvas.height) {
        console.log('ruh roh')
        init()
    }
}

init()
animate()

addEventListener('keydown', ({ key }) => {
    switch (key) {

        case 'a':
            console.log('<-')
            keys.left.pressed = true
            lastKey = 'left'
            break

        case 'w':
            console.log('^')
            keys.up.pressed = true
            player.velocity.y -= 25
            break
            
        case ' ':
            console.log('^')
            keys.up.pressed = true
            player.velocity.y -= 25
            break

        case 's':
            console.log('wee')
            break

        case 'd':
            console.log('->')
            keys.right.pressed = true
            lastKey = 'right'
            break
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {

        case 'a':
            console.log('<-')
            keys.left.pressed = false
            break

        case 'w':
            console.log('^')
            keys.up.pressed = false
            break

        case ' ':
            console.log('^')
            keys.up.pressed = false
            break

        case 's':
            console.log('wee')
            break

        case 'd':
            console.log('->')
            keys.right.pressed = false
            break
    }
})

if (typeof document !== 'undefined') {
   let element = document.querySelector('.class-name')
