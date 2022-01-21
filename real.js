// init
const controlsElement = document.querySelector("#controls");
const camerasContainerElement = document.querySelector("#camerasContainer");

let Xsize = window.innerWidth - controlsElement.clientWidth;
let Ysize = window.innerHeight;

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, Xsize / Ysize, 0.1, 1000 );
// const renderer = new THREE.WebGLRenderer( { antialias: true } );

const scenes = [new THREE.Scene(), new THREE.Scene()];
const cameras = [new THREE.PerspectiveCamera( 75, Xsize / (Ysize/2), 0.1, 1000 ), new THREE.PerspectiveCamera( 75, Xsize / (Ysize/2), 0.1, 1000 )];
const renderers = [new THREE.WebGLRenderer( { antialias: true } ), new THREE.WebGLRenderer( { antialias: true } )]
var graphNodes = [[], []];
let edges = [{}, {}];
let ids = [0, 0];

let activeIndex = 0;

renderers.forEach(renderer => {
    renderer.setSize( Xsize, (Ysize/2) );
    camerasContainerElement.appendChild( renderer.domElement );
});

// renderer.setSize( Xsize, Ysize);
// document.body.appendChild( renderer.domElement );

// var graphNodes = [];
// let edges = {};


function changeActiveTo(x) {
    activeIndex = x;
    document.getElementById("scene-0").classList = `${x == 0 ? "active-btn" : ""}`;
    document.getElementById("scene-1").classList = `${x == 0 ? "" : "active-btn"}`;
}

changeActiveTo(0);


const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

function randomColor() {
    return '#' + genRanHex(6);
}


function makeNewNode(color, x) {
    const geometry = new THREE.SphereGeometry(0.5, 8, 8);
    const material = new THREE.MeshBasicMaterial( { color: color } );
    const sphere = new THREE.Mesh(geometry, material);

    scenes[activeIndex].add(sphere);

    // create tooltip
    const tooltip = document.createElement('div');
    const nodeValElem = document.createElement('p');
    const nodePosElem = document.createElement('p');
    let connElemUl = document.createElement('p');
    const nodeId = document.createElement('h1');

    tooltip.id = `${activeIndex}-${ids[activeIndex]}`;
    connElemUl.id = `${activeIndex}-${ids[activeIndex]}-cn`;
    nodeValElem.id = `${activeIndex}-${ids[activeIndex]}-vl`;
    nodePosElem.id = `${activeIndex}-${ids[activeIndex]}-ps`;
    nodeId.id = `${activeIndex}-${ids[activeIndex]}-id`;

    nodePosElem.innerHTML = `<strong>x</strong>: ${sphere.position.x} <strong>y</strong>: ${sphere.position.y} <strong>z</strong>: ${sphere.position.z} `;
    nodeValElem.innerHTML = `<strong>Value: </strong>${x}`;
    nodeId.innerHTML = ids[activeIndex];

    tooltip.classList = "tooltip vis-off";
    nodeId.classList = "tooltip-id";

    connElemUl.innerHTML = '→ ';
    // console.log(connElemUl);
    tooltip.appendChild(nodeValElem);
    tooltip.appendChild(nodePosElem);
    tooltip.appendChild(connElemUl);
    tooltip.appendChild(nodeId);

    
    document.body.appendChild(tooltip);
    // console.log({x:x});
    return {id: ids[activeIndex]++, elem: sphere, tooltip: tooltip, conn: [], val: x, plane: activeIndex};
}


function addEdge(x, y) {
    function validX(element) {
        return element.id == x;
    }
    function validY(element) {
        return element.id == y;
    }
    let elemx = graphNodes[activeIndex].filter( validX )[0];
    let elemy = graphNodes[activeIndex].filter( validY )[0];
    elemx.conn.push(elemy);
    elemy.conn.push(elemx);

    document.getElementById(`${activeIndex}-${x}-cn`).innerHTML += ` ${elemy.val}[${elemy.id}], `;
    document.getElementById(`${activeIndex}-${y}-cn`).innerHTML += ` ${elemx.val}[${elemx.id}], `;
}

function createRandomEdges(p) {
    for (let i = 0; i < graphNodes[activeIndex].length; i++) {
        for (let j = i+1; j < graphNodes[activeIndex].length; j++) {
            if (Math.random() < p){
                addEdge(i,j);
                createConnection(i,j);
            }
        }
    }
}


// graphNodes[activeIndex].push( makeNewNode(randomColor(), 5, 10) );


