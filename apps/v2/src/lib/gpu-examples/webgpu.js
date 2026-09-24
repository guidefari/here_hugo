const shader = `@vertex
fn vertex(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
  let points = array<vec2f, 3>(
    vec2f(0.0, 0.8), vec2f(-0.8, -0.7), vec2f(0.8, -0.7)
  );
  return vec4f(points[i], 0.0, 1.0);
}

@fragment
fn fragment() -> @location(0) vec4f {
  return vec4f(0.96, 0.84, 0.28, 1.0);
}`;

export async function render(canvas) {
  if (!navigator.gpu) throw new Error("WebGPU is not available here. Try WebGL 2, or open this page in a browser with WebGPU support over HTTPS.");
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) throw new Error("No WebGPU adapter is available on this device.");
  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu");
  if (!context) throw new Error("Could not create a WebGPU canvas context.");

  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format, alphaMode: "opaque" });
  const module = device.createShaderModule({ code: shader });
  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: { module, entryPoint: "vertex" },
    fragment: { module, entryPoint: "fragment", targets: [{ format }] },
    primitive: { topology: "triangle-list" },
  });

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      clearValue: { r: 0.04, g: 0.12, b: 0.16, a: 1 },
      loadOp: "clear",
      storeOp: "store",
    }],
  });
  pass.setPipeline(pipeline);
  pass.draw(3);
  pass.end();
  device.queue.submit([encoder.finish()]);
}
