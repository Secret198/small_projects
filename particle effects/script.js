const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let speedMultiplier = 5;
let trailBallCount = 10;
let clickBallCount = 30;

class Ball{
    constructor(x, y, dx, dy, colour, radius){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.colour = colour;
        this.radius = radius;
    }

    draw(){
        c.beginPath();
        c.strokeStyle = this.colour;
        c.fillStyle = this.colour;
        c.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
        c.stroke();
        c.fill();
    }

    move(){
        this.x += this.dx;
        this.y += this.dy;
        if(this.radius > 0){
            this.radius-=0.5;
        }
        this.draw();
    }
}

function GetRandom(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function GetColour(r, g, b){
    return "rgb("+r+", "+g+", "+b+")";
}

function CircularExplosionTrail(e){
    for(let i = 0; i < trailBallCount;i++){
        balls.push(new Ball(e.clientX, e.clientY, Math.sin(i*(Math.PI*2/trailBallCount))*speedMultiplier, Math.cos(i*(Math.PI*2/trailBallCount))*speedMultiplier, GetColour(50, 125, 168), GetRandom(10, 20)));
    } 
}

let prevPosition = {
    x : undefined,
    y : undefined
}

function TraliBehind(e){
    for(let i = 0;i<trailBallCount;i++){
        if(prevPosition.x == undefined){
            prevPosition.x = e.clientX;
            prevPosition.y = e.clientY;
        }else{
            let dist = Math.sqrt(Math.pow(e.clientX - prevPosition.x, 2) + Math.pow(e.clientY - prevPosition.y, 2));
            let x = (e.clientX - prevPosition.x) / dist;
            let y = (e.clientY - prevPosition.y) / dist;

            let dx;
            let dy;

            // if(e.clientX < prevPosition.x){
            //     dx = Math.cos(Math.acos(x) + i*(Math.PI/2/trailBallCount)) * speedMultiplier;
            // }else{
            //     dx = Math.cos(Math.acos(x) + Math.PI*2-2*Math.acos(x) + i*(Math.PI/2/trailBallCount)) * speedMultiplier;
            // }
            // if(e.clientY < prevPosition.y){
            //     dy = Math.sin(Math.asin(y) + i*(Math.PI/2/trailBallCount)) * speedMultiplier;
            // }else{
            //     dy = Math.sin(Math.asin(y) + Math.PI*2-2*Math.asin(y) + i*(Math.PI/2/trailBallCount)) * speedMultiplier;
            // }

            dx = Math.cos(Math.acos(x) + i*(Math.PI/2/trailBallCount)) * speedMultiplier;
            dy = Math.sin(Math.asin(y) + i*(Math.PI/2/trailBallCount)) * speedMultiplier;
            balls.push(new Ball(e.clientX, e.clientY, dx, dy, GetColour(50, 125, 168), GetRandom(10, 20)));
        }

        prevPosition.x = e.clientX;
        prevPosition.y = e.clientY;
    }

}

let balls = Array();
window.addEventListener("mousemove", (e) => TraliBehind(e));

window.addEventListener("click", (e) =>{
    for(let i = 0; i < clickBallCount;i++){
        balls.push(new Ball(e.clientX, e.clientY, Math.sin(i*(Math.PI*2/clickBallCount))*speedMultiplier, Math.cos(i*(Math.PI*2/clickBallCount))*speedMultiplier, GetColour(125, 50, 168), GetRandom(10, 20)));
    }  
})

window.addEventListener("resize", () =>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

function main(){
    
    window.requestAnimationFrame(main);
    c.fillStyle = "rgba(21, 22, 59, 0.5)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    for(let i = 0;i<balls.length;i++){
        if(balls.length > 0){
            balls[i].move();

        }
        if(balls[i].radius <= 0){
            balls.splice(i, 1);
        }
    }
    
    
}
window.requestAnimationFrame(main);