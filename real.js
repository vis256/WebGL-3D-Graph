let id = 0;
var graphNodes = [];
class node {
    constructor(val, color, position, connectedTo) {
        this.id = id++;
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

function addEdge(x, y) {
    let xnode = graphNodes.filter(
        function valid(elem) { return elem.id == x; }
    )[0];
    let ynode = graphNodes.filter(
        function valid(elem) { return elem.id == y; }
    )[0];
    xnode.connectedTo.push(ynode);
    ynode.connectedTo.push(xnode);
}


// init();
addDefaultNode();
addDefaultNode();
addDefaultNode();
addDefaultNode();
addDefaultNode();
addDefaultNode();
addDefaultNode();
addDefaultNode();
addDefaultNode();
addEdge(0, 1);
addEdge(0, 2);
addEdge(2, 1);
addEdge(3, 1);
addEdge(4, 5);
addEdge(7, 8);
addEdge(8, 1);





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
    var geometry = new THREE.SphereGeometry(0.5, 8, 8);
    console.log(geometry);
    var material = new THREE.MeshBasicMaterial( { color: nodeElem.color } );
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
    let cycle = 1;
    const cubeHalfLength = 2;
    for (let i = 0; i < graphNodes.length; i++) {
        const sphere = scene.children[i];
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
        for (let j = 0; j < node.connectedTo.length; j++) {
            points = [];
            sid = node.connectedTo[j].id;
            points.push( scene.children[i].position );
            points.push( scene.children[j].position );
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
            const line = new THREE.Line( geometry, material );
            connections.push(line);
        }
    }

    connections.forEach(conn => {
        scene.add(conn);
    });

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
    // console.log("old", camera.position);

    camera.position.x = cameraDistToCenter * Math.sin( parallelRot * (2 * Math.PI) ) * Math.cos(perpendicularRot * (2 * Math.PI));
    camera.position.y = cameraDistToCenter * Math.sin(perpendicularRot * (2 * Math.PI));
    camera.position.z = cameraDistToCenter * Math.cos( parallelRot * (2 * Math.PI) ) * Math.cos(perpendicularRot * (2 * Math.PI));

}

const cameraRotationSpeed = 0.0125;
const cameraSpeed = 0.002;
const cameraZoomSpeed = 0.15;


function onkeydown(e) {
    // console.log(e.key);
    if (e.key == 'a') {
        parallelRot -= cameraSpeed;
        camera.rotateY(-cameraRotationSpeed);
    } 
    if (e.key == 'd') {
        parallelRot += cameraSpeed;
        camera.rotateY(cameraRotationSpeed);
    }
    if (e.key == 'w') {
        perpendicularRot += cameraSpeed;
        camera.rotateX(-cameraRotationSpeed);
    }
    if (e.key == 's') {
        perpendicularRot -= cameraSpeed;
        camera.rotateX(cameraRotationSpeed);
    }
    if (e.key == '=') {
        cameraDistToCenter += cameraZoomSpeed;
    }
    if (e.key == '-') {
        cameraDistToCenter -= cameraZoomSpeed;
    }

    moveCamera();
}

// camera.rotateY(1/2 * Math.PI);

document.addEventListener('keydown', onkeydown);

moveCamera();
spreadSpheres();
createConnectionBetweenSpheres();
animate();