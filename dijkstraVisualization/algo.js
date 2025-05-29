const canvas = document.getElementById("canvas")
const c = canvas.getContext('2d')

canvas.width = 1200
canvas.height = 600

const xCellCount = 20
const yCellCount = 10

const cellWidth = canvas.width / xCellCount
const cellHeight = canvas.height / yCellCount


const startButton = document.getElementById("start")
const wallDone = document.getElementById("wall")
const startDone = document.getElementById("startPoint")
const endDone = document.getElementById("endPoint")
const utasitas = document.getElementsByClassName("utasitas")[0]

const controls = document.getElementsByClassName("controls")[0]

function ShowButton(button){
    startButton.style.display = "none"
    wallDone.style.display = "none"
    startDone.style.display = "none"
    endDone.style.display = "none"

    button.style.display = "block"
}

ShowButton(startButton)

let mode = 0

startButton.addEventListener("click", () =>{
    mode = 1
    ShowButton(wallDone) 
    utasitas.innerText = "Jelölje be a falakat majd kattintson a kész gombra!"
})

wallDone.addEventListener("click", () =>{
    mode = 2
    ShowButton(startDone)
    GenerateGraph(walls)
    utasitas.innerText = "Jelölje be a start pozíciót, és kattintson a kész gombra!"
})
startDone.addEventListener("click", () =>{
    mode = 3
    ShowButton(endDone)    
    utasitas.innerText = "Jelölje be a vég pozíciót, és kattintson a kész gombra!"
})

endDone.addEventListener("click", () =>{
    Init()
    utasitas.innerText = "Útvonal keresése!"
    endDone.style.display = "none"
    window.requestAnimationFrame(DrawFrames)   
})

// let graph = Array(yCellCount)

// for(let i = 0;i<yCellCount;i++){
//     graph[i] = Array(xCellCount)
// }


//Test data and functions
// let graph = [
//     [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
//     [false, true, true, true, true, true, true, true, true ,true ,true, true, false, true, true, true, true, true, true, true ,true ,false],
//     [false, true, true, true, true, true, true, true, true ,true ,true, true, false, true, true, true, true, true, true, true ,true ,false],
//     [false, true, true, true, true, true, true, true, true ,true ,true, true, false, true, true, true, true, true, true, true ,true ,false],
//     [false, true, true, true, true, true, true, true, true ,true ,false, false, false, true, true, true, true, true, true, true ,true ,false],
//     [false, true, true, true, true, true, true, true, true ,true ,true, true, false, true, true, true, true, true, true, true ,true ,false],
//     [false, true, true, true, true, true, true, true, true ,true ,true, true, false, true, true, true, true, true, true, true ,true ,false],
//     [false, true, true, true, true, true, true, true, true ,true ,true, true, false, true, true, true, true, true, true, true ,true ,false],
//     [false, true, true, true, true, true, true, true, true ,true ,true, true, false, true, true, true, true, true, true, true ,true ,false],
//     [false, true, true, true, true, true, true, true, true ,true ,true, true, false, true, true, true, true, true, true, true ,true ,false],
//     [false, true, true, true, true, true, true, true, true ,true ,true, true, true, true, true, true, true, true, true, true ,true ,false],
//     [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
// ]

let startPos = {
    i: 0,
    j: 0
}

let endPoint = {
    i: 0,
    j: 0  
}

let graph = []

function ViewPath(route){
    for(let i = 1;i<graph.length;i++){
        for(let j = 1;j<graph[0].length;j++){
            if(!graph[i][j]){
                c.beginPath()
                c.fillStyle = "red"
                c.fillRect(canvas.width / xCellCount * (j-1), canvas.height / yCellCount * (i-1), cellWidth, cellHeight)
                c.fill()
            }
        }
    }
    for(let i = 0;i<route.length;i++){
        c.beginPath()
        c.fillStyle = "blue"
        c.fillRect(canvas.width / xCellCount * (route[i].j-1), canvas.height / yCellCount * (route[i].i - 1), cellWidth, cellHeight)
        c.fill()
    }
}

