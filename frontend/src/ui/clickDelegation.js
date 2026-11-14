// clickDelegation.js
import { go } from "../router/router.js";
import { openLightbox } from "./lightbox.js";
import { closeAllFabMenus } from "./fabMenu.js";
import { vmRecording, vmStartRecording, vmStopRecording, vmRerecord, vmSend } from "../voicemail/recorder.js";
import { playRandom } from "../player/controls.js";

document.addEventListener("click", (e) => {
  const vmMic = e.target.closest("[data-vm-mic]");
  if (vmMic) { if (!vmMic.disabled) (vmRecording ? vmStopRecording() : vmStartRecording()); return; }
  if (e.target.closest("[data-vm-retry]")) { vmStartRecording(); return; }
  if (e.target.closest("[data-vm-rerecord]")) { vmRerecord(); return; }
  if (e.target.closest("[data-vm-send]")) { vmSend(); return; }
  const fabToggle = e.target.closest("[data-fab-toggle]");
  if (fabToggle) {
    e.preventDefault(); e.stopPropagation();
    const wrap = fabToggle.closest("[data-fabwrap]");
    const willOpen = !wrap.classList.contains("is-open");
    closeAllFabMenus();
    if (willOpen) { wrap.classList.add("is-open"); wrap.querySelector("[data-fab-menu]").hidden = false; fabToggle.setAttribute("aria-expanded", "true"); }
    return;
  }
  const open = e.target.closest("[data-open]");
  if (open) { window.open(open.dataset.open, "_blank", "noopener"); e.preventDefault(); e.stopPropagation(); closeAllFabMenus(); return; }
  if (!e.target.closest("[data-fab-menu]")) closeAllFabMenus();
  const proj = e.target.closest("[data-project]");
  if (proj) { go("projects/" + proj.dataset.project); return; }
  const photo = e.target.closest("[data-photo]");
  if (photo) { openLightbox(Number(photo.dataset.photo)); return; }
  const r = e.target.closest("[data-route]");
  if (r) { go(r.dataset.route); return; }
  const nav = e.target.closest("[data-nav]");
  if (nav) { go(nav.dataset.nav); return; }
  const lib = e.target.closest("[data-lib]");
  if (lib) { go(lib.dataset.lib); return; }
  if (e.target.closest("[data-play-first]")) { playRandom(); }
});
