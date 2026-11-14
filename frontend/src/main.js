// main.js
import { route } from "./router/router.js";
import { applyLang } from "./i18n/translate.js";
import { resizeCanvas } from "./player/visualizer.js";
import "./ui/theme.js";
import "./ui/languageMenu.js";
import "./ui/mobileNav.js";
import "./ui/lightbox.js";
import "./ui/fabMenu.js";
import "./ui/clickDelegation.js";
import "./ui/uiSounds.js";
import "./ui/confetti.js";
import "./ui/selectionColor.js";
import "./player/mobileAudioUnlock.js";
import "./player/youtubeApi.js";
import "./pokemon/pokemonWidget.js";

window.addEventListener("hashchange", route);
requestAnimationFrame(resizeCanvas);
route();
applyLang("en");
