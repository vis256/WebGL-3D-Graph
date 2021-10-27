var graphNodes = [];
class node {
    constructor(val, color, position, connectedTo) {
        this.val = val;
        this.color = color;
        this.position = position;
        this.connectedTo = connectedTo;
    }
}

//     y
//     |
//     |
//     z-- --x

function init() {
    var x = new node(5, "#ffab33", new THREE.Vector3(2,0,0), []);
    var y = new node(15, "#0455cd", new THREE.Vector3(0,0,0), []);
    // x.connectedTo.push(y);
    graphNodes.push(x);
    graphNodes.push(y);
}

init();

class Graph {
    constructor(size) {
        let t = [];
        let tt = [];
        for (let i = 0; i < size; i++) {
            tt.push(null);
        }
        for (let i = 0; i < size; i++) {
            t.push(tt);
        }
        this.adjMatrix = t;
        this.colors = tt;
    }

    addEdge(x, y) {
        this.adjMatrix[x][y] = 1;
        this.adjMatrix[y][x] = 1;
    }

    removeEdge(x, y) {
        this.adjMatrix[x][y] = null;
        this.adjMatrix[y][x] = null;
    }
}

let graph = new Graph(5);
graph.adjMatrix[0][1] = "TEST";




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer( { antialias: true } );

const controlsElement = document.querySelector("#controls");



renderer.setSize( window.innerWidth - controlsElement.clientWidth, window.innerHeight - controlsElement.clientWidth);
document.body.appendChild( renderer.domElement );

// const geometry = new THREE.SphereGeometry();
// const material = new THREE.MeshBasicMaterial( { color: 0x999999 } );
// var sphere = new THREE.Mesh( geometry, material );
graphNodes.forEach(nodeElem => {
    console.log("test");
    var geometry = new THREE.SphereGeometry();
    var material = new THREE.MeshBasicMaterial( { color: nodeElem.color, wireframe: true } );
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = nodeElem.position.x;
    sphere.position.y = nodeElem.position.y;
    sphere.position.z = nodeElem.position.z;
    // console.log(sphere.position);
    scene.add( sphere );
    // sphere = new THREE.Mesh(geometry, material);
});
// sphere = new THREE.Mesh( geometry, material );
// scene.add( sphere );
// camera.position.x = 10;

// function renderCylinderInbetweenTwoNodes()

function spreadSpheres() {
    
}

function createConnectionBetweenSpheres() {
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const points = [];
    points.push( new THREE.Vector3(0, 20, 0) );
    points.push( new THREE.Vector3(0, -20, 0) );

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const line = new THREE.Line( geometry, material );
    scene.add(line);
}


function animate() {
	requestAnimationFrame( animate );
    var i = 1;
    // rotateCamera('right')
    // scene.children.forEach(sphere => {
    //     i *= -1;
    //     sphere.position.x += 0.01 * i;
    //     sphere.position.y += 0.01 * i;
    //     sphere.position.z += 0.01 * i;
    //     sphere.rotation.x += 0.01;
    //     sphere.rotation.y += 0.01;
    // });  

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

function moveCamera() {
    console.log("old", camera.position);

    camera.position.x = cameraDistToCenter * Math.sin( parallelRot * (2 * Math.PI) ) * Math.cos(perpendicularRot * (2 * Math.PI));
    camera.position.y = cameraDistToCenter * Math.sin(perpendicularRot * (2 * Math.PI));
    camera.position.z = cameraDistToCenter * Math.cos( parallelRot * (2 * Math.PI) ) * Math.cos(perpendicularRot * (2 * Math.PI));

}



function onkeydown(e) {
    // console.log(e.key);
    if (e.key == 'a') {
        parallelRot -= 0.002;
        camera.rotateY(-0.0125);
    } 
    if (e.key == 'd') {
        parallelRot += 0.002;
        camera.rotateY(0.0125);
    }
    if (e.key == 'w') {
        perpendicularRot += 0.002;
        camera.rotateX(-0.0125);
    }
    if (e.key == 's') {
        perpendicularRot -= 0.002;
        camera.rotateX(0.0125);
    }

    moveCamera();
}

// camera.rotateY(1/2 * Math.PI);

document.addEventListener('keydown', onkeydown);


createConnectionBetweenSpheres();
animate();