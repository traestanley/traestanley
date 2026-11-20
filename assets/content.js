const FPS = 24, LEN = 120;
const abs = p => new URL(p, document.baseURI).href; // full URLs, so CSS backgrounds resolve from the page
const IMG = {}; // project stills, e.g. {name: abs("assets/img/name.jpg")}; use as img:IMG.name and in the scene background
const KIND = {
  me:{label:"Trae",color:"var(--c-me)"}, film:{label:"Work",color:"var(--c-film)"},
  family:{label:"Family photos",color:"var(--c-family)"}, essay:{label:"Essay",color:"var(--c-essay)"}, note:{label:"Note",color:"var(--c-note)"}
};
/* Site content. To add an essay: copy an essay entry, change id/name/title/desc, set url to its page, and give it a free start time on V1. */
const LINKEDIN="https://www.linkedin.com/in/traestanley";
const AUD="https://www.audion.energy", AUDWORK="https://www.audion.energy/our-work";
const YT={thumb:id=>`https://i.ytimg.com/vi/${id}/mqdefault.jpg`, still:id=>`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`, watch:id=>`https://www.youtube.com/watch?v=${id}`};
const CLIPS = [
  {id:"title",track:"V1",kind:"me",start:0,dur:8,name:"Title card",
   scene:`<div class="scene s-title"><div><h1>TRAE STANLEY</h1><p>Notes on making video that people trust.</p><div class="ind"><span>Storytelling</span><span>Trust on camera</span><span>AI &amp; authenticity</span><span>Energy</span><span>Associations</span></div></div></div>`,
   title:"Trae Stanley",desc:"I’m a video producer at Audion in Houston. I spend my days filming energy executives, safety crews, educators and association leaders. Here I write about what that work teaches me: how people earn trust on camera, and what changes now that anyone can generate video.",
   meta:[["Day job","Producer, Audion"],["Based in","Sugar Land · Houston"],["Writes about","Storytelling, trust, AI and authenticity, industrial and association video"]],
   act:[["Read the latest essay","essay1"],["Audion ↗︎",AUD]]},

  {id:"essay1",track:"V1",kind:"essay",start:8,dur:16,name:"Polish is out. Proof is in.",soon:true,
   scene:`<div class="scene s-essay"><div><span class="mono k">Essay · 6 min read</span><h2>Polish is out. Proof is in.</h2><p>Feeds are filling up with AI-generated b-roll and stock smiles. The videos that still cut through show real employees, real job sites and real customers. Proof is becoming the new production value, and most companies haven’t noticed yet.</p></div></div>`,
   title:"Polish is out. Proof is in.",desc:"Why people-led, unscripted video is beating glossy brand spots, and what that means for how we shoot.",
   meta:[["Why now","LinkedIn and Threads reward people-led, authentic video as AI content floods feeds"],["Read time","6 min"]],act:[]},
  {id:"essay2",track:"V1",kind:"essay",start:24,dur:16,name:"What I’ve learned putting CEOs on camera",soon:true,
   scene:`<div class="scene s-essay"><div><span class="mono k">Essay · 7 min read</span><h2>What I’ve learned putting CEOs on camera</h2><p>The most powerful person in the room is usually the most nervous one once the light comes on. After years of filming energy executives, I’ve stopped writing them better scripts and started asking them better questions.</p></div></div>`,
   title:"What I’ve learned putting CEOs on camera",desc:"Lessons from filming energy executives: why scripts make leaders sound less believable, and what to do instead.",
   meta:[["Drawn from","Executive panels and pitch days I’ve filmed"],["Read time","7 min"]],act:[]},
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

  ...[
    ["idK-jLTs3v8","DXPE · Brand video","DXP Enterprises","Industrial","free","A brand film for DXP Enterprises, the Houston-based industrial distributor.","An industrial company, told as a story."],
    ["sXwlyKkVntc","Tenaris · Wedge 529","Tenaris","Energy · Product","free","A product video for Tenaris’ Wedge 529 connection. Making a technical oilfield product easy to follow is the job I care about most.","A technical product, explained."],
    ["_oemJ8GP1AI","Tenaris · Coiled tubing, made and shipped","Tenaris","Energy · Manufacturing","free","How Tenaris coiled tubing is made and shipped, filmed on the plant floor. Shooting around live operations is where my thinking on recruiting video for the trades started.","From the plant floor to the field."],
    ["4-IUkT454W0","AWS · Energy Symposium","AWS","Energy · Tech · Events","free","Highlights from the AWS Energy Symposium. Events like this are the source material for “Your conference is a year of content.”","A symposium, made to outlast the day."],
    ["RvRMN0xcNqU","Halliburton Labs · Denver Pitch Day","Halliburton Labs","Energy · Startups","bridge","Highlights from Halliburton Labs’ Pitch Day in Denver, where energy startups pitch to industry leaders. Rooms like this one are where “What I’ve learned putting CEOs on camera” comes from.","Founders under pressure, on camera."],
    ["5n7nfnLqkE4","Halliburton Labs · New Orleans recap","Halliburton Labs","Energy · Startups · Events","audion","A recap of Halliburton Labs’ program in New Orleans, from my first months at Audion.","Two days in New Orleans, in a few minutes."],
    ["5IGhnPHvL8U","Halliburton Labs · Brand video","Halliburton Labs","Energy · Startups","audion","A brand film for Halliburton Labs, the energy-industry startup accelerator.","What an accelerator actually does."],
    ["wucQ8KVGqrk","Halliburton · Fractech Expo","Halliburton","Energy · Trade show","audion","Coverage of Halliburton at the Fractech Expo.","A trade-show floor, cut for people who weren’t there."],
    ["OXp_9dxsbAE","Endress + Hauser · Safety guidelines","Endress + Hauser","Industrial · Safety","audion","A safety guidelines video for Endress + Hauser, made for people who will actually work by it.","Safety guidance crews actually watch."]
  ].map(([yt,title,client,industry,when,desc,big],i)=>({
    id:"film"+(i+1),track:"V2",kind:"film",start:8+i*10,dur:10,name:title,yt,img:YT.thumb(yt),url:YT.watch(yt),
    scene:`<div class="scene s-film s-yt"><img class="yt-still" src="${YT.still(yt)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${YT.thumb(yt)}'"><div class="yt-cap"><div class="big">${big}</div><button class="pb" type="button" data-play="${yt}" aria-label="Play ${title.replace(/"/g,"")}">Play</button></div></div>`,
    title,desc,
    meta:[["Client",client],["Industry",industry],["My role","Producer · Shooter · Editor"],
          ["Made",{free:"Freelance, before Audion",bridge:"Freelance; a client I later brought to Audion",audion:"At Audion"}[when]]],
    act:[["Watch on YouTube ↗︎",YT.watch(yt)],...(when==="audion"?[["Audion’s work ↗︎",AUDWORK]]:[])]
  })),

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
   meta:[["Day job","Producer, Audion"],["Home","Sugar Land, Texas"]],act:[["Follow on LinkedIn ↗︎",LINKEDIN],["Audion ↗︎",AUD]]},
  {id:"contact",track:"V1",kind:"me",start:104,dur:16,name:"Last frame · Let’s talk",
   scene:`<div class="scene s-contact"><h2>Let’s <em>talk shop.</em></h2></div>`,
   title:"Let’s talk",desc:"I’m glad to talk about storytelling, trust and corporate video: podcasts, panels, guest posts, or just comparing notes. For video projects, reach the team at Audion.",
   meta:[["LinkedIn",`<a href="${LINKEDIN}" target="_blank" rel="noopener">Send a message ↗︎</a>`],["Video projects",`<a href="${AUD}/contact" target="_blank" rel="noopener">Audion ↗︎</a>`]],
   act:[["Message on LinkedIn ↗︎",LINKEDIN],["Start a project with Audion ↗︎",AUD+"/contact"]]}
];
