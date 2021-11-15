// init
const controlsElement = document.querySelector("#controls");

let Xsize = window.innerWidth - controlsElement.clientWidth;
let Ysize = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, Xsize / Ysize, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer( { antialias: true } );


renderer.setSize( Xsize, Ysize);
document.body.appendChild( renderer.domElement );

let id = 0;
var graphNodes = [];
let pointer = new THREE.Vector2;



//     y
//     |
//     |
//     z-- --x



const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

function randomColor() {
    return '#' + genRanHex(6);
}


function makeNewNode(color, x, size) {
    const geometry = new THREE.SphereGeometry(0.5, 8, 8);
    const material = new THREE.MeshBasicMaterial( { color: color } );
    const sphere = new THREE.Mesh(geometry, material);

    scene.add(sphere);

    // create tooltip
    const tooltip = document.createElement('div');
    const nodeValElem = document.createElement('p');
    const nodePosElem = document.createElement('p');
    let connElemUl = document.createElement('p');
    const nodeId = document.createElement('h1');

    tooltip.id = id;
    connElemUl.id = `${id}-cn`;
    nodeValElem.id = `${id}-vl`;
    nodePosElem.id = `${id}-ps`;
    nodeId.id = `${id}-id`;

    nodePosElem.innerHTML = `<strong>x</strong>: ${sphere.position.x} <strong>y</strong>: ${sphere.position.y} <strong>z</strong>: ${sphere.position.z} `;
    nodeValElem.innerHTML = `<strong>Value: </strong>${x}`;
    nodeId.innerHTML = id;

    tooltip.classList = "tooltip vis-off";
    nodeId.classList = "tooltip-id";

    connElemUl.innerHTML = '→ ';
    console.log(connElemUl);
    tooltip.appendChild(nodeValElem);
    tooltip.appendChild(nodePosElem);
    tooltip.appendChild(connElemUl);
    tooltip.appendChild(nodeId);

    
    document.body.appendChild(tooltip);
    // console.log({x:x});
    return {id: id++, elem: sphere, tooltip: tooltip, conn: [], val: x};
}


function addEdge(x, y) {
    function validX(element) {
        return element.id == x;
    }
    function validY(element) {
        return element.id == y;
    }
    let elemx = graphNodes.filter( validX )[0];
    let elemy = graphNodes.filter( validY )[0];
    elemx.conn.push(y);
    elemy.conn.push(x);

    console.log(elemx);
    document.getElementById(`${x}-cn`).innerHTML += ` ${elemy.val}[${elemy.id}], `;
    document.getElementById(`${y}-cn`).innerHTML += ` ${elemx.val}[${elemy.id}], `;
}

function createRandomEdges(p) {
    for (let i = 0; i < graphNodes.length; i++) {
        for (let j = i+1; j < graphNodes.length; j++) {
            if (Math.random() < p){
                addEdge(i,j);
                createConnection(i,j);
            }
        }
    }
}


graphNodes.push( makeNewNode(randomColor(), 5, 10) );
// graphNodes.push( makeNewNode(randomColor(), 15, 10) );
// graphNodes.push( makeNewNode(randomColor(), 54, 10) );
// graphNodes.push( makeNewNode(randomColor(), 2, 10) );
// graphNodes.push( makeNewNode(randomColor(), 0, 10) );
// graphNodes.push( makeNewNode(randomColor(), -5, 10) );
// graphNodes.push( makeNewNode(randomColor(), 51, 10) );
// graphNodes.push( makeNewNode(randomColor(), 14, 10) );
// graphNodes.push( makeNewNode(randomColor(), 12, 10) );
// graphNodes.push( makeNewNode(randomColor(), 13, 10) );
// graphNodes.push( makeNewNode(randomColor(), 16, 10) );
// graphNodes.push( makeNewNode(randomColor(), 17, 10) );
// graphNodes.push( makeNewNode(randomColor(), 18, 10) );
// graphNodes.push( makeNewNode(randomColor(), 19, 10) );
// graphNodes.push( makeNewNode(randomColor(), 20, 10) );
// graphNodes.push( makeNewNode(randomColor(), 21, 10) );
// graphNodes.push( makeNewNode(randomColor(), 22, 10) );
// graphNodes.push( makeNewNode(randomColor(), 23, 10) );
// graphNodes.push( makeNewNode(randomColor(), 24, 10) );
// graphNodes.push( makeNewNode(randomColor(), 25, 10) );
// graphNodes.push( makeNewNode(randomColor(), 26, 10) );
// addEdge(0, 1);
// addEdge(0, 2);
// addEdge(2, 1);
// addEdge(3, 1);
// addEdge(4, 5);
// addEdge(7, 8);
// addEdge(8, 1);
// addEdge(6, 1);
// createRandomEdges(0.05);










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
        // console.log({x: x, y: y, z: z});
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
            // console.log({i:i, j:node.conn[j]});
            points = [];
            sid = node.conn[j];
            points.push( graphNodes[i].elem.position );
            points.push( graphNodes[node.conn[j]].elem.position );
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
            const line = new THREE.Line( geometry, material );
            connections.push(line);
        }
    }

    connections.forEach(conn => {
        scene.add(conn);
    });
}


