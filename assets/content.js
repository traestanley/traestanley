const FPS = 24, LEN = 120;
const abs = p => new URL(p, document.baseURI).href; // full URLs, so CSS backgrounds resolve from the page
const IMG = {}; // project stills, e.g. {name: abs("assets/img/name.jpg")}; use as img:IMG.name and in the scene background
const KIND = {
  me:{label:"Trae",color:"var(--c-me)"}, film:{label:"Work at Audion",color:"var(--c-film)"},
  family:{label:"Family photos",color:"var(--c-family)"}, essay:{label:"Essay",color:"var(--c-essay)"}, note:{label:"Note",color:"var(--c-note)"}
};
/* Site content. To add an essay: copy an essay entry, change id/name/title/desc, set url to its page, and give it a free start time on V1. */
const LINKEDIN="https://www.linkedin.com/in/traestanley";
const AUD="https://www.audion.energy", AUDWORK="https://www.audion.energy/our-work";
const CLIPS = [
  {id:"title",track:"V1",kind:"me",start:0,dur:8,name:"Title card",
   scene:`<div class="scene s-title"><div><h1>TRAE STANLEY</h1><p>Notes on making video people trust.</p><div class="ind"><span>Storytelling</span><span>Trust on camera</span><span>AI &amp; authenticity</span><span>Energy</span><span>Associations</span></div></div></div>`,
   title:"Trae Stanley",desc:"I’m a video producer at Audion in Houston. I spend my days filming energy executives, safety crews, educators and association leaders. Here I write about what that work teaches me: how people earn trust on camera, and what changes now that anyone can generate video.",
   meta:[["Day job","Producer, Audion"],["Based in","Sugar Land · Houston"],["Writes about","Storytelling, trust, AI and authenticity, industrial and association video"]],
   act:[["Read the latest essay","essay1"],["Audion ↗",AUD]]},

  {id:"essay1",track:"V1",kind:"essay",start:8,dur:16,name:"Polish is out. Proof is in.",soon:true,
   scene:`<div class="scene s-essay"><div><span class="mono k">Essay · 6 min read</span><h2>Polish is out. Proof is in.</h2><p>Feeds are filling up with AI-generated b-roll and stock smiles. The videos that still cut through show real employees, real job sites and real customers. Proof is becoming the new production value, and most companies haven’t noticed yet.</p></div></div>`,
   title:"Polish is out. Proof is in.",desc:"Why people-led, unscripted video is beating glossy brand spots, and what that means for how we shoot.",
   meta:[["Why now","LinkedIn and Threads reward people-led, authentic video as AI content floods feeds"],["Read time","6 min"]],act:[]},
  {id:"essay2",track:"V1",kind:"essay",start:24,dur:16,name:"What I’ve learned putting CEOs on camera",soon:true,
   scene:`<div class="scene s-essay"><div><span class="mono k">Essay · 7 min read</span><h2>What I’ve learned putting CEOs on camera</h2><p>The most powerful person in the room is usually the most nervous one once the light comes on. After years of filming energy executives, I’ve stopped writing them better scripts and started asking them better questions.</p></div></div>`,
   title:"What I’ve learned putting CEOs on camera",desc:"Lessons from filming energy executives: why scripts make leaders sound less believable, and what to do instead.",
   meta:[["Drawn from","Executive panels and interviews at Audion"],["Read time","7 min"]],act:[]},
  {id:"essay3",track:"V1",kind:"essay",start:40,dur:16,name:"Your conference is a year of content",soon:true,
   scene:`<div class="scene s-essay"><div><span class="mono k">Essay · 7 min read</span><h2>Your conference is a year of content. Most associations use it for a week.</h2><p>I’ve filmed rooms full of keynotes that vanished the day after the event. With a little planning before the cameras roll, those sessions become member clips, on-demand courses and next year’s registration video.</p></div></div>`,
   title:"Your conference is a year of content",desc:"How associations can treat event video as a year-round asset instead of a recording that sits on a drive.",
   meta:[["Why now","Associations are treating event content as a year-round asset (ASAE, Naylor, 2026)"],["Read time","7 min"]],act:[]},
  {id:"essay4",track:"V1",kind:"essay",start:56,dur:16,name:"The jobs no one is applying for",soon:true,
   scene:`<div class="scene s-essay"><div><span class="mono k">Essay · 6 min read</span><h2>The jobs no one is applying for</h2><p>An estimated 2.1 million skilled-trades roles could go unfilled by 2030. A careers page won’t fix that. Short videos of real crews, shot on the jobsite and posted where young people actually look, might.</p></div></div>`,
   title:"The jobs no one is applying for",desc:"Recruiting video for construction and energy, and why the crew on site tells the story better than any ad.",
   meta:[["Why now","Skilled-trades shortage; companies turning to short recruiting video"],["Read time","6 min"]],act:[]},
  {id:"essay5",track:"V1",kind:"essay",start:72,dur:16,name:"Shoot once, post for a month",soon:true,
   scene:`<div class="scene s-essay"><div><span class="mono k">Essay · 5 min read</span><h2>Shoot once, post for a month</h2><p>One interview day can give a team a hero film, a dozen under-60-second clips and a short LinkedIn series. The trick is deciding on the cutdowns before the shoot, not after.</p></div></div>`,
   title:"Shoot once, post for a month",desc:"Thinking in cutdowns: how one shoot becomes a month of native video.",
   meta:[["Why now","Short native video and recurring series formats are growing on LinkedIn"],["Read time","5 min"]],act:[]},

  {id:"film1",track:"V2",kind:"film",start:10,dur:10,name:"Energy · Executive panel",
   scene:`<div class="scene s-film" style="--g:radial-gradient(90% 90% at 70% 25%,#3A3424 0%,#0A0906 72%)"><div><div class="big">Energy leaders, on camera and at ease.</div></div></div>`,
   title:"Energy · Executive panel",desc:"Multi-camera coverage of an industry panel with energy-company CEOs. This is where essays like “What I’ve learned putting CEOs on camera” come from.",
   meta:[["Studio","Audion"],["Industry","Energy"],["Format","Live panel · multi-camera"]],act:[["See Audion’s work ↗",AUDWORK]]},
  {id:"film2",track:"V2",kind:"film",start:28,dur:9,name:"Energy · Product explainer",
   scene:`<div class="scene s-film" style="--g:radial-gradient(90% 90% at 25% 30%,#1B2E4A 0%,#04070D 72%)"><div><div class="big">A technical oilfield product, explained.</div></div></div>`,
   title:"Energy · Product explainer",desc:"An animated explainer that makes a technical oilfield product easy to follow, with maps, callouts and motion graphics. Making complex things simple is the job I care about most.",
   meta:[["Studio","Audion"],["Industry","Energy"],["Format","Motion graphics explainer"]],act:[["See Audion’s work ↗",AUDWORK]]},
  {id:"film3",track:"V2",kind:"film",start:44,dur:9,name:"Construction · Safety training",
   scene:`<div class="scene s-film" style="--g:radial-gradient(90% 90% at 75% 70%,#2C3A1E 0%,#080B05 72%)"><div><div class="big">Safety training crews actually watch.</div></div></div>`,
   title:"Construction · Safety training series",desc:"A training series for field crews in construction and industrial work. Filming on job sites is where my thinking on recruiting video started.",
   meta:[["Studio","Audion"],["Industry","Construction · Industrial safety"],["Format","Training series"]],act:[["See Audion’s work ↗",AUDWORK]]},
  {id:"film4",track:"V2",kind:"film",start:60,dur:8,name:"Healthcare tech · Award profiles",
   scene:`<div class="scene s-film" style="--g:radial-gradient(90% 90% at 75% 20%,#2E2A55 0%,#0A0910 70%)"><div><div class="big">Honoring the people behind the work.</div></div></div>`,
   title:"Healthcare tech · Award winner profiles",desc:"Short profiles of award winners at a healthcare technology company. Ten people, ten stories, one event.",
   meta:[["Studio","Audion"],["Industry","Healthcare · Tech"],["Format","Profile series"]],act:[["See Audion’s work ↗",AUDWORK]]},
  {id:"film5",track:"V2",kind:"film",start:76,dur:7,name:"Education · Conference sessions",
   scene:`<div class="scene s-film" style="--g:radial-gradient(90% 90% at 25% 25%,#1F3B33 0%,#07100D 72%)"><div><div class="big">The science of learning, filmed for on-demand.</div></div></div>`,
   title:"Education · Conference sessions",desc:"Sessions with an education researcher on how people learn, produced for on-demand viewing and livestream.",
   meta:[["Studio","Audion"],["Industry","Education"],["Format","Session films · livestream"]],act:[["See Audion’s work ↗",AUDWORK]]},
  {id:"film6",track:"V2",kind:"film",start:83,dur:7,name:"Associations · Legal conferences",
   scene:`<div class="scene s-film" style="--g:radial-gradient(90% 90% at 70% 70%,#3E2A1A 0%,#0D0805 72%)"><div><div class="big">Ten sessions, ready for on-demand.</div></div></div>`,
   title:"Associations · Legal conference video",desc:"Session films and promos for Texas legal associations. The source material for “Your conference is a year of content.”",
   meta:[["Studio","Audion"],["Industry","Associations"],["Format","Session edits · promos"]],act:[["See Audion’s work ↗",AUDWORK]]},

  {id:"note1",track:"A1",kind:"note",start:20,dur:6,name:"Note",
   scene:`<div class="scene s-note"><q>On LinkedIn, upload the video file itself. A YouTube link is a detour most people won’t take.</q></div>`,
   title:"Short note",desc:"Quick takes, posted first on Threads and LinkedIn.",meta:[["Format","Threads / LinkedIn post"]],act:[]},
  {id:"note2",track:"A1",kind:"note",start:53,dur:6,name:"Note",
   scene:`<div class="scene s-note"><q>People can spot AI b-roll in a second. Film your actual people.</q></div>`,
   title:"Short note",desc:"Quick takes, posted first on Threads and LinkedIn.",meta:[["Format","Threads / LinkedIn post"]],act:[]},
  {id:"note3",track:"A1",kind:"note",start:68,dur:6,name:"Note",
   scene:`<div class="scene s-note"><q>Your CEO doesn’t need a teleprompter. They need a better first question.</q></div>`,
   title:"Short note",desc:"Quick takes, posted first on Threads and LinkedIn.",meta:[["Format","Threads / LinkedIn post"]],act:[]},

  {id:"about",track:"V1",kind:"me",start:90,dur:14,name:"About Trae",
   scene:`<div class="scene s-about"><div><h2>About</h2><p>Video producer at Audion in Houston. Dad, Christ Church Sugar Land member, and the person with a camera at every family gathering. In 2025 my son Eli and I served on our first mission trip together, in Jamaica.</p></div></div>`,
   title:"About Trae",desc:"I’ve spent my career behind the camera, from music videos and church productions to energy executives and safety crews. Today I produce for Audion, and I write here to think out loud about where corporate video is going.",
   meta:[["Day job","Producer, Audion"],["Home","Sugar Land, Texas"]],act:[["Follow on LinkedIn ↗",LINKEDIN],["Audion ↗",AUD]]},
  {id:"contact",track:"V1",kind:"me",start:104,dur:16,name:"Last frame · Let’s talk",
   scene:`<div class="scene s-contact"><h2>Let’s <em>talk shop.</em></h2></div>`,
   title:"Let’s talk",desc:"I’m glad to talk about storytelling, trust and corporate video: podcasts, panels, guest posts, or just comparing notes. For video projects, reach the team at Audion.",
   meta:[["LinkedIn",`<a href="${LINKEDIN}" target="_blank" rel="noopener">Send a message ↗</a>`],["Video projects",`<a href="${AUD}/contact" target="_blank" rel="noopener">Audion ↗</a>`]],
   act:[["Message on LinkedIn ↗",LINKEDIN],["Start a project with Audion ↗",AUD+"/contact"]]}
];
