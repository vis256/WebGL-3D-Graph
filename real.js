let id = 0;
var graphNodes = [];
let canvasSize = {x: 0, y: 0};
// class node {
//     constructor(val, color, position, connectedTo) {
//         this.id = id++;
//         this.val = val;
//         this.color = color;
//         this.position = position;
//         this.connectedTo = connectedTo;
//     }
// }


//     y
//     |
//     |
//     z-- --x

let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2;
const scene = new THREE.Scene();


function init() {
    // var x = new node(5, "#ffab33", new THREE.Vector3(9,0,0), []);
    // var y = new node(15, "#0455cd", new THREE.Vector3(0,0,0), []);
    // x.connectedTo.push(y);
    graphNodes.push( new node(5, "#ffab33", new THREE.Vector3(9,0,0), []) );
    graphNodes.push( new node(15, "#0455cd", new THREE.Vector3(0,0,0), []) );
    graphNodes.push( new node(15, "#0995cd", new THREE.Vector3(4,5,0), []) );
}

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

function randomColor() {
    return '#' + genRanHex(6);
}

function addDefaultNode() {
    graphNodes.push( new node(5, randomColor(), new THREE.Vector3(0, 0 ,0), []) );
}

function makeNewNode(color, x, size) {
    const geometry = new THREE.SphereGeometry(0.5, 8, 8);
    const material = new THREE.MeshBasicMaterial( { color: color } );
    const sphere = new THREE.Mesh(geometry, material);

    scene.add(sphere);

    // create tooltip
    const tooltip = document.createElement('div');
    const nodeValElem = document.createElement('p');
    nodeValElem.innerText = x;

    tooltip.classList = "tooltip d-flex flex-column";
    tooltip.id = id;

    const connElemUl = document.createElement('p');
    connElemUl.id = `${id}-li`;
    connElemUl.innerText = '-> ';
    tooltip.appendChild(nodeValElem);
    tooltip.appendChild(connElemUl);

    document.body.appendChild(tooltip);

    return {id: id++, elem: sphere, tooltip: tooltip, conn: [], val: x};
}

// function addEdge(x, y) {
//     let xnode = graphNodes.filter(
//         function valid(elem) { return elem.id == x; }
//     )[0];
//     let ynode = graphNodes.filter(
//         function valid(elem) { return elem.id == y; }
//     )[0];
//     xnode.connectedTo.push(ynode);
//     ynode.connectedTo.push(xnode);
// }

function addEdge(x, y) {
    graphNodes[x].conn.push(y);
    graphNodes[y].conn.push(x);
    document.getElementById(`${x}-li`).innerText += `${graphNodes[y].val}, `;
    document.getElementById(`${y}-li`).innerText += `${graphNodes[x].val}, `;
}


// init();
// addDefaultNode();
// addDefaultNode();
// addDefaultNode();
// addDefaultNode();
// addDefaultNode();
// addDefaultNode();
// addDefaultNode();
// addDefaultNode();
// addDefaultNode();
graphNodes.push( makeNewNode(randomColor(), 5, 10) );
graphNodes.push( makeNewNode(randomColor(), 15, 10) );
graphNodes.push( makeNewNode(randomColor(), 54, 10) );
graphNodes.push( makeNewNode(randomColor(), 2, 10) );
graphNodes.push( makeNewNode(randomColor(), 0, 10) );
graphNodes.push( makeNewNode(randomColor(), -5, 10) );
graphNodes.push( makeNewNode(randomColor(), 51, 10) );
graphNodes.push( makeNewNode(randomColor(), 15, 10) );
graphNodes.push( makeNewNode(randomColor(), 12, 10) );
addEdge(0, 1);
addEdge(0, 2);
addEdge(2, 1);
addEdge(3, 1);
addEdge(4, 5);
addEdge(7, 8);
addEdge(8, 1);





const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer( { antialias: true } );

const controlsElement = document.querySelector("#controls");



renderer.setSize( window.innerWidth - controlsElement.clientWidth, window.innerHeight - controlsElement.clientWidth);
canvasSize.x =  window.innerWidth - controlsElement.clientWidth;
canvasSize.y = window.innerHeight - controlsElement.clientWidth;
document.body.appendChild( renderer.domElement );

// const geometry = new THREE.SphereGeometry();
// const material = new THREE.MeshBasicMaterial( { color: 0x999999 } );
// var sphere = new THREE.Mesh( geometry, material );

// sphere = new THREE.Mesh( geometry, material );
// scene.add( sphere );
// camera.position.x = 10;

// function renderCylinderInbetweenTwoNodes()