function GenerateGraph(walls){
   
    graph.push(Array(xCellCount+2).fill(false))
   
    for(let i = 0;i<yCellCount;i++){
        graph.push(Array(xCellCount+2).fill(false))
        for(let j = 1;j<=xCellCount;j++){
            if(NotVisited(i, j-1, walls)){
                graph[i+1][j] = true
            }
        }
    }
    graph.push(Array(xCellCount+2).fill(false))
 
}

function Grid(){
    for(let i = 1;i<xCellCount;i++){
        c.beginPath();
        c.moveTo(i*cellWidth, 0)
        c.lineTo(i*cellWidth, canvas.height)
        c.stroke()

        c.beginPath()
        c.moveTo(0, i*cellHeight)
        c.lineTo(canvas.width, i*cellHeight)
        c.stroke()
    }
}

Grid()



let isFinished = false

function DrawFrames(){
    
    Dijktstra()
    c.clearRect(0, 0, canvas.width, canvas.height)
    Grid()
    //Draw walls
    for(let i = 1;i<graph.length;i++){
        for(let j = 1;j<graph[0].length;j++){
            if(!graph[i][j]){
                c.beginPath()
                c.fillStyle = "black"
                c.fillRect(canvas.width / xCellCount * (j-1), canvas.height / yCellCount * (i-1), cellWidth, cellHeight)
                c.fill()
            }
        }
    }

    

    //Draw search
    for(let i = 0;i<discovered.length;i++){
        if(NotVisited(discovered[i].i, discovered[i].j, visited)){
            c.beginPath()
            c.fillStyle = "pink"
            c.fillRect(canvas.width / xCellCount * (discovered[i].j-1), canvas.height / yCellCount * (discovered[i].i-1), cellWidth, cellHeight)
            c.fill()
        }else{
            c.beginPath()
            c.fillStyle = "red"
            c.fillRect(canvas.width / xCellCount * (discovered[i].j-1), canvas.height / yCellCount * (discovered[i].i-1), cellWidth, cellHeight)
            c.fill()
        }
    } 

    //Draw path
    for(let i = 0;i<route.length;i++){
        c.beginPath()
        c.fillStyle = "yellow"
        c.fillRect(canvas.width / xCellCount * (route[i].j-1), canvas.height / yCellCount * (route[i].i - 1), cellWidth, cellHeight)
        c.fill()
    }

    //Draw start + end
    c.beginPath()
    c.fillStyle = "green"
    c.fillRect(canvas.width / xCellCount * (startPos.j-1), canvas.height / yCellCount * (startPos.i-1), cellWidth, cellHeight)
    c.fill()
    
    c.beginPath()
    c.fillStyle = "blue"
    c.fillRect(canvas.width / xCellCount * (endPoint.j-1), canvas.height / yCellCount * (endPoint.i-1), cellWidth, cellHeight)
    c.fill()

    let reqId

    if(!isFinished){
        reqId = window.requestAnimationFrame(DrawFrames)
    }else{
        window.cancelAnimationFrame(reqId)
    }
}

// window.requestAnimationFrame(DrawFrames)

//Functionality

function NotVisited(nodeI, nodeJ, visited){
    for(let i = 0;i<visited.length;i++){
        if(visited[i].i == nodeI && visited[i].j == nodeJ){
            return false
        }
    }
    return true
}

function NotDiscovered(nodeI, nodeJ, discovered){
    for(let i = 0;i<discovered.length;i++){
        if(discovered[i].i == nodeI && discovered[i].j == nodeJ){
            return i;
        }
    }
    return -1
}


let visited = []          
let discovered = []
let done = false


let currentNode = {}

let route = []
let routeNode = {}



function Init(){
    discovered.push({i:startPos.i, j:startPos.j, cost:0})
    visited.push({i:startPos.i, j:startPos.j})

    currentNode = {i: startPos.i, j:startPos.j, cost:0}
    routeNode = {i:endPoint.i, j:endPoint.j}
    route.push(routeNode)
    console.log(route)
}

