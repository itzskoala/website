// titles.js
import { PROJECTS } from "../data/projects/index.js";

const ROUTE_TITLES = {
  home: "Sri Kotala", about: "About · Sri Kotala", projects: "Projects · Sri Kotala",
  experience: "Experience & Research · Sri Kotala", photos: "Photography · Sri Kotala",
  connect: "Let's Connect · Sri Kotala", voicemail: "Voicemail · Sri Kotala", search: "Search · Sri Kotala",
};

export function setTitle(base, arg) {
  if (base === "projects" && arg) {
    const p = PROJECTS.find((x) => x.id === arg);
    document.title = p ? `${p.title} · Sri Kotala` : ROUTE_TITLES.projects;
  } else {
    document.title = ROUTE_TITLES[base] || ROUTE_TITLES.home;
  }
}