function spreadSpheres() {
    graphNodes.forEach(graphNodesX => {
        let cycle = 1;
        const cubeHalfLength = 2;
        for (let i = 0; i < graphNodesX.length; i++) {
            const sphere = graphNodesX[i].elem;
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
    });
    
}

function createConnectionBetweenSpheres() {
    let connections = [];
    let points = [];
    let fid, sid;
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    for (let i = 0; i < graphNodes[activeIndex].length; i++) {
        const node = graphNodes[activeIndex][i];
        fid = node.id;
        for (let j = 0; j < node.conn.length; j++) {
            // console.log({i:i, j:node.conn[j]});
            points = [];
            sid = node.conn[j];
            points.push( graphNodes[activeIndex][i].elem.position );
            points.push( node.conn[j].elem.position );
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
            const line = new THREE.Line( geometry, material );
            connections.push(line);
        }
    }

    connections.forEach(conn => {
        scenes[activeIndex].add(conn);
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
    let xelem = graphNodes[activeIndex].filter( validX )[0];
    let yelem = graphNodes[activeIndex].filter( validY )[0];
    // console.log({xelem: xelem, yelem: yelem});
    points.push( xelem.elem.position );
    points.push( yelem.elem.position );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial( { color: 0xffff66 } );
    const line = new THREE.Line( geometry, material )
    let key = [x,y].sort().join();
    edges[activeIndex][key] = line;
    scenes[activeIndex].add(line);
}


function animate() {
	requestAnimationFrame( animate );
	// renderer.render( scene, camera );
    for (let i = 0; i < renderers.length; i++) {
        renderers[i].render( scenes[i], cameras[i] );
    }
}

var cameraDistToCenter = 10;
var parallelRot = 0;
var perpendicularRot = 0;



function updateDataBoxesPosition() {
    let tempV = new THREE.Vector3();
    for (let j = 0; j < graphNodes.length; j++) {
        for (let i = 0; i < graphNodes[j].length; i++) {
            let sphere = graphNodes[j][i].elem;
            let tooltip = document.getElementById(`${j}-${graphNodes[j][i].id}`);
            sphere.getWorldPosition(tempV);
            tempV.project(cameras[j]);
                
            const x = (tempV.x *  .5 + 0.5) * Xsize + controlsElement.clientWidth;
            let y = (tempV.y * -.4 + 0.2) * Ysize;
            y += Ysize * .5;
            if (j == 0) {
                y -= Ysize/2;
            }
            // console.log(`TRANSFORM ${x} ${y}`);
            tooltip.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
        }
    }
    
}

function updateDataBoxesContent() {
    for (let i = 0; i < graphNodes[activeIndex].length; i++) {
        const node = graphNodes[activeIndex][i];
        document.getElementById(`${activeIndex}-${node.id}-vl`).innerHTML = `<strong>Value: </strong>${node.val}`;
        document.getElementById(`${activeIndex}-${node.id}-ps`).innerHTML = `<strong>x</strong>: ${node.elem.position.x} <strong>y</strong>: ${node.elem.position.y} <strong>z</strong>: ${node.elem.position.z} `;
        document.getElementById(`${activeIndex}-${node.id}-cn`).innerHTML = '→ ';
        node.conn.forEach(ind => {
            document.getElementById(`${activeIndex}-${node.id}-cn`).innerHTML += `${ind.id}, `;
        });
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
    cameras.forEach(camera => {
        camera.position.x = cameraDistToCenter * Math.sin( parallelRot * (2 * Math.PI) ) * Math.cos(perpendicularRot * (2 * Math.PI));
        camera.position.y = cameraDistToCenter * Math.sin(perpendicularRot * (2 * Math.PI));
        camera.position.z = cameraDistToCenter * Math.cos( parallelRot * (2 * Math.PI) ) * Math.cos(perpendicularRot * (2 * Math.PI));
    });
    // camera.position.x = cameraDistToCenter * Math.sin( parallelRot * (2 * Math.PI) ) * Math.cos(perpendicularRot * (2 * Math.PI));
    // camera.position.y = cameraDistToCenter * Math.sin(perpendicularRot * (2 * Math.PI));
    // camera.position.z = cameraDistToCenter * Math.cos( parallelRot * (2 * Math.PI) ) * Math.cos(perpendicularRot * (2 * Math.PI));

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
    cameras.forEach(camera => {
        camera.lookAt( new THREE.Vector3(0,0,0) );
    });
    // camera.lookAt( new THREE.Vector3(0,0,0) );
}

function onkeyup(e) {
    if (e.key == ' ') {
        hideDataBoxes();
    }
}


// function onpointermove(event) {
//     pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
//     pointer.y = (event.clientY / window.innerHeight) * 2 + 1;
// }


document.addEventListener('keydown', onkeydown);
document.addEventListener('keyup', onkeyup);
// document.addEventListener('pointermove', onpointermove);

// controls functions

function newNodeCreate() {
    // console.log("TE");
    const val = document.querySelector("#n-val").value;
    let color = document.querySelector("#n-color").value;
    if (color == "") {
        color = randomColor();
    }
    graphNodes[activeIndex].push( makeNewNode(color, val, 10) );
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


    let node = graphNodes[activeIndex].filter( validId )[0];

    for (let i = 0; i < node.conn.length; i++) {
        const connnode = node.conn[i];
        // connnode.conn.filter( invalidId );
        removeEdge(node, connnode);

    }
    scenes[activeIndex].remove(node.elem);
    graphNodes[activeIndex] = graphNodes[activeIndex].filter( invalidId );
    document.body.removeChild( document.getElementById(`${activeIndex}-${id}`));
}

function removeEdge(x, y) {
    const invalidX = elem => {return elem.id != x}
    const invalidY = elem => {return elem.id != y}
    let key = [x.id, y.id].sort().join();
    scenes[activeIndex].remove(edges[activeIndex][key]);

    x.conn = x.conn.filter( invalidY );
    y.conn = y.conn.filter( invalidX );
}

function deleteEdge() {
    const validX = elem => {return elem.id == x}
    const validY = elem => {return elem.id == y}

    let x = document.querySelector('#re-x').value;
    let y = document.querySelector('#re-y').value;
    removeEdge( graphNodes[activeIndex].filter(validX)[0], graphNodes[activeIndex].filter(validY)[0] );
    updateDataBoxesContent();
}

spreadSpheres();
createConnectionBetweenSpheres();
animate();
moveCamera();
setTimeout(() => {
    updateDataBoxesPosition();
    updateDataBoxesContent();
}, 1000);