function createConnection(x, y) {
    function validX(element) {
        return element.id == x;
    }
    function validY(element) {
        return element.id == y;
    }

    let points = [];
    let xelem = graphNodes.filter( validX )[0];
    let yelem = graphNodes.filter( validY )[0];
    // console.log({xelem: xelem, yelem: yelem});
    points.push( xelem.elem.position );
    points.push( yelem.elem.position );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial( { color: 0xffff66 } );
    const line = new THREE.Line( geometry, material )
    scene.add(line);
}


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

var cameraDistToCenter = 10;
var parallelRot = 0;
var perpendicularRot = 0;



function updateDataBoxesPosition() {
    let tempV = new THREE.Vector3();
    for (let i = 0; i < graphNodes.length; i++) {
        let sphere = graphNodes[i].elem;
        let tooltip = document.getElementById(`${graphNodes[i].id}`);
        sphere.getWorldPosition(tempV);
        tempV.project(camera);
        
        const x = (tempV.x *  .5 + 0.5) * Xsize + controlsElement.clientWidth;
        const y = (tempV.y * -.5 + .5) * Ysize;
        // console.log(`TRANSFORM ${x} ${y}`);
        tooltip.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
    }
}

function updateDataBoxesContent() {
    for (let i = 0; i < graphNodes.length; i++) {
        const node = graphNodes[i];
        document.getElementById(`${node.id}-vl`).innerHTML = `<strong>Value: </strong>${node.val}`;
        document.getElementById(`${node.id}-ps`).innerHTML = `<strong>x</strong>: ${node.elem.position.x} <strong>y</strong>: ${node.elem.position.y} <strong>z</strong>: ${node.elem.position.z} `;
    }
}

function toggleDataBoxVis() {
    let inp = document.querySelector("#vis-toggle-input").value;
    if (document.getElementById(`${parseInt(inp)}`).classList.contains('vis-off')) {
        document.getElementById(`${parseInt(inp)}`).classList = 'tooltip';
    } else {
        document.getElementById(`${parseInt(inp)}`).classList += 'vis-off';
    }
}

function showDataBoxes() {
    let arr = document.getElementsByClassName('tooltip');
    for (let i = 0; i < arr.length; i++) {
        const elem = arr[i];
        elem.classList = 'tooltip';
    }
}

function hideDataBoxes() {
    let arr = document.getElementsByClassName('tooltip');
    for (let i = 0; i < arr.length; i++) {
        const elem = arr[i];
        elem.classList += ' vis-off';
    }  
}




function moveCamera() {
    // console.log("old", camera.position);

    camera.position.x = cameraDistToCenter * Math.sin( parallelRot * (2 * Math.PI) ) * Math.cos(perpendicularRot * (2 * Math.PI));
    camera.position.y = cameraDistToCenter * Math.sin(perpendicularRot * (2 * Math.PI));
    camera.position.z = cameraDistToCenter * Math.cos( parallelRot * (2 * Math.PI) ) * Math.cos(perpendicularRot * (2 * Math.PI));

}

const cameraSpeed = 0.01;
const cameraZoomSpeed = 0.30;


function onkeydown(e) {
    // console.log(e.key);
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
    if (e.key == ' ') {
        showDataBoxes();
    }

    moveCamera();
    updateDataBoxesPosition();
    camera.lookAt( new THREE.Vector3(0,0,0) );
}

function onkeyup(e) {
    if (e.key == ' ') {
        hideDataBoxes();
    }
}


function onpointermove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 + 1;
}


document.addEventListener('keydown', onkeydown);
document.addEventListener('keyup', onkeyup);
document.addEventListener('pointermove', onpointermove);

// controls functions

function newNodeCreate() {
    // console.log("TE");
    const val = document.querySelector("#n-val").value;
    let color = document.querySelector("#n-color").value;
    if (color == "") {
        color = randomColor();
    }
    graphNodes.push( makeNewNode(color, val, 10) );
    spreadSpheres();
}

function newEdgeCreate() {
    let x = document.querySelector('#e-x').value;
    let y = document.querySelector('#e-y').value;
    console.log({x:[x, typeof(x)], y:[y, typeof(y)]});
    if (typeof(x) == "string") x = parseInt(x); y = parseInt(y);
    addEdge(x, y);
    createConnection(x, y);
    updateDataBoxesContent();
}

function removeNode() {
    const id = document.querySelector("#rn").value;

    function validId(elem) {
        return elem.id == id;
    }
    function invalidId(elem) {
        return elem.id != id;
    }

    let node = graphNodes.filter( validId )[0];
    scene.remove(node.elem);
    graphNodes = graphNodes.filter( invalidId );
    document.body.removeChild( document.getElementById(id));
}

spreadSpheres();
createConnectionBetweenSpheres();
animate();
moveCamera();
setTimeout(() => {
    updateDataBoxesPosition();
    updateDataBoxesContent();
}, 1000);
