const canvas = document.querySelector("canvas");
const scale = globalThis.devicePixelRatio || 1;
canvas.width = Math.round(320 * scale);
canvas.height = Math.round(320 * scale);
const context = canvas.getContext("2d", { alpha: true });
if (!context) throw new Error("Canvas 2D is unavailable.");
context.setTransform(scale, 0, 0, scale, 0, 0);

const image = new Image();
image.src = "./icon.png";
await image.decode();
// Leave a transparent margin and preserve the PNG's alpha channel.
context.drawImage(image, 32, 32, 256, 256);

canvas.addEventListener("dblclick", () => chrome.webview.postMessage("close"));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") chrome.webview.postMessage("close");
});
