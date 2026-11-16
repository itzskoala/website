// color.js
const cache = new Map();
const SAMPLE = 8;

export function extractAverageColor(url) {
  if (!url) return Promise.resolve(null);
  if (cache.has(url)) return Promise.resolve(cache.get(url));
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let color = null;
      try {
        const c = document.createElement("canvas");
        c.width = SAMPLE; c.height = SAMPLE;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, SAMPLE, SAMPLE);
        const data = ctx.getImageData(0, 0, SAMPLE, SAMPLE).data;
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i + 1]; b += data[i + 2]; n++; }
        color = { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
      } catch { color = null; }
      cache.set(url, color);
      resolve(color);
    };
    img.onerror = () => { cache.set(url, null); resolve(null); };
    img.src = url;
  });
}
