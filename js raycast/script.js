const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
canvas.width = 1600;
canvas.height = 900;

const canvas2 = document.getElementById("canvas2");
const c2 = canvas2.getContext("2d");
canvas2.width = 1600;
canvas2.height = 900;

class Obstacle{
    constructor(x1, y1, x2, y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    draw(){
        c.beginPath();
        c.moveTo(this.x1, this.y1);
        c.lineTo(this.x2, this.y2);
        c.strokeStyle = 'black'
        c.stroke()
    }
}

class Ray{
    constructor(x1, y1, x2, y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    draw(x, y){
        c.beginPath();
        c.moveTo(this.x1, this.y1);
        c.lineTo(x, y);
        c.strokeStyle = "yellow"
        c.stroke();
    }

    cast(obstacles){
        let point = {x: -1, y: -1}
        let distance;
        for(let i = 0; i<obstacles.length;i++){
            let x3 = obstacles[i].x1;
            let y3 = obstacles[i].y1;
            let x4 = obstacles[i].x2;
            let y4 = obstacles[i].y2;

            let t = ((this.x1-x3)*(y3-y4)-(this.y1-y3)*(x3-x4))/((this.x1-this.x2)*(y3-y4)-(this.y1-this.y2)*(x3-x4));
        
            let u = ((this.x1-x3)*(this.y1-this.y2)-(this.y1-y3)*(this.x1-this.x2))/((this.x1-this.x2)*(y3-y4)-(this.y1-this.y2)*(x3-x4));

            let temp

            if(u >= 0 && u <= 1 && t >= 0){
                temp = {x: this.x1 + t*(this.x2-this.x1), y:this.y1+t*(this.y2-this.y1)}
                if(distance == undefined || Math.sqrt(Math.pow(temp.x - this.x1, 2)+Math.pow(temp.y - this.y1, 2)) < distance){
                    distance = Math.sqrt(Math.pow(temp.x - this.x1, 2)+Math.pow(temp.y - this.y1, 2))
                    point = temp
                }
            }
        }
        return [point, distance];
    }
}


let obstacles = [
    new Obstacle(40, 90, 100, 250),
    new Obstacle(1200, 50, 1200, 850),
    new Obstacle(320, 400, 1460, 344),
    new Obstacle(1368, 800, 308, 704),
    new Obstacle(600, 300, 400, 500),

    new Obstacle(0, 0, canvas2.width, 0),
    new Obstacle(canvas.width, 0, canvas2.width, canvas2.height),
    new Obstacle(0, 0, 0, canvas2.height),
    new Obstacle(0, canvas.height, canvas.width, canvas2.height),
]

//Setup
const fov = 60
const rayNumber = 100;
const angle = fov/rayNumber;
let rays = []
for(let i = 0;i<fov;i+=angle){
    rays.push(new Ray(canvas.width/2, canvas.height/2, canvas.width/2+Math.cos(i*Math.PI/180), canvas.height/2+Math.sin(i*Math.PI/180)))
}

//Movement
//Mouse
canvas2.addEventListener('mousemove', (event) =>{
    let currentX = event.clientX-canvas2.offsetLeft
    let move = 0;

    for(j = 0;j<currentX;j++){
        if(currentX < 0){
            move--;
        }
        else{
            move++;
        }
        for(let i = 0;i<rays.length;i++){
            rays[i].x2 = rays[i].x1 + Math.cos((i*angle+move)*Math.PI/180);
            rays[i].y2 = rays[i].y1 + Math.sin((i*angle+move)*Math.PI/180);
        }
    }
})

const speed = 5

//Keyboard
window.addEventListener("keypress", (e) =>{
    let distanceX = (rays[rays.length/2].x2-rays[rays.length/2].x1)*speed
    let distanceY = (rays[rays.length/2].y2-rays[rays.length/2].y1)*speed

    let horDistX = ((rays[rays.length/2].y2-rays[rays.length/2].y1)*-1)*speed
    let horDistY = (rays[rays.length/2].x2-rays[rays.length/2].x1)*speed
    for(let i = 0;i<rays.length;i++){
        switch(e.keyCode){
            case 119:       //w
                rays[i].x1 += distanceX
                rays[i].y1 += distanceY
                rays[i].x2 += distanceX
                rays[i].y2 += distanceY
                break;
            case 97:        //a
                rays[i].x1 += horDistX*-1
                rays[i].y1 += horDistY*-1
                rays[i].x2 += horDistX*-1
                rays[i].y2 += horDistY*-1
                break;
            case 115:       //s
                rays[i].x1 += distanceX*-1
                rays[i].y1 += distanceY*-1
                rays[i].x2 += distanceX*-1
                rays[i].y2 += distanceY*-1
                break;
            case 100:       //d
                rays[i].x1 += horDistX
                rays[i].y1 += horDistY
                rays[i].x2 += horDistX
                rays[i].y2 += horDistY
                break;
        }
    }
    
})

function raytrace(dist, i){
    c2.fillStyle = "black";
    c2.fillRect(canvas2.width/rayNumber*i, 0, canvas2.width/rayNumber, dist/3);
    c2.fill();

    let value = 255/dist*100
    c2.fillStyle = "rgb("+value+", "+value+", "+value+")"
    c2.fillRect(canvas2.width/rayNumber*i, dist/3, canvas2.width/rayNumber, canvas2.height-dist/3*2);
    c2.fill();

    c2.fillStyle = "black";
    c2.fillRect(canvas2.width/rayNumber*i, canvas2.height-dist/3, canvas2.width/rayNumber, dist/3);
    c2.fill();
}

function main(){
    window.requestAnimationFrame(main);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c2.clearRect(0, 0, canvas2.width, canvas2.height);

    for(let i = 0;i<obstacles.length;i++){
        obstacles[i].draw();
    }


    for(let i = 0;i < rays.length;i++){
        let point = rays[i].cast(obstacles)[0];
        let dist;
        let alpha;
        if(i < rays.length/2){                                                     
            alpha = angle*(rays.length/2-i)*Math.PI/180;
            dist = Math.cos(alpha)*rays[i].cast(obstacles)[1]
        }
        else if(i > rays.length/2){
            alpha = angle*(i-rays.length/2)*Math.PI/180;
            dist = Math.cos(alpha)*rays[i].cast(obstacles)[1]
        }
        else{
            dist = rays[i].cast(obstacles)[1];
        }
        raytrace(Math.abs(dist), i)
        if(point.x != -1){
            rays[i].draw(point.x, point.y);
        }
        else{
            rays[i].draw(rays[i].x1+((rays[i].x2-rays[i].x1)*1000), rays[i].y1+((rays[i].y2-rays[i].y1)*1000))
        }
    }

}
main()