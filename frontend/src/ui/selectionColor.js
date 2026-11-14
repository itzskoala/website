// selectionColor.js
const useGold = Math.random() < 0.5;
const root = document.documentElement.style;
root.setProperty("--select-bg", useGold ? "var(--gold)" : "var(--maroon)");
root.setProperty("--select-fg", useGold ? "#1a1a1a" : "#ffffff");
