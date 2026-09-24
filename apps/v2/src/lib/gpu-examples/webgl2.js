const vertex = `#version 300 es
precision highp float;
const vec2 points[3] = vec2[3](
  vec2(0.0, 0.8), vec2(-0.8, -0.7), vec2(0.8, -0.7)
);
void main() {
  gl_Position = vec4(points[gl_VertexID], 0.0, 1.0);
}`;

const fragment = `#version 300 es
precision highp float;
out vec4 colour;
void main() {
  colour = vec4(0.96, 0.84, 0.28, 1.0);
}`;

export function render(canvas) {
  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("WebGL 2 is not available in this browser.");

  function compile(type, source) {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Could not create a shader.");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) ?? "Shader compilation failed.");
    }
    return shader;
  }

  const program = gl.createProgram();
  if (!program) throw new Error("Could not create a program.");
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "Program linking failed.");
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.04, 0.12, 0.16, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}