function spreadSpheres() {
    let cycle = 1;
    const cubeHalfLength = 2;
    for (let i = 0; i < graphNodes.length; i++) {
        const sphere = graphNodes[i].elem;
        let sub = i % 8;
        if (sub == 0) cycle++;
        let x, y, z;
        
        if (sub > 3) y = cubeHalfLength;
        else y = -cubeHalfLength;

        // 0 1 /2 /3 4 5 /6 /7
        if (sub < 2 || (sub > 3 && sub < 6)) x = cubeHalfLength;
        else x = -cubeHalfLength;

        if (sub % 2 == 0) z = cubeHalfLength;
        else z = -cubeHalfLength;
        sphere.position.x = x * cycle;
        sphere.position.y = y * cycle;
        sphere.position.z = z * cycle;
        console.log({x: x, y: y, z: z});
    }
}

function createConnectionBetweenSpheres() {
    let connections = [];
    let points = [];
    let fid, sid;
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    for (let i = 0; i < graphNodes.length; i++) {
        const node = graphNodes[i];
        fid = node.id;
        for (let j = 0; j < node.conn.length; j++) {
            points = [];
            sid = node.conn[j];
            points.push( graphNodes[i].elem.position );
            points.push( graphNodes[j].elem.position );
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
            const line = new THREE.Line( geometry, material );
            connections.push(line);
        }
    }

    connections.forEach(conn => {
        scene.add(conn);
    });

}

let INTERSECTED = null;

function animate() {
	requestAnimationFrame( animate );
    // let intersects = raycaster.intersectObjects( scene.children, false );
    // const startId = 10;
    // if (intersects.length > 0) {
    //     // if (INTERSECTED == null) INTERSECTED = intersects[0].object; console.log(INTERSECTED);
    //     if (INTERSECTED != intersects[0].object) {
    //         INTERSECTED = intersects[0].object;
    //         console.log(INTERSECTED);
    //     }
    // }
	renderer.render( scene, camera );
}

var cameraDistToCenter = 10;
var parallelRot = 0;
var perpendicularRot = 0;

// function moveCameraParallel() {
//     console.log("old", camera.position);
//     camera.position.x = cameraDistToCenter * Math.cos(parallelRot * 2 * Math.PI);
//     camera.position.z = cameraDistToCenter * Math.sin(parallelRot * 2 * Math.PI);
// }

// function moveCameraPerpendicular() {
//     console.log("old", camera.position);
//     camera.position.x = cameraDistToCenter * Math.cos(perpendicularRot * 2 * Math.PI);
//     camera.position.y = cameraDistToCenter * Math.sin(perpendicularRot * 2 * Math.PI);
// }

function createDataBoxes() {
    
}

function updateDataBoxesPosition() {
    let tempV = new THREE.Vector3();
    for (let i = 0; i < graphNodes.length; i++) {
        let sphere = graphNodes[i].elem;
        let tooltip = document.getElementById(`${i}`);
        sphere.getWorldPosition(tempV);
        tempV.project(camera);
        
        const x = (tempV.x *  .5 + .5) * canvasSize.x;
        const y = (tempV.y * -.5 + .5) * canvasSize.y;
        // console.log(`TRANSFORM ${x} ${y}`);
        tooltip.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
    }
}


function moveCamera() {
    // console.log("old", camera.position);

    camera.position.x = cameraDistToCenter * Math.sin( parallelRot * (2 * Math.PI) ) * Math.cos(perpendicularRot * (2 * Math.PI));
    camera.position.y = cameraDistToCenter * Math.sin(perpendicularRot * (2 * Math.PI));
    camera.position.z = cameraDistToCenter * Math.cos( parallelRot * (2 * Math.PI) ) * Math.cos(perpendicularRot * (2 * Math.PI));

}

const cameraSpeed = 0.002;
const cameraZoomSpeed = 0.15;


function onkeydown(e) {
    console.log(e.key);
    if (e.key == 'a') {
        parallelRot -= cameraSpeed;
    } 
    if (e.key == 'd') {
        parallelRot += cameraSpeed;
    }
    if (e.key == 'w') {
        perpendicularRot += cameraSpeed;
    }
    if (e.key == 's') {
        perpendicularRot -= cameraSpeed;
    }
    if (e.key == '=') {
        cameraDistToCenter += cameraZoomSpeed;
    }
    if (e.key == '-') {
        cameraDistToCenter -= cameraZoomSpeed;
    }

    moveCamera();
    updateDataBoxesPosition();
    camera.lookAt( new THREE.Vector3(0,0,0) );
}


function onpointermove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 + 1;
}

// camera.rotateY(1/2 * Math.PI);

document.addEventListener('keydown', onkeydown);
document.addEventListener('pointermove', onpointermove);

spreadSpheres();
createConnectionBetweenSpheres();
animate();
moveCamera();
