/* ============================================================
   app.js — Spotify x Sri Kotala portfolio
   The entire site is a Spotify app. Sidebar items + cards are
   portfolio content; views render into the main panel (no reloads).
   Bottom player really plays the bundled demo tracks + visualizer.
   ============================================================ */
(function () {
  "use strict";

  /* ====================== CONTENT ====================== */
  const PROFILE = {
    name: "Sri Kotala",
    tagline: "CS & Strategic Communication · UMN-TC",
    headshot: "./assets/headshot-angel.jpg",
    intro: 'Hi, I’m Sri, an AI Engineer, Marketer, Writer, &amp; <span class="highlight">connoisseur</span> of all things interesting',
    bio: [
      "I live in Minneapolis, Minnesota and I’m on a mission to learn as many things as possible!",
      "Software Engineering is like building with Legos and Marketing is like getting everybody to look at my Legos.",
      "I wear multiple hats and bounce between leading teams to being a team player. My ultimate goal is to create impactful, inclusive innovations in technology and media.",
      "In my free time, you’ll find me writing short stories, on late night runs, studying for the DELE (Spanish Certification), and spending time with my family in the lulling flatlands of Fargo, North Dakota.",
    ],
  };

  const PROJECTS = [
    { id: "aifilemanager", title: "AIFileManager", kind: "GitHub Repository", url: "https://github.com/itzskoala", img: "./assets/placeholders/aifilemanager.jpg", c1: "#e58e26", c2: "#f9d423", tags: ["ETL", "Ollama", "Langchain", "SQL Database"], desc: "An AI-powered file manager built with an ETL pipeline, Ollama, and a SQL database." },
    { id: "talk2me", title: "Talk2Me", kind: "Hugging Face Space", url: "https://huggingface.co/spaces/holasoykoalo7/ai-me", img: "./assets/placeholders/talk-2-me.png", c1: "#5f2c82", c2: "#49a09d", tags: ["HuggingFace", "Gradio"], desc: "An interactive AI chat experience that allows you to talk to me." },
    { id: "paradise", title: "Paradise Builder", kind: "GitHub Repository", url: "https://github.com/itzskoala/vacation-builder", img: "./assets/placeholders/paradise-icon.jpg", c1: "#f7971e", c2: "#ffd200", tags: ["CrewAI", "Context Engineering", "AgenticAI", "Google Travel Explore API"], desc: "A trip-planning project via a crew of agents." },
    { id: "crewai", title: "Content Creator w/ CrewAI", kind: "GitHub Repository", url: "https://github.com/itzskoala/content-creator-flow", img: "./assets/placeholders/social-media-ai.png", c1: "#c33764", c2: "#1d2671", tags: ["CrewAI", "Image Generation", "Serper API"], desc: "A multi-agent social media content workflow built with CrewAI." },
    { id: "brains", title: "Brains vs. Brawn", kind: "GitHub Repository", url: "https://github.com/itzskoala/brains-versus-brawns", img: "./assets/placeholders/ai-ufc.jpg", c1: "#11998e", c2: "#38ef7d", tags: ["Regression Models", "Neural Networks", "EDA", "K-means Clustering"], desc: "An ML project pitting strategy against strength." },
    { id: "adriana", title: "AdrianaOye", kind: "GitHub Repository", url: "https://github.com/itzskoala/AdrianaOye", img: "./assets/placeholders/icon-social-listening.jpg", c1: "#0f2027", c2: "#2c5364", tags: ["Social Listening", "NLP", "Web Scrapping"], desc: "A social-listening application I made for Telemundo Minnesota." },
    { id: "quotify", title: "Quotable", kind: "GitHub Repository", url: "https://github.com/itzskoala/quotify", img: "./assets/placeholders/icon-quotify.png", c1: "#1d976c", c2: "#93f9b9", tags: ["Content-Based Filtering", "UI/UX", "Social Media Marketing", "Graphic Design", "App Development"], desc: "A motivational quotes app." },
    { id: "eda", title: "Exploratory Data Analysis", kind: "GitHub Repository", url: "https://github.com/itzskoala/exploratory-data-analysis", img: "./assets/placeholders/icon-eda.png", c1: "#373b44", c2: "#4286f4", tags: ["Pandas", "EDA", "Evaluation Metrics"], desc: "Data exploration of different datasets in Python." },
  ];

  const EXPERIENCE = {
    work: [
      { name: "Software Engineer — Legal Technology", sub: "Minnesota Public Radio", meta: "Jun 2026 – Present" },
      { name: "Account Executive", sub: "Telemundo Minnesota", meta: "Jun 2026 – Present" },
      { name: "Research Assistant", sub: "Hubbard School of Journalism & Mass Communication", meta: "Sep 2024 – May 2026" },
      { name: "Teaching Assistant", sub: "UMN College of Science & Engineering", meta: "Jan 2024 – May 2026" },
      { name: "ML Engineer — NSF REU", sub: "North Dakota State University / Universidad de Chile", meta: "May 2024 – Aug 2024" },
    ],
    education: [
      { name: "B.A. Computer Science", sub: "University of Minnesota Twin Cities", meta: "Class of 2026 · GPA 3.67" },
      { name: "B.A. Strategic Communication: Advertising & PR", sub: "University of Minnesota Twin Cities", meta: "Class of 2026 · GPA 3.94" },
    ],
    research: [
      { name: "Feature Selection in Medical ML", sub: "NSF REU @ NDSU", meta: "May 2024 - August 2026" },
      { name: "Political Communication & AI", sub: "Hubbard School, UMN · 2026 ICA Finalist", meta: "Sep 2024 – May 2026" },
    ],
    awards: [
      { name: "2026 International Communication Association (ICA) Finalist", meta: "2026" },
      { name: "UMN Undergraduate Research Scholarship", meta: "2024 – 2025" },
      { name: "Dean's List, College of Liberal Arts", meta: "2023 – 2025" },
    ],
    documents: [
      { title: "Resume", kind: "PDF", url: "https://drive.google.com/file/d/1ezYjvkXrSOFABlV-6Ye4bsRwKC7lWHEo/view", c1: "#7a0019", c2: "#ffc72c" },
      { title: "ML / NSF Research Poster", kind: "PDF", url: "https://www.ndsu.edu/sites/default/files/fileadmin/cs/REU_Posters/Kotala_FS_Poster.pdf", c1: "#373b44", c2: "#4286f4" },
      { title: "GenAI + Political Communication", kind: "Paper", url: "https://drive.google.com/file/d/1mlgH7KUyDHaKGrPODIjCrjtLPGBSv-T4/view", c1: "#c33764", c2: "#1d2671" },
    ],
  };

  const PHOTOS = [
    { src: "./assets/photography/caribbean-sunset.jpg", cap: "Sunset on the Caribbean" },
    { src: "./assets/photography/turtles-crystal-springs.jpg", cap: "Turtles in Crystal Springs" },
    { src: "./assets/photography/glacier.jpg", cap: "Mirador Grey, Patagonia" },
    { src: "./assets/photography/clam.jpg", cap: "Clam on a Chilean beach" },
    { src: "./assets/photography/cat.jpg", cap: "City cat" },
    { src: "./assets/photography/rambo.JPG", cap: "My dog" },
    { src: "./assets/photography/city.jpg", cap: "Valparaíso, Chile" },
    { src: "./assets/photography/fishes.jpg", cap: "Cool Mexican fish" },
    { src: "./assets/photography/lizard.jpg", cap: "Mrs. Kipling!?" },
    { src: "./assets/photography/roses.jpeg", cap: "Red tulips" },
    { src: "./assets/photography/statue.jpg", cap: "Sentado frente al mar" },
  ];

  const LINKS = [
    { title: "LinkedIn", sub: "in/skotala", url: "https://linkedin.com/in/skotala/", c1: "#0a66c2", c2: "#0a66c2", icon: '<path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM0 8h5v16H0zM7.5 8h4.78v2.2h.07c.66-1.25 2.27-2.57 4.67-2.57 5 0 5.93 3.29 5.93 7.57V24h-5v-7.1c0-1.69-.03-3.86-2.35-3.86-2.35 0-2.71 1.84-2.71 3.74V24h-5z" fill="currentColor"/>' },
    { title: "GitHub", sub: "itzskoala", url: "https://github.com/itzskoala", c1: "#333", c2: "#111", icon: '<path d="M12 .5C5.7.5.7 5.5.7 11.8c0 5 3.2 9.2 7.7 10.7.6.1.8-.3.8-.6v-2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.3-1.6-1.3-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.6 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.6 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-3 0 0 1-.3 3.1 1.1a10.7 10.7 0 0 1 5.6 0C16.9 4.7 18 5 18 5c.6 1.6.2 2.7.1 3 .7.8 1.1 1.8 1.1 3 0 4.4-2.6 5.3-5.1 5.6.4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6 4.5-1.5 7.7-5.7 7.7-10.7C23.3 5.5 18.3.5 12 .5z" fill="currentColor"/>' },
    { title: "Email", sub: "sri.kotala@gmail.com", url: "mailto:sri.kotala@gmail.com", c1: "#7a0019", c2: "#ffc72c", icon: '<rect x="3" y="5.5" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 7.5 12 13 20.5 7.5" fill="none" stroke="currentColor" stroke-width="1.7"/>' },
    { title: "Strava", sub: "Stalk my runs", url: "https://www.strava.com/athletes/45513083", c1: "#fc4c02", c2: "#fc4c02", icon: '<path d="M9 0 3 12h4l2-4 2 4h4zM13 12l-2 4-2-4H6l5 10 5-10z" fill="currentColor"/>' },
    { title: "Book 30 min with me", sub: "Google Calendar", url: "https://calendar.app.google/rDoTnrGBcHyW3qWQ7", c1: "#11998e", c2: "#38ef7d", icon: '<rect x="3" y="4.5" width="18" height="17" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3 9h18M8 2.5v4M16 2.5v4" stroke="currentColor" stroke-width="1.7"/>' },
  ];

  // Music library. Each playlist is a folder of songs. To add a song, paste a
  // YouTube URL as `yt` — cover art loads from the thumbnail. To add a whole
  // playlist, append another { name, tracks: [...] } object.
  const PLAYLISTS = [
    { name: "Español", tracks: [
      { title: "Eres para Mí", artist: "Julieta Venegas", yt: "https://www.youtube.com/watch?v=gvjjheYHfO0" },
      { title: "Don", artist: "Miranda!", yt: "https://www.youtube.com/watch?v=32DOcN9A0TQ" },
      { title: "Lento", artist: "Julieta Venegas", yt: "https://www.youtube.com/watch?v=ZSIzwYzCkHQ" },
      { title: "Mismo Amor", artist: "Julieta Venegas", yt: "https://www.youtube.com/watch?v=wKSd0rdD1a4" },
      { title: "VOY A LLeVARTE PA PR", artist: "Bad Bunny", yt: "https://www.youtube.com/watch?v=uE_pyM3X-e0" },
      { title: "Ojitos Lindos", artist: "Bad Bunny & Bomba Estéreo", yt: "https://www.youtube.com/watch?v=qYymWg2Y_as" },
      { title: "La Chona", artist: "Los Tucanes De Tijuana", yt: "https://www.youtube.com/watch?v=41xlHlhGz7o" },
      { title: "Latina Foreva", artist: "Karol G", yt: "https://www.youtube.com/watch?v=BgMU9Vuj17Y" },
      { title: "Una Noche en Medellín (Remix)", artist: "Karol G, Cris Mj, Ryan Castro", yt: "https://www.youtube.com/watch?v=jWNXYYVHeJI" },
    ] },
    { name: "Telugu", tracks: [
      { title: "Jenniper Lopez", artist: "Benny Dayal", yt: "https://www.youtube.com/watch?v=rEFE9467bKU" },
      { title: "Apudo Ipudo", artist: "Siddharth", yt: "https://www.youtube.com/watch?v=zx1-Z5PJkfg" },
      { title: "Mr. Perfect", artist: "Devi Sri Prasad", yt: "https://www.youtube.com/watch?v=KFVmCzasRLE" },
      { title: "Sweety Sweety", artist: "Thaman S", yt: "https://www.youtube.com/watch?v=nR7utMjx0lY" },
      { title: "Run Run", artist: "Devi Sri Prasad", yt: "https://www.youtube.com/watch?v=pEc372Ymze4" },
      { title: "Pimple Dimple", artist: "Ranina Reddy & Sagar", yt: "https://www.youtube.com/watch?v=u8_P9AX8osk" },
      { title: "Top Lesi Poddi", artist: "Geetha Madhuri & Sagar", yt: "https://www.youtube.com/watch?v=QFkTD_2-Rsc" },
      { title: "Ayyo Paapam", artist: "Mamta Sharma & Ranjith", yt: "https://www.youtube.com/watch?v=yDfQmx9BPVo" },
      { title: "Sir Osthara", artist: "Suchitra", yt: "https://www.youtube.com/watch?v=zwx8MzlPi9w" },
    ] },
    { name: "Hindi", tracks: [
      { title: "Lutt Le Gaya", artist: "Shashwat Sachdev", yt: "https://www.youtube.com/watch?v=84Lc9SYzGSM" },
      { title: "Ishq Jalakar (Karvaan)", artist: "Shashwat Sachdev", yt: "https://www.youtube.com/watch?v=_dV23pgH3Ng" },
      { title: "Run Down The City (Monica)", artist: "Shashwat Sachdev", yt: "https://www.youtube.com/watch?v=IGtIUhNprbk" },
      { title: "Destiny (Mann Atkeya)", artist: "Shashwat Sachdev", yt: "https://www.youtube.com/watch?v=qoVARB96kuM" },
      { title: "Move (Yeh Ishq Ishq)", artist: "Shashwat Sachdev", yt: "https://www.youtube.com/watch?v=CFM3r9TEKXc" },
      { title: "Didi (Sher-E-Baloch)", artist: "Shashwat Sachdev", yt: "https://www.youtube.com/watch?v=C7xkqKq9Z14" },
      { title: "Teri Ni Kararan", artist: "Shashwat Sachdev", yt: "https://www.youtube.com/watch?v=DbrnTlzo3rE" },
      { title: "Hawa Hawa", artist: "Hassan Jahangir", yt: "https://www.youtube.com/watch?v=X8t8axbZnH8" },
      { title: "Behti Hawa Sa Tha Woh", artist: "Shaan, Shantanu Moitra", yt: "https://www.youtube.com/watch?v=YEQNI92bagk" },
      { title: "Zoobi Doobi", artist: "Sonu Nigam", yt: "https://www.youtube.com/watch?v=sxB4bCU0F60" },
      { title: "Aal Izz Well", artist: "Sonu Nigam", yt: "https://www.youtube.com/watch?v=FEDZUR6WLnU" },
    ] },
    { name: "English", tracks: [
      { title: "Illegal", artist: "PinkPantheress", yt: "https://www.youtube.com/watch?v=XuKq7zT_0nM" },
      { title: "Stars", artist: "PinkPantheress", yt: "https://www.youtube.com/watch?v=eh59FZMLvLA" },
      { title: "Stateside", artist: "PinkPantheress", yt: "https://www.youtube.com/watch?v=Ma16tc9GmK0" },
      { title: "Romeo", artist: "PinkPantheress", yt: "https://www.youtube.com/watch?v=yyJNQ5zcZuI" },
      { title: "Tonight", artist: "PinkPantheress", yt: "https://www.youtube.com/watch?v=AsJIueO_Q9E" },
      { title: "Illegal (feat. Anitta)", artist: "PinkPantheress", yt: "https://www.youtube.com/watch?v=k8kOK55LaW8" },
      { title: "Chicago", artist: "Michael Jackson", yt: "https://www.youtube.com/watch?v=wAoq__SQpwk" },
      { title: "Remember the Time", artist: "Michael Jackson", yt: "https://www.youtube.com/watch?v=qM19eRgOK1Q" },
      { title: "Slave to the Rhythm", artist: "Michael Jackson", yt: "https://www.youtube.com/watch?v=6l-t1uoS-lw" },
      { title: "Human Nature", artist: "Michael Jackson", yt: "https://www.youtube.com/watch?v=oqLpko9Gprs" },
      { title: "A Place With No Name", artist: "Michael Jackson", yt: "https://www.youtube.com/watch?v=sjYD-OUZ1t8" },
      { title: "Don't Stop 'Til You Get Enough", artist: "Michael Jackson", yt: "https://www.youtube.com/watch?v=n3qQtSRmHxo" },
      { title: "P.Y.T. (Pretty Young Thing)", artist: "Michael Jackson", yt: "https://www.youtube.com/watch?v=y32ejtuxSjM" },
      { title: "Beat It", artist: "Michael Jackson", yt: "https://www.youtube.com/watch?v=kOn-HdEg6AQ" },
      { title: "Black or White", artist: "Michael Jackson", yt: "https://www.youtube.com/watch?v=m-y_IxPcx8U" },
      { title: "Thriller", artist: "Michael Jackson", yt: "https://www.youtube.com/watch?v=Z85lxckrtzg" },
      { title: "Girl Like Me", artist: "PinkPantheress", yt: "https://www.youtube.com/watch?v=D24dn9eXTwA" },
    ] },
  ];
  // Flatten into one list the player indexes into; each playlist keeps its global indices.
  const TRACKS = [];
  PLAYLISTS.forEach((p) => { p.trackIdx = p.tracks.map((t) => { TRACKS.push(t); return TRACKS.length - 1; }); });

  const SECTIONS = [
    { id: "about",      name: "This Is Sri Kotala", sub: "Artist profile",     emoji: "🐨", img: "./assets/headshot-angel.jpg", c1: "#7a0019", c2: "#ffc72c" },
    { id: "projects",   name: "Projects",           sub: PROJECTS.length + " builds", emoji: "🛠️", img: "./assets/covers/projects.jpg", c1: "#5f2c82", c2: "#49a09d" },
    { id: "experience", name: "Experience & Research", sub: "Resume",          emoji: "💼", img: "./assets/covers/experience.jpg", c1: "#c33764", c2: "#1d2671" },
    { id: "photos",     name: "Photography",        sub: PHOTOS.length + " photos",   emoji: "📷", img: "./assets/covers/photography.jpg", c1: "#f7971e", c2: "#ffd200" },
    { id: "connect",    name: "Let's Connect",      sub: "Links & booking",    emoji: "💬", img: "./assets/covers/connect.jpg", c1: "#11998e", c2: "#38ef7d" },
  ];

  /* ====================== HELPERS ====================== */
  const $ = (s, c) => (c || document).querySelector(s);
  const grad = (a, b) => `linear-gradient(135deg, ${a}, ${b})`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  const playSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  // Pull the 11-char video id out of any YouTube URL form (watch?v=, youtu.be/, embed/, shorts/).
  const ytId = (url) => { const m = String(url).match(/(?:v=|\/embed\/|youtu\.be\/|\/shorts\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(url) ? url : ""); };
  const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const extSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M9 7h8v8"/></svg>';

  const main = $("[data-main]");
  const viewEl = $("[data-view]");

  /* ====================== VIEW RENDERERS ====================== */
  function projectCard(p) {
    return `<div class="card" data-project="${p.id}">
      <div class="card-art"><img src="${p.img}" alt="${esc(p.title)}" loading="lazy"></div>
      <div class="card-title">${esc(p.title)}</div>
      <div class="card-sub">${esc(p.kind)}</div>
      <button class="card-fab" data-open="${esc(p.url)}" aria-label="Open ${esc(p.title)}">${playSvg}</button>
    </div>`;
  }

  function tile(s) {
    return `<div class="tile" data-route="${s.id}">
      <div class="tile-cover" style="background:${grad(s.c1, s.c2)}">${s.img ? `<img src="${s.img}" alt="">` : s.emoji}</div>
      <div class="tile-name">${esc(s.name)}</div>
      <button class="tile-fab" data-route="${s.id}" aria-label="Open ${esc(s.name)}">${playSvg}</button>
    </div>`;
  }

  function viewHome() {
    const h = new Date().getHours();
    const greet = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    return { tint: "#1f1f1f", html: `<div class="view-pad">
      <h1 class="greeting">${greet}!</h1>
      <p class="greeting-sub">Welcome to my tiny corner of the internet!</p>
      <div class="tiles">${SECTIONS.map(tile).join("")}</div>

      <div class="shelf-head"><h2>Featured Projects</h2><button class="show-all" data-route="projects">Show all</button></div>
      <div class="grid">${PROJECTS.slice(0, 5).map(projectCard).join("")}</div>

      <div class="shelf-head"><h2>From the camera roll</h2><button class="show-all" data-route="photos">Show all</button></div>
      <div class="grid">${PHOTOS.slice(0, 5).map((p, i) => `
        <div class="card" data-photo="${i}">
          <div class="card-art"><img src="${p.src}" alt="${esc(p.cap)}" loading="lazy"></div>
          <div class="card-title">${esc(p.cap)}</div>
          <div class="card-sub">Photo</div>
        </div>`).join("")}</div>
    </div>`};
  }

  function viewAbout() {
    const popular = PROJECTS.slice(0, 4).map((p, i) => `
      <div class="track-row link" data-project="${p.id}">
        <span class="track-idx">${i + 1}</span>
        <div class="track-main"><div class="track-name">${esc(p.title)}</div><div class="track-sub">${esc(p.kind)}</div></div>
        <span class="track-meta">${esc(p.tags[0] || "")}</span>
      </div>`).join("");
    return { tint: "#7a001933", hero: "#5a0013", html: `
      <div class="hero" style="--hero-c:#5a0013">
        <div class="hero-cover round"><img src="${PROFILE.headshot}" alt="Sri Kotala"></div>
        <div>
          <h1 class="hero-title">${esc(PROFILE.name)}</h1>
          <div class="hero-meta">${esc(PROFILE.tagline)}</div>
        </div>
      </div>
      <div class="action-bar">
        <button class="play-big" data-play-first aria-label="Play">${playSvg}</button>
        <button class="ghost-btn" data-route="connect">Follow</button>
      </div>
      <div class="view-pad">
        <div class="about-card">
          <img src="./assets/headshot.png" alt="Sri Kotala">
          <div><h2 class="about-lead">${PROFILE.intro}</h2>${PROFILE.bio.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
        </div>
        <div class="section-label">Popular</div>
        <div class="tracklist">${popular}</div>
      </div>
    `};
  }

  function viewProjects() {
    return { tint: "#3a2150", html: `
      <div class="hero" style="--hero-c:#3a2150;padding-top:48px">
        <div class="hero-cover"><img src="./assets/covers/projects.jpg" alt=""></div>
        <div>
          <div class="hero-kind">Playlist</div>
          <h1 class="hero-title">Projects</h1>
          <div class="hero-meta">${esc(PROFILE.name)} · ${PROJECTS.length} builds</div>
        </div>
      </div>
      <div class="view-pad"><div class="grid">${PROJECTS.map(projectCard).join("")}</div></div>
    `};
  }

  function viewProjectDetail(id) {
    const p = PROJECTS.find((x) => x.id === id) || PROJECTS[0];
    return { tint: p.c1 + "55", html: `
      <div class="hero" style="--hero-c:${p.c1}">
        <div class="hero-cover"><img src="${p.img}" alt="${esc(p.title)}"></div>
        <div>
          <div class="hero-kind">Project</div>
          <h1 class="hero-title">${esc(p.title)}</h1>
          <div class="hero-meta"><b>${esc(PROFILE.name)}</b> · ${esc(p.kind)}</div>
        </div>
      </div>
      <div class="action-bar">
        <button class="play-big" data-open="${esc(p.url)}" aria-label="Open project">${playSvg}</button>
      </div>
      <div class="view-pad">
        <p style="max-width:620px;line-height:1.6;color:var(--muted)">${esc(p.desc)}</p>
        <div class="tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        <div class="section-label">More by Sri</div>
        <div class="grid">${PROJECTS.filter((x) => x.id !== p.id).slice(0, 4).map(projectCard).join("")}</div>
      </div>
    `};
  }

  function trackRows(list) {
    return list.map((e, i) => `
      <div class="track-row">
        <span class="track-idx">${i + 1}</span>
        <div class="track-main"><div class="track-name">${esc(e.name)}</div>${e.sub ? `<div class="track-sub">${esc(e.sub)}</div>` : ""}</div>
        <span class="track-meta">${esc(e.meta || "")}</span>
      </div>`).join("");
  }

  function viewExperience() {
    const docs = EXPERIENCE.documents.map((d) => `
      <div class="card" data-open="${esc(d.url)}">
        <div class="card-art" style="background:${grad(d.c1, d.c2)};font-size:2rem">📄</div>
        <div class="card-title">${esc(d.title)}</div>
        <div class="card-sub">${esc(d.kind)} ↗</div>
      </div>`).join("");
    return { tint: "#2a1840", hero: "#5b2a6e", html: `
      <div class="hero" style="--hero-c:#5b2a6e;padding-top:48px">
        <div class="hero-cover"><img src="./assets/covers/experience.jpg" alt=""></div>
        <div>
          <div class="hero-kind">Playlist</div>
          <h1 class="hero-title">Experience</h1>
          <div class="hero-meta">${esc(PROFILE.name)} · work, education, research & awards</div>
        </div>
      </div>
      <div class="view-pad">
        <div class="section-label">Work Experience</div><div class="tracklist">${trackRows(EXPERIENCE.work)}</div>
        <div class="section-label">Education</div>
        <div class="edu-block">
          <img class="edu-logo" src="./assets/umn-goldy.png" onerror="this.onerror=null;this.src='./assets/umn.svg'" alt="University of Minnesota">
          <div class="tracklist">${trackRows(EXPERIENCE.education)}</div>
        </div>
        <div class="section-label">Research</div><div class="tracklist">${trackRows(EXPERIENCE.research)}</div>
        <div class="section-label">Awards & Achievements</div><div class="tracklist">${trackRows(EXPERIENCE.awards)}</div>
        <div class="section-label">Documents</div><div class="grid">${docs}</div>
      </div>
    `};
  }

  function viewPhotos() {
    return { tint: "#5a3a10", hero: "#8a5a14", html: `
      <div class="hero" style="--hero-c:#8a5a14;padding-top:48px">
        <div class="hero-cover"><img src="./assets/covers/photography.jpg" alt=""></div>
        <div>
          <div class="hero-kind">Playlist</div>
          <h1 class="hero-title">Photography</h1>
          <div class="hero-meta">${esc(PROFILE.name)} · the world through my eyes</div>
        </div>
      </div>
      <div class="view-pad"><div class="photo-grid">${PHOTOS.map((p, i) => `
        <div class="photo" data-photo="${i}">
          <img src="${p.src}" alt="${esc(p.cap)}" loading="lazy">
          <div class="photo-cap">${esc(p.cap)}</div>
        </div>`).join("")}</div></div>
    `};
  }

  function viewConnect() {
    return { tint: "#0d4d3f", hero: "#0f6b56", html: `
      <div class="hero" style="--hero-c:#0f6b56;padding-top:48px">
        <div class="hero-cover"><img src="./assets/covers/connect.jpg" alt=""></div>
        <div>
          <div class="hero-kind">Playlist</div>
          <h1 class="hero-title">Let's Connect</h1>
          <div class="hero-meta">Let's be friends 😄</div>
        </div>
      </div>
      <div class="view-pad">
        <div class="connect-grid">${LINKS.map((l) => `
          <a class="connect-card" href="${esc(l.url)}" target="_blank" rel="noreferrer" data-tick>
            <div class="ico" style="background:${grad(l.c1, l.c2)}"><svg viewBox="0 0 24 24">${l.icon}</svg></div>
            <h3>${esc(l.title)}</h3><span>${esc(l.sub)}</span>
          </a>`).join("")}</div>
      </div>
    `};
  }

  function viewSearch(q) {
    // Lowercase + strip accents so "fotografia" matches "Fotografía", etc.
    const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Searchable text includes both the English source and its Spanish translation,
    // so queries match in either language regardless of the active language.
    const both = (s) => norm(s + " " + (typeof I18N !== "undefined" && I18N[s] ? I18N[s] : ""));
    const query = norm((q || "").trim());
    if (!query) {
      return { tint: "#1f1f1f", html: `<div class="view-pad">
        <h1 class="greeting">Search</h1>
        <p style="color:var(--muted)">Browse everything</p>
        <div class="tiles">${SECTIONS.map(tile).join("")}</div></div>` };
    }
    const proj = PROJECTS.filter((p) => (both(p.title) + " " + norm(p.tags.join(" ")) + " " + both(p.kind) + " " + both(p.desc)).includes(query));
    const secs = SECTIONS.filter((s) => both(s.name).includes(query));
    const phs = PHOTOS.map((p, i) => ({ p, i })).filter((x) => both(x.p.cap).includes(query));
    let html = `<div class="view-pad"><h1 class="greeting">Results for "${esc(query)}"</h1>`;
    if (secs.length) html += `<div class="section-label">Sections</div><div class="tiles">${secs.map(tile).join("")}</div>`;
    if (proj.length) html += `<div class="section-label">Projects</div><div class="grid">${proj.map(projectCard).join("")}</div>`;
    if (phs.length) html += `<div class="section-label">Photos</div><div class="photo-grid">${phs.map((x) => `<div class="photo" data-photo="${x.i}"><img src="${x.p.src}" alt="${esc(x.p.cap)}"><div class="photo-cap">${esc(x.p.cap)}</div></div>`).join("")}</div>`;
    if (!secs.length && !proj.length && !phs.length) html += `<p style="color:var(--muted)">Nothing found.</p>`;
    html += `</div>`;
    return { tint: "#1f1f1f", html };
  }

  /* ====================== ROUTER ====================== */
  const searchBox = $("[data-search-box]");
  const searchInput = $("[data-search-input]");

  function setHeaderTint(c) { main.style.setProperty("--header-tint", c || "var(--panel)"); }

  function render(out) {
    viewEl.className = "view fade-view";
    viewEl.innerHTML = out.html;
    if (typeof translateEl === "function") translateEl(viewEl);
    setHeaderTint(out.tint);
    main.scrollTop = 0;
  }

  function route() {
    const hash = (location.hash || "#home").slice(1);
    const [base, arg] = hash.split("/");
    searchBox.classList.toggle("show", base === "search");
    let out;
    if (base === "home") out = viewHome();
    else if (base === "about") out = viewAbout();
    else if (base === "projects" && arg) out = viewProjectDetail(arg);
    else if (base === "projects") out = viewProjects();
    else if (base === "experience") out = viewExperience();
    else if (base === "photos") out = viewPhotos();
    else if (base === "connect") out = viewConnect();
    else if (base === "search") out = viewSearch(searchInput.value);
    else out = viewHome();
    render(out);
    // active states
    document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("is-active", a.dataset.nav === base));
    document.querySelectorAll("[data-lib]").forEach((li) => li.classList.toggle("is-active", li.dataset.lib === base));
  }

  function go(hash) { if (location.hash === "#" + hash) route(); else location.hash = hash; }

  /* ====================== CLICK DELEGATION ====================== */
  document.addEventListener("click", (e) => {
    const open = e.target.closest("[data-open]");
    if (open) { window.open(open.dataset.open, "_blank", "noopener"); e.preventDefault(); e.stopPropagation(); return; }
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

  searchInput.addEventListener("input", () => { if ((location.hash || "").startsWith("#search")) render(viewSearch(searchInput.value)); else go("search"); });
  $("[data-back]").addEventListener("click", () => history.back());
  $("[data-fwd]").addEventListener("click", () => history.forward());

  /* ====================== LIGHTBOX ====================== */
  const lb = $("[data-lightbox]"), lbImg = $("[data-lb-img]"), lbCap = $("[data-lb-cap]");
  function openLightbox(i) { const p = PHOTOS[i]; if (!p) return; lbImg.src = p.src; lbCap.textContent = p.cap; lb.classList.add("show"); }
  function closeLightbox() { lb.classList.remove("show"); lbImg.src = ""; }
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest("[data-lb-close]")) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  /* ====================== PLAYER (YouTube) + VISUALIZER ====================== */
  const canvas = $("[data-viz]"), ctx2d = canvas.getContext("2d");
  const sp = $(".sp");
  const nowArt = $("[data-now-art]"), nowTitle = $("[data-now-title]"), nowArtist = $("[data-now-artist]");
  const seekEl = $("[data-seek]"), curEl = $("[data-cur]"), durEl = $("[data-dur]"), volEl = $("[data-volume]");
  const iconPlay = $("[data-icon-play]"), iconPause = $("[data-icon-pause]");
  const btnShuffle = $("[data-shuffle]"), btnRepeat = $("[data-repeat]");
  const fmt = (s) => isFinite(s) ? Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0") : "0:00";

  let queue = TRACKS.map((_, i) => i), cur = -1, shuffle = false, repeat = false;
  let yt = null, ytReady = false, wantPlay = -1, isPlaying = false, seeking = false, raf, poll, errCount = 0;

  // ---- YouTube IFrame API (hidden player streams the audio) ----
  window.onYouTubeIframeAPIReady = function () {
    yt = new YT.Player("yt-host", {
      height: "1", width: "1",
      playerVars: { controls: 0, disablekb: 1, playsinline: 1, rel: 0 },
      events: {
        onReady: () => { ytReady = true; yt.setVolume(+volEl.value); if (wantPlay > -1) { const i = wantPlay; wantPlay = -1; playPos(i); } },
        onStateChange: onYtState,
        onError: onYtError,
      },
    });
  };

  // A video that can't be embedded fires onError. Skip to the next one, but stop
  // after we've tried the whole queue so it can't cascade-skip infinitely.
  function onYtError() {
    errCount++;
    if (errCount >= queue.length) { errCount = 0; isPlaying = false; reflectPlay(); nowArtist.textContent = tstr("Unavailable — try another song"); return; }
    playPos(cur + 1);
  }
  (function loadYtApi() { const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s); })();

  function onYtState(e) {
    const S = YT.PlayerState;
    if (e.data === S.PLAYING) { isPlaying = true; errCount = 0; reflectPlay(); startPoll(); if (!raf) draw(); }
    else if (e.data === S.PAUSED) { isPlaying = false; reflectPlay(); }
    else if (e.data === S.ENDED) {
      isPlaying = false; reflectPlay();
      if (repeat) { yt.seekTo(0, true); yt.playVideo(); return; }
      // A video that "ends" at ~0s never really played — treat as an error, not a real finish.
      if (((yt.getCurrentTime && yt.getCurrentTime()) || 0) < 1) return onYtError();
      errCount = 0; playPos(cur + 1);
    }
    syncQueue();
  }
  function reflectPlay() {
    sp.classList.toggle("playing", isPlaying);
    iconPlay.style.display = isPlaying ? "none" : "";
    iconPause.style.display = isPlaying ? "" : "none";
  }

  // ---- decorative visualizer (YouTube audio isn't accessible to the page) ----
  function resizeCanvas() { const d = window.devicePixelRatio || 1; canvas.width = canvas.clientWidth * d; canvas.height = canvas.clientHeight * d; ctx2d.setTransform(d, 0, 0, d, 0, 0); }
  window.addEventListener("resize", resizeCanvas);
  const NB = 48, bars = new Array(NB).fill(0);
  function draw() {
    raf = requestAnimationFrame(draw);
    const w = canvas.clientWidth, h = canvas.clientHeight; ctx2d.clearRect(0, 0, w, h);
    const t = performance.now() / 1000, bw = w / NB;
    for (let i = 0; i < NB; i++) {
      const target = isPlaying
        ? (0.28 + 0.72 * Math.abs(Math.sin(i * 0.5 + t * 3.1) * Math.sin(i * 0.13 + t * 1.7))) * (0.55 + Math.random() * 0.45)
        : 0.02;
      bars[i] += (target - bars[i]) * 0.25;
      const bh = bars[i] * h * 0.95, x = i * bw;
      const g = ctx2d.createLinearGradient(0, h, 0, h - bh);
      g.addColorStop(0, "rgba(122,0,25,.95)"); g.addColorStop(1, "rgba(255,199,44,.55)");
      ctx2d.fillStyle = g; ctx2d.fillRect(x + bw * 0.15, h - bh, bw * 0.7, bh);
    }
    if (!isPlaying && bars.every((b) => b < 0.03)) { cancelAnimationFrame(raf); raf = 0; ctx2d.clearRect(0, 0, w, h); }
  }

  // ---- progress polling (YouTube has no timeupdate event) ----
  function startPoll() {
    if (poll) return;
    poll = setInterval(() => {
      if (!ytReady || seeking || !isPlaying) return;
      const d = yt.getDuration() || 0, c = yt.getCurrentTime() || 0;
      if (d) { seekEl.value = (c / d) * 1000; seekEl.style.setProperty("--f", (c / d) * 100 + "%"); }
      curEl.textContent = fmt(c); durEl.textContent = fmt(d);
    }, 250);
  }

  function loadTrack(idx, autoplay) {
    const t = TRACKS[idx], id = ytId(t.yt);
    nowArt.textContent = "";
    nowArt.style.background = id ? `#000 center/cover no-repeat url(${ytThumb(id)})` : grad("#7a0019", "#ffc72c");
    nowTitle.textContent = t.title; nowArtist.textContent = t.artist;
    curEl.textContent = "0:00"; durEl.textContent = "0:00"; seekEl.value = 0; seekEl.style.setProperty("--f", "0%");
    if (typeof syncQueue === "function") syncQueue();
    if (!ytReady) { wantPlay = autoplay ? idx : -1; return; }
    if (autoplay) yt.loadVideoById(id); else yt.cueVideoById(id);
  }
  function play() { if (ytReady) yt.playVideo(); }
  function pause() { if (ytReady) yt.pauseVideo(); }
  function playPos(pos) { cur = (pos + queue.length) % queue.length; loadTrack(queue[cur], true); }
  function playTrack(idx) { let pos = queue.indexOf(idx); if (pos === -1) { queue = TRACKS.map((_, i) => i); pos = idx; } playPos(pos); }

  $("[data-playpause]").addEventListener("click", () => { if (cur === -1) return playRandom(); isPlaying ? pause() : play(); });
  $("[data-next]").addEventListener("click", () => { if (cur === -1) return playRandom(); playPos(cur + 1); });
  $("[data-prev]").addEventListener("click", () => { if (cur === -1) return playRandom(); if (ytReady && yt.getCurrentTime() > 3) yt.seekTo(0, true); else playPos(cur - 1); });
  btnShuffle.addEventListener("click", () => {
    shuffle = !shuffle; btnShuffle.classList.toggle("on", shuffle);
    const cTrack = cur > -1 ? queue[cur] : null;
    if (shuffle) for (let i = queue.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [queue[i], queue[j]] = [queue[j], queue[i]]; }
    else queue.sort((a, b) => a - b);
    if (cTrack !== null) cur = queue.indexOf(cTrack);
  });
  btnRepeat.addEventListener("click", () => { repeat = !repeat; btnRepeat.classList.toggle("on", repeat); });
  seekEl.addEventListener("input", () => { seeking = true; if (ytReady) { const d = yt.getDuration() || 0; curEl.textContent = fmt((seekEl.value / 1000) * d); } seekEl.style.setProperty("--f", (seekEl.value / 10) + "%"); });
  seekEl.addEventListener("change", () => { if (ytReady) { const d = yt.getDuration() || 0; yt.seekTo((seekEl.value / 1000) * d, true); } seeking = false; });
  // Volume + mute (single control). Clicking the speaker mutes/unmutes the music.
  const btnMute = $("[data-mute]"), volOn = $("[data-vol-on]"), volOff = $("[data-vol-off]");
  let lastVol = +volEl.value || 75;
  function applyVol(v) {
    v = Math.max(0, Math.min(100, v));
    if (ytReady) yt.setVolume(v);
    volEl.value = v; volEl.style.setProperty("--f", v + "%");
    const isMuted = v <= 0;
    volOn.style.display = isMuted ? "none" : "";
    volOff.style.display = isMuted ? "" : "none";
    btnMute.classList.toggle("on", isMuted);
    btnMute.title = isMuted ? "Unmute" : "Mute";
  }
  volEl.addEventListener("input", () => { const v = +volEl.value; if (v > 0) lastVol = v; applyVol(v); });
  btnMute.addEventListener("click", () => { if (+volEl.value > 0) { lastVol = +volEl.value; applyVol(0); } else { applyVol(lastVol || 75); } });
  applyVol(+volEl.value);

  /* ====================== LIBRARY / PLAYLIST PANEL ====================== */
  const qPanel = $("[data-queue-panel]"), qBtn = $("[data-queue-toggle]");
  let libView = null; // null = library root; otherwise the open playlist object
  const artBg = (yt) => { const id = ytId(yt); return id ? `#000 center/cover no-repeat url(${ytThumb(id)})` : grad("#7a0019", "#ffc72c"); };
  const chevR = '<svg class="queue-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';
  const chevL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>';

  function renderPanel() {
    if (!libView) {
      qPanel.innerHTML =
        `<div class="queue-head"><span>Your Library</span><span class="queue-count">${PLAYLISTS.length} playlist${PLAYLISTS.length === 1 ? "" : "s"}</span></div>` +
        `<div class="queue-list">${PLAYLISTS.map((p, pi) => `
          <div class="queue-item" data-pl="${pi}">
            <div class="queue-art" style="background:${artBg(p.tracks[0] && p.tracks[0].yt)}"></div>
            <div class="queue-info"><div class="queue-title">${esc(p.name)}</div><div class="queue-artist">Playlist · ${p.tracks.length} songs</div></div>
            <button class="queue-playbtn" data-play-pl="${pi}" aria-label="Play ${esc(p.name)}" title="Play playlist">${playSvg}</button>
            ${chevR}
          </div>`).join("")}</div>`;
      qPanel.querySelectorAll("[data-pl]").forEach((el) => el.addEventListener("click", (e) => { e.stopPropagation(); libView = PLAYLISTS[+el.dataset.pl]; renderPanel(); }));
      qPanel.querySelectorAll("[data-play-pl]").forEach((el) => el.addEventListener("click", (e) => { e.stopPropagation(); playPlaylist(PLAYLISTS[+el.dataset.playPl]); syncQueue(); }));
    } else {
      const p = libView;
      qPanel.innerHTML =
        `<div class="queue-head"><button class="queue-back" data-back-lib aria-label="Back to library">${chevL}</button><span>${esc(p.name)}</span><span class="queue-count">${p.tracks.length} songs</span><button class="queue-playbtn head-play" data-play-pl-cur aria-label="Play ${esc(p.name)}" title="Play playlist">${playSvg}</button></div>` +
        `<div class="queue-list">${p.trackIdx.map((gi) => { const t = TRACKS[gi]; return `
          <div class="queue-item" data-qi="${gi}">
            <div class="queue-art" style="background:${artBg(t.yt)}"></div>
            <div class="queue-info"><div class="queue-title">${esc(t.title)}</div><div class="queue-artist">${esc(t.artist)}</div></div>
            <div class="queue-eq" aria-hidden="true"><span></span><span></span><span></span></div>
          </div>`; }).join("")}</div>`;
      qPanel.querySelector("[data-back-lib]").addEventListener("click", (e) => { e.stopPropagation(); libView = null; renderPanel(); });
      qPanel.querySelector("[data-play-pl-cur]").addEventListener("click", (e) => { e.stopPropagation(); playPlaylist(p); syncQueue(); });
      qPanel.querySelectorAll("[data-qi]").forEach((el) => el.addEventListener("click", (e) => { e.stopPropagation(); playFromPlaylist(p, +el.dataset.qi); }));
      syncQueue();
    }
    if (typeof translateEl === "function") translateEl(qPanel);
  }

  // Play a song scoped to its playlist (next/prev/shuffle stay within that folder).
  function playFromPlaylist(p, gi) {
    queue = p.trackIdx.slice();
    if (shuffle) for (let i = queue.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [queue[i], queue[j]] = [queue[j], queue[i]]; }
    playPos(queue.indexOf(gi));
  }
  // Play a whole playlist from the top (shuffled if shuffle is on).
  function playPlaylist(p) {
    queue = p.trackIdx.slice();
    if (shuffle) for (let i = queue.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [queue[i], queue[j]] = [queue[j], queue[i]]; }
    playPos(0);
  }
  // Startup / cold play: pick a random song from the whole library, then continue through it.
  function playRandom() {
    queue = TRACKS.map((_, i) => i);
    playPos(Math.floor(Math.random() * queue.length));
  }

  function syncQueue() {
    const active = cur > -1 ? queue[cur] : -1;
    qPanel.querySelectorAll("[data-qi]").forEach((el) => {
      const on = +el.dataset.qi === active;
      el.classList.toggle("is-current", on);
      el.classList.toggle("is-playing", on && isPlaying);
      if (on && !qPanel.hidden) el.scrollIntoView({ block: "nearest" });
    });
    qBtn.classList.toggle("on", !qPanel.hidden);
  }
  qBtn.addEventListener("click", (e) => { e.stopPropagation(); qPanel.hidden = !qPanel.hidden; if (!qPanel.hidden) { libView = null; renderPanel(); } syncQueue(); });
  document.addEventListener("click", (e) => {
    if (qPanel.hidden) return;
    // Keep the panel open while using the player controls (or clicking the panel/toggle itself).
    if (qPanel.contains(e.target) || qBtn.contains(e.target) || (e.target.closest && e.target.closest(".player"))) return;
    qPanel.hidden = true; qBtn.classList.remove("on");
  });

  /* ====================== THEME ====================== */
  const root = document.documentElement;
  function applyTheme(t) { root.dataset.theme = t; localStorage.setItem("theme", t); }
  applyTheme(localStorage.getItem("theme") || "dark");
  $("[data-theme-toggle]").addEventListener("click", () => applyTheme(root.dataset.theme === "dark" ? "light" : "dark"));

  /* ====================== LANGUAGE / TRANSLATE ====================== */
  // English is the source; this maps every visible English string → Spanish.
  // Proper nouns (names, companies, project & song titles, tech tags) stay as-is.
  // Always default to English on load — the language choice is not persisted across reloads.
  let LANG = "en";
  const I18N = {
    // sidebar + nav
    "Home": "Inicio", "Search": "Buscar", "My Portfolio": "Mi portafolio",
    "This Is Sri Kotala": "Esto es Sri Kotala", "Artist profile": "Perfil de artista",
    "Projects": "Proyectos", "Playlist · builds": "Lista · proyectos",
    "Experience & Research": "Experiencia e investigación", "Playlist · resume": "Lista · currículum",
    "Photography": "Fotografía", "Playlist · photos": "Lista · fotos",
    "Let's Connect": "Conectemos", "Links & booking": "Enlaces y reservas",
    // greeting / home
    "Good morning!": "¡Buenos días!", "Good afternoon!": "¡Buenas tardes!", "Good evening!": "¡Buenas noches!",
    "Welcome to my tiny corner of the internet!": "¡Bienvenido a mi pequeño rincón del internet!",
    "Featured Projects": "Proyectos destacados", "From the camera roll": "Del carrete de fotos",
    "Show all": "Ver todo", "Popular": "Popular", "More by Sri": "Más de Sri",
    "Resume": "Currículum", "Playlist": "Lista", "Follow": "Seguir",
    // about
    "Hi, I’m Sri, an AI Engineer, Marketer, Writer, &": "Hola, soy Sri: ingeniero de IA, marketer, escritor y",
    "connoisseur": "conocedor", "of all things interesting": "de todo lo interesante",
    "I live in Minneapolis, Minnesota and I’m on a mission to learn as many things as possible!": "Vivo en Minneapolis, Minnesota y tengo la misión de aprender tantas cosas como sea posible.",
    "Software Engineering is like building with Legos and Marketing is like getting everybody to look at my Legos.": "La ingeniería de software es como construir con Legos y el marketing es como lograr que todos miren mis Legos.",
    "I wear multiple hats and bounce between leading teams to being a team player. My ultimate goal is to create impactful, inclusive innovations in technology and media.": "Uso muchos sombreros y alterno entre liderar equipos y ser parte del equipo. Mi meta final es crear innovaciones inclusivas y de impacto en la tecnología y los medios.",
    "In my free time, you’ll find me writing short stories, on late night runs, studying for the DELE (Spanish Certification), and spending time with my family in the lulling flatlands of Fargo, North Dakota.": "En mi tiempo libre me encontrarás escribiendo cuentos, saliendo a correr de noche, estudiando para el DELE (certificación de español) y pasando tiempo con mi familia en las tranquilas llanuras de Fargo, Dakota del Norte.",
    // projects
    "Hugging Face Space": "Espacio de Hugging Face", "GitHub Repository": "Repositorio de GitHub",
    "An AI-powered file manager that automatically renames and sorts files.": "Un gestor de archivos con IA .",
    "An interactive AI chat experience that allows you to talk to me.": "Una experiencia de chat con IA interactiva que te permite hablar conmigo.",
    "A trip-planning project via a crew of agents.": "Un proyecto de planificación de viajes mediante un equipo de agentes.",
    "A multi-agent social media content workflow built with CrewAI.": "Un flujo de contenido para redes sociales multiagente creado con CrewAI.",
    "An ML project pitting strategy against strength.": "Un proyecto de ML que enfrenta la estrategia contra la fuerza.",
    "A social-listening application I made for Telemundo Minnesota.": "Una aplicación de escucha social que hice para Telemundo Minnesota.",
    "A motivational quotes app.": "Una app de frases motivacionales.",
    "Data exploration of different datasets in Python.": "Exploración de datos de distintos conjuntos de datos en Python.",
    // experience
    "Experience": "Experiencia", "Sri Kotala · work, education, research & awards": "Sri Kotala · trabajo, educación, investigación y premios",
    "Work Experience": "Experiencia laboral", "Education": "Educación", "Research": "Investigación",
    "Awards & Achievements": "Premios y logros", "Documents": "Documentos",
    "Software Engineer — Legal Technology": "Ingeniero de Software — Tecnología Legal",
    "Account Executive": "Ejecutivo de Cuentas", "Research Assistant": "Asistente de Investigación",
    "Teaching Assistant": "Asistente de Enseñanza", "ML Engineer — NSF REU": "Ingeniero de ML — NSF REU",
    "B.A. Computer Science": "Licenciatura en Ciencias de la Computación",
    "B.A. Strategic Communication: Advertising & PR": "Licenciatura en Comunicación Estratégica: Publicidad y RR. PP.",
    "Class of 2026 · GPA 3.67": "Promoción 2026 · GPA 3.67", "Class of 2026 · GPA 3.94": "Promoción 2026 · GPA 3.94",
    "Jun 2026 – Present": "jun 2026 – Presente", "Sep 2024 – May 2026": "sep 2024 – may 2026",
    "Jan 2024 – May 2026": "ene 2024 – may 2026", "May 2024 – Aug 2024": "may 2024 – ago 2024",
    "Feature Selection in Medical ML": "Selección de características en ML médico",
    "Political Communication & AI": "Comunicación política e IA",
    "Hubbard School, UMN · 2026 ICA Finalist": "Hubbard School, UMN · Finalista ICA 2026",
    "May 2024 - August 2026": "may 2024 – agosto 2026", "Summer 2024": "Verano 2024",
    "2026 International Communication Association (ICA) Finalist": "Finalista de la International Communication Association (ICA) 2026",
    "UMN Undergraduate Research Scholarship": "Beca de Investigación de Pregrado de UMN",
    "Dean's List, College of Liberal Arts": "Cuadro de Honor, College of Liberal Arts",
    "ML / NSF Research Poster": "Póster de investigación ML / NSF",
    "GenAI + Political Communication": "IA Generativa + Comunicación Política", "Paper": "Artículo",
    // photos
    "Clam on a Chilean beach": "Almeja en una playa chilena", "City cat": "Gato callejero",
    "My dog": "Mi perro", "Cool Mexican fish": "Peces mexicanos geniales", "Mrs. Kipling!?": "¿¡La Sra. Kipling!?",
    "Red tulips": "Tulipanes rojas", "Photo": "Foto", "Sunset on the Caribbean": "Atardecer en el Caribe",
    "Turtles in Crystal Springs": "Tortugas en Crystal Springs",
    // connect
    "Let's be friends 😄": "Seamos amigos 😄", "Email": "Correo", "Stalk my runs": "Espía mis carreras",
    // player + library
    "Press play": "Dale a play", "A dive into my favorite songs": "Un viaje por mis canciones favoritas",
    "Demo soundtrack": "Banda sonora de muestra", "Unavailable — try another song": "No disponible — prueba otra canción",
    "Your Library": "Tu biblioteca",
    // search
    "What do you want to explore?": "¿Qué quieres explorar?", "Nothing found.": "No se encontró nada.",
    "Browse everything": "Explora todo", "Sections": "Secciones", "Photos": "Fotos",
  };
  function tstr(en) { return LANG === "es" && I18N[en] ? I18N[en] : en; }
  function esPattern(key) {
    let m;
    if ((m = key.match(/^(\d+) songs$/))) return m[1] + " canciones";
    if ((m = key.match(/^(\d+) song$/))) return m[1] + " canción";
    if ((m = key.match(/^(\d+) playlists$/))) return m[1] + " listas";
    if ((m = key.match(/^(\d+) playlist$/))) return m[1] + " lista";
    if ((m = key.match(/^Playlist · (\d+) songs$/))) return "Lista · " + m[1] + " canciones";
    if ((m = key.match(/^(\d+) builds$/))) return m[1] + " proyectos";
    if ((m = key.match(/^(\d+) photos$/))) return m[1] + " fotos";
    if ((m = key.match(/^Results for "(.*)"$/))) return 'Resultados de "' + m[1] + '"';
    return null;
  }
  function translateEl(rootEl) {
    if (!rootEl) return;
    const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      if (n.__en === undefined) n.__en = n.nodeValue;
      const en = n.__en, key = en.trim();
      if (!key) return;
      if (LANG === "es") { const es = I18N[key] || esPattern(key); if (es != null) n.nodeValue = en.replace(key, es); }
      else if (n.nodeValue !== en) n.nodeValue = en;
    });
    rootEl.querySelectorAll("[placeholder]").forEach((el) => {
      if (el.__ph === undefined) el.__ph = el.getAttribute("placeholder");
      const es = I18N[el.__ph];
      el.setAttribute("placeholder", LANG === "es" && es ? es : el.__ph);
    });
  }
  function applyLang(lang) {
    LANG = lang; // intentionally not persisted — every reload starts in English
    document.querySelectorAll("[data-lang-code]").forEach((el) => (el.textContent = lang.toUpperCase()));
    document.querySelectorAll("[data-lang]").forEach((b) => b.classList.toggle("is-active", b.dataset.lang === lang));
    translateEl(document.querySelector(".sp"));
  }
  (function langUI() {
    const wrap = $("[data-lang-wrap]"), toggle = $("[data-lang-toggle]"), menu = $("[data-lang-menu]");
    toggle.addEventListener("click", (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; });
    document.addEventListener("click", (e) => { if (!menu.hidden && !wrap.contains(e.target)) menu.hidden = true; });
    menu.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); menu.hidden = true; applyLang(b.dataset.lang); }));
  })();

  /* ====================== CREAMY UI SOUNDS ====================== */
  (function uiSounds() {
    let muted = localStorage.getItem("uiSound") === "off", c = null, last = 0;
    function ac() { if (!c) { try { c = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } } if (c.state === "suspended") c.resume(); return c; }
    function warm(x) { if (!x._w) { const lp = x.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1600; lp.Q.value = 0.3; lp.connect(x.destination); x._w = lp; } return x._w; }
    function pop(freq, vol, dur) {
      if (muted) return; const x = ac(); if (!x) return; const t = x.currentTime;
      const o = x.createOscillator(), sub = x.createOscillator(), g = x.createGain();
      o.type = "sine"; sub.type = "sine";
      o.frequency.setValueAtTime(freq * 1.35, t); o.frequency.exponentialRampToValueAtTime(freq, t + 0.09);
      sub.frequency.setValueAtTime(freq * 0.5, t);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.022); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); sub.connect(g); g.connect(warm(x));
      o.start(t); sub.start(t); o.stop(t + dur + 0.05); sub.stop(t + dur + 0.05);
    }
    const hover = () => { const n = performance.now(); if (n - last < 90) return; last = n; pop(540, 0.013, 0.13); };
    const tick = () => pop(340, 0.05, 0.26);
    const swoosh = () => { pop(300, 0.045, 0.22); setTimeout(() => pop(440, 0.035, 0.2), 70); };
    const HOVER = ".side-nav a, .lib-list li, .card, .tile, .connect-card, .ctrl, .theme-btn, .photo, .ghost-btn, .play-big, .round-btn, .show-all, .track-row.link";
    const CLICK = "a, button, .card, .tile, .lib-list li, .connect-card, .photo, .track-row.link";
    document.addEventListener("pointerover", (e) => { if (e.target.closest && e.target.closest(HOVER)) hover(); }, { passive: true });
    document.addEventListener("pointerdown", (e) => { const el = e.target.closest && e.target.closest(CLICK); if (!el) return; if (el.matches("[data-theme-toggle], [data-theme-toggle] *")) swoosh(); else tick(); }, { passive: true });

    const btn = $("[data-sound-toggle]");
    if (btn) {
      const reflect = () => { btn.classList.toggle("on", !muted); btn.setAttribute("title", muted ? "UI sounds: off" : "UI sounds: on"); };
      btn.addEventListener("click", () => { muted = !muted; localStorage.setItem("uiSound", muted ? "off" : "on"); reflect(); if (!muted) tick(); });
      reflect();
    }
  })();

  /* ====================== INIT ====================== */
  window.addEventListener("hashchange", route);
  requestAnimationFrame(resizeCanvas);
  route();
  applyLang(LANG);
})();
