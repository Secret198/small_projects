const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 500;


function Paddle(x, y, width, height, velocity){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = velocity;

    this.draw = () =>{
        c.fillStyle = 'white';
        c.fillRect(this.x, this.y, this.width, this.height);
    }

    this.update = () =>{
        if(this.y <= 0){
            this.y = 1;
        }
        else if (this.y + this.height >= canvas.height){
            this.y = canvas.height - this.height - 1;
        }
        this.y += this.velocity;
        
        this.draw();
    }
}

let random = [-1, 1];

function Ball(x, y, velx, vely, radius){
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
    this.radius = radius;
    // this.color = 'rgb('+Math.floor(Math.random()*255)+', '+Math.floor(Math.random()*255)+', '+Math.floor(Math.random()*255)+')';

    this.draw = () =>{ 
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = 'white';
        c.fillStyle = 'white';
        c.fill();
        c.stroke();
    }

    this.update = () =>{
        this.x += this.velx;
        this.y += this.vely;

        if(this.x <= 0 + this.radius || this.x >= canvas.width - this.radius){
            this.velx = - this.velx;
        }
        if(this.y <= 0 + radius || this.y >= canvas.height - this.radius){
            this.vely = - this.vely;
        }

        this.draw();
    }
}

class Particle{
    constructor(x, y, velx, vely, radius){
        this.x = x;
        this.y = y;
        this.velx = velx;
        this.vely = vely;
        this.radius = radius;
        // this.color = "rgba(255, 255, 255, 1)";
        // this.alpha = 1;
    }

    draw(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = "rgba(255, 255, 255, 1)";
        c.fill();
    }

    update(){
        this.x += this.velx;
        this.y += this.vely;
        this.draw();
    }
}

const player = new Paddle(canvas.width - 100, canvas.height / 2, 20, 100, 0);
const ball = new Ball(canvas.width /2, canvas.height / 2, 5 * random[Math.floor(Math.random() * 2)], 5 * random[Math.floor(Math.random() * 2)], 15);
const opponent = new Paddle(50, canvas.height / 2, 20, 100, 0);


//GameMode
let singlePlayer = false;
const single = document.getElementById('single');
const double = document.getElementById('double');
const modeUI = document.getElementById('gameMode');

single.addEventListener('click', () =>{
    modeUI.style.display = 'none';
    singlePlayer = true;
    setTimeout(() => {
        main();
    }, 1000);
})

double.addEventListener('click', () => {
    modeUI.style.display = 'none';
    setTimeout(() => {
        main();
    }, 1000);
})

//Player1 movement
let playerVel = 8

window.addEventListener('keydown', (e) =>{
    if(e.key == 'ArrowUp' && player.y >= 0){
        player.velocity = - playerVel;
    }
    else if(e.key == 'ArrowDown' && player.y <= canvas.height){
        player.velocity = playerVel;
    }
})

window.addEventListener('keyup', (e) =>{
    if(e.key == 'ArrowUp' || e.key == 'ArrowDown'){
        player.velocity = 0;
    }
})

let score = {
    player: 0,
    ai: 0
}

function aiScore(aiScore){
    c.font = '80px arcade';
    c.fillStyle = 'white';
    c.fillText(aiScore, canvas.width / 4, canvas.height / 4);
}

function playerScore(playerScore){
    c.font = '80px arcade';
    c.fillStyle = 'white';
    c.fillText(playerScore, canvas.width / 4 * 3, canvas.height / 4);
}

function gameOver(text){
    const winText = document.getElementById('gOtext');
    const UI = document.getElementById('gameOver');
    UI.style.display = 'flex';
    winText.innerHTML = text;

    ball.velx = 0;
    ball.vely = 0;

    const button = document.getElementById('restart');
    button.addEventListener('click', ()=>{
        window.location.reload();
    })
}



function main(){
    window.requestAnimationFrame(main);
    c.clearRect(0, 0, canvas.width, canvas.height);
    ball.update();
    player.update();
    opponent.update();

    //Opponent movement

    let ovel = 8;
    if(singlePlayer == false){
        window.addEventListener('keydown', (e) =>{
            if(e.key == 'w' && opponent.y >= 0){
                opponent.velocity = - ovel;
            }
            else if(e.key == 's' && player.y <= canvas.height){
                opponent.velocity = ovel;
            }
        })
        
        window.addEventListener('keyup', (e) =>{
            if(e.key == 'w' || e.key == 's'){
                opponent.velocity = 0;
            }
        })
    }
    else{
        if(ball.y > opponent.height / 2 && ball.y < canvas.height - opponent.height / 2){
            if(opponent.y + opponent.height / 2 > ball.y){
                opponent.y -= ovel;
            }
            else{
                opponent.y += ovel;
            }
        }
    }
    
    let particles = [];

    //Speed changing
    if(ball.x + ball.radius >= player.x && ball.y >= player.y && ball.y < player.y + player.height){
        ball.velx = 10;
        
        if(ball.y < player.y + player.height / 2){
            if(ball.vely < 0){
                ball.velx = -ball.velx + Math.floor((player.y + player.height / 2 - ball.y) / 20);
                for(i=0;i<10;i++){
                    particles.push(new Particle(player.x, player.y, Math.floor(Math.random) * 10 * random[Math.floor(Math.random()*2)], Math.floor(Math.random) * 10 * random[Math.floor(Math.random()*2)], 10));
                    particles[i].update();
                }
            }
            else{
                ball.velx = -ball.velx - Math.floor((player.y + player.height / 2 - ball.y) / 20);
                ball.vely--;
            }
        }
        else{
            if(ball.vely > 0){
                ball.velx = -ball.velx + Math.floor((ball.y - (player.y + player.height / 2)) / 20);
            }
            else{
                ball.velx = -ball.velx - Math.floor((ball.y - (player.y + player.height / 2)) / 20);
                ball.vely++;
                
            }
        }
    }

    if(ball.x - ball.radius <= opponent.x + opponent.width && ball.y >= opponent.y && ball.y < opponent.y + opponent.height){
        ball.velx = -ball.velx;
        if(ball.vely > 0){
            ball.vely = 10;
        }
        else{
           ball.vely = -10; 
        }
    }

    //Score
    if(ball.x - ball.radius < opponent.x + opponent.width / 2){
        score.player++;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.velx = 0;
        ball.vely = 0;
        player.y = canvas.height / 2 - player.height / 2;

        setTimeout(() => {
            ball.velx = 5 * random[Math.floor(Math.random() * 2)];
            ball.vely = 5 * random[Math.floor(Math.random() * 2)];
            if (singlePlayer == false){
                opponent.y = canvas.height / 2 - opponent.height / 2;
            } 
        }, 1000);
        
    }
    if(ball.x + ball.radius >= player.x + player.width / 2){
        score.ai++;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.velx = 0;
        ball.vely = 0;
        player.y = canvas.height / 2 - player.height / 2;
        setTimeout(() => {
            ball.velx = 5 * random[Math.floor(Math.random() * 2)];
            ball.vely = 5 * random[Math.floor(Math.random() * 2)];
            opponent.y = canvas.height / 2 - opponent.height / 2;
            if (singlePlayer == false){
                opponent.y = canvas.height / 2 - opponent.height / 2;
            }
        }, 1000);
        
    }

    if(score.ai == 10){
        if(singlePlayer == true){
            gameOver('You lost');
        }
        else{
            gameOver('Player 2 won');
        }
    }

    if(score.player == 10){
        if(singlePlayer == true){
            gameOver('You won');
        }
        else{
            gameOver('Player 1 won')
        }
    }

    aiScore(score.ai);
    playerScore(score.player);
}

// main();