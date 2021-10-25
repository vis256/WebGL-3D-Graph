function getRenderingContext() {
    var canvas = document.querySelector("canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    var gl = canvas.getContext("webgl")
      || canvas.getContext("experimental-webgl");
    if (!gl) {
      var paragraph = document.querySelector("p");
      paragraph.innerHTML = "Failed to get WebGL context."
        + "Your browser or device may not support WebGL.";
      return null;
    }
    return gl;
}

function main() {
    var gl = getRenderingContext();
    var config = {
        DrawMode: gl.TRIANGLES,
        Quality: 3,
        ZoomLevel: -2.8,
        Rotation: {
            X: 0.0001,
            Y: 0.00005,
            Z: 0
        }

    };


    var icosahedron = new Icosahedron3D(config.Quality);
}

var Icosahedron3D = (function () {
    function Icosahedron3D(quality) {
        this._quality = quality;
        this._calculateGeometry();
    }
    Icosahedron3D.prototype._calculateGeometry = function () {
        this.Points = [];
        this.TriangleIndices = [];
        this._middlePointIndexCache = {};
        this._index = 0;
        var t = (1.0 + Math.sqrt(5.0)) / 2.0;
        this._addVertex(-1, t, 0);
        this._addVertex(1, t, 0);
        this._addVertex(-1, -t, 0);
        this._addVertex(1, -t, 0);
        this._addVertex(0, -1, t);
        this._addVertex(0, 1, t);
        this._addVertex(0, -1, -t);
        this._addVertex(0, 1, -t);
        this._addVertex(t, 0, -1);
        this._addVertex(t, 0, 1);
        this._addVertex(-t, 0, -1);
        this._addVertex(-t, 0, 1);
        this._addFace(0, 11, 5);
        this._addFace(0, 5, 1);
        this._addFace(0, 1, 7);
        this._addFace(0, 7, 10);
        this._addFace(0, 10, 11);
        this._addFace(1, 5, 9);
        this._addFace(5, 11, 4);
        this._addFace(11, 10, 2);
        this._addFace(10, 7, 6);
        this._addFace(7, 1, 8);
        this._addFace(3, 9, 4);
        this._addFace(3, 4, 2);
        this._addFace(3, 2, 6);
        this._addFace(3, 6, 8);
        this._addFace(3, 8, 9);
        this._addFace(4, 9, 5);
        this._addFace(2, 4, 11);
        this._addFace(6, 2, 10);
        this._addFace(8, 6, 7);
        this._addFace(9, 8, 1);
        this._refineVertices();
    };
    Icosahedron3D.prototype._addVertex = function (x, y, z) {
        var length = Math.sqrt(x * x + y * y + z * z);
        this.Points.push({
            x: x / length,
            y: y / length,
            z: z / length
        });
        return this._index++;
    };
    Icosahedron3D.prototype._addFace = function (x, y, z) {
        this.TriangleIndices.push(x);
        this.TriangleIndices.push(y);
        this.TriangleIndices.push(z);
    };
    Icosahedron3D.prototype._refineVertices = function () {
        for (var i = 0; i < this._quality; i++) {
            var faceCount = this.TriangleIndices.length;
            for (var face = 0; face < faceCount; face += 3) {
                var x1 = this.TriangleIndices[face];
                var y1 = this.TriangleIndices[face + 1];
                var z1 = this.TriangleIndices[face + 2];
                var x2 = this._getMiddlePoint(x1, y1);
                var y2 = this._getMiddlePoint(y1, z1);
                var z2 = this._getMiddlePoint(z1, x1);
                this._addFace(x1, x2, z2);
                this._addFace(y1, y2, x2);
                this._addFace(z1, z2, y2);
                this._addFace(x2, y2, z2);
            }
        }
    };
    Icosahedron3D.prototype._getMiddlePoint = function (p1, p2) {
        var firstIsSmaller = p1 < p2;
        var smallerIndex = firstIsSmaller ? p1 : p2;
        var greaterIndex = firstIsSmaller ? p2 : p1;
        var key = (smallerIndex << 32) + greaterIndex;
        var p = this._middlePointIndexCache[key];
        if (p !== undefined)
            p;
        var point1 = this.Points[p1];
        var point2 = this.Points[p2];
        var middle = {
            x: (point1.x + point2.x) / 2.0,
            y: (point1.y + point2.y) / 2.0,
            z: (point1.z + point2.z) / 2.0,
        };
        var i = this._addVertex(middle.x, middle.y, middle.z);
        this._middlePointIndexCache[key] = i;
        return i;
    };
    return Icosahedron3D;
})();