function Dijktstra(){
    //Find cost of every node until end is found
   
    if(!done){
        for(let i = -1;i<=1;i++){
            for(let j = -1;j<=1;j++){
                if(i != 0 || j != 0){
                    if(graph[currentNode.i + i][currentNode.j + j] && NotVisited(currentNode.i + i, currentNode.j + j, visited)&& NotDiscovered(currentNode.i + i, currentNode.j + j, discovered) == -1){
                        discovered.push({i: currentNode.i+i, j: currentNode.j+j, cost: currentNode.cost+ Math.sqrt(Math.abs(i) + Math.abs(j))})
                    }else if(graph[currentNode.i + i][currentNode.j + j] && NotVisited(currentNode.i + i, currentNode.j + j, visited)){
                        let child = NotDiscovered(currentNode.i + i, currentNode.j + j, discovered) 
                    
                        if(discovered[child].cost < currentNode.cost + Math.sqrt(Math.abs(i) + Math.abs(j))){
                            discovered[child].cost = currentNode.cost + Math.sqrt(Math.abs(i) + Math.abs(j))
                        }
                    }
                    if(currentNode.i + i == endPoint.i && currentNode.j + j == endPoint.j){
                        done = true
                       
                    }
                }
            }
        }
        let min = {
            i: undefined,
            j: undefined,
            cost: undefined
        }
      
        for(let i = 0;i<discovered.length;i++){
            if((min.i == undefined || discovered[i].cost < min.cost) && NotVisited(discovered[i].i, discovered[i].j, visited)){
                min = discovered[i]
            }
        }
        currentNode = min
        visited.push({i: currentNode.i, j:currentNode.j})

    }
    else{
        console.log(discovered)
        while(routeNode.i != startPos.i || routeNode.j != startPos.j){
            let minCost = undefined
            let minIndex = undefined
            for(let i = -1;i<=1;i++){
                for(let j = -1;j<=1;j++){
                    if(i != 0 || j != 0){
                        let discoveredIndex = NotDiscovered(routeNode.i + i, routeNode.j + j, discovered)
                        if(discoveredIndex != -1){
                            if(minCost == undefined || discovered[discoveredIndex].cost < minCost){
                                minCost = discovered[discoveredIndex].cost
                                minIndex = discoveredIndex
                            }
                        }
                    }
            
                }
            }
            route.push({i:discovered[minIndex].i, j:discovered[minIndex].j})
            routeNode = {i:discovered[minIndex].i, j:discovered[minIndex].j}
        }
        isFinished = true
    }
  //  ViewPath(route)
}
 
// function Dijktstra(start, end){ //Szétszedni hogy lehessen animálni
//     let visited = []
//     let discovered = []
//     let done = false

//     discovered.push({i:start.i, j:start.j, cost:0})
//     visited.push({i:start.i, j:start.j})
//     let currentNode = {i: start.i, j: start.j, cost: 0}

//     //Find cost of every node until end is found
//     while(visited.length < (graph.length * graph[0].length) && !done){
//         for(let i = -1;i<=1;i++){
//             for(let j = -1;j<=1;j++){
//                 if(i != 0 || j != 0){
//                     if(graph[currentNode.i + i][currentNode.j + j] && NotVisited(currentNode.i + i, currentNode.j + j, visited)&& NotDiscovered(currentNode.i + i, currentNode.j + j, discovered) == -1){
//                         discovered.push({i: currentNode.i+i, j: currentNode.j+j, cost: currentNode.cost+1})
//                     }else if(graph[currentNode.i + i][currentNode.j + j] && NotVisited(currentNode.i + i, currentNode.j + j, visited)){
//                         let child = NotDiscovered(currentNode.i + i, currentNode.j + j, discovered) 
                    
//                         if(discovered[child].cost < currentNode.cost + 1){
//                             discovered[child].cost = currentNode.cost + 1
//                         }
//                     }
//                     if(currentNode.i + i == end.i && currentNode.j + j == end.j){
//                         done = true
//                     }
//                 }
//             }
//         }
//         let min = {
//             i: undefined,
//             j: undefined,
//             cost: undefined
//         }
      
