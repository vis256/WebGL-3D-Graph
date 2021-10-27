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
    graphNodes.push( new node(15, "#0455cd", new THREE.Vector3(4,5,0), []) );
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

init();
addEdge(0, 1);
addEdge(0, 2);
addEdge(2, 1);





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
    console.log("old", camera.position);

    camera.position.x = cameraDistToCenter * Math.sin( parallelRot * (2 * Math.PI) ) * Math.cos(perpendicularRot * (2 * Math.PI));
    camera.position.y = cameraDistToCenter * Math.sin(perpendicularRot * (2 * Math.PI));
    camera.position.z = cameraDistToCenter * Math.cos( parallelRot * (2 * Math.PI) ) * Math.cos(perpendicularRot * (2 * Math.PI));

}



function onkeydown(e) {
    console.log(e.key);
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
    if (e.key == '=') {
        cameraDistToCenter += 0.05;
    }
    if (e.key == '-') {
        cameraDistToCenter -= 0.05;
    }

    moveCamera();
}

// camera.rotateY(1/2 * Math.PI);

document.addEventListener('keydown', onkeydown);


createConnectionBetweenSpheres();
animate();