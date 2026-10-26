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


  const EXPERIENCE = {
    work: [
      { name: "Sharepoint Engineer", sub: "Minnesota Public Radio", meta: "Nov 2026 – Present" },
      { name: "Account Executive", sub: "Telemundo Minnesota", meta: "Jun 2026 – Aug 2026" },
      { name: "Software Engineer Intern — Legal Technology", sub: "Minnesota Public Radio", meta: "Jun 2026 – Aug 2026" },
      { name: "Research Assistant", sub: "Hubbard School of Journalism & Mass Communication", meta: "Sep 2024 – May 2026" },
      { name: "Teaching Assistant", sub: "UMN College of Science & Engineering", meta: "Jan 2024 – May 2026" },
      { name: "ML Engineer — NSF REU", sub: "North Dakota State University / Universidad de Chile", meta: "May 2024 – Aug 2024" },
    ],
    education: [
      { name: "B.A. Computer Science", sub: "University of Minnesota Twin Cities", meta: "Class of 2026 · GPA 3.67" },
      { name: "B.A. Strategic Communication: Advertising & PR", sub: "University of Minnesota Twin Cities", meta: "Class of 2026 · GPA 3.94" },
    ],
    research: [
      { name: "Feature Selection in Medical ML", sub: "NSF REU @ NDSU", meta: "May 2024 - Aug 2024" },
      { name: "Political Communication & AI", sub: "Hubbard School, UMN · 2026 ICA Finalist", meta: "Sep 2024 – May 2026" },
    ],
    awards: [
      { name: "2026 International Communication Association (ICA) Finalist", meta: "2026" },
      { name: "UMN Undergraduate Research Scholarship", meta: "2024 – 2025" },
      { name: "Dean's List, College of Liberal Arts", meta: "2023 – 2025" },
    ],
    documents: [
      { title: "Resume", kind: "PDF", url: "https://drive.google.com/file/d/1yp7Fqrp77I5zCeHlOSOiL0AeAa6Ooz9t/view?usp=sharing", thumb: "./assets/docs/resume.jpg", c1: "#7a0019", c2: "#ffc72c" },
      { title: "ML / NSF Research Poster", kind: "PDF", url: "https://www.ndsu.edu/sites/default/files/fileadmin/cs/REU_Posters/Kotala_FS_Poster.pdf", thumb: "./assets/docs/nsf-poster.jpg", c1: "#373b44", c2: "#4286f4" },
      { title: "GenAI + Political Communication", kind: "Paper", url: "https://drive.google.com/file/d/1mlgH7KUyDHaKGrPODIjCrjtLPGBSv-T4/view", thumb: "./assets/docs/genai-paper.jpg", c1: "#c33764", c2: "#1d2671" },
      { title: "LegalAI File Manager Documentation", kind: "PDF", url: "https://drive.google.com/file/d/1zQEmWjGFmiWJXM4n4nGBScS-FOqJWOgj/view", thumb: "./assets/docs/legalai-doc.jpg", c1: "#1e3c72", c2: "#2a5298" },
    ],
  };

    const PROJECTS = [
    { id: "quotify", title: "Quotable", kind: "GitHub Repository", url: "https://github.com/itzskoala/quotify", site: "https://quotableapp.net/", img: "./assets/placeholders/icon-quotable.svg", c1: "#1d976c", c2: "#93f9b9", tags: ["Content-Based Filtering", "Node.js", "UI/UX", "Digital Marketing"], desc: "A motivational quotes app. Highlighting extraordinary people, places, and things so we too can become extraordinary 🌎🌷💛🏖️🏄" },
    { id: "worldwalker", title: "World Walker", kind: "GitHub Repository", url: "https://github.com/itzskoala/WorldWalker",site: "https://world-walker-livid.vercel.app/", img: "./assets/placeholders/worldwalker.jpg", c1: "#2193b0", c2: "#6dd5ed", tags: ["Webooks", "FastAPI", "Google Health", "Authentication", "PostgresSQL", "OpenStreetMap", "Design Patterns"], desc: "A FastAPI app that pulls step counts from my Fitbit Air via Google Cloud and converts them into progress on a virtual walk around the world." },
    { id: "voicenotes", title: "Voice Notes", kind: "GitHub Repository", url: "https://github.com/itzskoala/voicemail", img: "./assets/placeholders/voice-notes.svg", c1: "#7a0019", c2: "#33000a", tags: ["Inference Models", "Prompt Engineering", "Content Moderation", "Multi-language Support", "Background Processing", "Serverless Functions"], desc: "A voice-message feature for this site that records audio in the browser, then runs it through open-weight Hugging Face models. Every message goes through a spam-filter." },
    { id: "brains", title: "Brains vs. Brawn", kind: "GitHub Repository", url: "https://github.com/itzskoala/brains-versus-brawns", site: "https://huggingface.co/spaces/holasoykoalo7/BrainsVSBrawn", img: "./assets/placeholders/ai-ufc.jpg", c1: "#11998e", c2: "#38ef7d", tags: ["Logistic Regression", "Decision Trees", "SVM", "Evaluation Metrics", "Playwright", "Github Actions", "Caching"], desc: "Using machine learning algorithms to predict a UFC fighter’s probability of winning, their most likely method of victory, and in which round." },
    { id: "paradise", title: "Paradise Builder", kind: "GitHub Repository", url: "https://github.com/itzskoala/vacation-builder", img: "./assets/placeholders/paradise-icon.jpg", c1: "#f7971e", c2: "#ffd200", tags: ["CrewAI", "Harness Engineering", "Serper API", "Google Travel Explore API"], desc: "A trip-planning project via a crew of agents." },
    { id: "talkingbooks", title: "TalkingBooks", kind: "GitHub Repository", url: "https://github.com/itzskoala/talking-books", img: "./assets/placeholders/talking-books.png", c1: "#d35400", c2: "#f9d423", tags: ["RAG", "Langchain", "ChromaDB", "JSONL", "Chunking", "Evaluation Metrics"], desc: "I used Retrieval-Augmented Generation (RAG) to \"chat\" with any book! This application is geared towards children who are able to have simple conversations with complex books, stories, and ideas." },
    { id: "crewai", title: "Content Creator w/ CrewAI", kind: "GitHub Repository", url: "https://github.com/itzskoala/content-creator-flow", img: "./assets/placeholders/social-media-ai.png", c1: "#c33764", c2: "#1d2671", tags: ["CrewAI", "Harness Engineering", "Serper API"], desc: "A multi-agent social media content workflow built with CrewAI." },
    { id: "linkedinfinder", title: "LinkedIn Candidate Finder", kind: "GitHub Repository", url: "https://github.com/itzskoala/LinkedIn-candidate-finder", img: "./assets/placeholders/linkedin-candidate-finder.png", c1: "#0077b5", c2: "#00a0dc", tags: ["Social listening", "Web Scraping", "Recruiting", "MCP", "Open Source LLMs"], desc: "A tool that searches LinkedIn to surface candidates matching a given role." },
    { id: "aifilemanager", title: "AIFileManager", kind: "GitHub Repository", url: "https://github.com/itzskoala/LegaIAI-File-Manager", img: "./assets/placeholders/aifilemanager.png", c1: "#e58e26", c2: "#f9d423", tags: ["ETL", "Ollama", "Langchain", "SQL Database", "Pydantic", "MS Sharepoint Engineering", "MS Power Automate", "MS Azure"], desc: "An AI-powered file manager that automatically renames and sorts files." },
    { id: "talk2me", title: "Talk2Me", kind: "Hugging Face Space", url: "https://huggingface.co/spaces/holasoykoalo7/ai-me", img: "./assets/placeholders/talk-2-me.png", c1: "#5f2c82", c2: "#49a09d", tags: ["HuggingFace", "Harness Engineering", "Gradio"], desc: "An interactive AI chat experience that allows you to talk to me." },
    { id: "adriana", title: "AdrianaOye", kind: "GitHub Repository", url: "https://github.com/itzskoala/AdrianaOye", img: "./assets/placeholders/icon-social-listening.jpg", c1: "#0f2027", c2: "#2c5364", tags: ["Social Listening", "Gradio", "NLP", "Web Scrapping"], desc: "A social-listening application I made for Telemundo Minnesota." },
    { id: "eda", title: "Exploratory Data Analysis", kind: "GitHub Repository", url: "https://github.com/itzskoala/exploratory-data-analysis", img: "./assets/placeholders/icon-eda.png", c1: "#373b44", c2: "#4286f4", tags: ["Pandas", "NumPy", "Seaborn", "Matplotlib", "Univariate, bivariate & multivariate analysis", "Data cleaning & preprocessing", "Statistical distributions", "Descriptive statistics"], desc: "Data exploration of different datasets in Python." },
  ];

  const PHOTOS = [
    { src: "./assets/photography/bariloche.jpg", cap: "San Carlos de Bariloche" },
    { src: "./assets/photography/punta-arenas-birds.jpg", cap: "Birds in Punta Arenas" },
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
    { src: "./assets/photography/humboldt-cap.jpg", cap: "Aftermath of a long run" },
    { src: "./assets/photography/dallas-eyeball.jpg", cap: "Giant Eyeball in Dallas" },
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
    { name: "Spanish", tracks: [
      { title: "Eres para Mí", artist: "Julieta Venegas", yt: "https://www.youtube.com/watch?v=gvjjheYHfO0" },
      { title: "Don", artist: "Miranda!", yt: "https://www.youtube.com/watch?v=32DOcN9A0TQ" },
      { title: "Lento", artist: "Julieta Venegas", yt: "https://www.youtube.com/watch?v=ZSIzwYzCkHQ" },
      { title: "Mismo Amor", artist: "Julieta Venegas", yt: "https://www.youtube.com/watch?v=wKSd0rdD1a4" },
      { title: "VOY A LLeVARTE PA PR", artist: "Bad Bunny", yt: "https://www.youtube.com/watch?v=uE_pyM3X-e0" },
      { title: "Ojitos Lindos", artist: "Bad Bunny & Bomba Estéreo", yt: "https://www.youtube.com/watch?v=qYymWg2Y_as" },
      { title: "La Chona", artist: "Los Tucanes De Tijuana", yt: "https://www.youtube.com/watch?v=41xlHlhGz7o" },
      { title: "Latina Foreva", artist: "Karol G", yt: "https://www.youtube.com/watch?v=BgMU9Vuj17Y" },
      { title: "Una Noche en Medellín (Remix)", artist: "Karol G, Cris Mj, Ryan Castro", yt: "https://www.youtube.com/watch?v=jWNXYYVHeJI" },
      { title: "Si Antes Te Hubiera Conocido", artist: "Karol G", yt: "https://www.youtube.com/watch?v=QCZZwZQ4qNs" },
      { title: "Party", artist: "Bad Bunny", yt: "https://www.youtube.com/watch?v=NexvjBkpeCY" },
      { title: "MONACO", artist: "Bad Bunny", yt: "https://www.youtube.com/watch?v=J-7knuczw2E" },
      { title: "Oh Qué Será?", artist: "Willie Colón", yt: "https://www.youtube.com/watch?v=TXYMMsoTMLQ" },
      { title: "Suavemente", artist: "Elvis Crespo", yt: "https://www.youtube.com/watch?v=QH0zo6AcP6g" },
      { title: "Al Compás De Mi Caballo", artist: "Los Imperials", yt: "https://www.youtube.com/watch?v=t2KBSeK7z0Q" },
      { title: "Se Me Perdió La Cadenita", artist: "La Sonora Dinamita", yt: "https://www.youtube.com/watch?v=EjZna5PFSNI" },
      { title: "Tabaco Y Ron", artist: "Rodolfo y Su Típica RA7", yt: "https://www.youtube.com/watch?v=CPGcW2CtPfE" },
      { title: "Porro Bonito", artist: "Orquesta Ritmo de Sabanas", yt: "https://www.youtube.com/watch?v=rxUSEyEmo1Q" },
      { title: "El Cucuy", artist: "Andy Gonzales Y Sus Amigos", yt: "https://www.youtube.com/watch?v=5cocFq5SKQg" },
      { title: "En el 2000", artist: "Natalia Lafourcade", yt: "https://www.youtube.com/watch?v=Xqr-Ku5EaGE" },
      { title: "Bésame Mucho", artist: "Lisa Ono", yt: "https://www.youtube.com/watch?v=7ejA6VDP4Ps" },
      { title: "Quién Será", artist: "Lisa Ono", yt: "https://www.youtube.com/watch?v=r6QzhYYlsos" },
      { title: "La Rosa de los Vientos", artist: "Makiza", yt: "https://www.youtube.com/watch?v=Yr6GczearGA" },
      { title: "1977", artist: "Ana Tijoux", yt: "https://www.youtube.com/watch?v=yiQ7S38nKog" },
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
      { title: "Tillu Anna DJ Pedithe", artist: "Ram Miriyala", yt: "https://www.youtube.com/watch?v=M-954V9LORI" },
      { title: "Meghaalu Lekunna", artist: "Yazin Nizar", yt: "https://www.youtube.com/watch?v=2AsTEQcN7xQ" },
      { title: "Waiting For You", artist: "KK", yt: "https://www.youtube.com/watch?v=X4Wy4AyZlnU" },
      { title: "Niluvaddham", artist: "Karthik & Sumangali", yt: "https://www.youtube.com/watch?v=nyRvRV3qqyc" },
      { title: "Adirey Adirey", artist: "Jassie Gift & Kalpana", yt: "https://www.youtube.com/watch?v=OeUhzFRNomE" },
      { title: "Chandrullo Unde", artist: "Shankar Mahadevan", yt: "https://www.youtube.com/watch?v=_LnEnslmV5M" },
      { title: "Rooba Rooba", artist: "Chinmayi & Shahil Hada", yt: "https://www.youtube.com/watch?v=tL08JUXGJGo" },
      { title: "Uppenantha", artist: "KK, Devi Sri Prasad", yt: "https://www.youtube.com/watch?v=TIOZUdc0aL8" },
      { title: "Diyyalo Diyyala", artist: "Priya Himesh & Khushi Murali", yt: "https://www.youtube.com/watch?v=RAotnwMAXAA" },
      { title: "Arey Rey", artist: "Mickey J Meyer & Karthik", yt: "https://www.youtube.com/watch?v=PTAScUlG7ZA" },
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
      { title: "Oh Priya Priya", artist: "Adnan Sami", yt: "https://www.youtube.com/watch?v=ASahUxsb4QQ" },
      { title: "Chaleya", artist: "Arijit Singh, Shilpa Rao", yt: "https://www.youtube.com/watch?v=VAdGW7QDJiU" },
      { title: "Jhoome Jo Pathaan", artist: "Arijit Singh, Sukriti Kakar", yt: "https://www.youtube.com/watch?v=YxWlaYCA8MU" },
      { title: "Disco Deewane", artist: "Nazia Hassan", yt: "https://www.youtube.com/watch?v=QljTHgNSmHQ" },
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
      { title: "Something Stupid", artist: "Lola Marsh", yt: "https://www.youtube.com/watch?v=F8dKVbP1Nzo" },
      { title: "Baby Blue", artist: "Badfinger", yt: "https://www.youtube.com/watch?v=33oAuvbRg-c" },
      { title: "Pokémon Theme", artist: "Jason Paige", yt: "https://www.youtube.com/watch?v=2zMIddjFAIA" },
      { title: "2.B.A. Master", artist: "Russell Velázquez", yt: "https://www.youtube.com/watch?v=D2G3FWVukGU" },
      { title: "Funkytown", artist: "Lipps Inc.", yt: "https://www.youtube.com/watch?v=OAC4ItP0xWM" },
      { title: "brutal", artist: "Olivia Rodrigo", yt: "https://www.youtube.com/watch?v=WGcUNV_f6pk" },
      { title: "A Horse With No Name", artist: "America", yt: "https://www.youtube.com/watch?v=na47wMFfQCo" },
      { title: "Let It Happen", artist: "Tame Impala", yt: "https://www.youtube.com/watch?v=NMRhx71bGo4" },
      { title: "Dracula", artist: "Tame Impala", yt: "https://www.youtube.com/watch?v=jwVMgGs50vE" },
      { title: "Smooth Operator", artist: "Sade", yt: "https://www.youtube.com/watch?v=mRNcPbCJNJ8" },
      { title: "Rasputin", artist: "Boney M.", yt: "https://www.youtube.com/watch?v=6JhVo2zS8hU" },
      { title: "Livin' La Vida Loca", artist: "Ricky Martin", yt: "https://www.youtube.com/watch?v=CN5hQOI__10" },
      { title: "Oops!...I Did It Again", artist: "Britney Spears", yt: "https://www.youtube.com/watch?v=wsHbHR3Os6U" },
    ] },
  ];
  // Flatten into one list the player indexes into; each playlist keeps its global indices.
  const TRACKS = [];
  PLAYLISTS.forEach((p) => { p.trackIdx = p.tracks.map((t) => { TRACKS.push(t); return TRACKS.length - 1; }); });

  // Classic two-ring voicemail glyph: a single evenodd path (two rings bridged along their shared
  // bottom tangent) so it drops into the sidebar/tile/hero icon slots like any other inline svg here.
  const voicemailSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M11.5 12L12.5 12A5 5 0 1 1 17.5 17L6.5 17A5 5 0 1 1 11.5 12ZM8.9 12A2.4 2.4 0 1 0 4.1 12A2.4 2.4 0 1 0 8.9 12ZM19.9 12A2.4 2.4 0 1 0 15.1 12A2.4 2.4 0 1 0 19.9 12Z"/></svg>';

  const SECTIONS = [
    { id: "about",      name: "This Is Sri Kotala", sub: "Artist profile",     emoji: "🐨", img: "./assets/headshot-angel.jpg", c1: "#7a0019", c2: "#ffc72c" },
    { id: "projects",   name: "Projects",           sub: PROJECTS.length + " builds", emoji: "🛠️", img: "./assets/covers/projects.jpg", c1: "#5f2c82", c2: "#49a09d" },
    { id: "experience", name: "Experience & Research", sub: "Resume",          emoji: "💼", img: "./assets/covers/experience.jpg", c1: "#c33764", c2: "#1d2671" },
    { id: "photos",     name: "Photography",        sub: PHOTOS.length + " photos",   emoji: "📷", img: "./assets/covers/photography.jpg", c1: "#f7971e", c2: "#ffd200" },
    { id: "connect",    name: "Let's Connect",      sub: "Links & booking",    emoji: "💬", img: "./assets/covers/connect.jpg", c1: "#11998e", c2: "#38ef7d" },
    { id: "voicemail",  name: "Voicemail",          sub: "Send me a voice message!", emoji: voicemailSvg, c1: "#7a0019", c2: "#33000a" },
  ];

  // Pokémon roaming-pet widget (bottom-left corner, see POKÉMON WIDGET section near the bottom).
  // Folder names mirror jakobhoeg/vscode-pokemon's media/ directory exactly — they're used verbatim
  // to build each sprite's raw.githubusercontent.com URL, so don't "fix" any odd spelling here.
  const POKEDEX_BY_GEN = {
    1: "abra aerodactyl alakazam arbok arcanine articuno beedrill bellsprout blastoise bulbasaur butterfree caterpie chansey charizard charmander charmeleon clefable clefairy cloyster cubone dewgong diglett ditto dodrio doduo dragonair dragonite dratini drowzee dugtrio eevee ekans electabuzz electrode exeggcute exeggutor farfetchd fearow flareon gastly gengar geodude gloom golbat goldeen golduck golem graveler grimer growlithe gyarados haunter hitmonchan hitmonlee horsea hypno ivysaur jigglypuff jolteon jynx kabuto kabutops kadabra kakuna kangaskhan kingler koffing krabby lapras lickitung machamp machoke machop magikarp magmar magnemite magneton mankey marowak meowth metapod mew mewtwo moltres mrmime muk nidoking nidoqueen nidoran_female nidoran_male nidorina nidorino ninetales oddish omanyte omastar onix paras parasect persian pidgeot pidgeotto pidgey pikachu pikachu_female pinsir poliwag poliwhirl poliwrath ponyta porygon primeape psyduck raichu rapidash raticate rattata rhydon rhyhorn sandshrew sandslash scyther seadra seaking seel shellder slowbro slowpoke snorlax spearow squirtle starmie staryu tangela tauros tentacool tentacruel vaporeon venomoth venonat venusaur venusaur_female victreebel vileplume voltorb vulpix wartortle weedle weepinbell weezing wigglytuff zapdos zubat",
    2: "aipom ampharos ariados azumarill bayleef bellossom blissey celebi chikorita chinchou cleffa corsola crobat croconaw cyndaquil delibird donphan dunsparce elekid entei espeon feraligatr flaaffy forretress furret girafarig gligar granbull heracross_female heracross_male hitmontop hooh hoothoot hoppip houndoom houndour igglybuff jumpluff kingdra lanturn larvitar ledian ledyba lugia magby magcargo mantine mareep marill meganium meganium_female miltank misdreavus murkrow natu noctowl octillery phanpy pichu pichu_spiky_eared piloswine pineco politoed porygon2 pupitar quagsire quilava qwilfish raikou remoraid scizor sentret shuckle skarmory skiploom slowking slugma smeargle smoochum sneasel snubbull spinarak stantler steelix steelix_female sudowoodo suicune sunflora sunkern swinub teddiursa togepi togetic totodile typhlosion tyranitar tyrogue umbreon unown_a unown_b unown_c unown_d unown_e unown_exclamation unown_f unown_g unown_h unown_i unown_j unown_k unown_l unown_m unown_n unown_o unown_p unown_q unown_question unown_r unown_s unown_t unown_u unown_v unown_w unown_x unown_y unown_z ursaring wobbuffet_female wobbuffet_male wooper xatu yanma",
    3: "absol aggron altaria anorith armaldo aron azurill bagon baltoy banette barboach beautifly beldum blaziken breloom cacnea cacturne camerupt carvanha cascoon castform chimecho clamperl claydol combusken corphish cradily crawdaunt delcatty deoxys deoxys_attack deoxys_defense deoxys_speed dusclops duskull dustox electrike exploud feebas flygon gardevoir glalie gorebyss groudon grovyle grumpig gulpin hariyama huntail illumise jirachi kecleon kirlia kyogre lairon latias latios lileep linoone lombre lotad loudred ludicolo lunatone luvdisc makuhita manectric marshtomp masquerain mawile medicham meditite metagross metang mightyena milotic minun mudkip nincada ninjask nosepass numel nuzleaf pelipper plusle poochyena ralts rayquaza regice regirock registeel relicanth roselia sableye salamence sceptile sealeo seedot seviper sharpedo shedinja shelgon shiftry shroomish shuppet silcoon skitty slaking slakoth snorunt solrock spheal spinda spoink surskit swablu swalot swampert swellow taillow torchic torkoal trapinch treecko tropius vibrava vigoroth volbeat wailmer wailord walrein whiscash whismur wingull wurmple wynaut zangoose zigzagoon",
    4: "abomasnow ambipom arceus arceus_bug arceus_dark arceus_dragon arceus_electric arceus_fighting arceus_fire arceus_flying arceus_ghost arceus_grass arceus_ground arceus_ice arceus_poison arceus_psychic arceus_rock arceus_steel arceus_water azelf bastiodon bibarel bidoof bonsly bronzong bronzor budew buizel buneary burmy_plant burmy_sandy burmy_trash carnivine chatot cherrim cherubi chimchar chingling combee_female combee_male cranidos cresselia croagunk darkrai dialga drapion drifblim drifloon dusknoir electivire empoleon finneon floatzel froslass gabite gabite_female gallade garchomp garchomp_female gastrodon_east gastrodon_west gible gible_female giratina giratina_origin glaceon glameow gliscor grotle happiny heatran hippopotas_female hippopotas_male hippowdon_female hippowdon_male honchkrow infernape kricketot kricketune leafeon lickilicky lopunny lucario lumineon luxio luxray magmortar magnezone mamoswine manaphy mantyke mesprit mimeJr mismagius monferno mothim munchlax pachirisu palkia phione piplup porygonZ prinplup probopass purugly rampardos regigigas rhyperior riolu roserade rotom rotom_fan rotom_frost rotom_heat rotom_mow rotom_wash shaymin shaymin_sky shellos_east shellos_west shieldon shinx skorupi skuntank snover spiritomb staraptor staravia starly stunky tangrowth togekiss torterra toxicroak turtwig uxie vespiquen weavile wormadam_plant wormadam_sandy wormadam_trash yanmega",
    5: "alomomola audino axew basculin_blue_striped basculin_red_striped boldore bouffalant braviary cobalion cottonee crustle cubchoo deerling_autumn deerling_spring deerling_summer deerling_winter drilbur druddigon ducklett duosion durant elgyem emolga galvantula garbodor golett gorthorita gurdurr heatmor herdier karrablast keldeo klang krokorok krookodile leavanny liepard litwick mandibuzz maractus meloetta mienfo minccino munna musharna panpour pansage pansear patrat pawniard petilil pidove sawk scolipede scraggy shelmet sigilyph stunfisk terrakion throh tirtouga tympole vanillish victini virizion watchog woobat zebstrika zorua",
  };

  /* ====================== HELPERS ====================== */
  const $ = (s, c) => (c || document).querySelector(s);
  const grad = (a, b) => `linear-gradient(135deg, ${a}, ${b})`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  const playSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  // Pull the 11-char video id out of any YouTube URL form (watch?v=, youtu.be/, embed/, shorts/).
  const ytId = (url) => { const m = String(url).match(/(?:v=|\/embed\/|youtu\.be\/|\/shorts\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(url) ? url : ""); };
  const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const extSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M9 7h8v8"/></svg>';
  const githubSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 .5C5.7.5.7 5.5.7 11.8c0 5 3.2 9.2 7.7 10.7.6.1.8-.3.8-.6v-2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.3-1.6-1.3-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.6 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.6 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-3 0 0 1-.3 3.1 1.1a10.7 10.7 0 0 1 5.6 0C16.9 4.7 18 5 18 5c.6 1.6.2 2.7.1 3 .7.8 1.1 1.8 1.1 3 0 4.4-2.6 5.3-5.1 5.6.4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6 4.5-1.5 7.7-5.7 7.7-10.7C23.3 5.5 18.3.5 12 .5z"/></svg>';
  const micSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
  const sendSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 12 2"/></svg>';
  // Projects with a `site` field get a play button that opens a small menu (repo vs. live site)
  // instead of jumping straight to the GitHub URL.
  function fabHtml(p, btnClass, label) {
    if (!p.site) return `<button class="${btnClass}" data-open="${esc(p.url)}" aria-label="${esc(label)}">${playSvg}</button>`;
    const wrapClass = btnClass === "card-fab" ? "fab-wrap card-fab-pos" : "fab-wrap";
    return `<div class="${wrapClass}" data-fabwrap>
      <button class="${btnClass}" data-fab-toggle aria-haspopup="true" aria-expanded="false" aria-label="${esc(label)}">${playSvg}</button>
      <div class="fab-menu" data-fab-menu hidden>
        <a class="fab-opt" data-open="${esc(p.url)}">${githubSvg}<span>GitHub Repo</span></a>
        <a class="fab-opt" data-open="${esc(p.site)}">${extSvg}<span>Website</span></a>
      </div>
    </div>`;
  }

  const main = $("[data-main]");
  const viewEl = $("[data-view]");

  /* ====================== VIEW RENDERERS ====================== */
  function projectCard(p) {
    return `<div class="card" data-project="${p.id}">
      <div class="card-art"><img src="${p.img}" alt="${esc(p.title)}" loading="lazy"></div>
      <div class="card-title">${esc(p.title)}</div>
      <div class="card-sub">${esc(p.kind)}</div>
      ${fabHtml(p, "card-fab", "Open " + p.title)}
    </div>`;
  }

  function photoCard(p, i) {
    return `<div class="card" data-photo="${i}">
      <div class="card-art"><img src="${p.src}" alt="${esc(p.cap)}" loading="lazy"></div>
      <div class="card-title">${esc(p.cap)}</div>
      <div class="card-sub">${esc("Photo")}</div>
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
      <h1 class="greeting">${greet}!<span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span></h1>
      <p class="greeting-sub">Welcome to my tiny corner of the internet!</p>
      <div class="tiles">${SECTIONS.map(tile).join("")}</div>

      <div class="shelf-head"><h2>Featured Projects</h2><button class="show-all" data-route="projects">Show all</button></div>
      <div class="grid" data-shelf="projects">${PROJECTS.slice(0, 5).map(projectCard).join("")}</div>

      <div class="shelf-head"><h2>From the camera roll</h2><button class="show-all" data-route="photos">Show all</button></div>
      <div class="grid" data-shelf="photos">${PHOTOS.slice(0, 5).map(photoCard).join("")}</div>
    </div>`};
  }

  // Home shelves start with a placeholder count (5) just so there's something to measure;
  // fitShelves() immediately corrects it to however many cards actually fit one row, so a
  // wide monitor doesn't end up with a half-empty row of trailing grid space, and a narrow
  // one doesn't overflow. Re-run on resize (debounced) while the home route is active.
  function fitShelf(el, items, renderFn) {
    if (!el || !items.length) return;
    const card = el.firstElementChild;
    if (!card) return;
    const cardW = card.getBoundingClientRect().width;
    if (!cardW) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const fitCols = Math.floor((el.clientWidth + gap) / (cardW + gap));
    // Deliberately stop one card short of a full edge-to-edge row — a fully packed row
    // reads as cluttered; leaving a sliver of breathing room on the right looks intentional.
    const cols = Math.max(1, Math.min(items.length, fitCols - 1));
    if (cols === el.children.length) return;
    el.innerHTML = items.slice(0, cols).map(renderFn).join("");
    if (typeof translateEl === "function") translateEl(el);
    setupReveals(el);
  }
  function fitShelves() {
    fitShelf($('[data-shelf="projects"]'), PROJECTS, projectCard);
    fitShelf($('[data-shelf="photos"]'), PHOTOS, photoCard);
  }
  let fitShelvesTimer = 0;
  window.addEventListener("resize", () => {
    if ((location.hash || "#home").slice(1).split("/")[0] !== "home") return;
    clearTimeout(fitShelvesTimer);
    fitShelvesTimer = setTimeout(fitShelves, 150);
  });

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
          <img src="./assets/headshot.jpg" alt="Sri Kotala" loading="lazy">
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
        ${fabHtml(p, "play-big", "Open project")}
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
        <div class="card-art doc-art" style="background:${grad(d.c1, d.c2)}">${d.thumb ? `<img src="${d.thumb}" alt="" loading="lazy" class="${d.thumbFit === "contain" ? "fit-contain" : "fit-cover"}">` : `<span style="font-size:2rem">📄</span>`}</div>
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
          <img class="edu-logo" src="./assets/umn.svg" alt="University of Minnesota" loading="lazy">
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

  function viewVoicemail() {
    return { tint: "#3a0d10", hero: "#5a0014", html: `
      <div class="hero" style="--hero-c:#5a0014;padding-top:48px">
        <div class="hero-cover" style="background:${grad("#7a0019", "#33000a")}">${voicemailSvg}</div>
        <div>
          <div class="hero-kind">Playlist</div>
          <h1 class="hero-title">Voicemail</h1>
          <div class="hero-meta">Send me a voice message in whatever language you wish! <span aria-hidden="true">🎙️</span></div>
        </div>
      </div>
      <div class="action-bar">
        <a class="play-big" data-project="voicenotes" title="Click to see how I made this." aria-label="View the code on GitHub">${playSvg}</a>
      </div>
      <div class="view-pad">
        <div class="vm-card">
          <form class="vm-fields" data-vm-form novalidate>
            <label class="vm-field">
              <span>Your name</span>
              <input type="text" id="vm-name" name="name" autocomplete="name" placeholder="Full name" data-vm-input required>
              <small class="vm-error" data-vm-error="name" hidden></small>
            </label>
            <label class="vm-field">
              <span>Email</span>
              <input type="email" id="vm-email" name="email" autocomplete="email" placeholder="name@example.com" data-vm-input>
              <small class="vm-error" data-vm-error="email" hidden></small>
            </label>
            <label class="vm-field">
              <span>Phone number</span>
              <input type="tel" id="vm-phone" name="phone" autocomplete="tel" inputmode="numeric" placeholder="5555555555" data-vm-input data-vm-phone>
            </label>
            <small class="vm-error" data-vm-error="contact" hidden></small>
          </form>

          <div class="vm-recorder">
            <button type="button" class="vm-mic" data-vm-mic disabled aria-label="Requesting microphone access">
              ${micSvg}<span class="vm-mic-ring" aria-hidden="true"></span>
            </button>
            <div class="vm-status" data-vm-status>Requesting microphone access…</div>
            <div class="vm-timer" data-vm-timer hidden>0:00</div>
            <button type="button" class="ghost-btn" data-vm-retry hidden>Allow microphone access</button>
          </div>

          <div class="vm-preview" data-vm-preview hidden>
            <audio controls data-vm-audio></audio>
            <div class="vm-preview-actions">
              <button type="button" class="ghost-btn" data-vm-rerecord>Record again</button>
              <button type="button" class="play-big vm-send" data-vm-send aria-label="Send voicemail">${sendSvg}</button>
            </div>
            <div class="vm-send-status" data-vm-send-status hidden></div>
          </div>
        </div>
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
    setupReveals(viewEl);
  }

  /* Staggered fade+rise as elements enter the scroll viewport (once each).
     First paint animates the above-the-fold items in as a staggered intro. */
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let revealIO = null;
  function setupReveals(rootEl) {
    if (prefersReduced) return;
    const els = [...rootEl.querySelectorAll(".hero, .shelf-head, .tile, .card, .track-row, .photo, .connect-card, .doc-card")];
    if (!els.length) return;
    const idx = new Map();
    els.forEach((el) => {
      const p = el.parentElement, i = idx.get(p) || 0;
      idx.set(p, i + 1);
      el.classList.add("reveal");
      el.style.setProperty("--ri", Math.min(i, 8));
    });
    if (!revealIO) {
      revealIO = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          revealIO.unobserve(el);
          el.classList.add("in");
          const done = () => { el.classList.remove("reveal", "in"); el.style.removeProperty("--ri"); el.removeEventListener("transitionend", done); };
          el.addEventListener("transitionend", done);
        });
      }, { root: main, rootMargin: "0px 0px -6% 0px", threshold: 0.04 });
    }
    els.forEach((el) => revealIO.observe(el));
  }

  // Per-route tab titles — cosmetic (this is a client-rendered SPA, so crawlers
  // still only ever see the static <title> in index.html), but it keeps the
  // browser tab / bookmark / share-sheet title honest as people navigate.
  const ROUTE_TITLES = {
    home: "Sri Kotala", about: "About · Sri Kotala", projects: "Projects · Sri Kotala",
    experience: "Experience & Research · Sri Kotala", photos: "Photography · Sri Kotala",
    connect: "Let's Connect · Sri Kotala", voicemail: "Voicemail · Sri Kotala", search: "Search · Sri Kotala",
  };
  function setTitle(base, arg) {
    if (base === "projects" && arg) {
      const p = PROJECTS.find((x) => x.id === arg);
      document.title = p ? `${p.title} · Sri Kotala` : ROUTE_TITLES.projects;
    } else {
      document.title = ROUTE_TITLES[base] || ROUTE_TITLES.home;
    }
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
    else if (base === "voicemail") out = viewVoicemail();
    else if (base === "search") out = viewSearch(searchInput.value);
    else out = viewHome();
    setTitle(base, arg);
    render(out);
    if (base === "home") fitShelves();
    // active states
    document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("is-active", a.dataset.nav === base));
    document.querySelectorAll("[data-lib]").forEach((li) => li.classList.toggle("is-active", li.dataset.lib === base));
    // voicemail recorder owns a live mic stream — wind it down on every other route,
    // and kick off the permission flow the moment this route renders.
    if (base === "voicemail") vmEnter(); else vmTeardown();
  }

  function go(hash) { if (location.hash === "#" + hash) route(); else location.hash = hash; }

  /* ====================== CLICK DELEGATION ====================== */
  function closeAllFabMenus() {
    document.querySelectorAll("[data-fabwrap].is-open").forEach((w) => {
      w.classList.remove("is-open");
      const m = w.querySelector("[data-fab-menu]"); if (m) m.hidden = true;
      const t = w.querySelector("[data-fab-toggle]"); if (t) t.setAttribute("aria-expanded", "false");
    });
  }
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

  searchInput.addEventListener("input", () => { if ((location.hash || "").startsWith("#search")) render(viewSearch(searchInput.value)); else go("search"); });
  $("[data-back]").addEventListener("click", () => history.back());
  $("[data-fwd]").addEventListener("click", () => history.forward());

  /* ====================== MOBILE NAV DRAWER ====================== */
  // Below 820px the sidebar becomes a slide-in drawer, toggled by the hamburger button.
  (function mobileNav() {
    const sideEl = $(".side"), burger = $("[data-nav-burger]"), backdrop = $("[data-side-backdrop]");
    if (!sideEl || !burger || !backdrop) return;
    function closeSide() { sideEl.classList.remove("is-open"); backdrop.classList.remove("show"); burger.setAttribute("aria-expanded", "false"); }
    function openSide() { sideEl.classList.add("is-open"); backdrop.classList.add("show"); burger.setAttribute("aria-expanded", "true"); }
    burger.addEventListener("click", (e) => { e.stopPropagation(); sideEl.classList.contains("is-open") ? closeSide() : openSide(); });
    backdrop.addEventListener("click", closeSide);
    sideEl.addEventListener("click", (e) => { if (e.target.closest("[data-route],[data-nav],[data-lib]")) closeSide(); });
    window.addEventListener("hashchange", closeSide);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSide(); });
  })();

  /* ====================== VOICEMAIL RECORDER ====================== */
  // Records to whatever MIME type the browser actually supports (webm/opus on Chrome &
  // Firefox, mp4/aac on Safari) rather than hardcoding one, so playback + download work
  // everywhere. Mic is only opened for the duration of an actual recording — the initial
  // permission check stops its tracks immediately so the browser's "mic is live" indicator
  // doesn't sit on while someone is just filling in the name/contact fields.
  const VM_MIME_CANDIDATES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus", "audio/ogg"];
  const VM_MAX_SECONDS = 300; // 5 min — keeps the base64 upload payload well under Vercel's 4.5MB function body limit
  let vmStream = null, vmRecorder = null, vmChunks = [], vmRecording = false, vmTimerId = null, vmStartedAt = 0, vmDuration = 0, vmBlobUrl = null, vmBlob = null, vmTouched = false, vmSendingBlob = null;

  function vmPickMimeType() {
    if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return "";
    return VM_MIME_CANDIDATES.find((t) => MediaRecorder.isTypeSupported(t)) || "";
  }
  function vmSupported() { return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder); }
  // Status/error text is set imperatively (async mic callbacks, validation), so it has to be
  // translated on the way in — translateEl() only re-walks the DOM on render or language switch.
  function vmSetStatus(text) { const el = $("[data-vm-status]"); if (el) el.textContent = tstr(text); }
  function vmErrorMessage(err) {
    const name = err && err.name;
    if (name === "NotAllowedError" || name === "PermissionDeniedError") return "Microphone access was denied. Allow it in your browser’s site settings, then try again.";
    if (name === "NotFoundError" || name === "DevicesNotFoundError") return "No microphone was found on this device.";
    if (name === "NotReadableError" || name === "TrackStartError") return "Your microphone is already in use by another app.";
    return "Couldn’t access the microphone. Please try again.";
  }

  // No getUserMedia call here — the mic permission prompt should only ever appear once someone
  // actually taps the mic button (vmStartRecording), not the moment the page loads.
  function vmEnter() {
    vmRecording = false;
    vmTouched = false;
    const mic = $("[data-vm-mic]"), retry = $("[data-vm-retry]");
    if (!mic) return; // not on the voicemail route
    if (retry) retry.hidden = true;
    if (!vmSupported()) {
      mic.disabled = true; mic.classList.remove("is-ready", "is-recording", "is-denied");
      mic.setAttribute("aria-label", "Voice recording not supported");
      vmSetStatus("Voice recording isn’t supported in this browser.");
      return;
    }
    mic.disabled = false; mic.classList.add("is-ready"); mic.classList.remove("is-recording", "is-denied");
    mic.setAttribute("aria-label", "Start recording");
    vmSetStatus("Tap the mic to record — your browser will ask for microphone access.");
  }

  // Called on every route change (cheap no-op when the recorder was never touched) so a
  // live mic never keeps running once someone navigates away from the voicemail page.
  function vmTeardown() {
    if (vmTimerId) { clearInterval(vmTimerId); vmTimerId = null; }
    if (vmRecorder && vmRecorder.state !== "inactive") { try { vmRecorder.stop(); } catch (e) {} }
    if (vmStream) { vmStream.getTracks().forEach((t) => t.stop()); vmStream = null; }
    vmRecorder = null; vmChunks = []; vmRecording = false;
    if (vmBlobUrl) { URL.revokeObjectURL(vmBlobUrl); vmBlobUrl = null; }
  }

  function vmShowDenied(err) {
    const mic = $("[data-vm-mic]"), retry = $("[data-vm-retry]"); if (!mic) return;
    mic.disabled = false; mic.classList.remove("is-ready", "is-recording"); mic.classList.add("is-denied");
    mic.setAttribute("aria-label", "Microphone access denied");
    if (retry) retry.hidden = false;
    vmSetStatus(vmErrorMessage(err));
  }

  // Name + at least one way to reach back are required before we'll start recording.
  function vmValidate() {
    const nameEl = $("#vm-name"), emailEl = $("#vm-email"), phoneEl = $("#vm-phone");
    const nameErr = $("[data-vm-error='name']"), emailErr = $("[data-vm-error='email']"), contactErr = $("[data-vm-error='contact']");
    let ok = true;
    const hasName = !!(nameEl && nameEl.value.trim());
    if (nameErr) { nameErr.hidden = hasName; nameErr.textContent = tstr("Please tell me your name."); }
    if (nameEl) nameEl.setAttribute("aria-invalid", String(!hasName));
    if (!hasName) ok = false;
    const emailVal = emailEl ? emailEl.value.trim() : "";
    const emailValid = !emailVal || (emailEl && emailEl.checkValidity());
    if (emailErr) { emailErr.hidden = emailValid; emailErr.textContent = tstr("That doesn’t look like a valid email."); }
    if (emailEl) emailEl.setAttribute("aria-invalid", String(!emailValid));
    if (!emailValid) ok = false;
    const hasContact = !!(emailVal || (phoneEl && phoneEl.value.trim()));
    if (contactErr) { contactErr.hidden = hasContact; contactErr.textContent = tstr("Leave an email or phone number so I can get back to you."); }
    if (!hasContact) ok = false;
    return ok;
  }

  function vmStartRecording() {
    const mic = $("[data-vm-mic]");
    if (!mic || mic.disabled || vmRecording) return;
    vmTouched = true;
    if (!vmValidate()) { vmSetStatus("Fill in your name and a way to reach you before recording."); return; }
    // This is the only getUserMedia call in the whole flow — the browser's permission prompt
    // fires right here, from inside this click handler, the first time someone taps the mic.
    mic.disabled = true;
    const retry = $("[data-vm-retry]"); if (retry) retry.hidden = true;
    vmSetStatus("Requesting microphone access…");
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      vmStream = stream;
      vmChunks = [];
      const mimeType = vmPickMimeType();
      try { vmRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream); }
      catch (e) { vmSetStatus("This browser can’t record audio."); vmStream.getTracks().forEach((t) => t.stop()); vmStream = null; return; }
      vmRecorder.ondataavailable = (e) => { if (e.data && e.data.size) vmChunks.push(e.data); };
      vmRecorder.onstop = vmFinishRecording;
      vmRecorder.onerror = () => { vmSetStatus("Recording failed. Please try again."); vmStopRecording(); };
      vmRecorder.start();
      vmRecording = true;
      vmStartedAt = Date.now();
      vmClearPreview(); // stop/discard any prior recording's audio before this one starts
      const mic2 = $("[data-vm-mic]");
      mic2.disabled = false;
      mic2.classList.remove("is-ready"); mic2.classList.add("is-recording");
      mic2.setAttribute("aria-label", "Stop recording");
      vmSetStatus("Recording… tap to stop.");
      const timerEl = $("[data-vm-timer]"); if (timerEl) { timerEl.hidden = false; timerEl.textContent = "0:00"; }
      vmTimerId = setInterval(() => {
        const elapsed = (Date.now() - vmStartedAt) / 1000;
        const t = $("[data-vm-timer]"); if (t) t.textContent = fmt(elapsed);
        if (elapsed >= VM_MAX_SECONDS) vmStopRecording(); // keep messages (and upload payloads) reasonable
      }, 250);
    }).catch((err) => { vmShowDenied(err); });
  }

  function vmStopRecording() {
    if (vmRecorder && vmRecorder.state !== "inactive") vmRecorder.stop();
    else vmFinishRecording();
    if (vmStream) { vmStream.getTracks().forEach((t) => t.stop()); vmStream = null; }
    if (vmTimerId) { clearInterval(vmTimerId); vmTimerId = null; }
    vmRecording = false;
  }

  function vmFinishRecording() {
    const mic = $("[data-vm-mic]");
    if (!mic) return; // navigated away mid-recording
    mic.classList.remove("is-recording"); mic.classList.add("is-ready");
    mic.setAttribute("aria-label", "Start recording");
    const timerEl = $("[data-vm-timer]"); if (timerEl) timerEl.hidden = true;
    if (!vmChunks.length) { vmSetStatus("Ready when you are — tap the mic to record."); return; }
    vmDuration = Math.round((Date.now() - vmStartedAt) / 1000);
    vmBlob = new Blob(vmChunks, { type: (vmRecorder && vmRecorder.mimeType) || "audio/webm" });
    if (vmBlobUrl) URL.revokeObjectURL(vmBlobUrl);
    vmBlobUrl = URL.createObjectURL(vmBlob);
    const audio = $("[data-vm-audio]"), preview = $("[data-vm-preview]"), sendBtn = $("[data-vm-send]"), sendStatus = $("[data-vm-send-status]");
    if (audio) audio.src = vmBlobUrl;
    if (sendBtn) { sendBtn.disabled = false; sendBtn.classList.remove("is-sent"); }
    if (sendStatus) sendStatus.hidden = true;
    if (preview) preview.hidden = false;
    vmSetStatus("Got it! Preview your message below, then hit send.");
  }

  // Hiding the preview panel doesn't stop an already-playing <audio> element underneath it —
  // has to be paused explicitly, or a prior recording keeps audibly playing under a new one.
  function vmClearPreview() {
    const preview = $("[data-vm-preview]"), audio = $("[data-vm-audio]");
    if (preview) preview.hidden = true;
    if (audio) { audio.pause(); audio.removeAttribute("src"); audio.load(); }
    if (vmBlobUrl) { URL.revokeObjectURL(vmBlobUrl); vmBlobUrl = null; }
    vmBlob = null;
  }

  function vmRerecord() {
    vmClearPreview();
    vmSetStatus("Ready when you are — tap the mic to record.");
  }

  // Read-as-base64 + a JSON POST, rather than multipart/form-data, so the API route can rely
  // on Vercel's built-in JSON body parsing instead of pulling in a multipart-parsing dependency.
  function vmBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result).split(",")[1] || "");
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  function vmSend() {
    // Scoped to *this* recording (by object identity), not a global in-flight flag — sending
    // voicemail A must never block someone from recording and sending voicemail B before A's
    // request resolves. Only guards against double-firing the same blob (double-click/tap).
    if (!vmBlob || vmSendingBlob === vmBlob) return;
    if (!vmValidate()) { vmSetStatus("Fill in your name and a way to reach you before sending."); return; }
    const thisBlob = vmBlob;
    vmSendingBlob = thisBlob;
    const sendBtn = $("[data-vm-send]"), sendStatus = $("[data-vm-send-status]");
    if (sendBtn) sendBtn.disabled = true;
    if (sendStatus) { sendStatus.hidden = false; sendStatus.textContent = tstr("Sending…"); }
    const name = $("#vm-name") ? $("#vm-name").value.trim() : "";
    const email = $("#vm-email") ? $("#vm-email").value.trim() : "";
    const phone = $("#vm-phone") ? $("#vm-phone").value.trim() : "";
    const mimeType = thisBlob.type || "audio/webm";
    vmBlobToBase64(thisBlob).then((audioBase64) => fetch("/api/voicemail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, mimeType, durationSeconds: vmDuration, audioBase64 }),
    })).then((res) => { if (!res.ok) throw new Error("bad status"); return res.json().catch(() => ({})); })
      .then(() => {
        if (vmSendingBlob === thisBlob) vmSendingBlob = null;
        // The recording may already have moved on (re-recorded, or a new one sent) by the time
        // this resolves — only touch the UI if it's still showing the same send we started.
        if (sendBtn && vmBlob === thisBlob) sendBtn.classList.add("is-sent");
        if (sendStatus && vmBlob === thisBlob) sendStatus.textContent = tstr("Sent! Thanks — I’ll get back to you.");
      })
      .catch(() => {
        if (vmSendingBlob === thisBlob) vmSendingBlob = null;
        if (sendBtn && vmBlob === thisBlob) sendBtn.disabled = false;
        if (sendStatus && vmBlob === thisBlob) sendStatus.textContent = tstr("Couldn’t reach the server — please try again in a moment.");
      });
  }

  document.addEventListener("submit", (e) => { if (e.target && e.target.hasAttribute && e.target.hasAttribute("data-vm-form")) e.preventDefault(); });
  document.addEventListener("input", (e) => { if (vmTouched && e.target.closest && e.target.closest("[data-vm-input]")) vmValidate(); });
  // Phone field accepts digits only — strip anything else as it's typed/pasted, rather than
  // validating after the fact. Preserves cursor position so stripping mid-string (e.g. a paste
  // with dashes) doesn't jump the caret to the end.
  document.addEventListener("input", (e) => {
    const phoneEl = e.target.closest && e.target.closest("[data-vm-phone]");
    if (!phoneEl) return;
    const digitsOnly = phoneEl.value.replace(/\D/g, "");
    if (digitsOnly === phoneEl.value) return;
    const pos = phoneEl.selectionStart - (phoneEl.value.slice(0, phoneEl.selectionStart).match(/\D/g) || []).length;
    phoneEl.value = digitsOnly;
    phoneEl.setSelectionRange(pos, pos);
  });

  /* ====================== LIGHTBOX ====================== */
  const lb = $("[data-lightbox]"), lbImg = $("[data-lb-img]"), lbCap = $("[data-lb-cap]");
  function openLightbox(i) { const p = PHOTOS[i]; if (!p) return; lbImg.src = p.src; lbCap.textContent = p.cap; lb.classList.add("show"); }
  function closeLightbox() { lb.classList.remove("show"); lbImg.src = ""; }
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest("[data-lb-close]")) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeLightbox(); closeAllFabMenus(); } });

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

  // ---- real per-track frequency data, precomputed offline from each track's own audio ----
  // (see assets/viz/<videoId>.json: log-spaced band energies sampled over time, built by
  // downloading each track once, running an FFT, and keeping only this tiny derived numeric
  // envelope — never the audio itself). Synced to playback via yt.getCurrentTime() in draw().
  const vizCache = new Map(); // id -> {fps,bands,frames,bytes:Uint8Array} | null (no data / failed)
  let curVizId = null, curViz = null;
  function loadViz(id) {
    if (!id) return Promise.resolve(null);
    if (vizCache.has(id)) return Promise.resolve(vizCache.get(id));
    return fetch(`./assets/viz/${id}.json`)
      .then((r) => { if (!r.ok) throw 0; return r.json(); })
      .then((d) => {
        const bytes = Uint8Array.from(atob(d.data), (c) => c.charCodeAt(0));
        const v = { fps: d.fps, bands: d.bands, frames: d.frames, bytes };
        vizCache.set(id, v);
        return v;
      })
      .catch(() => { vizCache.set(id, null); return null; });
  }
  function ytThumbHi(id) { return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`; }
  // YouTube serves a tiny gray placeholder (HTTP 200, ~120x90) instead of a 404 when a
  // maxres thumbnail doesn't exist for a video — so feature-detect by checking real size.
  function upgradeThumb(el, id) {
    if (!id || !el) return;
    const img = new Image();
    img.onload = () => { if (img.naturalWidth > 120) el.style.backgroundImage = `url(${ytThumbHi(id)})`; };
    img.src = ytThumbHi(id);
  }

  // ---- mobile audio unlock ----
  // Mobile browsers only allow the FIRST audio playback on a page to start from
  // directly inside a user gesture. On a phone the YouTube iframe API script is
  // often still loading when someone taps play, so the real playVideo() call ends
  // up firing later from the async onReady callback — outside that gesture — and
  // gets silently blocked. That's the "sometimes it just doesn't play" bug. Playing
  // one silent frame synchronously on the page's first touch/click grants the page
  // audio-playback permission immediately, so the later async call goes through.
  const SILENT_WAV = "data:audio/wav;base64,UklGRkQDAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YSADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";
  (function unlockMobileAudio() {
    let done = false;
    function unlock() {
      if (done) return; done = true;
      try { const a = new Audio(SILENT_WAV); a.volume = 0; a.play().catch(() => {}); } catch (e) {}
    }
    document.addEventListener("touchstart", unlock, { once: true, passive: true });
    document.addEventListener("pointerdown", unlock, { once: true, passive: true });
  })();

  // ---- YouTube IFrame API (hidden player streams the audio) ----
  window.onYouTubeIframeAPIReady = function () {
    yt = new YT.Player("yt-host", {
      height: "1", width: "1",
      playerVars: { controls: 0, disablekb: 1, playsinline: 1, rel: 0, origin: location.origin },
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

  // ---- visualizer: real frequency bands when precomputed data is available for the current
  // track (synced to yt.getCurrentTime()), otherwise falls back to the old decorative motion ----
  function resizeCanvas() { const d = window.devicePixelRatio || 1; canvas.width = canvas.clientWidth * d; canvas.height = canvas.clientHeight * d; ctx2d.setTransform(d, 0, 0, d, 0, 0); }
  window.addEventListener("resize", resizeCanvas);
  const NB = 48, bars = new Array(NB).fill(0);
  function draw() {
    raf = requestAnimationFrame(draw);
    const w = canvas.clientWidth, h = canvas.clientHeight; ctx2d.clearRect(0, 0, w, h);
    const t = performance.now() / 1000, bw = w / NB;
    let frame = null, frameBase = 0, frameBands = 0;
    if (isPlaying && curViz && ytReady) {
      const ct = yt.getCurrentTime() || 0;
      const fi = Math.min(curViz.frames - 1, Math.max(0, Math.floor(ct * curViz.fps)));
      frame = curViz.bytes; frameBase = fi * curViz.bands; frameBands = curViz.bands;
    }
    for (let i = 0; i < NB; i++) {
      let target;
      if (frame) {
        const bi = Math.min(frameBands - 1, Math.floor((i / NB) * frameBands));
        target = 0.05 + (frame[frameBase + bi] / 255) * 0.95;
      } else {
        target = isPlaying
          ? (0.28 + 0.72 * Math.abs(Math.sin(i * 0.5 + t * 3.1) * Math.sin(i * 0.13 + t * 1.7))) * (0.55 + Math.random() * 0.45)
          : 0.02;
      }
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
    if (id) upgradeThumb(nowArt, id);
    nowTitle.textContent = t.title; nowArtist.textContent = t.artist;
    curEl.textContent = "0:00"; durEl.textContent = "0:00"; seekEl.value = 0; seekEl.style.setProperty("--f", "0%");
    curVizId = id; curViz = null;
    loadViz(id).then((v) => { if (curVizId === id) curViz = v; });
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
  const artAttr = (yt) => { const id = ytId(yt); return id ? `data-yt="${id}"` : ""; };
  const chevR = '<svg class="queue-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';
  const chevL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>';

  function renderPanel() {
    if (!libView) {
      qPanel.innerHTML =
        `<div class="queue-head"><span>Your Library</span><span class="queue-count">${PLAYLISTS.length} playlist${PLAYLISTS.length === 1 ? "" : "s"}</span></div>` +
        `<div class="queue-list">${PLAYLISTS.map((p, pi) => `
          <div class="queue-item" data-pl="${pi}">
            <div class="queue-art" style="background:${artBg(p.tracks[0] && p.tracks[0].yt)}" ${artAttr(p.tracks[0] && p.tracks[0].yt)}></div>
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
            <div class="queue-art" style="background:${artBg(t.yt)}" ${artAttr(t.yt)}></div>
            <div class="queue-info"><div class="queue-title">${esc(t.title)}</div><div class="queue-artist">${esc(t.artist)}</div></div>
            <div class="queue-eq" aria-hidden="true"><span></span><span></span><span></span></div>
          </div>`; }).join("")}</div>`;
      qPanel.querySelector("[data-back-lib]").addEventListener("click", (e) => { e.stopPropagation(); libView = null; renderPanel(); });
      qPanel.querySelector("[data-play-pl-cur]").addEventListener("click", (e) => { e.stopPropagation(); playPlaylist(p); syncQueue(); });
      qPanel.querySelectorAll("[data-qi]").forEach((el) => el.addEventListener("click", (e) => { e.stopPropagation(); playFromPlaylist(p, +el.dataset.qi); }));
      syncQueue();
    }
    qPanel.querySelectorAll("[data-yt]").forEach((el) => upgradeThumb(el, el.dataset.yt));
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
    "Jun 2026 – Aug 2026": "jun 2026 – ago 2026", "May 2024 - Aug 2024": "may 2024 - ago 2024",
    "Feature Selection in Medical ML": "Selección de características en ML médico",
    "Political Communication & AI": "Comunicación política e IA",
    "Hubbard School, UMN · 2026 ICA Finalist": "Hubbard School, UMN · Finalista ICA 2026",
    "May 2024 - August 2026": "may 2024 – agosto 2026", "Summer 2024": "Verano 2024",
    "2026 International Communication Association (ICA) Finalist": "Finalista de la International Communication Association (ICA) 2026",
    "UMN Undergraduate Research Scholarship": "Beca de Investigación de Pregrado de UMN",
    "Dean's List, College of Liberal Arts": "Cuadro de Honor, College of Liberal Arts",
    "ML / NSF Research Poster": "Póster de investigación ML / NSF",
    "GenAI + Political Communication": "IA Generativa + Comunicación Política", "Paper": "Artículo",
    "LegalAI File Manager Documentation": "Documentación de LegalAI File Manager",
    // projects
    "Hugging Face Space": "Espacio de Hugging Face", "GitHub Repository": "Repositorio de GitHub",
    "GitHub Repo": "Repositorio de GitHub", "Website": "Sitio web",
    "A voice-message feature for this site that records audio in the browser, then runs it through open-weight Hugging Face models. Every message goes through a spam-filter.": "Una función de mensajes de voz para este sitio que graba audio en el navegador y luego lo procesa con modelos de pesos abiertos de Hugging Face. Cada mensaje pasa por un filtro antispam.",
    "A FastAPI app that pulls step counts from my Fitbit Air via Google Cloud and converts them into progress on a virtual walk around the world.": "Una app de FastAPI que toma los pasos de mi Fitbit Air a través de Google Cloud y los convierte en avance dentro de una caminata virtual alrededor del mundo.",
    "Using machine learning algorithms to predict a UFC fighter’s probability of winning, their most likely method of victory, and in which round.": "Uso de algoritmos de aprendizaje automático para predecir la probabilidad de victoria de un peleador de UFC, su método de victoria más probable, y en qué asalto.",
    "I used Retrieval-Augmented Generation (RAG) to \"chat\" with any book! This application is geared towards children who are able to have simple conversations with complex books, stories, and ideas.": "Usé Generación Aumentada por Recuperación (RAG) para \"conversar\" con cualquier libro. Esta aplicación está pensada para niños que pueden tener conversaciones sencillas sobre libros, historias e ideas complejas.",
    "A tool that searches LinkedIn to surface candidates matching a given role.": "Una herramienta que busca en LinkedIn para encontrar candidatos que coincidan con un puesto determinado.",
    "An AI-powered file manager that automatically renames and sorts files.": "Un gestor de archivos con IA que renombra y organiza los archivos automáticamente.",
    "An interactive AI chat experience that allows you to talk to me.": "Una experiencia de chat con IA interactiva que te permite hablar conmigo.",
    "A trip-planning project via a crew of agents.": "Un proyecto de planificación de viajes mediante un equipo de agentes.",
    "A multi-agent social media content workflow built with CrewAI.": "Un flujo de contenido para redes sociales multiagente creado con CrewAI.",
    "An ML project pitting strategy against strength.": "Un proyecto de ML que enfrenta la estrategia contra la fuerza.",
    "A social-listening application I made for Telemundo Minnesota.": "Una aplicación de escucha social que hice para Telemundo Minnesota.",
    "A motivational quotes app. Highlighting extraordinary people, places, and things so we too can become extraordinary 🌎🌷💛🏖️🏄": "Una app de frases motivacionales. Destacando personas, lugares y cosas extraordinarias para que nosotros también podamos serlo 🌎🌷💛🏖️🏄",
    "Data exploration of different datasets in Python.": "Exploración de datos de distintos conjuntos de datos en Python.",
    // photos
    "Clam on a Chilean beach": "Almeja en una playa chilena", "City cat": "Gato callejero",
    "My dog": "Mi perro", "Cool Mexican fish": "Peces mexicanos geniales", "Mrs. Kipling!?": "¿¡La Sra. Kipling!?",
    "Red tulips": "Tulipanes rojas", "Photo": "Foto", "Sunset on the Caribbean": "Atardecer en el Caribe",
    "Turtles in Crystal Springs": "Tortugas en Crystal Springs",
    "Aftermath of a long run": "Las secuelas de una carrera larga",
    "Giant Eyeball in Dallas": "El ojo gigante de Dallas",
    "Birds in Punta Arenas": "Aves en Punta Arenas",
    // connect
    "Let's be friends 😄": "Seamos amigos 😄", "Email": "Correo", "Stalk my runs": "Espía mis carreras",
    // voicemail
    "Voicemail": "Buzón de voz", "Send me a voice message!": "¡Envíame un mensaje de voz!",
    "Send me a voice message in whatever language you wish!": "¡Envíame un mensaje de voz en el idioma que quieras!",
    "Your name": "Tu nombre", "Phone number": "Número de teléfono",
    "Full name": "Nombre completo",
    "Requesting microphone access…": "Solicitando acceso al micrófono…",
    "Tap the mic to record — your browser will ask for microphone access.": "Toca el micrófono para grabar — tu navegador pedirá acceso al micrófono.",
    "Ready when you are — tap the mic to record.": "Cuando quieras — toca el micrófono para grabar.",
    "Recording… tap to stop.": "Grabando… toca para detener.",
    "Microphone access was denied. Allow it in your browser’s site settings, then try again.": "Se denegó el acceso al micrófono. Permítelo en la configuración del sitio de tu navegador y vuelve a intentarlo.",
    "Voice recording isn’t supported in this browser.": "La grabación de voz no es compatible con este navegador.",
    "No microphone was found on this device.": "No se encontró ningún micrófono en este dispositivo.",
    "Your microphone is already in use by another app.": "Tu micrófono ya está siendo usado por otra aplicación.",
    "Couldn’t access the microphone. Please try again.": "No se pudo acceder al micrófono. Inténtalo de nuevo.",
    "This browser can’t record audio.": "Este navegador no puede grabar audio.",
    "Recording failed. Please try again.": "La grabación falló. Inténtalo de nuevo.",
    "Fill in your name and a way to reach you before recording.": "Completa tu nombre y una forma de contactarte antes de grabar.",
    "Fill in your name and a way to reach you before sending.": "Completa tu nombre y una forma de contactarte antes de enviar.",
    "Got it! Preview your message below, then hit send.": "¡Listo! Escucha tu mensaje abajo y luego pulsa enviar.",
    "Allow microphone access": "Permitir acceso al micrófono",
    "Record again": "Grabar de nuevo",
    "Sending…": "Enviando…", "Sent! Thanks — I’ll get back to you.": "¡Enviado! Gracias — te responderé pronto.",
    "Couldn’t reach the server — please try again in a moment.": "No se pudo conectar con el servidor — inténtalo de nuevo en un momento.",
    "Please tell me your name.": "Dime tu nombre, por favor.",
    "That doesn’t look like a valid email.": "Ese correo no parece válido.",
    "Leave an email or phone number so I can get back to you.": "Deja un correo o número de teléfono para poder responderte.",
    // player + library
    "Press play": "Dale a play", "A dive into my favorite songs": "Un viaje por mis canciones favoritas",
    "Demo soundtrack": "Banda sonora de muestra", "Unavailable — try another song": "No disponible — prueba otra canción",
    "Your Library": "Tu biblioteca",
    // search
    "What do you want to explore?": "¿Qué quieres explorar?", "Nothing found.": "No se encontró nada.",
    "Browse everything": "Explora todo", "Sections": "Secciones", "Photos": "Fotos",
    // pokémon widget (species names are proper nouns and stay in English, like tech tags)
    "Select a generation or start typing to search for a Pokémon…": "Elige una generación o escribe para buscar un Pokémon…",
    "All generations": "Todas las generaciones",
    "No Pokémon found.": "No se encontró ningún Pokémon.",
    "No Pokémon yet — click + to add one.": "Aún no hay ningún Pokémon — haz clic en + para añadir uno.",
  };
  function tstr(en) { if (LANG !== "es") return en; return I18N[en] || esPattern(en) || en; }
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
    if ((m = key.match(/^Generation (\d+)$/))) return "Generación " + m[1];
    if ((m = key.match(/^Browse Gen (\d+) Pokémon$/))) return "Explorar Pokémon de la Gen " + m[1];
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
    // A gentle low-pass (plus a touch of high-shelf cut) every tone is routed through — this is
    // what actually makes things sound "creamy" instead of synth-y: it rounds off the upper
    // harmonics of the triangle waves below so nothing reads as buzzy or clicky.
    function warm(x) {
      if (!x._w) {
        const lp = x.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 620; lp.Q.value = 0.4;
        const sh = x.createBiquadFilter(); sh.type = "highshelf"; sh.frequency.value = 2200; sh.gain.value = -9;
        lp.connect(sh); sh.connect(x.destination);
        x._w = lp;
      }
      return x._w;
    }
    // Short burst of filtered noise, lowpassed for a soft "puff" of air rather than a fizzy hiss.
    function noiseBurst(x, t, dur, freq, q, vol) {
      const n = Math.max(1, Math.floor(x.sampleRate * dur));
      const buf = x.createBuffer(1, n, x.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.2);
      const src = x.createBufferSource(); src.buffer = buf;
      const bp = x.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = freq; bp.Q.value = q;
      const g = x.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(bp); bp.connect(g); g.connect(x.destination);
      src.start(t);
    }
    // A round, mellow tone: triangle (not sine) carries the body — a little more harmonic
    // richness than a sine reads as "warm" rather than "thin" — with a quiet sub-octave sine
    // underneath for weight and a slow, soft attack so nothing ever sounds plucked or clicky.
    function pop(freq, vol, dur) {
      if (muted) return; const x = ac(); if (!x) return; const t = x.currentTime;
      const o = x.createOscillator(), det = x.createOscillator(), sub = x.createOscillator(), g = x.createGain(), subG = x.createGain();
      o.type = "triangle"; det.type = "triangle"; sub.type = "sine";
      o.frequency.setValueAtTime(freq * 1.1, t); o.frequency.exponentialRampToValueAtTime(freq, t + 0.15);
      det.frequency.setValueAtTime(freq * 1.11, t); det.frequency.exponentialRampToValueAtTime(freq * 1.006, t + 0.15); // gentle detune = body
      sub.frequency.setValueAtTime(freq * 0.5, t);
      subG.gain.value = 0.4; // keep the sub quiet — weight without boom
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.07); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); det.connect(g); sub.connect(subG); subG.connect(g); g.connect(warm(x));
      o.start(t); det.start(t); sub.start(t); o.stop(t + dur + 0.05); det.stop(t + dur + 0.05); sub.stop(t + dur + 0.05);
    }
    // A soft, rounded click: a mellow triangle thump sliding gently downward, plus a brief warm
    // puff of lowpassed noise underneath — a cream/lubed switch bottoming out, not a hard clack.
    function squish() {
      if (muted) return; const x = ac(); if (!x) return; const t = x.currentTime;
      const o = x.createOscillator(), g = x.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(165, t); o.frequency.exponentialRampToValueAtTime(72, t + 0.13);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.055, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
      o.connect(g); g.connect(warm(x));
      o.start(t); o.stop(t + 0.17);
      noiseBurst(x, t, 0.09, 520, 0.9, 0.018);
    }
    const hover = () => { const n = performance.now(); if (n - last < 90) return; last = n; pop(460, 0.009, 0.2); };
    const tick = () => squish();
    const swoosh = () => { pop(260, 0.038, 0.32); setTimeout(() => pop(390, 0.03, 0.3), 90); };
    const HOVER = ".side-nav a, .lib-list li, .card, .tile, .connect-card, .ctrl, .theme-btn, .photo, .ghost-btn, .play-big, .round-btn, .show-all, .track-row.link";
    const CLICK = "a, button, .card, .tile, .lib-list li, .connect-card, .photo, .track-row.link";
    document.addEventListener("pointerover", (e) => { if (e.target.closest && e.target.closest(HOVER)) hover(); }, { passive: true });
    document.addEventListener("pointerdown", (e) => { const el = e.target.closest && e.target.closest(CLICK); if (!el) return; if (el.matches("[data-theme-toggle], [data-theme-toggle] *, [data-lang-toggle], [data-lang-toggle] *")) swoosh(); else tick(); }, { passive: true });

    const btn = $("[data-sound-toggle]");
    if (btn) {
      const reflect = () => { btn.classList.toggle("on", !muted); btn.setAttribute("title", muted ? "UI sounds: off" : "UI sounds: on"); };
      btn.addEventListener("click", () => { muted = !muted; localStorage.setItem("uiSound", muted ? "off" : "on"); reflect(); if (!muted) tick(); });
      reflect();
    }
  })();

  /* ====================== CONFETTI (click the logo/name) ====================== */
  // A burst radiating out from the logo, like the effect on quotableapp.net —
  // not a rain of confetti falling from the top of the screen.
  (function confettiFX() {
    const brand = $(".brand");
    if (!brand) return;
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const colors = ["#ffc72c", "#7a0019", "#ffd75e", "#93122f", "#38ef7d", "#4facfe", "#ffffff"];
    // `html{zoom:90%}` (see app.css) renders this fixed, full-viewport canvas into an enlarged
    // CSS-pixel space, so constant px/frame motion reads slower on screen than it should at 100%
    // zoom — compensate by scaling gravity/velocity by the inverse of the zoom factor so the fall
    // speed looks the same regardless of page zoom (particle *size* is intentionally left alone,
    // since pieces should shrink along with the rest of the zoomed-out UI).
    const zoomFactor = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
    const gravity = 1.1 / zoomFactor, drag = 0.985;
    let canvas, cctx, particles = [], raf2 = null;
    // A mellow party-horn "toot" that glides up, then a soft ascending twinkle — a celebratory
    // "ta-da!" with the same creamy, rounded-off character as the rest of the UI sounds (a warm
    // lowpass + a triangle horn instead of a buzzy sawtooth, slower attacks throughout).
    function playPopSound() {
      if (localStorage.getItem("uiSound") === "off") return;
      try {
        const x = new (window.AudioContext || window.webkitAudioContext)();
        const t = x.currentTime;
        const master = x.createBiquadFilter(); master.type = "lowpass"; master.frequency.value = 2600; master.Q.value = 0.3;
        master.connect(x.destination);
        const horn = x.createOscillator(), hg = x.createGain(), hf = x.createBiquadFilter();
        horn.type = "triangle";
        horn.frequency.setValueAtTime(300, t);
        horn.frequency.exponentialRampToValueAtTime(560, t + 0.11);
        hf.type = "bandpass"; hf.frequency.value = 850; hf.Q.value = 1.6;
        hg.gain.setValueAtTime(0.0001, t);
        hg.gain.linearRampToValueAtTime(0.14, t + 0.035);
        hg.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
        horn.connect(hf); hf.connect(hg); hg.connect(master);
        horn.start(t); horn.stop(t + 0.18);
        [[1046, 0.1], [1318, 0.17], [1568, 0.24]].forEach(([freq, dt]) => {
          const o = x.createOscillator(), g = x.createGain();
          o.type = "triangle"; o.frequency.setValueAtTime(freq, t + dt);
          g.gain.setValueAtTime(0.0001, t + dt);
          g.gain.linearRampToValueAtTime(0.085, t + dt + 0.025);
          g.gain.exponentialRampToValueAtTime(0.0001, t + dt + 0.32);
          o.connect(g); g.connect(master);
          o.start(t + dt); o.stop(t + dt + 0.34);
        });
        setTimeout(() => x.close(), 700);
      } catch (e) { /* audio unsupported — silently skip */ }
    }
    function ensureCanvas() {
      if (canvas) return;
      canvas = document.createElement("canvas");
      canvas.className = "confetti-canvas";
      canvas.setAttribute("aria-hidden", "true");
      document.body.appendChild(canvas);
      cctx = canvas.getContext("2d");
      const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
      resize();
      window.addEventListener("resize", resize);
    }
    function spawn() {
      ensureCanvas();
      playPopSound();
      const logo = brand.querySelector("img") || brand;
      const r = logo.getBoundingClientRect();
      const originX = r.left + r.width / 2, originY = r.top + r.height / 2;
      const n = 160;
      for (let i = 0; i < n; i++) {
        // Fan the burst upward and outward (like a popper), not a full 360° circle.
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.15;
        const speed = (5 + Math.random() * 11) / zoomFactor;
        particles.push({
          x: originX, y: originY,
          w: 5 + Math.random() * 5, h: 7 + Math.random() * 6,
          color: colors[(Math.random() * colors.length) | 0],
          rot: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.3,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life: 0, maxLife: 90 + Math.random() * 50,
        });
      }
      if (particles.length > 700) particles.splice(0, particles.length - 700);
      if (!raf2) tick();
    }
    function tick() {
      cctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.vx *= drag; p.vy = p.vy * drag + gravity;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
        const fadeIn = p.maxLife - p.life;
        const alpha = fadeIn < 25 ? Math.max(0, fadeIn / 25) : 1;
        cctx.save();
        cctx.globalAlpha = alpha;
        cctx.translate(p.x, p.y);
        cctx.rotate(p.rot);
        cctx.fillStyle = p.color;
        cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        cctx.restore();
      });
      particles = particles.filter((p) => p.life < p.maxLife && p.y < canvas.height + 40);
      raf2 = particles.length ? requestAnimationFrame(tick) : null;
    }
    brand.addEventListener("click", spawn);
  })();

  /* ====================== TEXT SELECTION COLOR ====================== */
  // Random UMN maroon or gold highlight, picked fresh each page load (see ::selection in app.css).
  (function selectionColor() {
    const useGold = Math.random() < 0.5;
    const root = document.documentElement.style;
    root.setProperty("--select-bg", useGold ? "var(--gold)" : "var(--maroon)");
    root.setProperty("--select-fg", useGold ? "#1a1a1a" : "#ffffff");
  })();

  /* ====================== POKÉMON WIDGET ====================== */
  // A VS Code Pokémon-style roaming pet, docked as a third sidebar panel below the library list —
  // https://github.com/jakobhoeg/vscode-pokemon. Sprites are hotlinked straight from that project's
  // public repo (idle/walk gifs per species, 5 gens) rather than vendored here, so there's nothing
  // to keep in sync. Markup lives in <aside class="side">, outside the router's [data-main], so it
  // survives every route change; state is session-only — a refresh resets to one fresh random Pokémon.
  (function pokePet() {
    const widget = $("[data-poke-widget]");
    if (!widget) return;
    const stage = $("[data-poke-stage]", widget);
    const collapseBtn = $("[data-poke-collapse]", widget);
    const addBtn = $("[data-poke-add]", widget);
    const shuffleBtn = $("[data-poke-shuffle]", widget);
    const clearBtn = $("[data-poke-clear]", widget);
    const resizeHandle = $("[data-poke-resize]", widget);
    const picker = $("[data-poke-picker]");
    const pickerInput = $("[data-poke-picker-input]", picker);
    const pickerList = $("[data-poke-picker-list]", picker);

    const SPRITE_BASE = "https://raw.githubusercontent.com/jakobhoeg/vscode-pokemon/main/media";
    const BUBBLE_ICONS = [`${SPRITE_BASE}/happy.png`, `${SPRITE_BASE}/heart.png`];
    const SPRITE_SIZE = 84;
    const MAX_ACTIVE = 3; // fewer, bigger sprites fit the sidebar better than the old 5-at-52px
    const BALL_OPEN_MS = 450, SPAWN_POP_MS = 170, FADE_OUT_MS = 220, BALL_CLOSE_MS = 600;
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pokeList = Object.keys(POKEDEX_BY_GEN).flatMap((g) => POKEDEX_BY_GEN[g].split(" ").map((name) => ({ gen: +g, name })));

    let active = [];
    let idSeq = 0;
    let pendingAnim = 0; // in-flight spawn/despawn DOM animations — gates the empty-state message
    let pickerMode = "root"; // "root" | "gen" | "search"
    let pickerGen = null;

    const spriteUrl = (entry, variant) => `${SPRITE_BASE}/gen${entry.gen}/${entry.name}/default_${variant}_8fps.gif`;
    // Folder names are snake_case ("basculin_blue_striped") — just spacing + title-casing them
    // reads fine for a fun corner-of-the-screen label; a few (e.g. "hooh") won't get their official
    // punctuation back, which is an acceptable trade for not hand-mapping 634 names.
    const displayName = (name) => name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const randomEntry = (excludeName) => {
      let e;
      do { e = pokeList[(Math.random() * pokeList.length) | 0]; } while (pokeList.length > 1 && excludeName && e.name === excludeName);
      return e;
    };

    function renderEmpty() {
      if (active.length || pendingAnim) return; // something's still on stage or mid-animation
      stage.innerHTML = `<div class="poke-empty">${esc(tstr("No Pokémon yet — click + to add one."))}</div>`;
    }

    function clearTimer(p) { if (p.timer) { clearTimeout(p.timer); p.timer = null; } }

    // Fade the Pokémon out, then snap a pokeball shut over the same spot — mirrors
    // jakobhoeg/vscode-pokemon's fade-out + pokeball-close pairing. `p` must already be
    // spliced out of `active` by the caller before this runs.
    function despawn(p) {
      clearTimer(p);
      pendingAnim++;
      const x = p.x;
      p.el.classList.add("is-fading");
      setTimeout(() => {
        p.el.remove();
        const ball = document.createElement("div");
        ball.className = "poke-ball is-closing";
        ball.style.left = x + "px";
        stage.appendChild(ball);
        setTimeout(() => { ball.remove(); pendingAnim--; renderEmpty(); }, BALL_CLOSE_MS);
      }, FADE_OUT_MS);
    }

    function removePokemon(id) {
      const i = active.findIndex((p) => p.id === id);
      if (i === -1) return;
      const [p] = active.splice(i, 1);
      despawn(p);
    }

    function clearAll() {
      const toRemove = active.slice();
      active = [];
      if (!toRemove.length) { renderEmpty(); return; }
      toRemove.forEach(despawn);
    }

    function scheduleIdle(p) {
      p.el.src = spriteUrl(p.entry, "idle");
      if (reduceMotion) return; // respect prefers-reduced-motion: stay put rather than wander
      clearTimer(p);
      p.timer = setTimeout(() => walkToRandom(p), 1400 + Math.random() * 2600);
    }

    function walkToRandom(p) {
      if (!active.includes(p)) return;
      const stageW = stage.clientWidth || 220, spriteW = SPRITE_SIZE;
      const maxX = Math.max(2, stageW - spriteW - 2);
      let targetX = Math.random() * maxX;
      if (Math.abs(targetX - p.x) < 24) targetX = targetX > p.x ? Math.min(maxX, p.x + 40) : Math.max(0, p.x - 40);
      const dir = targetX > p.x ? 1 : -1; // native sprite faces left; flip to face right
      const dur = Math.max(400, (Math.abs(targetX - p.x) / 46) * 1000);
      p.el.classList.toggle("is-flip", dir === 1);
      p.el.src = spriteUrl(p.entry, "walk");
      p.el.style.transitionDuration = dur + "ms";
      requestAnimationFrame(() => { p.el.style.left = targetX + "px"; });
      p.x = targetX;
      clearTimer(p);
      p.timer = setTimeout(() => scheduleIdle(p), dur);
    }

    // Pop a happy/heart bubble above a Pokémon when it's clicked — same happy.png/heart.png
    // reaction icons as the real extension, with a simple fade in/up then out.
    function spawnBubble(p) {
      const bubble = document.createElement("img");
      bubble.className = "poke-bubble";
      bubble.src = BUBBLE_ICONS[(Math.random() * BUBBLE_ICONS.length) | 0];
      bubble.alt = ""; bubble.setAttribute("aria-hidden", "true");
      bubble.style.left = (p.x + SPRITE_SIZE / 2 - 12) + "px";
      stage.appendChild(bubble);
      requestAnimationFrame(() => bubble.classList.add("is-in"));
      setTimeout(() => {
        bubble.classList.remove("is-in");
        setTimeout(() => bubble.remove(), 200);
      }, 850);
    }
    stage.addEventListener("click", (e) => {
      const el = e.target.closest(".poke-sprite");
      if (!el) return;
      const p = active.find((x) => x.el === el);
      if (p) spawnBubble(p);
    });

    // Pokeball-open, then the Pokémon pops in out of it — mirrors jakobhoeg/vscode-pokemon's
    // pokeball-open + pokemon-pop pairing (same 6-frame sheet, same pop timing).
    function spawn(entry) {
      if (active.length >= MAX_ACTIVE) removePokemon(active[0].id);
      const emptyEl = stage.querySelector(".poke-empty");
      if (emptyEl) emptyEl.remove();
      const id = ++idSeq;
      const startX = Math.max(2, Math.random() * ((stage.clientWidth || 220) - SPRITE_SIZE - 6));
      pendingAnim++;
      const ball = document.createElement("div");
      ball.className = "poke-ball is-opening";
      ball.style.left = startX + "px";
      stage.appendChild(ball);
      const p = { id, entry, el: null, x: startX, timer: null };
      active.push(p);
      setTimeout(() => {
        ball.remove();
        const img = document.createElement("img");
        img.className = "poke-sprite is-spawning";
        img.alt = ""; img.setAttribute("aria-hidden", "true");
        img.onerror = () => removePokemon(id); // sprite missing upstream — don't leave a broken icon
        img.src = spriteUrl(entry, "idle");
        img.style.left = startX + "px";
        stage.appendChild(img);
        p.el = img;
        scheduleIdle(p);
        setTimeout(() => { img.classList.remove("is-spawning"); pendingAnim--; }, SPAWN_POP_MS);
      }, BALL_OPEN_MS);
      return p;
    }

    function shuffle() {
      const last = active.length ? active[active.length - 1].entry.name : null;
      clearAll();
      spawn(randomEntry(last));
    }

    /* ---- add-picker (quick-pick style search modal) ---- */
    const folderSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>';
    const ballSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/></svg>';
    const backChevSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>';
    const rowGenHtml = (g) => `<div class="poke-picker-row" data-poke-gen="${g}"><span class="poke-picker-icon">${folderSvg}</span><span class="poke-picker-name">${esc(tstr("Generation " + g))}</span><span class="poke-picker-sub">${esc(tstr("Browse Gen " + g + " Pokémon"))}</span></div>`;
    const rowBackHtml = () => `<div class="poke-picker-row" data-poke-back><span class="poke-picker-icon">${backChevSvg}</span><span class="poke-picker-name">${esc(tstr("All generations"))}</span></div>`;
    const rowPokemonHtml = (entry) => `<div class="poke-picker-row" data-poke-pick="${entry.gen}|${esc(entry.name)}"><span class="poke-picker-icon">${ballSvg}</span><span class="poke-picker-name">${esc(displayName(entry.name))}</span><span class="poke-picker-sub">Gen ${entry.gen}</span></div>`;

    function renderPicker(query) {
      if (pickerMode === "root") {
        pickerList.innerHTML = [1, 2, 3, 4, 5].map(rowGenHtml).join("");
      } else if (pickerMode === "gen") {
        pickerList.innerHTML = rowBackHtml() + POKEDEX_BY_GEN[pickerGen].split(" ").map((name) => rowPokemonHtml({ gen: pickerGen, name })).join("");
      } else {
        const q = (query || "").toLowerCase();
        const matches = pokeList.filter((e) => displayName(e.name).toLowerCase().includes(q)).slice(0, 60);
        pickerList.innerHTML = matches.length ? matches.map(rowPokemonHtml).join("") : `<div class="poke-picker-empty">${esc(tstr("No Pokémon found."))}</div>`;
      }
    }

    function openPicker() {
      picker.hidden = false;
      pickerInput.value = "";
      pickerMode = "root"; pickerGen = null;
      renderPicker();
      requestAnimationFrame(() => pickerInput.focus());
    }
    function closePicker() { picker.hidden = true; }

    addBtn.addEventListener("click", openPicker);
    picker.addEventListener("pointerdown", (e) => { if (e.target === picker) closePicker(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !picker.hidden) closePicker(); });
    pickerInput.addEventListener("input", () => {
      const q = pickerInput.value.trim().toLowerCase();
      pickerMode = q ? "search" : "root";
      if (!q) pickerGen = null;
      renderPicker(q);
    });
    pickerList.addEventListener("click", (e) => {
      const row = e.target.closest(".poke-picker-row");
      if (!row) return;
      if (row.dataset.pokeGen) { pickerMode = "gen"; pickerGen = +row.dataset.pokeGen; pickerInput.value = ""; renderPicker(); pickerInput.focus(); return; }
      if (row.dataset.pokeBack !== undefined) { pickerMode = "root"; pickerGen = null; renderPicker(); return; }
      if (row.dataset.pokePick) {
        const [gen, name] = row.dataset.pokePick.split("|");
        spawn({ gen: +gen, name });
        closePicker();
      }
    });

    collapseBtn.addEventListener("click", () => {
      const collapsed = widget.classList.toggle("is-collapsed");
      collapseBtn.setAttribute("aria-expanded", String(!collapsed));
    });
    shuffleBtn.addEventListener("click", shuffle);
    clearBtn.addEventListener("click", clearAll);

    /* ---- drag the handle above the stage to resize it ---- */
    const STAGE_MIN_H = 100;
    resizeHandle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      const startY = e.clientY, startH = stage.offsetHeight;
      const maxH = Math.max(STAGE_MIN_H, Math.min(460, window.innerHeight - 260));
      resizeHandle.classList.add("is-dragging");
      resizeHandle.setPointerCapture(e.pointerId);
      const onMove = (ev) => {
        const h = Math.min(maxH, Math.max(STAGE_MIN_H, startH + (startY - ev.clientY)));
        stage.style.height = h + "px";
      };
      const onUp = () => {
        resizeHandle.classList.remove("is-dragging");
        resizeHandle.removeEventListener("pointermove", onMove);
        resizeHandle.removeEventListener("pointerup", onUp);
      };
      resizeHandle.addEventListener("pointermove", onMove);
      resizeHandle.addEventListener("pointerup", onUp);
    });

    spawn(randomEntry()); // every visitor gets one wandering companion by default
  })();

  /* ====================== INIT ====================== */
  window.addEventListener("hashchange", route);
  requestAnimationFrame(resizeCanvas);
  route();
  applyLang(LANG);
})();