//         for(let i = 0;i<discovered.length;i++){
//             if((min.i == undefined || discovered[i].cost < min.cost) && NotVisited(discovered[i].i, discovered[i].j, visited)){
//                 min = discovered[i]
//             }
//         }
//         currentNode = min
//         visited.push({i: currentNode.i, j:currentNode.j})
//         window.requestAnimationFrame(DrawFrames)
//     }
   
//     //Find the path with lowest cost
//     let route = []
//     let routeNode = {i: end.i, j: end.j}

//     route.push(routeNode)

//     while(routeNode.i != start.i || routeNode.j != start.j){
//         let minCost = undefined
//         let minIndex = undefined
//         for(let i = -1;i<=1;i++){
//             for(let j = -1;j<=1;j++){
//                 if(i != 0 || j != 0){
//                     let discoveredIndex = NotDiscovered(routeNode.i + i, routeNode.j + j, discovered)
//                     if(discoveredIndex != -1){
//                         if(minCost == undefined || discovered[discoveredIndex].cost < minCost){
//                             minCost = discovered[discoveredIndex].cost
//                             minIndex = discoveredIndex
//                         }
//                     }
//                 }
            
//             }
//         }
//         route.push({i:discovered[minIndex].i, j:discovered[minIndex].j})
//         routeNode = {i:discovered[minIndex].i, j:discovered[minIndex].j}
//     }

    
//   //  ViewPath(route)
// }


let mousePos = {
    x: 0,
    y: 0
}
let prevStart = {
    x: -1,
    y: -1,
    i: -1,
    j: -1
}

let prevEnd = {
    x: -1,
    y: -1,
    i: -1,
    j: -1
}



let walls = []

canvas.addEventListener("click", (e) =>{
    switch(mode){
        case 1:
            mousePos.x = e.x-canvas.offsetLeft+(canvas.width/2)
            mousePos.y = e.y-canvas.offsetTop 
            c.beginPath()
            c.fillStyle = "black"
            const xPos = mousePos.x - (mousePos.x % cellWidth) 
            const yPos = mousePos.y - (mousePos.y % cellHeight)
            walls.push({i: yPos / cellHeight, j: xPos / cellWidth})
            c.fillRect(xPos, yPos, cellWidth, cellHeight)
            c.fill()
            break
        case 2:
            if(prevStart.x == -1){
                mousePos.x = e.x-canvas.offsetLeft+(canvas.width/2)
                mousePos.y = e.y-canvas.offsetTop
                c.beginPath()
                c.fillStyle = "green"
                let cellX = mousePos.x - (mousePos.x % cellWidth) 
                let cellY = mousePos.y - (mousePos.y % cellHeight)
                c.fillRect(cellX, cellY, cellWidth, cellHeight)
                c.fill()   
                startPos.i = Math.floor(mousePos.y / cellHeight)+1
                startPos.j = Math.floor(mousePos.x / cellWidth)+1
                prevStart.x = cellX
                prevStart.y = cellY
                prevStart.i = Math.floor(mousePos.y / cellHeight)
                prevStart.j = Math.floor(mousePos.x / cellWidth)
            }
            break
        case 3:
            if(prevEnd.x == -1){
                mousePos.x = e.x-canvas.offsetLeft+(canvas.width/2)
                mousePos.y = e.y-canvas.offsetTop
                c.beginPath()
                c.fillStyle = "blue"
                let cellX = mousePos.x - (mousePos.x % cellWidth) 
                let cellY = mousePos.y - (mousePos.y % cellHeight)
                c.fillRect(cellX, cellY, cellWidth, cellHeight)
                c.fill()
                endPoint.i = Math.floor(mousePos.y / cellHeight)+1
                endPoint.j = Math.floor(mousePos.x / cellWidth)+1
                prevEnd.x = cellX
                prevEnd.y = cellY
                prevEnd.i = Math.floor(mousePos.y / cellHeight)
                prevEnd.j = Math.floor(mousePos.x / cellWidth)
            }
            break
        }
    
})