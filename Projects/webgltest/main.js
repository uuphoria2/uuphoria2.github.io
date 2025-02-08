const canvas = document.getElementById("webgl-canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    alert("webgl not supported");
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const vsSource = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelViewMatrix;
    void main(void) {
        gl_Position = u_ModelViewMatrix * a_Position;
    }
`;

const fsSource = `
    precision mediump float;
    void main(void) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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
    0.0,  0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(shaderProgram, "a_Position");
const uModelViewMatrix = gl.getUniformLocation(shaderProgram, "u_ModelViewMatrix");

gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosition);

const degToRad = (deg) => deg * Math.PI / 180;
const rotate = (angle) => {
    return new Float32Array([
        Math.cos(degToRad(angle)), -Math.sin(degToRad(angle)), 0.0, 0.0,
        Math.sin(degToRad(angle)), Math.cos(degToRad(angle)), 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
};

let angle = 0;
const animate = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniformMatrix4fv(uModelViewMatrix, false, rotate(angle));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    angle += 1;
    requestAnimationFrame(animate);
};

animate();
