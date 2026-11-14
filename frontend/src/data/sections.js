// sections.js
import { PROJECTS } from "./projects/index.js";
import { PHOTOS } from "./photos.js";
import { voicemailSvg } from "../utils/icons.js";

export const SECTIONS = [
  { id: "about", name: "This Is Sri Kotala", sub: "Artist profile", emoji: "🐨", img: "./assets/headshot-angel.jpg", c1: "#7a0019", c2: "#ffc72c" },
  { id: "projects", name: "Projects", sub: PROJECTS.length + " builds", emoji: "🛠️", img: "./assets/covers/projects.jpg", c1: "#5f2c82", c2: "#49a09d" },
  { id: "experience", name: "Experience & Research", sub: "Resume", emoji: "💼", img: "./assets/covers/experience.jpg", c1: "#c33764", c2: "#1d2671" },
  { id: "photos", name: "Photography", sub: PHOTOS.length + " photos", emoji: "📷", img: "./assets/covers/photography.jpg", c1: "#f7971e", c2: "#ffd200" },
  { id: "connect", name: "Let's Connect", sub: "Links & booking", emoji: "💬", img: "./assets/covers/connect.jpg", c1: "#11998e", c2: "#38ef7d" },
  { id: "voicemail", name: "Voicemail", sub: "Send me a voice message!", emoji: voicemailSvg, c1: "#7a0019", c2: "#33000a" },
];
