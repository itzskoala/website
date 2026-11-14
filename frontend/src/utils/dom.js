// dom.js
export const $ = (s, c) => (c || document).querySelector(s);
export const grad = (a, b) => `linear-gradient(135deg, ${a}, ${b})`;
export const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
