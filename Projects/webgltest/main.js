const canvas = document.getElementById("webgl-canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    alert("WebGL not supported");
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const vsSource = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ModelViewMatrix;
    varying vec4 v_Color;
    void main(void) {
        gl_Position = u_ModelViewMatrix * a_Position;
        v_Color = a_Color;
    }
`;

const fsSource = `
    precision mediump float;
    varying vec4 v_Color;
    void main(void) {
        gl_FragColor = v_Color;
    }
`;

const compileShader = (source, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling shader!", gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
};

const vertexShader = compileShader(vsSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(fsSource, gl.FRAGMENT_SHADER);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error("ERROR linking program!", gl.getProgramInfoLog(shaderProgram));
    return;
}

gl.useProgram(shaderProgram);

const vertices = new Float32Array([
    -0.5, -0.5,  0.5,  1.0, 0.0, 0.0,
    0.5, -0.5,  0.5,  0.0, 1.0, 0.0,
    0.5,  0.5,  0.5,  0.0, 0.0, 1.0,
    -0.5,  0.5,  0.5,  1.0, 1.0, 0.0,
    
    -0.5, -0.5, -0.5,  1.0, 0.0, 0.0,
    0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
    0.5,  0.5, -0.5,  0.0, 0.0, 1.0,
    -0.5,  0.5, -0.5,  1.0, 1.0, 0.0
]);

const indices = new Uint16Array([
    0, 1, 2,  0, 2, 3,
    4, 5, 6,  4, 6, 7,
    0, 1, 5,  0, 5, 4,
    1, 2, 6,  1, 6, 5,
    2, 3, 7,  2, 7, 6,
    3, 0, 4,  3, 4, 7
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(shaderProgram, "a_Position");
const aColor = gl.getAttribLocation(shaderProgram, "a_Color");
const uModelViewMatrix = gl.getUniformLocation(shaderProgram, "u_ModelViewMatrix");

gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.enableVertexAttribArray(aPosition);

gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
gl.enableVertexAttribArray(aColor);

const degToRad = (deg) => deg * Math.PI / 180;

const rotateX = (angle) => {
    return new Float32Array([
        1, 0, 0, 0,
        0, Math.cos(degToRad(angle)), -Math.sin(degToRad(angle)), 0,
        0, Math.sin(degToRad(angle)), Math.cos(degToRad(angle)), 0,
        0, 0, 0, 1
    ]);
};

const rotateY = (angle) => {
    return new Float32Array([
        Math.cos(degToRad(angle)), 0, Math.sin(degToRad(angle)), 0,
        0, 1, 0, 0,
        -Math.sin(degToRad(angle)), 0, Math.cos(degToRad(angle)), 0,
        0, 0, 0, 1
    ]);
};

let angleX = 0;
let angleY = 0;

const animate = () => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const modelViewMatrix = new Float32Array(16);
    glMatrix.mat4.identity(modelViewMatrix);
    glMatrix.mat4.multiply(modelViewMatrix, modelViewMatrix, rotateX(angleX));
    glMatrix.mat4.multiply(modelViewMatrix, modelViewMatrix, rotateY(angleY));

    gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    angleX += 1;
    angleY += 1;

    requestAnimationFrame(animate);
};

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);
animate();
