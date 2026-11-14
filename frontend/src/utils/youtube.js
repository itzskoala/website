// youtube.js
export const ytId = (url) => {
  const m = String(url).match(/(?:v=|\/embed\/|youtu\.be\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(url) ? url : "");
};
export const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const ytThumbHi = (id) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

export function upgradeThumb(el, id) {
  if (!id || !el) return;
  const img = new Image();
  img.onload = () => { if (img.naturalWidth > 120) el.style.backgroundImage = `url(${ytThumbHi(id)})`; };
  img.src = ytThumbHi(id);
}
