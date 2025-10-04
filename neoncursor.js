const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}
resizeCanvas();

let points = [];
const maxPoints = 20; // Shorter trail for lightning
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  points.push({ x: mouse.x, y: mouse.y });
  if (points.length > maxPoints) points.shift();
});

function drawLightning(points) {
  if (points.length < 2) return;
  ctx.save();
  ctx.shadowBlur = 30;
  ctx.shadowColor = '#ffff00';
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 8;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  // Draw jagged lightning
  for (let i = 1; i < points.length; i++) {
    // Offset every other point for zig-zag
    let prev = points[i - 1];
    let curr = points[i];
    let dx = curr.x - prev.x;
    let dy = curr.y - prev.y;
    let angle = Math.atan2(dy, dx);
    let length = Math.sqrt(dx * dx + dy * dy);

    // Zig-zag offset
    let offset = (i % 2 === 0 ? 1 : -1) * Math.min(10, length / 2);
    let perpAngle = angle + Math.PI / 2;
    let zx = curr.x + Math.cos(perpAngle) * offset;
    let zy = curr.y + Math.sin(perpAngle) * offset;

    ctx.lineTo(zx, zy);
  }

  ctx.stroke();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLightning(points);
  requestAnimationFrame(animate);
}

animate();
window.addEventListener('resize', resizeCanvas);