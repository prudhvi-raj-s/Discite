import React, { useState, useEffect, useRef } from "react";

// ── BRAND TOKENS ──────────────────────────────────────────────────────────────
const B = {
  green:"#2FA478", greenDk:"#1E7A56", greenDim:"rgba(47,164,120,0.14)", greenBd:"rgba(47,164,120,0.32)",
  indigo:"#3D2FA4", indigoDk:"#2C218A", indigoDim:"rgba(61,47,164,0.14)", indigoBd:"rgba(61,47,164,0.32)",
  rasp:"#A42F5B", raspDim:"rgba(164,47,91,0.14)", raspBd:"rgba(164,47,91,0.32)",
  olive:"#95A42F", oliveDim:"rgba(149,164,47,0.14)", oliveBd:"rgba(149,164,47,0.32)",
  li:"#0A66C2", tw:"#1D9BF0",
};

const TH = {
  light:{ bg:"#F4F6FF", sf:"#FFFFFF", card:"#ECF0FF", cardHv:"#E0E8FF", bd:"#C4D0EE", bdM:"#A8BCDC", tx:"#0A1030", txD:"#2D4080", txM:"#6878A8", inp:"#FFFFFF", sh:"0 2px 10px rgba(40,60,140,0.09)" },
  dark: { bg:"#080D18", sf:"#0D1525", card:"#121F35", cardHv:"#172540", bd:"#1A2D47", bdM:"#22395C", tx:"#DCE8FF", txD:"#8098BF", txM:"#4D6585", inp:"#0D1525", sh:"0 2px 10px rgba(0,0,0,0.35)" },
};

// ── STATIC DATA ───────────────────────────────────────────────────────────────
const LESSONS = [
  { id:1, type:"video", title:"Course Introduction & Environment Setup", dur:"8:42",  vid:"rfscVS0vtbw", done:true,  tags:["Python","environment setup","programming"], references: [{id:1, title:"Python Setup Guide", url:"https://www.python.org/downloads/", type:"link"}, {id:2, title:"Env Cheatsheet", url:"dummy.pdf", type:"pdf"}] },
  { id:2, type:"video", title:"Core Concepts & Data Structures",         dur:"15:20", vid:"PkZNo7MFNFg", done:true,  tags:["JavaScript","data structures","algorithms"], references: [{id:3, title:"MDN Array Docs", url:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array", type:"link"}] },
  { id:3, type:"pdf",   title:"Clean Code Handbook - Chapter 1",         dur:"24 pages", url:"https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf", done:false, tags:["Reading","Clean Code","PDF"], references: [{id:4, title:"Book Exercises Repo", url:"https://github.com", type:"link"}] },
  { id:4, type:"video", title:"Building Full-Stack Projects",            dur:"22:15", vid:"W6NZfCO5SIk", done:false, tags:["React","Node.js","REST API"], references: [] },
  { id:5, type:"video", title:"Advanced Patterns & Architecture",        dur:"18:33", vid:"ysEN5RaKOlA", done:false, tags:["software architecture","design patterns"], references: [] },
];

const INIT_PROGRAMS = [
  { id:1, title:"Full-Stack Web Development", instructor:"Discite Core", color:B.green,  tags:["React","Node.js","MongoDB"], status:"active",    level:"Intermediate", duration:"14 wks", desc:"Build production-ready MERN stack applications from scratch.", lessons:LESSONS, done:2, total:5 },
  { id:2, title:"Python for Data Science",    instructor:"Dr. Kavya R.",  color:B.indigo, tags:["Python","Pandas","ML"],     status:"enrolled",  level:"Beginner",     duration:"10 wks", desc:"Master data manipulation, visualisation and ML with Python.", lessons:[], done:0, total:12 },
  { id:3, title:"DSA Masterclass",            instructor:"Rahul G.",      color:B.rasp,   tags:["Algorithms","C++","LeetCode"], status:"enrolled",level:"Advanced",     duration:"8 wks",  desc:"Deep dive into algorithms and competitive programming.", lessons:[], done:5, total:8 },
];

const INIT_GROUPS = [
  { id:1, name:"Full-Stack Builders",  course:"Full-Stack Web Dev",  members:24, color:B.green,  desc:"A cohort building real projects together. Code reviews every Sunday 8 PM IST.", tags:["React","Node.js"] },
  { id:2, name:"Algorithm Aces",       course:"DSA Masterclass",     members:18, color:B.indigo, desc:"Solving LeetCode daily. No question too basic!", tags:["Algorithms","LeetCode"] },
];

const SEED_MSGS = [
  { id:1, user:"Priya S.",  av:"PS", col:B.green,  text:"Just finished Lesson 3 — the async/await section was mind-blowing 🤯", time:"10:32 AM" },
  { id:2, user:"Rahul M.",  av:"RM", col:B.indigo, text:"Got stuck on error handling though. Anyone willing to share their approach?", time:"10:35 AM" },
  { id:3, user:"You",       av:"ME", col:B.olive,  text:"I can share! Also check the transcript in Lesson 3 — it's super detailed.", time:"10:38 AM", isMe:true },
];

const MKT_SEED = [
  { id:1, title:"AWS Cloud Credits Starter Pack", cat:"Computing", desc:"AWS Free Tier + ₹4,000 credits for EC2, S3, Lambda.", price:999,  rent:null, rating:4.8, reviews:234,  seller:"Amazon Web Services", badge:"Popular" },
  { id:2, title:"React: The Complete 2025 Guide",  cat:"Courses",   desc:"Build 20 real-world projects. 52 hrs of content.", price:1299, rent:249,  rating:4.9, reviews:5892,  seller:"Discite Learn",       badge:"Bestseller" },
  { id:3, title:"JetBrains WebStorm — Student",    cat:"Software",  desc:"The smartest JavaScript IDE. 1-year student license.", price:3499, rent:299,  rating:4.7, reviews:1203,  seller:"JetBrains",            badge:"Student Deal" },
  { id:4, title:"Clean Code by Robert Martin",     cat:"Books",     desc:"A handbook of Agile software craftsmanship.", price:649,  rent:79,   rating:4.8, reviews:8934,  seller:"Pearson India",        badge:null },
];

const TRANSCRIPT = `Welcome to this comprehensive learning journey. In today's session we'll explore the foundational concepts that underpin modern software engineering.

The architecture we're working with consists of three primary layers. First is the data layer, which manages all information flowing through your application. Second is the business logic layer, where core functionality lives. Third is the presentation layer.

Understanding how these layers interact is crucial for building scalable, maintainable applications.

When you approach any new engineering problem, start by breaking it into core components. What data do you need? What rules govern how it's processed? How should results be presented?

Debugging is another critical skill. When something doesn't work, a systematic approach is key: isolate the problem, form hypotheses, test methodically, and document what you learn.`;

const LANGS = ["Hindi","Telugu","Tamil","Spanish","French","German","Japanese"];

const INIT_PROFILE = {
  personal: { name:"Arjun Sharma", title:"Aspiring Full-Stack Developer", email:"arjun.sharma@email.com", phone:"+91 98765 43210", location:"Hyderabad, India", about:"Passionate Computer Science student with hands-on experience building full-stack applications. Committed to clean code and constant learning." },
  social: { linkedin:"linkedin.com/in/arjun-sharma", github:"github.com/arjun-dev", portfolio:"", twitter:"" },
  education: [{ id:1, degree:"B.Tech in Computer Science", institution:"JNTU Hyderabad", year:"2021–2025", grade:"8.4 CGPA", coursework:"DSA, DBMS, OS" }],
  experience: [{ id:1, role:"Frontend Intern", company:"TechFlow Solutions", duration:"May 2023 - Aug 2023", location:"Remote", desc:"Developed responsive UI components using React and Tailwind. Improved load time by 15%." }],
  projects: [{ id:1, name:"TaskFlow — Full-Stack App", tech:"React, Node.js, MongoDB", desc:"CRUD app with auth. Deployed to Vercel.", link:"github.com/arjun-dev/taskflow" }],
  skills: { technical:["JavaScript","React.js","Node.js","MongoDB","Python","Git"], soft:["Problem Solving","Team Collaboration"] },
};

const INIT_NOTES = [
  { id: 1, title: "Course Introduction", content: "Remember to install <b>Python 3.10+</b> as mentioned. Setup virtual environments using <i>venv</i>.", date: new Date().toLocaleDateString() },
  { id: 2, title: "Data Structures Ideas", content: "<ul><li>Arrays vs Linked Lists</li><li>Arrays have O(1) access time but O(n) insertions.</li></ul><span style=\"background-color: #ffe066;\">Good to remember for technical interviews.</span>", date: new Date().toLocaleDateString() }
];

function mkInitEvents() {
  const n=new Date();
  const ds=(off)=>{ const d=new Date(n); d.setDate(d.getDate()+off); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
  return [
    { id:1, title:"Study: React Hooks Deep Dive",  date:ds(0), type:"personal", color:B.olive,  time:"09:00" },
    { id:2, title:"Full-Stack Builders Call",      date:ds(2), type:"group",    color:B.indigo, time:"20:00" },
  ];
}

// ── MICRO COMPONENTS ──────────────────────────────────────────────────────────
function Spin({ size=13, color="#fff" }) {
  return <span style={{ display:"inline-block",width:size,height:size,border:`2px solid ${color}28`,borderTopColor:color,borderRadius:"50%",animation:"dc-spin 0.7s linear infinite",flexShrink:0 }} />;
}
function Av({ init, color, size=32 }) {
  const fs=Math.round(size*0.34);
  return <div style={{ width:size,height:size,borderRadius:"50%",background:`${color}18`,border:`1.5px solid ${color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:fs,fontWeight:700,color,fontFamily:"'Marvel',sans-serif",flexShrink:0,letterSpacing:"0.02em" }}>{init}</div>;
}
function Pill({ label, color }) {
  return <span style={{ background:`${color}18`,border:`1px solid ${color}44`,color,borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:500,whiteSpace:"nowrap" }}>{label}</span>;
}
function Stars({ r }) {
  const f=Math.floor(r); return <span style={{ color:"#F5A623",fontSize:11 }}>{"★".repeat(f)}{"☆".repeat(5-f)}</span>;
}
function Logo({ size=36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="22" fill={B.green}/>
      <text x="22" y="17.5" textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="700" fontFamily="Marvel,sans-serif" letterSpacing="1.5">DIS</text>
      <text x="22" y="30.5" textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="700" fontFamily="Marvel,sans-serif" letterSpacing="1.5">CITE</text>
    </svg>
  );
}
function SkelBox({ T, lines=[70,50,100,75] }) {
  return (
    <div style={{ background:T.card,border:`1px solid ${T.bd}`,borderRadius:10,padding:13,marginBottom:8 }}>
      {lines.map((w,i)=><div key={i} style={{ height:9,width:`${w}%`,background:T.bd,borderRadius:4,marginBottom:i<lines.length-1?7:0,animation:"dc-pulse 1.4s ease infinite" }} />)}
    </div>
  );
}

// ── COMPONENT EXTENSIONS (MODALS) ─────────────────────────────────────────────
function ComposeModal({ T, groupsList, onClose, onPostToGroup }) {
  const [platform,setPlatform]=useState("linkedin");
  const [selectedGroup, setSelectedGroup] = useState(groupsList[0]?.id);
  const [postText,setPostText]=useState("");
  const [enhancing,setEnhancing]=useState(false);
  const [posted,setPosted]=useState(false);
  const [enhanceType, setEnhanceType] = useState("polish");

  const liMax=3000; const twMax=280; const grpMax=1500;
  const charLimit=platform==="twitter"?twMax:platform==="group"?grpMax:liMax;
  const charsLeft=charLimit-postText.length;
  const overLimit=charsLeft<0;

  const PLATFORMS=[
    {id:"linkedin",label:"LinkedIn",color:B.li,icon:"in"},
    {id:"twitter",label:"Twitter/X",color:B.tw,icon:"𝕏"},
    {id:"group",label:"Group",color:B.indigo,icon:"👥"},
    {id:"both",label:"Both",color:B.green,icon:"↔"}
  ];

  function handleEnhance() {
    if(!postText.trim()) return; setEnhancing(true);
    setTimeout(() => {
      let suffix = "✨ (Polished)";
      if(enhanceType === 'expand') suffix = "📝 (Expanded details based on AI analysis...)";
      if(enhanceType === 'catchy') suffix = "🔥 (Hook updated to be super catchy!)";
      setPostText(postText.trim() + "\n\n" + suffix);
      setEnhancing(false);
    }, 600);
  }

  function handlePost() {
    if(!postText.trim()||overLimit) return; setPosted(true);
    if(platform === "group"){
       onPostToGroup(selectedGroup, postText);
    }
    setTimeout(()=>{ setPosted(false); setPostText(""); onClose(); },1200);
  }

  return (
    <div style={{ position:"fixed",inset:0,zIndex:200 }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.52)",animation:"dc-in 0.18s ease" }} />
      <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:201,width:540,maxWidth:"92vw",background:T.sf,border:`1px solid ${T.bd}`,borderRadius:16,overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,0.3)",animation:"dc-up 0.22s ease" }}>
        <div style={{ padding:"14px 18px 12px",borderBottom:`1px solid ${T.bd}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:9 }}><Logo size={26}/><span style={{ fontFamily:"'Marvel',sans-serif",fontSize:17,color:T.tx }}>Create Post</span></div>
          <button onClick={onClose} style={{ color:T.txM,fontSize:22,lineHeight:1,padding:"0 4px",cursor:"pointer",border:"none",background:"none" }}>×</button>
        </div>
        <div style={{ padding:"16px 18px" }}>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:10,color:T.txM,textTransform:"uppercase",letterSpacing:"0.09em",fontWeight:600,marginBottom:8 }}>Post to</div>
            <div style={{ display:"flex",gap:7 }}>
              {PLATFORMS.map(p=>(
                <button key={p.id} onClick={()=>setPlatform(p.id)}
                  style={{ flex:1,padding:"8px 10px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.15s",border:`1.5px solid ${platform===p.id?p.color:T.bd}`,background:platform===p.id?`${p.color}18`:"transparent",color:platform===p.id?p.color:T.txM,display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
                  <span style={{ fontSize:11,fontWeight:800 }}>{p.icon}</span>{p.label}
                </button>
              ))}
            </div>
            {platform === "group" && (
              <div style={{ marginTop:10, animation:"dc-up 0.2s ease" }}>
                <select value={selectedGroup} onChange={e=>setSelectedGroup(Number(e.target.value))} style={{ width:"100%", padding:"8px 12px", background:T.inp, border:`1px solid ${T.bd}`, borderRadius:8, color:T.tx, fontSize:12, outline:"none", cursor:"pointer" }}>
                  {groupsList.map(g => <option key={g.id} value={g.id}>{g.name} — {g.course}</option>)}
                </select>
              </div>
            )}
          </div>
          <div style={{ display:"flex",gap:10,alignItems:"flex-start",marginBottom:10 }}>
            <Av init="AS" color={B.olive} size={36}/>
            <textarea value={postText} onChange={e=>setPostText(e.target.value)} autoFocus
              placeholder={platform==="twitter"?"What's happening? Share a quick insight… (280 chars)":platform==="group"?"Ask a question or share an insight with the cohort...":"Share a professional insight, learning win, or project update…"}
              style={{ flex:1,minHeight:140,background:T.inp,border:`1.5px solid ${overLimit?B.rasp:T.bd}`,borderRadius:9,padding:"11px 13px",fontSize:13,lineHeight:1.7,color:T.tx,resize:"vertical",fontFamily:"'Roboto',sans-serif",outline:"none",transition:"border-color 0.15s" }} />
          </div>
          <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:12 }}>
            <span style={{ fontSize:11,fontFamily:"monospace",color:overLimit?B.rasp:charsLeft<50?B.olive:T.txM }}>{charsLeft<charLimit?`${charsLeft} chars remaining`:`Max ${charLimit} chars`}</span>
          </div>
          
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ display:"flex", gap:4, alignItems:"center", background:T.inp, border:`1px solid ${T.bd}`, borderRadius:8, padding:"4px" }}>
              <select value={enhanceType} onChange={e=>setEnhanceType(e.target.value)} style={{ background:"transparent", border:"none", color:T.tx, fontSize:12, outline:"none", cursor:"pointer", paddingLeft:4 }}>
                 <option value="polish">✨ Polish</option>
                 <option value="expand">📝 Expand</option>
                 <option value="catchy">🔥 Catchy</option>
              </select>
              <button onClick={handleEnhance} disabled={enhancing||!postText.trim()}
                style={{ background:B.indigoDim,color:B.indigo,padding:"6px 12px",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer",border:"none", opacity:(enhancing||!postText.trim())?0.55:1 }}>
                {enhancing ? "..." : "Enhance"}
              </button>
            </div>
            
            <div style={{ flex:1 }}/>
            <button onClick={onClose} style={{ background:"transparent",border:`1px solid ${T.bd}`,color:T.txM,padding:"8px 14px",borderRadius:8,fontSize:12,cursor:"pointer" }}>Discard</button>
            <button onClick={handlePost} disabled={!postText.trim()||overLimit||posted}
              style={{ padding:"8px 22px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",transition:"all 0.15s",background:posted?B.green:(platform==="linkedin"?B.li:platform==="twitter"?B.tw:platform==="group"?B.indigo:B.green),color:"#fff",opacity:(!postText.trim()||overLimit)?0.5:1,display:"flex",alignItems:"center",gap:6 }}>
              {posted?"✓ Posted!":platform==="linkedin"?"Post to LinkedIn":platform==="twitter"?"Post to Twitter/X":platform==="group"?"Post to Group":"Post to Both"}
            </button>
          </div>
        </div>
        <div style={{ padding:"8px 18px",borderTop:`1px solid ${T.bd}`,background:T.card,fontSize:10.5,color:T.txM }}>💡 Tip: Use the <b>AI Enhancement</b> tools to rewrite, expand, or add a catchy hook to your draft instantly.</div>
      </div>
    </div>
  );
}

function CreateGroupModal({ T, onClose, onCreateGroup }) {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");

  function handleCreate() {
    if(!name.trim()) return;
    onCreateGroup({
      id: Date.now(),
      name, 
      course, 
      desc, 
      tags: tags.split(",").map(t=>t.trim()).filter(Boolean),
      members: 1,
      color: B.indigo
    });
    onClose();
  }

  return (
    <div style={{ position:"fixed",inset:0,zIndex:200 }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.52)",animation:"dc-in 0.18s ease" }} />
      <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:201,width:480,maxWidth:"92vw",background:T.sf,border:`1px solid ${T.bd}`,borderRadius:16,overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,0.3)",animation:"dc-up 0.22s ease" }}>
        <div style={{ padding:"14px 18px",borderBottom:`1px solid ${T.bd}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:9 }}><span style={{fontSize:20}}>👥</span><span style={{ fontFamily:"'Marvel',sans-serif",fontSize:17,color:T.tx }}>Create Cohort Group</span></div>
          <button onClick={onClose} style={{ color:T.txM,fontSize:22,lineHeight:1,padding:"0 4px",cursor:"pointer",border:"none",background:"none" }}>×</button>
        </div>
        <div style={{ padding:"18px", display:"flex", flexDirection:"column", gap:12 }}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Group Name (e.g., Weekend Coders)" style={{ width:"100%", padding:"10px 12px", background:T.inp, border:`1px solid ${T.bd}`, borderRadius:8, color:T.tx, fontSize:13, outline:"none" }} autoFocus/>
          <input value={course} onChange={e=>setCourse(e.target.value)} placeholder="Associated Course (e.g., Full-Stack Web Dev)" style={{ width:"100%", padding:"10px 12px", background:T.inp, border:`1px solid ${T.bd}`, borderRadius:8, color:T.tx, fontSize:13, outline:"none" }}/>
          <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="Tags (comma separated, e.g., React, AI, Study)" style={{ width:"100%", padding:"10px 12px", background:T.inp, border:`1px solid ${T.bd}`, borderRadius:8, color:T.tx, fontSize:13, outline:"none" }}/>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description & Goals..." style={{ width:"100%", padding:"10px 12px", background:T.inp, border:`1px solid ${T.bd}`, borderRadius:8, color:T.tx, fontSize:13, outline:"none", minHeight:80, resize:"vertical" }}/>
        </div>
        <div style={{ padding:"14px 18px",borderTop:`1px solid ${T.bd}`,background:T.card, display:"flex", justifyContent:"flex-end", gap:8 }}>
          <button onClick={onClose} style={{ background:"transparent",border:`1px solid ${T.bd}`,color:T.txM,padding:"8px 14px",borderRadius:8,fontSize:12,cursor:"pointer" }}>Cancel</button>
          <button onClick={handleCreate} disabled={!name.trim()} style={{ background:B.indigo,color:"#fff",padding:"8px 20px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",opacity:!name.trim()?0.5:1 }}>Create Group</button>
        </div>
      </div>
    </div>
  );
}

function CreateProgramModal({ T, onClose, onSaveProgram, initialData, currentUser }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [instructor, setInstructor] = useState(initialData?.instructor || "");
  const [desc, setDesc] = useState(initialData?.desc || "");
  const [topics, setTopics] = useState(() => {
    if (initialData?.lessons && initialData.lessons.length > 0) {
      return initialData.lessons.map(l => ({
        id: l.id,
        title: l.title.replace(/^\d+\.\s*/, ''),
        type: l.type,
        url: l.type === 'pdf' ? l.url : (l.vid !== 'rfscVS0vtbw' && l.vid ? `https://youtube.com/watch?v=${l.vid}` : ''),
        refTitle: l.references?.[0]?.title || "",
        refUrl: l.references?.[0]?.url || ""
      }));
    }
    return [{ id: Date.now(), title: "", type: "video", url: "", refTitle: "", refUrl: "" }];
  });

  function addTopic() {
    setTopics([...topics, { id: Date.now(), title: "", type: "video", url: "", refTitle: "", refUrl: "" }]);
  }

  function updateTopic(id, field, value) {
    setTopics(topics.map(t => t.id === id ? { ...t, [field]: value } : t));
  }

  function removeTopic(id) {
    if(topics.length > 1) {
      setTopics(topics.filter(t => t.id !== id));
    }
  }

  function handleFileUpload(id, e) {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Url = event.target.result;
            setTopics(prev => prev.map(t => {
                if (t.id === id) {
                    return { ...t, url: base64Url, type: 'pdf', title: t.title || file.name.replace(/\.[^/.]+$/, "") };
                }
                return t;
            }));
        };
        reader.readAsDataURL(file);
    }
  }

  function handleSave() {
    if(!title.trim()) return;
    const newId = initialData?.id || Date.now();
    
    // Map topics into formal lessons with appropriate typing and reference extraction
    const mockLessons = topics.filter(t => t.title.trim()).map((t, idx) => {
      const isPdf = t.type === "pdf";
      let vidId = "";
      
      if (!isPdf && t.url) {
         const vMatch = t.url.match(/[?&]v=([^&]+)/)?.[1] || t.url.match(/youtu\.be\/([^?]+)/)?.[1];
         vidId = vMatch || t.url || "rfscVS0vtbw"; // Fallback to default if unable to parse
      }

      const references = [];
      if (t.refTitle && t.refUrl) {
         references.push({ id: 1, title: t.refTitle, url: t.refUrl, type: "link" });
      }

      return {
        id: newId + 1 + idx,
        title: `${idx + 1}. ${t.title}`,
        dur: isPdf ? "1 Document" : "10:00",
        type: t.type,
        url: isPdf ? t.url : "",
        vid: vidId,
        done: false,
        tags: ["Custom", "Curriculum"],
        references: references
      };
    });

    onSaveProgram({
      id: newId,
      title, 
      instructor: instructor || currentUser,
      creator: initialData?.creator || currentUser,
      desc,
      tags: ["Custom"],
      lessons: mockLessons,
      color: B.green,
      status: "active",
      level: "All Levels",
      duration: "Custom",
      done: 0,
      total: mockLessons.length,
      isCustom: true
    });
    onClose();
  }

  return (
    <div style={{ position:"fixed",inset:0,zIndex:200 }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.52)",animation:"dc-in 0.18s ease" }} />
      <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:201,width:600,maxWidth:"95vw",maxHeight:"85vh",display:"flex",flexDirection:"column",background:T.sf,border:`1px solid ${T.bd}`,borderRadius:16,overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,0.3)",animation:"dc-up 0.22s ease" }}>
        <div style={{ padding:"14px 18px",borderBottom:`1px solid ${T.bd}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:9 }}><span style={{fontSize:20}}>📚</span><span style={{ fontFamily:"'Marvel',sans-serif",fontSize:17,color:T.tx }}>Add Custom Program & Curriculum</span></div>
          <button onClick={onClose} style={{ color:T.txM,fontSize:22,lineHeight:1,padding:"0 4px",cursor:"pointer",border:"none",background:"none" }}>×</button>
        </div>
        <div style={{ padding:"18px", display:"flex", flexDirection:"column", gap:14, overflowY:"auto", flex:1 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Program Title (e.g., Advanced System Design)" style={{ width:"100%", padding:"10px 12px", background:T.inp, border:`1px solid ${T.bd}`, borderRadius:8, color:T.tx, fontSize:13, outline:"none" }} autoFocus/>
            <input value={instructor} onChange={e=>setInstructor(e.target.value)} placeholder="Instructor / Source (Optional)" style={{ width:"100%", padding:"10px 12px", background:T.inp, border:`1px solid ${T.bd}`, borderRadius:8, color:T.tx, fontSize:13, outline:"none" }}/>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Program Description..." style={{ width:"100%", padding:"10px 12px", background:T.inp, border:`1px solid ${T.bd}`, borderRadius:8, color:T.tx, fontSize:13, outline:"none", minHeight:50, resize:"vertical" }}/>
          </div>
          
          <div style={{ marginTop: 4 }}>
            <div style={{ fontSize:12, fontWeight:600, color:T.tx, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10 }}>Curriculum Builder</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {topics.map((t, idx) => (
                <div key={t.id} style={{ background:T.card, border:`1px solid ${T.bd}`, borderRadius:8, padding:"12px", position:"relative" }}>
                  <div style={{ fontSize:11, fontWeight:600, color:T.txM, marginBottom:8 }}>Topic {idx + 1}</div>
                  {topics.length > 1 && (
                     <button onClick={()=>removeTopic(t.id)} style={{ position:"absolute", top:10, right:10, color:B.rasp, background:"none", border:"none", cursor:"pointer", fontSize:16, lineHeight:1 }}>×</button>
                  )}
                  <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                    <input value={t.title} onChange={e=>updateTopic(t.id, 'title', e.target.value)} placeholder="Topic Title (e.g. Introduction to Architecture)" style={{ flex:1, padding:"8px 10px", background:T.inp, border:`1px solid ${T.bd}`, borderRadius:6, color:T.tx, fontSize:12, outline:"none" }}/>
                    <select value={t.type} onChange={e=>updateTopic(t.id, 'type', e.target.value)} style={{ padding:"8px 10px", background:T.inp, border:`1px solid ${T.bd}`, borderRadius:6, color:T.tx, fontSize:12, outline:"none", cursor:"pointer", width:100 }}>
                      <option value="video">Video</option>
                      <option value="pdf">PDF Doc</option>
                    </select>
                  </div>
                  <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                    <input value={t.url} onChange={e=>updateTopic(t.id, 'url', e.target.value)} placeholder={t.type === "video" ? "YouTube Video URL (Optional)" : "PDF Document URL"} style={{ flex:1, padding:"8px 10px", background:T.inp, border:`1px solid ${T.bd}`, borderRadius:6, color:T.tx, fontSize:12, outline:"none" }}/>
                    <label style={{ display:"flex", alignItems:"center", gap:6, padding:"0 12px", background:`${B.olive}15`, border:`1px dashed ${B.oliveBd}`, borderRadius:6, color:B.olive, fontSize:11, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
                      📎 Attach PDF
                      <input type="file" accept="application/pdf" style={{display:"none"}} onChange={(e)=>handleFileUpload(t.id, e)} />
                    </label>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <input value={t.refTitle} onChange={e=>updateTopic(t.id, 'refTitle', e.target.value)} placeholder="Reference File Title (e.g. Official Docs)" style={{ flex:0.4, padding:"8px 10px", background:T.inp, border:`1px dashed ${T.bd}`, borderRadius:6, color:T.tx, fontSize:12, outline:"none" }}/>
                    <input value={t.refUrl} onChange={e=>updateTopic(t.id, 'refUrl', e.target.value)} placeholder="Reference URL Link" style={{ flex:0.6, padding:"8px 10px", background:T.inp, border:`1px dashed ${T.bd}`, borderRadius:6, color:T.tx, fontSize:12, outline:"none" }}/>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addTopic} style={{ marginTop:10, background:`${B.green}18`, color:B.green, border:`1px dashed ${B.greenBd}`, padding:"8px 16px", borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer", width:"100%" }}>+ Add Another Topic</button>
          </div>
        </div>
        <div style={{ padding:"14px 18px",borderTop:`1px solid ${T.bd}`,background:T.sf, display:"flex", justifyContent:"flex-end", gap:8, flexShrink:0 }}>
          <button onClick={onClose} style={{ background:"transparent",border:`1px solid ${T.bd}`,color:T.txM,padding:"8px 14px",borderRadius:8,fontSize:12,cursor:"pointer" }}>Cancel</button>
          <button onClick={handleSave} disabled={!title.trim() || !topics[0]?.title.trim()} style={{ background:B.green,color:"#fff",padding:"8px 20px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",opacity:(!title.trim() || !topics[0]?.title.trim())?0.5:1 }}>{initialData ? "Save Changes" : "Create Curriculum"}</button>
        </div>
      </div>
    </div>
  );
}

function NoteEditor({ note, updateNote, deleteNote, T, B }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && note) {
      if (editorRef.current.getAttribute('data-note-id') !== String(note.id)) {
        editorRef.current.innerHTML = note.content || "";
        editorRef.current.setAttribute('data-note-id', note.id);
      }
    }
  }, [note?.id, note?.content]); 

  if (!note) return null;

  const format = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      updateNote({ ...note, content: editorRef.current.innerHTML });
    }
  };

  const btn = { background:T.card, border:`1px solid ${T.bd}`, color:T.tx, padding:"4px 10px", borderRadius:5, cursor:"pointer", fontSize:12, fontWeight:600 };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <input
        value={note.title || ""}
        onChange={e => updateNote({ ...note, title: e.target.value })}
        placeholder="Note Title..."
        style={{ background:"transparent", border:"none", borderBottom:`1px solid ${T.bd}`, padding:"8px 0", fontSize:16, fontWeight:600, color:T.tx, marginBottom:10, outline:"none" }}
      />
      <div style={{ display:"flex", gap:6, marginBottom:10, paddingBottom:10, borderBottom:`1px dashed ${T.bd}`, flexWrap:"wrap" }}>
        <button onClick={()=>format('bold')} style={btn} title="Bold">B</button>
        <button onClick={()=>format('italic')} style={{...btn, fontStyle:'italic'}} title="Italic">I</button>
        <button onClick={()=>format('underline')} style={{...btn, textDecoration:'underline'}} title="Underline">U</button>
        <div style={{width:1, background:T.bd, margin:'0 2px'}} />
        <button onClick={()=>format('backColor', '#ffe066')} style={btn} title="Highlight (Yellow)">🖍️ Yellow</button>
        <button onClick={()=>format('backColor', '#a8e6cf')} style={btn} title="Highlight (Green)">🖍️ Green</button>
        <button onClick={()=>format('backColor', 'transparent')} style={btn} title="Clear Highlight">Eraser</button>
        <div style={{width:1, background:T.bd, margin:'0 2px'}} />
        <button onClick={()=>format('insertUnorderedList')} style={btn} title="Bullet List">• List</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={e => updateNote({ ...note, content: e.currentTarget.innerHTML })}
        style={{ flex:1, background:T.inp, border:`1px solid ${T.bd}`, borderRadius:8, padding:14, fontSize:13, color:T.tx, outline:"none", fontFamily:"'Roboto',sans-serif", lineHeight:1.6, boxShadow:`inset 0 2px 4px rgba(0,0,0,0.03)`, overflowY:"auto" }}
      />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:10 }}>
        <span style={{fontSize:10, color:T.txM}}>Auto-saving...</span>
        <button onClick={()=>deleteNote(note.id)} style={{ color:B.rasp, fontSize:11, background:"none", border:"none", cursor:"pointer" }}>🗑 Delete Note</button>
      </div>
    </div>
  );
}

// ── CUSTOM PDF RENDERER WITH ANNOTATIONS ──────────────────────────────────────
function CustomPdfRenderer({ url, B }) {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  
  const [pdf, setPdf] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(typeof window.pdfjsLib !== 'undefined');

  // Annotation States
  const [tool, setTool] = useState("pen"); 
  const [color, setColor] = useState("#e03131"); 
  const [savedStatus, setSavedStatus] = useState(false);
  const [paths, setPaths] = useState({}); 

  // Drawing Refs
  const isDrawing = useRef(false);
  const currentPoints = useRef([]);

  useEffect(() => {
    if (scriptLoaded) return;
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
    script.onload = () => {
      try {
        if (window.pdfjsLib) {
           window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
           setScriptLoaded(true);
        } else {
           setError("Failed to initialize PDF viewer.");
        }
      } catch (e) {
        setError("PDF Engine setup error.");
      }
    };
    script.onerror = () => setError("Failed to load PDF engine.");
    document.body.appendChild(script);
  }, [scriptLoaded]);

  useEffect(() => {
    if (!scriptLoaded || !url) return;
    setLoading(true); setError(null); setPageNum(1); setPdf(null); setPaths({});
    
    let loadTask;
    try {
      if (url.startsWith('data:application/pdf;base64,')) {
        const base64Data = url.split(',')[1];
        if (!base64Data) throw new Error("Invalid Base64 format");
        const binaryString = window.atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        loadTask = window.pdfjsLib.getDocument({ data: bytes });
      } else {
        loadTask = window.pdfjsLib.getDocument(url);
      }
      loadTask.promise.then(
        (loadedPdf) => { setPdf(loadedPdf); setLoading(false); },
        (err) => { setError("Failed to load PDF securely. Cross-origin restriction blocked the file."); setLoading(false); }
      );
    } catch (err) { setError("Failed to parse document data."); setLoading(false); }
  }, [scriptLoaded, url]);

  useEffect(() => {
    if (!pdf || !canvasRef.current || !overlayRef.current) return;
    let renderTask;
    try {
        pdf.getPage(pageNum).then((page) => {
          if (!canvasRef.current || !overlayRef.current) return;
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = canvasRef.current;
          const overlay = overlayRef.current;
          const context = canvas.getContext('2d');
          
          canvas.height = viewport.height; canvas.width = viewport.width;
          overlay.height = viewport.height; overlay.width = viewport.width;

          const renderContext = { canvasContext: context, viewport: viewport };
          renderTask = page.render(renderContext);
          
          renderTask.promise.then(() => redrawAnnotations()).catch(err => {
             if (err.name !== 'RenderingCancelledException') console.error('Render error:', err);
          });
        }).catch(err => console.error("Page error:", err));
    } catch(err) {
        console.error("PDF render exception:", err);
    }
    return () => { if (renderTask) renderTask.cancel(); };
  }, [pdf, pageNum]);

  // Annotation Drawing Logic
  const getPos = (e) => {
    const rect = overlayRef.current.getBoundingClientRect();
    const scaleX = overlayRef.current.width / rect.width;
    const scaleY = overlayRef.current.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const applyToolStyles = (ctx, currentTool, currentColor) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (currentTool === 'highlight') {
        ctx.globalCompositeOperation = 'multiply';
        ctx.strokeStyle = currentColor + '80'; // semi-transparent
        ctx.lineWidth = 15;
    } else if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = 20;
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = 2;
    }
  };

  const startDraw = (e) => {
    isDrawing.current = true;
    currentPoints.current = [getPos(e)];
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const pos = getPos(e);
    currentPoints.current.push(pos);
    
    if (!overlayRef.current) return;
    const ctx = overlayRef.current.getContext('2d');
    if (!ctx) return;

    applyToolStyles(ctx, tool, color);
    
    ctx.beginPath();
    const prev = currentPoints.current[currentPoints.current.length - 2];
    if (prev) {
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }
  };

  const stopDraw = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    
    if (currentPoints.current.length > 1) {
      setPaths(prev => ({
        ...prev,
        [pageNum]: [...(prev[pageNum] || []), { tool, color, points: [...currentPoints.current] }]
      }));
    }
    currentPoints.current = [];
  };

  const redrawAnnotations = () => {
    if (!overlayRef.current) return;
    const ctx = overlayRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    const pagePaths = paths[pageNum] || [];
    
    pagePaths.forEach(path => {
      applyToolStyles(ctx, path.tool, path.color);
      ctx.beginPath();
      if(path.points.length > 0) {
        ctx.moveTo(path.points[0].x, path.points[0].y);
        for(let i=1; i<path.points.length; i++) ctx.lineTo(path.points[i].x, path.points[i].y);
        ctx.stroke();
      }
    });
  };

  const clearPageAnnotations = () => {
    setPaths(prev => ({ ...prev, [pageNum]: [] }));
    if(overlayRef.current) {
        const ctx = overlayRef.current.getContext('2d');
        if(ctx) ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    }
  };

  const saveAnnotations = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  useEffect(() => { if (!loading && !error && overlayRef.current) redrawAnnotations(); }, [paths, pageNum]);

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', background:'#323639', padding:'20px 20px 40px', overflowY:'auto', flex:1 }}>
      <div style={{ display:'flex', gap:10, background:'#202124', padding:'8px 16px', borderRadius:8, marginBottom:16, alignItems:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.3)', position:"sticky", top:0, zIndex:10 }}>
         <div style={{ fontSize:12, color:'#aaa', fontWeight:600, marginRight:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>Tools</div>
         <button onClick={()=>setTool('pen')} style={{ background:tool==='pen'?'#444':'transparent', border:`1px solid ${tool==='pen'?'#666':'transparent'}`, padding:'4px 8px', borderRadius:4, color:'#fff', cursor:'pointer' }}>✏️ Pen</button>
         <button onClick={()=>setTool('highlight')} style={{ background:tool==='highlight'?'#444':'transparent', border:`1px solid ${tool==='highlight'?'#666':'transparent'}`, padding:'4px 8px', borderRadius:4, color:'#fff', cursor:'pointer' }}>🖍️ Highlight</button>
         <button onClick={()=>setTool('eraser')} style={{ background:tool==='eraser'?'#444':'transparent', border:`1px solid ${tool==='eraser'?'#666':'transparent'}`, padding:'4px 8px', borderRadius:4, color:'#fff', cursor:'pointer' }}>🧽 Eraser</button>
         
         <div style={{ width:1, height:20, background:'#555', margin:'0 8px' }} />
         
         <input type="color" value={color} onChange={(e)=>setColor(e.target.value)} disabled={tool==='eraser'} style={{ width:24, height:24, padding:0, border:'none', background:'transparent', cursor:tool==='eraser'?'not-allowed':'pointer', opacity:tool==='eraser'?0.3:1 }} title="Choose Color"/>
         
         <div style={{ width:1, height:20, background:'#555', margin:'0 8px' }} />

         <button onClick={clearPageAnnotations} style={{ background:'transparent', color:'#ff6b6b', padding:'4px 8px', borderRadius:4, border:'1px solid #ff6b6b40', cursor:'pointer', fontSize:11 }}>Clear Page</button>
         <button onClick={saveAnnotations} style={{ background:savedStatus?B.green:'#3D2FA4', color:'#fff', padding:'4px 12px', borderRadius:4, border:'none', cursor:'pointer', fontSize:11, fontWeight:600 }}>{savedStatus ? "✓ Saved!" : "💾 Save Annotations"}</button>
      </div>

      {loading && <div style={{color:'#fff', padding:20, display:'flex', alignItems:'center', gap:8}}><Spin size={16} color="#fff"/> Loading Document Physics...</div>}
      {error && <div style={{color:'#ff6b6b', padding:20, textAlign:'center', background:'#ff6b6b20', borderRadius:8, border:'1px solid #ff6b6b50'}}>{error}</div>}
      
      <div style={{ display: pdf && !loading && !error ? 'block' : 'none', position:'relative', maxWidth:"100%" }}>
         <canvas ref={canvasRef} style={{ background:'#fff', boxShadow:'0 8px 24px rgba(0,0,0,0.4)', borderRadius:6, maxWidth:"100%", height:"auto", display:"block" }} />
         
         <canvas 
            ref={overlayRef} 
            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
            style={{ position:'absolute', top:0, left:0, zIndex:5, cursor:tool==='eraser'?'cell':'crosshair' }} 
         />

         <div style={{ display:'flex', justifyContent:'center', gap:15, marginTop:20, color:'#fff', alignItems:'center', background:'#202124', padding:'10px 20px', borderRadius:30, position:"sticky", bottom:0, boxShadow:'0 4px 15px rgba(0,0,0,0.4)', zIndex:10 }}>
            <button disabled={pageNum <= 1} onClick={()=>setPageNum(p=>p-1)} style={{ background:pageNum<=1?"#444":B.green, color:'#fff', padding:'6px 14px', borderRadius:20, border:'none', cursor:pageNum<=1?'not-allowed':'pointer', fontWeight:600, fontSize:12 }}>← Prev</button>
            <span style={{ fontSize:12, fontWeight:500, fontFamily:"monospace" }}>Page {pageNum} of {pdf?.numPages || 1}</span>
            <button disabled={pageNum >= (pdf?.numPages || 1)} onClick={()=>setPageNum(p=>p+1)} style={{ background:pageNum >= (pdf?.numPages || 1)?"#444":B.green, color:'#fff', padding:'6px 14px', borderRadius:20, border:'none', cursor:pageNum >= (pdf?.numPages || 1)?'not-allowed':'pointer', fontWeight:600, fontSize:12 }}>Next →</button>
         </div>
      </div>
    </div>
  );
}

// ── YOUTUBE API COMPONENT FOR SCREENSHOT CAPTURE ──────────────────────────────
function YouTubePlayer({ vid, onPlayerReady }) {
  const containerRef = useRef(null);
  
  // Create a stable callback ref so useEffect doesn't constantly re-trigger
  const cbRef = useRef(onPlayerReady);
  useEffect(() => { cbRef.current = onPlayerReady; }, [onPlayerReady]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create a fresh DOM element for YouTube to safely replace without confusing React
    containerRef.current.innerHTML = '<div id="yt-player-target" style="width:100%; height:100%;"></div>';
    const target = containerRef.current.firstElementChild;
    
    let player;
    const init = () => {
      if (window.YT && window.YT.Player) {
        player = new window.YT.Player(target, {
          videoId: vid,
          playerVars: { rel: 0, modestbranding: 1 },
          events: { onReady: (e) => cbRef.current?.(e.target) }
        });
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = init;
    } else if (!window.YT.Player) {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if(prev) prev();
        init();
      }
    } else {
      init();
    }
    
    return () => { if(player?.destroy) player.destroy(); };
  }, [vid]); 

  return <div ref={containerRef} style={{width:'100%', height:'100%'}}/>;
}


// ── MAIN APP ──────────────────────────────────────────────────────────────────
function Discite() {
  const [tn,setTn]=useState("light"); const T=TH[tn];
  const [view,setView]=useState("learn");
  const [drawer,setDrawer]=useState(null);

  // FAB States
  const [showCompose,setShowCompose]=useState(false);
  const [showCreateGroup, setShowCreateGroup]=useState(false);
  const [showCreateProgram, setShowCreateProgram]=useState(false);
  const [editingProg, setEditingProg] = useState(null);

  // Dynamic Programs List
  const [programsList, setProgramsList] = useState(INIT_PROGRAMS);
  const [progId,setProgId]=useState(1);
  const [previewId,setPreviewId]=useState(null);
  const [curIdx,setCurIdx]=useState(0);
  const [plUrl,setPlUrl]=useState("");
  const [plStatus,setPlStatus]=useState("");
  const [plLoading,setPlLoading]=useState(false);

  // YouTube Player instance safely held in a Ref to avoid state circularity crashes
  const ytPlayerRef = useRef(null);

  // Transcript & Translations
  const [lang,setLang]=useState("Hindi");
  const [translating,setTranslating]=useState(false);
  const [translation,setTranslation]=useState("");
  const [showTrans,setShowTrans]=useState(false);
  const [autoScroll,setAutoScroll]=useState(false);
  const [scrollPct,setScrollPct]=useState(0);

  // Social/News/Resources
  const [rightTab,setRightTab]=useState("social");
  const [socTab,setSocTab]=useState("linkedin");
  const [socSearch,setSocSearch]=useState("");
  const [newsSearch,setNewsSearch]=useState("");
  const [social,setSocial]=useState({linkedin:[],twitter:[]});
  const [loadSoc,setLoadSoc]=useState(false);
  const [news,setNews]=useState([]);
  const [loadNews,setLoadNews]=useState(false);

  // Notes Drawer State
  const [notes, setNotes] = useState(INIT_NOTES);
  const [activeNoteId, setActiveNoteId] = useState(null);

  // Groups
  const [groupsList, setGroupsList] = useState(INIT_GROUPS);
  const [grp,setGrp]=useState(INIT_GROUPS[0]);
  const [msgs,setMsgs]=useState(SEED_MSGS);
  const [chatInput,setChatInput]=useState("");

  // Calendar
  const [calDate,setCalDate]=useState(new Date());
  const [events,setEvents]=useState(mkInitEvents());
  const [selDay,setSelDay]=useState(null);
  const [evTitle,setEvTitle]=useState("");
  const [evTime,setEvTime]=useState("09:00");
  const [evType,setEvType]=useState("personal");

  // Marketplace
  const [mktQ,setMktQ]=useState("");
  const [mktItems,setMktItems]=useState(MKT_SEED);
  const [mktLoading,setMktLoading]=useState(false);
  const [mktCat,setMktCat]=useState("All");

  // Segmented Profile State
  const [profileData,setProfileData]=useState(INIT_PROFILE);
  const [profTab,setProfTab]=useState("profile");
  const [profSubView, setProfSubView]=useState("personal"); 
  const [editingProfile, setEditingProfile]=useState(false);
  const [editDraft,setEditDraft]=useState(null);
  
  // AI Resume State
  const [rrole,setRrole]=useState("");
  const [rtext,setRtext]=useState("");
  const [rloading,setRloading]=useState(false);
  const [showResume,setShowResume]=useState(false);
  const [aiSuggesting,setAiSuggesting]=useState(false);
  const [suggestDone,setSuggestDone]=useState(false);
  const [profSections,setProfSections]=useState({
    personal:true,social:true,education:true,experience:true,
    projects:true,skills:true,certifications:true,languages:true,
    achievements:true,hobbies:false,references:false,
  });
  const [itemSel,setItemSel]=useState({ skills:[], projects:[], experience:[], achievements:[], certifications:[] });

  const txRef=useRef(null); const tlRef=useRef(null);
  const chatEnd=useRef(null); const stmr=useRef(null);

  // Robustly derive current program/lesson data
  const prog = programsList.find(p=>p.id===progId) || programsList[0] || { id:0, title:"No Programs", color:B.green, tags:[], lessons:[], done:0, total:0 };
  const lessons = prog.lessons?.length ? prog.lessons : [{ id:0, type:"video", title:"No lessons available", dur:"0:00", vid:"" }];
  const cur = lessons[curIdx] || lessons[0];
  const prevProg = programsList.find(p=>p.id===previewId);
  const filtSoc = (socTab==="linkedin"?(social.linkedin||[]):(social.twitter||[])).filter(p=>!socSearch||JSON.stringify(p).toLowerCase().includes(socSearch.toLowerCase()));
  const filtNews = news.filter(n=>!newsSearch||JSON.stringify(n).toLowerCase().includes(newsSearch.toLowerCase()));
  const filtMkt = mktCat==="All"?mktItems:mktItems.filter(i=>i.cat===mktCat);

  useEffect(()=>{ fetchSoc(cur.tags); fetchNews(cur.tags); },[]);
  useEffect(()=>{ chatEnd.current?.scrollIntoView({behavior:"smooth"}); },[msgs, drawer]);
  useEffect(()=>{
    if(autoScroll){
      stmr.current=setInterval(()=>{
        const el=showTrans?tlRef.current:txRef.current; if(!el) return;
        el.scrollTop+=0.65;
        setScrollPct(Math.min((el.scrollTop/(el.scrollHeight-el.clientHeight))*100,100));
        if(el.scrollTop>=el.scrollHeight-el.clientHeight-2) setAutoScroll(false);
      },28);
    } else clearInterval(stmr.current);
    return()=>clearInterval(stmr.current);
  },[autoScroll,showTrans]);

  // Profile Builders CRUD logic
  function startEdit() {
    setEditingProfile(true);
    setEditDraft(JSON.parse(JSON.stringify(profileData)));
  }
  function saveProfile() {
    setProfileData(editDraft);
    setEditingProfile(false);
    setEditDraft(null);
  }
  function cancelEdit() {
    setEditingProfile(false);
    setEditDraft(null);
  }
  function updateDraft(section, field, value) {
    setEditDraft(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  }
  function updateArrayDraft(section, index, field, value) {
    setEditDraft(prev => {
      const newArray = [...prev[section]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: newArray };
    });
  }
  function addArrayItem(section, template) {
    setEditDraft(prev => ({ ...prev, [section]: [...prev[section], { id: Date.now(), ...template }] }));
  }
  function removeArrayItem(section, index) {
    setEditDraft(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
  }

  function calcCompletion(pd) {
    let s=0;
    const p=pd.personal;
    if(p.name) s+=5; if(p.email) s+=5; if(p.phone) s+=4; if(p.location) s+=4; if(p.about?.length>20) s+=5; if(p.title) s+=2;
    if(pd.social.linkedin) s+=4; if(pd.social.github) s+=4;
    if(pd.education.length>0&&pd.education[0]?.degree) s+=12;
    if(pd.experience.length>0) s+=12;
    if(pd.projects.length>=1) s+=6;
    if(pd.skills.technical.length>=5) s+=8;
    return Math.min(Math.round(s),100);
  }

  // MOCK API FUNCTIONS
  function fetchSoc(tags) {
    setLoadSoc(true); setSocial({linkedin:[],twitter:[]});
    setTimeout(() => {
      setSocial({
        linkedin: [{ author: "System Mock", title: "Update", content: `Insight generated about: ${tags?.join(", ") || "General Topic"}. Found a great way to implement this in my next project.`, likes: 342, comments: 18, time: "2h ago" }],
        twitter: [{ handle: "@tech_enthusiast", name: "Tech Enthusiast", content: `Just learned about ${tags?.[0]||'tech'}. The ecosystem is moving fast! 🚀 #learning`, likes: 120, retweets: 12, time: "45m ago" }]
      });
      setLoadSoc(false);
    }, 600);
  }
  function fetchNews(tags) {
    setLoadNews(true); setNews([]);
    setTimeout(() => {
      setNews([
        { title: `Industry update on ${tags?.[0]||'Tech'}`, source: "Tech Mock Daily", summary: "Recent trends show a 40% increase in adoption for these specific architectures across enterprise companies.", time: "3h ago", category: "Tech" },
        { title: `New tools released for ${tags?.[1]||'Development'}`, source: "Dev Weekly", summary: "A breakdown of the top 5 tools you should add to your workflow this year.", time: "1d ago", category: "Tools" }
      ]);
      setLoadNews(false);
    }, 600);
  }
  function aiSocSearch(qOverride) {
    const q = typeof qOverride === 'string' ? qOverride : socSearch;
    if(!q.trim()) return; setLoadSoc(true);
    setTimeout(() => {
      setSocial({
        linkedin: [{ author: "AI Search Result", title: "Mock", content: `Found specific insight for "${q}". Real-world applications are vast.`, likes: 234, comments: 12, time: "1h ago" }],
        twitter: [{ handle: "@searcher", name: "Searcher", content: `Here is a tweet about ${q}. Highly relevant. #search`, likes: 89, retweets: 13, time: "2h ago" }]
      });
      setLoadSoc(false);
    }, 500);
  }
  function aiNewsSearch(qOverride) {
    const q = typeof qOverride === 'string' ? qOverride : newsSearch;
    if(!q.trim()) return; setLoadNews(true);
    setTimeout(() => {
      setNews([{ title: `Search result for ${q}`, source: "Mock Search", summary: `Mocked summary focusing entirely on the keyword ${q}.`, time: "2h ago", category: "Search" }]);
      setLoadNews(false);
    }, 500);
  }
  function mktSearch() {
    if(!mktQ.trim()) return; setMktLoading(true);
    setTimeout(() => {
      const results = MKT_SEED.filter(item => JSON.stringify(item).toLowerCase().includes(mktQ.toLowerCase()));
      setMktItems(results.length ? results : MKT_SEED);
      setMktCat("All");
      setMktLoading(false);
    }, 500);
  }
  function translate() {
    setTranslating(true); setShowTrans(false); setTranslation("");
    setTimeout(() => {
      setTranslation(`[MOCK TRANSLATION IN ${lang}]\n\nAPI is currently disabled to resolve bugs. This is a simulated translation output representing the parsed transcript text translated into ${lang}.`);
      setShowTrans(true);
      tlRef.current&&(tlRef.current.scrollTop=0);
      setTranslating(false);
    }, 600);
  }

  function genResume() {
    if(!rrole.trim()) return;
    setRloading(true); setShowResume(false);
    setTimeout(() => {
      const selSkills = itemSel.skills;
      const selProjects = profileData.projects.filter(p => itemSel.projects.includes(p.id));
      const selExp = profileData.experience.filter(e => itemSel.experience.includes(e.id));
      
      let draft = `MOCK RESUME DRAFT FOR: ${rrole.toUpperCase()}\n\n[API is disabled. This is a simulated single-column ATS resume based on your selections.]\n\n`;
      
      if (profSections.personal) {
        draft += `${profileData.personal.name.toUpperCase()}\n${profileData.personal.email} | ${profileData.personal.phone}\n${profileData.personal.location}\n\nSUMMARY\n${profileData.personal.about}\n\n`;
      }
      if (profSections.experience && selExp.length > 0) {
        draft += `EXPERIENCE\n${selExp.map(e => `• ${e.role.toUpperCase()} at ${e.company}\n  ${e.desc}`).join("\n\n")}\n\n`;
      }
      if (profSections.projects && selProjects.length > 0) {
        draft += `PROJECTS\n${selProjects.map(p => `• ${p.name.toUpperCase()} | ${p.tech}\n  ${p.desc}`).join("\n\n")}\n\n`;
      }
      if (profSections.skills && selSkills.length > 0) {
        draft += `SKILLS\nTechnical: ${selSkills.join(", ")}\n\n`;
      }

      setRtext(draft.trim());
      setShowResume(true);
      setRloading(false);
    }, 800);
  }

  function handleAiSuggest() {
    if(!rrole.trim()) return;
    setAiSuggesting(true);
    setSuggestDone(false);
    setTimeout(() => {
      setItemSel({
        skills: profileData.skills.technical.slice(0, 4),
        projects: profileData.projects.map(p=>p.id),
        experience: profileData.experience.map(e=>e.id),
        achievements: profileData.achievements?.map(a=>a.id) || [],
        certifications: []
      });
      setProfSections(prev => ({
        ...prev,
        projects: profileData.projects.length > 0,
        experience: profileData.experience.length > 0,
        skills: true
      }));
      setSuggestDone(true);
      setAiSuggesting(false);
    }, 600);
  }

  function toggleItem(section, id) {
    setItemSel(prev=>{
      const cur = prev[section] || [];
      return { ...prev, [section]: cur.includes(id) ? cur.filter(x=>x!==id) : [...cur,id] };
    });
  }

  function selLesson(i) {
    setCurIdx(i); setScrollPct(0); setAutoScroll(false); setShowTrans(false); setTranslation(""); 
    ytPlayerRef.current = null;
    txRef.current&&(txRef.current.scrollTop=0);
    fetchSoc(lessons[i].tags); fetchNews(lessons[i].tags);
  }
  function enterProg(id) {
    setProgId(id); setCurIdx(0); setPreviewId(null); setShowTrans(false); setTranslation(""); 
    ytPlayerRef.current = null;
    const p=programsList.find(r=>r.id===id); if(p?.lessons?.length){ fetchSoc(p.lessons[0].tags); fetchNews(p.lessons[0].tags); }
  }
  
  function loadPlaylist() {
    const isPdf = plUrl.toLowerCase().endsWith(".pdf");
    const listMatch = plUrl.match(/[?&]list=([^&]+)/);
    const vidMatch = plUrl.match(/youtu\.be\/([^?]+)/) || plUrl.match(/v=([^&]+)/);

    if(isPdf || listMatch || vidMatch) {
      setPlLoading(true); setPlStatus(isPdf ? "Fetching document..." : "Fetching videos...");
      setTimeout(() => {
        const newId = Date.now();
        let mockLessons = [];
        
        if (isPdf) {
           mockLessons = [
              { id: newId+1, type: "pdf", title: "1. Imported Document", dur: "1 Document", url: plUrl, done: false, tags: ["Imported", "PDF"], references: [] }
           ];
        } else {
           const mainVid = listMatch ? `videoseries?list=${listMatch[1]}` : vidMatch[1];
           mockLessons = [
             { id: newId+1, type: "video", title: "1. Imported Source", dur: "10:15", vid: mainVid, done: false, tags: ["Imported", "Intro"], references: [] },
             { id: newId+2, type: "video", title: "2. Core Fundamentals", dur: "14:20", vid: "PkZNo7MFNFg", done: false, tags: ["Imported", "Core"], references: [] },
             { id: newId+3, type: "video", title: "3. Advanced Techniques", dur: "18:05", vid: "W6NZfCO5SIk", done: false, tags: ["Imported", "Advanced"], references: [] },
           ];
        }
        
        const newProg = { id: newId, title: isPdf ? "Imported Book/PDF" : (listMatch ? "Imported Playlist" : "Imported Video"), instructor: isPdf ? "Document Source" : "YouTube Creator", color: B.indigo, tags: isPdf ? ["Document"] : ["YouTube"], status: "active", level: "All Levels", duration: "Custom", desc: "Custom imported content: " + plUrl, lessons: mockLessons, done: 0, total: mockLessons.length, isCustom: true };
        
        setProgramsList(prev => [newProg, ...prev]);
        setProgId(newId); setCurIdx(0); ytPlayerRef.current = null;
        setPlStatus("✓ Loaded to My Programs"); setPlLoading(false);
        setTimeout(() => setPlStatus(""), 3000);
        setPlUrl("");
      }, 1200);
    } else {
      setPlStatus("✗ Invalid URL");
      setTimeout(() => setPlStatus(""), 3000);
    }
  }

  function deleteProgram(e, id) {
    e.stopPropagation();
    const progToRemove = programsList.find(p => p.id === id);
    const isCreator = progToRemove?.creator === profileData.personal.name;

    // Remove from My Programs list
    setProgramsList(prev => prev.filter(p => p.id !== id));
    
    // If user is creator, also delete it from Marketplace
    if (isCreator) {
        setMktItems(prev => prev.filter(m => m.progId !== id));
    }

    if (progId === id) { 
        const remaining = programsList.filter(p => p.id !== id);
        setProgId(remaining.length > 0 ? remaining[0].id : (INIT_PROGRAMS[0]?.id || 1)); 
        setCurIdx(0); 
        ytPlayerRef.current = null;
    }
    if (previewId === id) { setPreviewId(null); }
  }

  function handlePostToGroup(groupId, text) {
    const now = new Date();
    const newMessage = { id: Date.now(), user: "You", av: "ME", col: B.olive, text: text, time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), isMe: true };
    if (grp.id === groupId) { setMsgs(p => [...p, newMessage]); } 
    else { const targetGroup = groupsList.find(g => g.id === groupId); if (targetGroup) { setGrp(targetGroup); setMsgs([...SEED_MSGS, newMessage]); } }
    setDrawer("groups");
  }

  function handleCreateGroup(newGroup) {
    setGroupsList(prev => [...prev, newGroup]);
    setGrp(newGroup);
    setMsgs([]); // fresh chat
    setDrawer("groups");
  }

  function handleSaveProgram(progData) {
    if (editingProg) {
        setProgramsList(prev => prev.map(p => p.id === progData.id ? progData : p));
        setMktItems(prev => prev.map(m => m.progId === progData.id ? {...m, title: progData.title, desc: progData.desc} : m));
        setEditingProg(null);
    } else {
        setProgramsList(prev => [progData, ...prev]);
        setMktItems(prev => [{
            id: Date.now() + 100,
            progId: progData.id,
            title: progData.title,
            cat: "Courses",
            desc: progData.desc,
            price: 0, rent: null, rating: 5.0, reviews: 0, seller: progData.creator, badge: "New"
        }, ...prev]);
    }
    setProgId(progData.id);
    setView("learn");
    setRightTab("resources"); // Switch to resources to show the references of the first lesson
  }

  function sendChat() {
    if(!chatInput.trim()) return;
    const now=new Date();
    setMsgs(p=>[...p,{id:p.length+10,user:"You",av:"ME",col:B.olive,text:chatInput,time:now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),isMe:true}]);
    setChatInput("");
  }
  function addEvent() {
    if(!evTitle.trim()||!selDay) return;
    setEvents(ev=>[...ev,{id:ev.length+10,title:evTitle,date:selDay,type:evType,color:evType==="group"?B.indigo:B.green,time:evTime}]);
    setEvTitle(""); setSelDay(null);
  }

  // Handle Video Screenshot Capture
  function captureVideoNote() {
    if (!ytPlayerRef.current || typeof ytPlayerRef.current.getCurrentTime !== 'function') return;
    const time = ytPlayerRef.current.getCurrentTime();
    const fmt = Math.floor(time/60) + ':' + String(Math.floor(time%60)).padStart(2,'0');
    const thumb = `https://img.youtube.com/vi/${cur.vid}/hqdefault.jpg`;
    
    // Create an elegant simulated screenshot component 
    const html = `<div contenteditable="false" style="display:inline-block; margin:10px 0; border:1px solid #C4D0EE; border-radius:8px; overflow:hidden; width:260px; box-shadow:0 4px 12px rgba(40,60,140,0.1);"><div style="position:relative;"><img src="${thumb}" style="width:100%; display:block;" /><div style="position:absolute; bottom:6px; right:6px; background:rgba(0,0,0,0.8); color:#fff; font-size:11px; padding:3px 8px; border-radius:4px; font-family:monospace; font-weight:bold; letter-spacing:0.5px;">${fmt}</div></div><div style="padding:8px 12px; font-size:12px; background:#F4F6FF; color:#0A1030; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${cur.title}</div></div><br/>`;

    if (activeNoteId) {
       setNotes(notes.map(n => n.id === activeNoteId ? { ...n, content: n.content + html } : n));
    } else {
       const newId = Date.now();
       setNotes([{ id: newId, title: "Video Notes: " + cur.title, content: html, date: new Date().toLocaleDateString() }, ...notes]);
       setActiveNoteId(newId);
    }
    setDrawer("notes");
  }


  // ── CSS ───────────────────────────────────────────────────────────────────
  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Marvel:wght@400;700&family=Numans&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${T.bdM};border-radius:4px}
    input,select,button,textarea{font-family:'Roboto',sans-serif;outline:none} button{cursor:pointer;border:none;background:none}
    @keyframes dc-spin{to{transform:rotate(360deg)}}
    @keyframes dc-pulse{0%,100%{opacity:1}50%{opacity:.38}}
    @keyframes dc-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes dc-in{from{opacity:0}to{opacity:1}}
    @keyframes dc-fab-pulse{0%,100%{box-shadow:0 8px 24px rgba(47,164,120,0.35)}50%{box-shadow:0 8px 34px rgba(47,164,120,0.65)}}
    .dc-nav{transition:background 0.16s,color 0.16s;border-left:3px solid transparent;padding:10px 0;width:100%;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:9px;font-weight:500;text-transform:uppercase;letter-spacing:0.07em}
    .dc-nav:hover{background:${B.greenDim}}.dc-nav.v-on{background:${B.greenDim};border-left-color:${B.green}}.dc-nav.d-on{background:${B.indigoDim};border-left-color:${B.indigo}}
    .dc-tab{border-bottom:2px solid transparent;transition:color 0.15s,border-color 0.15s;cursor:pointer;background:none;border-left:none;border-right:none;border-top:none}
    .dc-tab.on{border-bottom-color:${B.green}}
    .dc-ghost{transition:opacity 0.15s;cursor:pointer}.dc-ghost:hover{opacity:0.78}
    .dc-pri{transition:opacity 0.14s,transform 0.1s;cursor:pointer}.dc-pri:hover{opacity:0.86}.dc-pri:active{transform:scale(0.97)}
    .dc-lesson{border-left:2px solid transparent;transition:background 0.13s}.dc-lesson:hover{background:${B.greenDim}60}.dc-lesson.on{border-left-color:${B.green};background:${B.greenDim}!important}
    .dc-prog{transition:border-color 0.15s,opacity 0.15s;cursor:pointer}.dc-prog:hover{opacity:0.85}
    .dc-day{border-radius:6px;transition:background 0.12s;cursor:pointer}.dc-day:hover{filter:brightness(0.97)}
    .dc-inp{border-radius:7px;padding:7px 11px;font-size:12px;transition:border-color 0.15s;width:100%}.dc-inp:focus{border-color:${B.green}!important;outline:none}
    .mkt-cat-on{background:${B.greenDim}!important;color:${B.green}!important;border-color:${B.greenBd}!important}
    .dc-fab{animation:dc-fab-pulse 2.4s ease-in-out infinite;transition:transform 0.15s,opacity 0.15s; display:flex;align-items:center;justifyContent:center}.dc-fab:hover{transform:scale(1.08)!important;opacity:0.92}.dc-fab:active{transform:scale(0.96)!important}
    .prof-nav{padding:10px 14px;border-radius:8px;font-size:13px;font-weight:500;color:var(--txM);cursor:pointer;transition:all 0.15s;display:flex;align-items:center;gap:8px}
    .prof-nav:hover{background:var(--cardHv);color:var(--tx)}
    .prof-nav.on{background:${B.greenDim};color:${B.green};border:1px solid ${B.greenBd}}
    .prof-field{background:var(--inp);border:1px solid var(--bd);border-radius:6px;padding:8px 10px;font-size:12.5px;color:var(--tx);width:100%;transition:border-color 0.15s;outline:none;}
    .prof-field:focus{border-color:${B.green}}
    .fab-mini{width:44px;height:44px;border-radius:50%;background:var(--card);border:1px solid var(--bd);color:var(--tx);font-size:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;box-shadow:var(--sh);}
    .fab-mini:hover{transform:scale(1.1);background:var(--cardHv);}
  `;

  const embedSrc = cur.type === "pdf" ? null : (cur.vid?.includes('videoseries') 
    ? `https://www.youtube.com/embed/${cur.vid}&rel=0&modestbranding=1` 
    : (cur.vid ? `https://www.youtube.com/embed/${cur.vid}?rel=0&modestbranding=1` : ""));

  return (
    <div style={{ "--inp":T.inp,"--bd":T.bd,"--tx":T.tx, "--txM":T.txM, "--card":T.card, "--cardHv":T.cardHv, "--sh":T.sh, fontFamily:"'Roboto',sans-serif",background:T.bg,color:T.tx,height:"100vh",display:"flex",overflow:"hidden",position:"relative" }}>
      <style>{css}</style>
      
      {showCompose && <ComposeModal T={T} groupsList={groupsList} onClose={()=>setShowCompose(false)} onPostToGroup={handlePostToGroup} />}
      {showCreateGroup && <CreateGroupModal T={T} onClose={()=>setShowCreateGroup(false)} onCreateGroup={handleCreateGroup} />}
      {showCreateProgram && <CreateProgramModal T={T} currentUser={profileData.personal.name} onClose={()=>{setShowCreateProgram(false); setEditingProg(null);}} onSaveProgram={handleSaveProgram} initialData={editingProg} />}

      {/* Drawer Overlay - zIndex 40 covering all normal content */}
      {drawer&&<div onClick={()=>setDrawer(null)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.46)",zIndex:40,animation:"dc-in 0.22s ease" }} />}

      {/* Right Drawer Panel - zIndex 50 (above overlay) */}
      <div style={{ position:"fixed",top:0,right:0,height:"100vh",width:"60%",background:T.sf,borderLeft:`1px solid ${T.bd}`,zIndex:50,display:"flex",flexDirection:"column",transform:drawer?"translateX(0)":"translateX(100%)",transition:"transform 0.32s cubic-bezier(0.4,0,0.2,1)",boxShadow:drawer?"-8px 0 40px rgba(0,0,0,0.22)":"none" }}>
        <div style={{ display:"flex",alignItems:"center",padding:"10px 14px",borderBottom:`1px solid ${T.bd}`,flexShrink:0,gap:8 }}>
          <div style={{ display:"flex",gap:0,border:`1px solid ${T.bd}`,borderRadius:8,overflow:"hidden" }}>
            {["groups","notes","calendar"].map(d=>(
              <button key={d} onClick={()=>setDrawer(d)} style={{ padding:"6px 18px",fontSize:12.5,fontWeight:500,background:drawer===d?B.green:"transparent",color:drawer===d?"#fff":T.txM,transition:"all 0.15s",border:"none",cursor:"pointer" }}>
                {d==="groups"?"👥 Groups":d==="notes"?"📝 Notes":"📅 Calendar"}
              </button>
            ))}
          </div>
          <div style={{ flex:1 }}/>
          <button onClick={()=>setDrawer(null)} style={{ color:T.txM,fontSize:22,lineHeight:1,padding:"0 6px",cursor:"pointer",border:"none",background:"none" }}>×</button>
        </div>
        <div style={{ flex:1,overflow:"hidden",display:"flex" }}>
          
          {/* Group Drawer Content */}
          {drawer==="groups" && (
            <div style={{ flex:1,display:"flex",overflow:"hidden" }}>
              <div style={{ width:220,borderRight:`1px solid ${T.bd}`,display:"flex",flexDirection:"column",flexShrink:0 }}>
                <div style={{ padding:"9px 11px 6px",borderBottom:`1px solid ${T.bd}`,flexShrink:0, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontSize:9.5,color:T.txM,textTransform:"uppercase",letterSpacing:"0.09em",fontWeight:600 }}>Your Cohorts</div>
                  <button onClick={()=>setShowCreateGroup(true)} style={{ background:B.indigo, color:"#fff", border:"none", borderRadius:5, padding:"4px 8px", fontSize:10, fontWeight:600, cursor:"pointer" }}>+ NEW</button>
                </div>
                <div style={{ flex:1,overflowY:"auto",padding:8,display:"flex",flexDirection:"column",gap:7 }}>
                  {groupsList.map(g=>(
                    <div key={g.id} onClick={()=>setGrp(g)} style={{ background:grp.id===g.id?`${g.color}14`:T.card,border:`1.5px solid ${grp.id===g.id?g.color:T.bd}`,borderRadius:10,padding:"9px 11px",cursor:"pointer",transition:"all 0.15s" }}>
                      <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:5 }}><div style={{ width:8,height:8,borderRadius:"50%",background:g.color,flexShrink:0 }}/><div style={{ fontSize:12,fontWeight:500,color:T.tx }}>{g.name}</div></div>
                      <div style={{ fontSize:10,color:T.txM,marginBottom:5 }}>{g.course}</div>
                      <div style={{ display:"flex",flexWrap:"wrap",gap:3,marginBottom:4 }}>{g.tags.map(tg=><Pill key={tg} label={tg} color={g.color}/>)}</div>
                      <div style={{ fontSize:9.5,color:T.txM,fontFamily:"monospace" }}>👥 {g.members} members</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
                <div style={{ padding:"9px 13px",borderBottom:`1px solid ${T.bd}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <div style={{ width:9,height:9,borderRadius:"50%",background:grp.color,boxShadow:`0 0 5px ${grp.color}90` }}/>
                    <div><div style={{ fontFamily:"'Numans',sans-serif",fontSize:14.5,color:T.tx }}>{grp.name}</div><div style={{ fontSize:9.5,color:T.txM }}>{grp.members} members · {grp.course}</div></div>
                  </div>
                </div>
                <div style={{ flex:1,overflowY:"auto",padding:"11px 13px",display:"flex",flexDirection:"column",gap:10 }}>
                  {msgs.map(m=>(
                    <div key={m.id} style={{ display:"flex",gap:7,flexDirection:m.isMe?"row-reverse":"row",animation:"dc-up 0.2s ease" }}>
                      <Av init={m.av} color={m.col} size={29}/>
                      <div style={{ maxWidth:"68%",display:"flex",flexDirection:"column",alignItems:m.isMe?"flex-end":"flex-start" }}>
                        <div style={{ fontSize:9.5,color:T.txM,marginBottom:2,fontFamily:"monospace" }}>{m.isMe?"You":m.user} · {m.time}</div>
                        <div style={{ background:m.isMe?`${grp.color}20`:T.card,border:`1px solid ${m.isMe?`${grp.color}45`:T.bd}`,borderRadius:m.isMe?"11px 3px 11px 11px":"3px 11px 11px 11px",padding:"7px 11px",fontSize:12.5,color:T.tx,lineHeight:1.6 }}>{m.text}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEnd}/>
                </div>
                <div style={{ padding:"8px 13px",borderTop:`1px solid ${T.bd}`,display:"flex",gap:7,background:T.sf,flexShrink:0 }}>
                  <input className="dc-inp" value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder={`Message ${grp.name}…`} style={{ flex:1,padding:"8px 12px",background:T.inp,border:`1px solid ${T.bd}`,color:T.tx,fontSize:12.5 }}/>
                  <button className="dc-pri" onClick={sendChat} style={{ background:B.green,color:"#fff",padding:"8px 16px",borderRadius:7,fontSize:12.5,fontWeight:600,flexShrink:0 }}>Send</button>
                </div>
              </div>
            </div>
          )}

          {/* Notes Drawer Content */}
          {drawer==="notes" && (
             <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
              <div style={{ padding:"9px 13px", borderBottom:`1px solid ${T.bd}`, flexShrink:0, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontFamily:"'Numans',sans-serif", fontSize:14.5, color:T.tx }}>My Notes</div>
                  <div style={{ fontSize:9.5, color:T.txM }}>{activeNoteId ? "Editing Note" : "All Saved Notes"}</div>
                </div>
                {activeNoteId ? (
                  <button onClick={()=>setActiveNoteId(null)} style={{ background:T.card, border:`1px solid ${T.bd}`, color:T.txD, padding:"4px 10px", borderRadius:6, fontSize:11, cursor:"pointer" }}>← Back</button>
                ) : (
                  <button onClick={()=>{
                    const newNote = { id: Date.now(), title: "Untitled Note", content: "", date: new Date().toLocaleDateString() };
                    setNotes([newNote, ...notes]);
                    setActiveNoteId(newNote.id);
                  }} style={{ background:B.green, color:"#fff", padding:"5px 12px", borderRadius:6, fontSize:11, fontWeight:600, cursor:"pointer", border:"none" }}>+ New Note</button>
                )}
              </div>
              
              <div style={{ flex:1, padding:"13px", display:"flex", flexDirection:"column", overflowY:"auto" }}>
                {activeNoteId ? (
                  <NoteEditor 
                    note={notes.find(n => n.id === activeNoteId)} 
                    updateNote={(updated) => setNotes(notes.map(n => n.id === updated.id ? updated : n))} 
                    deleteNote={(id) => { setNotes(notes.filter(n => n.id !== id)); setActiveNoteId(null); }} 
                    T={T} B={B} 
                  />
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {notes.length === 0 ? (
                      <div style={{ textAlign:"center", color:T.txM, fontSize:12, marginTop:20 }}>No saved notes yet.</div>
                    ) : (
                      notes.map(note => (
                        <div key={note.id} onClick={()=>setActiveNoteId(note.id)} style={{ background:T.card, border:`1px solid ${T.bd}`, borderRadius:8, padding:"10px 12px", cursor:"pointer", transition:"border-color 0.15s" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                            <span style={{ fontSize:13, fontWeight:600, color:T.tx }}>{note.title || "Untitled Note"}</span>
                            <span style={{ fontSize:10, color:T.txM }}>{note.date}</span>
                          </div>
                          <div style={{ fontSize:11.5, color:T.txD, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                            {note.content ? note.content.replace(/<[^>]*>?/gm, '').substring(0, 80) + "..." : "Empty note..."}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Calendar Drawer Content */}
          {drawer==="calendar" && (
            <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
              <div style={{ padding:"9px 16px",borderBottom:`1px solid ${T.bd}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
                <button className="dc-ghost" onClick={()=>setCalDate(new Date(calDate.getFullYear(),calDate.getMonth()-1,1))} style={{ background:T.card,border:`1px solid ${T.bd}`,color:T.txD,padding:"4px 12px",borderRadius:6,fontSize:14 }}>‹</button>
                <div style={{ fontFamily:"'Marvel',sans-serif",fontSize:18,color:T.tx }}>
                  {["January","February","March","April","May","June","July","August","September","October","November","December"][calDate.getMonth()]} {calDate.getFullYear()}
                </div>
                <button className="dc-ghost" onClick={()=>setCalDate(new Date(calDate.getFullYear(),calDate.getMonth()+1,1))} style={{ background:T.card,border:`1px solid ${T.bd}`,color:T.txD,padding:"4px 12px",borderRadius:6,fontSize:14 }}>›</button>
              </div>
              <div style={{ flex:1,overflowY:"auto",padding:"10px 14px" }}>
                <div style={{ fontSize:9.5,color:T.txM,textTransform:"uppercase",letterSpacing:"0.09em",fontWeight:600,marginBottom:8 }}>Upcoming</div>
                <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                  {events.map((ev,i)=>(
                    <div key={i} style={{ background:T.card,border:`1px solid ${T.bd}`,borderRadius:8,padding:"7px 10px",display:"flex",alignItems:"center",gap:8,animation:"dc-up 0.25s ease" }}>
                      <div style={{ width:3,borderRadius:2,alignSelf:"stretch",background:ev.color,flexShrink:0 }}/>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontSize:12,color:T.tx,fontWeight:500,lineHeight:1.3 }}>{ev.title}</div>
                        <div style={{ fontSize:9.5,color:T.txM,fontFamily:"monospace",marginTop:1 }}>{ev.date} · {ev.time}</div>
                      </div>
                      <Pill label={ev.type} color={ev.type==="group"?B.indigo:B.olive}/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Nav (Left Icon Bar) */}
      <nav style={{ width:56,background:T.sf,borderRight:`1px solid ${T.bd}`,display:"flex",flexDirection:"column",alignItems:"center",padding:"11px 0 12px",gap:2,flexShrink:0,zIndex:30 }}>
        <div style={{ marginBottom:14 }}><Logo size={34}/></div>
        {[{id:"learn",lbl:"Learn",ico:"▶"},{id:"marketplace",lbl:"Market",ico:"🛒"},{id:"profile",lbl:"Profile",ico:"👤"}].map(n=>(
          <button key={n.id} className={`dc-nav${view===n.id?" v-on":""}`} style={{ color:view===n.id?B.green:T.txM }} onClick={()=>setView(n.id)}>
            <span style={{ fontSize:15 }}>{n.ico}</span>{n.lbl}
          </button>
        ))}
        <div style={{ flex:1 }}/>
        {[{id:"groups",lbl:"Groups",ico:"💬"},{id:"notes",lbl:"Notes",ico:"📝"},{id:"calendar",lbl:"Schedule",ico:"📅"}].map(n=>(
          <button key={n.id} className={`dc-nav${drawer===n.id?" d-on":""}`} style={{ color:drawer===n.id?B.indigo:T.txM }} onClick={()=>setDrawer(prev=>prev===n.id?null:n.id)}>
            <span style={{ fontSize:15 }}>{n.ico}</span>{n.lbl}
          </button>
        ))}
        <div style={{ marginTop:8,display:"flex",flexDirection:"column",gap:5,alignItems:"center" }}>
          {["light","dark"].map(k=>(
            <button key={k} onClick={()=>setTn(k)} title={k==="light"?"Light mode":"Dark mode"}
              style={{ width:16,height:16,borderRadius:"50%",border:`2px solid ${tn===k?B.green:T.bd}`,background:k==="light"?"#EEF2FF":"#0D1525",cursor:"pointer",transition:"border-color 0.15s",flexShrink:0 }} />
          ))}
        </div>
        <div style={{ marginTop:8 }}><Av init={(profileData.personal.name||"AS").split(" ").map(w=>w[0]).join("").slice(0,2)} color={B.olive} size={30}/></div>
      </nav>

      <div style={{ flex:1,display:"flex",overflow:"hidden",minWidth:0,position:"relative" }}>
        
        {/* INLINE LEARN VIEW */}
        <div style={{ flex:1,display:view==="learn"?"flex":"none",overflow:"hidden" }}>
          <aside style={{ width:300,background:T.sf,borderRight:`1px solid ${T.bd}`,display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden" }}>
            <div style={{ padding:"9px 9px 7px",borderBottom:`1px solid ${T.bd}`,flexShrink:0 }}>
              <div style={{ fontFamily:"'Marvel',sans-serif",fontSize:15,color:T.tx,letterSpacing:"0.3px",marginBottom:6 }}>LearnStack</div>
              <div style={{ display:"flex",gap:4 }}>
                <input className="dc-inp" value={plUrl} onChange={e=>setPlUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&loadPlaylist()} placeholder="YouTube or PDF URL…"
                  style={{ flex:1,padding:"5px 7px",fontSize:10,background:T.inp,border:`1px solid ${T.bd}`,color:T.tx,minWidth:0 }} disabled={plLoading} />
                <button className="dc-pri" onClick={loadPlaylist} disabled={plLoading} style={{ background:B.green,color:"#fff",padding:"5px 8px",borderRadius:6,fontSize:11,fontWeight:700,flexShrink:0,opacity:plLoading?0.6:1 }}>
                  {plLoading ? <Spin size={11} color="#fff"/> : "▶"}
                </button>
              </div>
              {plStatus&&<div style={{ fontSize:10.5,marginTop:4,color:plStatus.startsWith("✓")?B.green:"#E05555" }}>{plStatus}</div>}
            </div>
            <div style={{ flexShrink:0,borderBottom:`1px solid ${T.bd}` }}>
              <div style={{ padding:"6px 9px 3px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <span style={{ fontSize:8.5,color:T.txM,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600 }}>Now Learning</span>
                <span style={{ fontSize:8.5,color:B.green,fontFamily:"monospace" }}>{prog.done||0}/{prog.total||7}</span>
              </div>
              <div style={{ padding:"0 9px 5px" }}>
                <div style={{ height:3,background:T.bd,borderRadius:2,overflow:"hidden" }}>
                  <div style={{ height:"100%",background:B.green,width:`${((prog.done||0)/(prog.total||7))*100}%`,transition:"width 0.4s" }} />
                </div>
              </div>
              <div style={{ maxHeight:220,overflowY:"auto" }}>
                {lessons.map((l,i)=>(
                  <div key={l.id} className={`dc-lesson${i===curIdx?" on":""}`} onClick={()=>selLesson(i)} style={{ padding:"6px 9px",borderBottom:`1px solid ${T.bd}40`,cursor:"pointer" }}>
                    <div style={{ display:"flex",gap:6,alignItems:"flex-start" }}>
                      <div style={{ width:16,height:16,borderRadius:"50%",flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,
                        background:l.done?`${B.green}20`:(i===curIdx?`${B.green}14`:"transparent"),border:`1.5px solid ${l.done?B.green:(i===curIdx?B.green:T.bd)}`,color:l.done?B.green:(i===curIdx?B.green:T.txM) }}>
                        {l.done?"✓":i+1}
                      </div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontSize:10.5,lineHeight:1.35,color:l.done?T.txM:T.tx,fontWeight:i===curIdx?500:400 }}>{l.title}</div>
                        <div style={{ fontSize:9,color:T.txM,fontFamily:"monospace",marginTop:2 }}>{l.type === "pdf" ? "📄" : "▶"} {l.dur}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex:1,overflowY:"auto" }}>
              <div style={{ padding:"6px 9px 4px" }}><span style={{ fontSize:8.5,color:T.txM,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600 }}>My Programs</span></div>
              {prevProg&&(
                <div style={{ margin:"0 7px 7px",background:T.card,border:`1.5px solid ${prevProg.color}60`,borderRadius:9,padding:"10px 10px",animation:"dc-up 0.22s ease" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:5,marginBottom:5 }}>
                    <div style={{ width:6,height:6,borderRadius:"50%",background:prevProg.color,flexShrink:0 }}/>
                    <div style={{ fontSize:11,fontWeight:600,color:T.tx,flex:1,lineHeight:1.25 }}>{prevProg.title}</div>
                  </div>
                  <div style={{ fontSize:10,color:T.txD,lineHeight:1.5,marginBottom:5 }}>{prevProg.desc}</div>
                  <div style={{ display:"flex",gap:4,marginBottom:5,flexWrap:"wrap" }}><Pill label={prevProg.level} color={prevProg.color}/><Pill label={prevProg.duration} color={T.txM}/></div>
                  <div style={{ marginBottom:7 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",fontSize:8.5,color:T.txM,marginBottom:3,fontFamily:"monospace" }}><span>Progress</span><span>{prevProg.done||0}/{prevProg.total||0}</span></div>
                    <div style={{ height:3,background:T.bd,borderRadius:2,overflow:"hidden" }}><div style={{ height:"100%",background:prevProg.color,width:`${((prevProg.done||0)/(prevProg.total||prevProg.lessons?.length||1))*100}%` }}/></div>
                  </div>
                  <div style={{ display:"flex",gap:5 }}>
                    <button className="dc-pri" onClick={()=>enterProg(prevProg.id)} style={{ flex:1,background:prevProg.color,color:"#fff",padding:"5px",borderRadius:6,fontSize:10.5,fontWeight:600 }}>Continue →</button>
                    <button className="dc-ghost" onClick={()=>setPreviewId(null)} style={{ background:T.bd,color:T.txM,padding:"5px 7px",borderRadius:6,fontSize:10.5 }}>✕</button>
                  </div>
                </div>
              )}
              {programsList.map(p=>(
                <div key={p.id} className="dc-prog" onClick={()=>setPreviewId(prev=>prev===p.id?null:p.id)}
                  style={{ margin:"0 7px 5px",background:progId===p.id?`${p.color}14`:T.card,border:`1.5px solid ${progId===p.id?p.color:T.bd}`,borderRadius:8,padding:"7px 9px", position:"relative" }}>
                  <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                    <div style={{ width:5,height:5,borderRadius:"50%",background:p.color,flexShrink:0 }}/>
                    <div style={{ flex:1,minWidth:0, paddingRight: 40 }}>
                      <div style={{ fontSize:11,fontWeight:500,color:T.tx,lineHeight:1.3 }}>{p.title}</div>
                      <div style={{ fontSize:9,color:T.txM,marginTop:1 }}>{p.instructor}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:5 }}>
                    <div style={{ flex:1,height:2,background:T.bd,borderRadius:1,overflow:"hidden",marginRight:7 }}><div style={{ height:"100%",background:p.color,width:`${((p.done||0)/(p.total||p.lessons?.length||1))*100}%` }}/></div>
                    <Pill label={p.status==="completed"?"✓ Done":p.status==="active"?"▶ Active":"Enrolled"} color={p.status==="completed"?B.olive:p.status==="active"?B.green:B.indigo}/>
                  </div>
                  <div style={{ position:"absolute", top:8, right:6, display:"flex", gap:4 }}>
                    {p.creator === profileData.personal.name && (
                      <button onClick={(e) => { e.stopPropagation(); setEditingProg(p); setShowCreateProgram(true); }} title="Edit Program"
                        style={{ background:"transparent", border:"none", color:T.txM, fontSize:13, cursor:"pointer", padding:"2px 4px", borderRadius:4, transition:"all 0.2s" }}
                        onMouseOver={e=>{e.currentTarget.style.background=B.indigoDim; e.currentTarget.style.color=B.indigo;}}
                        onMouseOut={e=>{e.currentTarget.style.background="transparent"; e.currentTarget.style.color=T.txM;}}>
                        ✏️
                      </button>
                    )}
                    <button onClick={(e) => deleteProgram(e, p.id)} title={p.creator === profileData.personal.name ? "Delete Program" : "Remove Program"} 
                      style={{ background:"transparent", border:"none", color:T.txM, fontSize:14, cursor:"pointer", padding:"2px 4px", borderRadius:4, transition:"all 0.2s" }} 
                      onMouseOver={e=>{e.currentTarget.style.background=B.raspDim; e.currentTarget.style.color=B.rasp;}} 
                      onMouseOut={e=>{e.currentTarget.style.background="transparent"; e.currentTarget.style.color=T.txM;}}>
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <main style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0 }}>
            {cur.type !== "pdf" && (
              <div style={{ background:"#000",flexShrink:0,borderBottom:`1px solid ${T.bd}` }}>
                <div style={{ aspectRatio:"16/9",width:"100%",maxHeight:"62vh",overflow:"hidden" }}>
                   {cur.vid ? <YouTubePlayer vid={cur.vid} onPlayerReady={(p) => ytPlayerRef.current = p} /> : null}
                </div>
              </div>
            )}
            
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderBottom:`1px solid ${T.bd}`,flexShrink:0,background:T.sf }}>
              <div>
                <div style={{ fontFamily:"'Numans',sans-serif",fontSize:13.5,color:T.tx,lineHeight:1.3 }}>{cur.title}</div>
                <div style={{ fontSize:10,color:T.txM,marginTop:2,display:"flex",gap:6,flexWrap:"wrap",alignItems:"center" }}>
                  <span style={{ fontFamily:"monospace" }}>Lesson {curIdx+1}/{lessons.length} · {cur.dur}</span>
                  {cur.tags?.slice(0,2).map(tg=><Pill key={tg} label={tg} color={B.green}/>)}
                </div>
              </div>
              <div style={{ display:"flex",gap:6, alignItems:"center" }}>
                {cur.type !== "pdf" && (
                   <button className="dc-pri" onClick={captureVideoNote} style={{ background:B.indigoDim, border:`1px solid ${B.indigoBd}`, color:B.indigo, padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
                      📸 Capture Note
                   </button>
                )}
                {curIdx>0&&<button className="dc-ghost" onClick={()=>selLesson(curIdx-1)} style={{ background:T.card,border:`1px solid ${T.bd}`,color:T.txD,padding:"4px 10px",borderRadius:6,fontSize:11 }}>← Prev</button>}
                {curIdx<lessons.length-1&&<button className="dc-pri" onClick={()=>selLesson(curIdx+1)} style={{ background:B.green,color:"#fff",padding:"4px 12px",borderRadius:6,fontSize:11,fontWeight:600 }}>Next →</button>}
              </div>
            </div>

            {cur.type === "pdf" ? (
              <CustomPdfRenderer url={cur.url} B={B} />
            ) : (
              <div style={{ flex:1,display:"flex",flexDirection:"column",padding:"7px 10px 10px",gap:6,overflow:"hidden",minHeight:0 }}>
                <div style={{ display:"flex",alignItems:"center",gap:6,flexShrink:0,flexWrap:"wrap" }}>
                  <span style={{ fontSize:9,color:T.txM,textTransform:"uppercase",letterSpacing:"0.09em",fontWeight:600 }}>Transcript</span>
                  <div style={{ flex:1 }}/>
                  {autoScroll&&<div style={{ width:36,height:3,background:T.bd,borderRadius:2,overflow:"hidden" }}><div style={{ width:`${scrollPct}%`,height:"100%",background:B.green,transition:"width 0.08s" }}/></div>}
                  <button className={`dc-ghost${autoScroll?" dc-scron":""}`} onClick={()=>setAutoScroll(v=>!v)} style={{ background:T.card,border:`1px solid ${T.bd}`,color:T.txM,padding:"3px 8px",borderRadius:5,fontSize:10.5,display:"flex",alignItems:"center",gap:3 }}>
                    {autoScroll?"⏸":"▶"} Auto-scroll
                  </button>
                  <select className="dc-inp" value={lang} onChange={e=>setLang(e.target.value)} style={{ width:"auto",padding:"3px 6px",background:T.inp,border:`1px solid ${T.bd}`,color:T.tx,fontSize:11,borderRadius:6 }}>
                    {LANGS.map(l=><option key={l}>{l}</option>)}
                  </select>
                  <button className="dc-pri" onClick={translate} disabled={translating} style={{ background:B.indigo,color:"#fff",padding:"3px 11px",borderRadius:5,fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:4,opacity:translating?.7:1 }}>
                    {translating?<><Spin size={10} color="#fff"/> Translating…</>:`🌐 → ${lang}`}
                  </button>
                  {showTrans&&<button className="dc-ghost" onClick={()=>setShowTrans(v=>!v)} style={{ background:T.card,border:`1px solid ${T.bd}`,color:T.txD,padding:"3px 8px",borderRadius:5,fontSize:10.5 }}>📄 Original</button>}
                </div>
                <div style={{ flex:1,display:"flex",gap:7,minHeight:0 }}>
                  <div ref={txRef} style={{ flex:1,background:T.card,border:`1px solid ${T.bd}`,borderRadius:9,padding:"11px 13px",overflowY:"auto",fontSize:12.5,lineHeight:1.85,color:showTrans?T.txM:T.tx,transition:"color 0.25s" }}>
                    {TRANSCRIPT.split("\n\n").map((p,i)=><p key={i} style={{ marginBottom:11 }}>{p}</p>)}
                  </div>
                  {showTrans&&(
                    <div ref={tlRef} style={{ flex:1,background:T.card,border:`1px solid ${B.indigoBd}`,borderRadius:9,padding:"11px 13px",overflowY:"auto",fontSize:12.5,lineHeight:1.85,color:T.tx,animation:"dc-up 0.3s ease" }}>
                      <div style={{ fontSize:9,color:B.indigo,textTransform:"uppercase",letterSpacing:"0.09em",fontWeight:600,marginBottom:8 }}>{lang} Translation</div>
                      {translation.split("\n\n").map((p,i)=><p key={i} style={{ marginBottom:11 }}>{p}</p>)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>

          <aside style={{ width:300,background:T.sf,borderLeft:`1px solid ${T.bd}`,display:"flex",flexDirection:"column",flexShrink:0 }}>
            <div style={{ display:"flex",borderBottom:`1px solid ${T.bd}`,flexShrink:0 }}>
              {["social","news","resources"].map(t=>(
                <button key={t} className={`dc-tab${rightTab===t?" on":""}`} onClick={()=>setRightTab(t)} style={{ flex:1,padding:"9px 0",color:rightTab===t?B.green:T.txM,fontSize:12,fontWeight:500,textTransform:"capitalize" }}>{t}</button>
              ))}
            </div>
            {rightTab==="social"&&<>
              <div style={{ display:"flex",borderBottom:`1px solid ${T.bd}`,flexShrink:0 }}>
                {[{id:"linkedin",lbl:"LinkedIn"},{id:"twitter",lbl:"X / Twitter"}].map(t=>(
                  <button key={t.id} className={`dc-tab${socTab===t.id?" on":""}`} onClick={()=>setSocTab(t.id)} style={{ flex:1,padding:"6px 0",color:socTab===t.id?B.green:T.txM,fontSize:10.5,fontWeight:500 }}>{t.lbl}</button>
                ))}
              </div>
              <div style={{ padding:"6px 9px",borderBottom:`1px solid ${T.bd}`,flexShrink:0 }}>
                <div style={{ display:"flex",gap:5 }}>
                  <input className="dc-inp" value={socSearch} onChange={e=>setSocSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&aiSocSearch()} placeholder="Search or ↵ for results…" style={{ flex:1,padding:"5px 8px",fontSize:10.5,background:T.inp,border:`1px solid ${T.bd}`,color:T.tx }}/>
                  {socSearch&&<button className="dc-pri" onClick={()=>aiSocSearch()} style={{ background:B.green,color:"#fff",padding:"5px 8px",borderRadius:6,fontSize:11,fontWeight:700,flexShrink:0 }}>↵</button>}
                </div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:3,marginTop:4 }}>
                  {cur.tags?.map(tg=>(
                    <div key={tg} onClick={()=>{setSocSearch(tg); aiSocSearch(tg);}} style={{cursor:"pointer", transition:"opacity 0.2s"}}>
                      <Pill label={tg} color={B.green}/>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex:1,overflowY:"auto",padding:8 }}>
                {loadSoc?[1,2].map(i=><SkelBox key={i} T={T}/>):filtSoc.length===0?<div style={{ textAlign:"center",color:T.txM,fontSize:12,paddingTop:24 }}>No posts found</div>
                :filtSoc.map((p,i)=>(
                  <div key={i} style={{ background:T.card,border:`1px solid ${T.bd}`,borderRadius:9,padding:"9px 11px",marginBottom:7,animation:"dc-up 0.28s ease" }}>
                    <div style={{ display:"flex",gap:7,marginBottom:6 }}>
                      <Av init={(p.author||p.name||"U").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()} color={[B.green,B.indigo,B.rasp][i%3]} size={29}/>
                      <div><div style={{ fontSize:11.5,fontWeight:500,color:T.tx }}>{p.author||p.name}</div><div style={{ fontSize:9.5,color:socTab==="twitter"?B.tw:T.txM }}>{p.title||p.handle} · {p.time}</div></div>
                    </div>
                    <div style={{ fontSize:11.5,color:T.txD,lineHeight:1.65,marginBottom:5 }}>{p.content}</div>
                    <div style={{ fontSize:9.5,color:T.txM,fontFamily:"monospace" }}>{socTab==="linkedin"?`👍 ${(p.likes||0).toLocaleString()} · 💬 ${p.comments}`:`♥ ${(p.likes||0).toLocaleString()} · 🔁 ${(p.retweets||0).toLocaleString()}`}</div>
                  </div>
                ))}
              </div>
            </>}
            {rightTab==="news"&&<>
              <div style={{ padding:"6px 9px",borderBottom:`1px solid ${T.bd}`,flexShrink:0 }}>
                <div style={{ display:"flex",gap:5 }}>
                  <input className="dc-inp" value={newsSearch} onChange={e=>setNewsSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&aiNewsSearch()} placeholder="Search news or ↵ for results…" style={{ flex:1,padding:"5px 8px",fontSize:10.5,background:T.inp,border:`1px solid ${T.bd}`,color:T.tx }}/>
                  {newsSearch&&<button className="dc-pri" onClick={()=>aiNewsSearch()} style={{ background:B.rasp,color:"#fff",padding:"5px 8px",borderRadius:6,fontSize:11,fontWeight:700,flexShrink:0 }}>↵</button>}
                </div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:3,marginTop:4 }}>
                  {cur.tags?.map(tg=>(
                    <div key={tg} onClick={()=>{setNewsSearch(tg); aiNewsSearch(tg);}} style={{cursor:"pointer", transition:"opacity 0.2s"}}>
                      <Pill label={tg} color={B.rasp}/>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex:1,overflowY:"auto",padding:8 }}>
                {loadNews?[1,2,3].map(i=><SkelBox key={i} T={T} lines={[80,55,100,70,45]}/>):filtNews.length===0?<div style={{ textAlign:"center",color:T.txM,fontSize:12,paddingTop:24 }}>No news found</div>
                :filtNews.map((n,i)=>(
                  <div key={i} style={{ background:T.card,border:`1px solid ${T.bd}`,borderRadius:9,padding:"9px 11px",marginBottom:7,animation:"dc-up 0.28s ease" }}>
                    <div style={{ display:"flex",gap:6,alignItems:"flex-start",marginBottom:5 }}>
                      <div style={{ flex:1,fontSize:12,fontWeight:500,color:T.tx,lineHeight:1.35 }}>{n.title}</div>
                      <Pill label={n.category} color={B.rasp}/>
                    </div>
                    <div style={{ fontSize:11,color:T.txD,lineHeight:1.6,marginBottom:5 }}>{n.summary}</div>
                    <div style={{ fontSize:9.5,color:T.txM,fontFamily:"monospace" }}>{n.source} · {n.time}</div>
                  </div>
                ))}
              </div>
            </>}
            {rightTab==="resources"&&<>
              <div style={{ padding:"12px 14px",borderBottom:`1px solid ${T.bd}`,flexShrink:0 }}>
                <div style={{ fontSize:13,fontWeight:600,color:T.tx }}>Lesson Resources</div>
                <div style={{ fontSize:10.5,color:T.txM,marginTop:2 }}>Reference files and links for this topic</div>
              </div>
              <div style={{ flex:1,overflowY:"auto",padding:12 }}>
                {cur.references && cur.references.length > 0 ? (
                  <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                    {cur.references.map(r => (
                      <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:T.card,border:`1px solid ${T.bd}`,borderRadius:8,textDecoration:"none",transition:"all 0.15s" }}>
                        <span style={{ fontSize:16 }}>{r.type==="pdf"?"📄":r.type==="video"?"▶️":"🔗"}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12,fontWeight:500,color:T.tx }}>{r.title}</div>
                          <div style={{ fontSize:9.5,color:B.li,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{r.url}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign:"center",color:T.txM,fontSize:12,paddingTop:24 }}>No resources available for this lesson</div>
                )}
              </div>
            </>}
          </aside>
        </div>

        {/* MARKETPLACE VIEW */}
        <div style={{ flex:1,display:view==="marketplace"?"flex":"none",flexDirection:"column",overflow:"hidden" }}>
          <div style={{ padding:"18px 26px 14px",background:T.sf,borderBottom:`1px solid ${T.bd}`,flexShrink:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:3 }}>
              <div>
                <div style={{ fontFamily:"'Marvel',sans-serif",fontSize:26,color:T.tx,marginBottom:3 }}>Discite Marketplace</div>
                <div style={{ fontSize:12.5,color:T.txD,marginBottom:12 }}>Computing · Courses · Software · Books · Study Materials — buy or rent</div>
              </div>
              <button onClick={()=>setShowCreateProgram(true)} style={{ background:B.green, color:"#fff", border:"none", borderRadius:8, padding:"8px 16px", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                <span>📚</span> Publish Program
              </button>
            </div>
            <div style={{ display:"flex",gap:8,maxWidth:680 }}>
              <input className="dc-inp" value={mktQ} onChange={e=>setMktQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&mktSearch()} placeholder="Search resources…" style={{ flex:1,padding:"11px 15px",fontSize:14,background:T.inp,border:`1px solid ${T.bd}`,color:T.tx,borderRadius:9 }}/>
              <button className="dc-pri" onClick={mktSearch} disabled={mktLoading} style={{ background:B.green,color:"#fff",padding:"11px 20px",borderRadius:9,fontSize:14,fontWeight:700,display:"flex",alignItems:"center",gap:7,flexShrink:0,opacity:mktLoading?.7:1 }}>
                {mktLoading?<><Spin size={14} color="#fff"/> Searching…</>:"🔍 Search"}
              </button>
            </div>
          </div>
          <div style={{ display:"flex",gap:6,padding:"9px 20px",borderBottom:`1px solid ${T.bd}`,flexShrink:0,overflowX:"auto",alignItems:"center" }}>
            {["All","Computing","Courses","Software","Books","Materials"].map(c=><button key={c} onClick={()=>setMktCat(c)} className={mktCat===c?"mkt-cat-on":""} style={{ background:T.card,border:`1px solid ${T.bd}`,color:T.txD,padding:"5px 13px",borderRadius:20,fontSize:11.5,fontWeight:mktCat===c?600:400,whiteSpace:"nowrap",cursor:"pointer",transition:"all 0.14s" }}>{c}</button>)}
            <div style={{ flex:1 }}/><span style={{ fontSize:10.5,color:T.txM,whiteSpace:"nowrap" }}>{filtMkt.length} items</span>
          </div>
          <div style={{ flex:1,overflowY:"auto",padding:"14px 18px" }}>
            {mktLoading?<div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:13 }}>{[1,2,3,4,5,6].map(i=><SkelBox key={i} T={T} lines={[60,40,100,80,55,70]}/>)}</div>:(
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:13 }}>
                {filtMkt.map((item,i)=>{const cc=B.green; return (
                  <div key={item.id||i} style={{ background:T.card,border:`1px solid ${T.bd}`,borderRadius:12,padding:"13px 14px",display:"flex",flexDirection:"column",gap:7,animation:"dc-up 0.28s ease" }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:7 }}><div style={{ fontSize:13.5,fontWeight:600,color:T.tx,lineHeight:1.3,flex:1 }}>{item.title}</div><Pill label={item.cat} color={cc}/></div>
                    <div style={{ fontSize:11.5,color:T.txD,lineHeight:1.65 }}>{item.desc}</div>
                    <div style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,color:T.txM }}><Stars r={item.rating}/><span>{item.rating}</span><span>({(item.reviews||0).toLocaleString()})</span>{item.badge&&<Pill label={item.badge} color={B.rasp}/>}</div>
                    <div style={{ fontSize:10.5,color:T.txM }}>by {item.seller}</div>
                    <div style={{ display:"flex",gap:6,marginTop:"auto",paddingTop:3 }}>
                      {item.seller === profileData.personal.name ? (
                        <>
                          <button className="dc-pri" onClick={() => {
                            const p = programsList.find(prog => prog.id === item.progId);
                            if (p) {
                                setEditingProg(p);
                                setShowCreateProgram(true);
                            }
                          }} style={{ flex:1,background:B.indigo,border:`1px solid ${B.indigoBd}`,color:"#fff",padding:"7px 8px",borderRadius:8,fontSize:12,fontWeight:600 }}>✏️ Edit</button>
                          <button className="dc-pri" onClick={(e) => deleteProgram(e, item.progId)} style={{ flex:1,background:B.rasp,border:`1px solid ${B.raspBd}`,color:"#fff",padding:"7px 8px",borderRadius:8,fontSize:12,fontWeight:600 }}>🗑 Delete</button>
                        </>
                      ) : (
                        <>
                          {item.price!=null&&<button className="dc-pri" style={{ flex:1,background:B.green,color:"#fff",padding:"7px 8px",borderRadius:8,fontSize:12,fontWeight:600 }}>Buy ₹{item.price.toLocaleString()}</button>}
                          {item.rent!=null&&<button className="dc-pri" style={{ flex:item.price==null?1:0,background:B.indigoDim,border:`1px solid ${B.indigoBd}`,color:B.indigo,padding:"7px 8px",borderRadius:8,fontSize:12,fontWeight:600,whiteSpace:"nowrap" }}>Rent ₹{item.rent}/mo</button>}
                        </>
                      )}
                    </div>
                  </div>
                );})}
              </div>
            )}
          </div>
        </div>

        {/* PROFILE VIEW */}
        <div style={{ flex:1,display:view==="profile"?"flex":"none",flexDirection:"column",overflow:"hidden" }}>
          
          <div style={{ background:`linear-gradient(135deg,${B.green}18 0%,${B.indigo}10 60%,${T.sf} 100%)`,borderBottom:`1px solid ${T.bd}`,padding:"18px 28px 14px",flexShrink:0 }}>
            <div style={{ display:"flex",alignItems:"center",gap:18 }}>
              <div style={{ position:"relative",flexShrink:0 }}>
                <svg width={76} height={76}>
                  <circle cx="38" cy="38" r={28} fill="none" stroke={T.bd} strokeWidth={6}/>
                  <circle cx="38" cy="38" r={28} fill="none" stroke={B.green} strokeWidth={6}
                    strokeDasharray={2*Math.PI*28} strokeDashoffset={(2*Math.PI*28)*(1-calcCompletion(profileData)/100)} strokeLinecap="round"
                    transform="rotate(-90 38 38)" style={{ transition:"stroke-dashoffset 0.7s ease" }}/>
                  <text x="38" y="34" textAnchor="middle" fill={B.green} fontSize="13" fontWeight="700" fontFamily="Marvel,sans-serif">{calcCompletion(profileData)}%</text>
                  <text x="38" y="47" textAnchor="middle" fill={T.txM} fontSize="8" fontFamily="Roboto,sans-serif">complete</text>
                </svg>
                <div style={{ position:"absolute",top:-4,left:-4,width:84,height:84,borderRadius:"50%",background:`${B.green}12`,border:`2px solid ${B.greenBd}`,display:"flex",alignItems:"center",justifyContent:"center",zIndex:-1 }}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Marvel',sans-serif",fontSize:24,color:T.tx,lineHeight:1.2 }}>{profileData.personal.name||"Your Name"}</div>
                <div style={{ fontSize:13,color:B.green,fontWeight:500,marginTop:2 }}>{profileData.personal.title||"Your Title"}</div>
                <div style={{ fontSize:11,color:T.txM,marginTop:4,display:"flex",gap:10,flexWrap:"wrap" }}>
                  {profileData.personal.location&&<span>📍 {profileData.personal.location}</span>}
                  {profileData.personal.email&&<span>✉ {profileData.personal.email}</span>}
                  {profileData.personal.phone&&<span>📞 {profileData.personal.phone}</span>}
                </div>
              </div>
              <div style={{ display:"flex",gap:9,flexShrink:0,flexWrap:"wrap" }}>
                {[{v:LESSONS.filter(l=>l.done).length,l:"Certs"},{v:profileData.projects.length,l:"Projects"},{v:profileData.skills.technical.length,l:"Skills"},{v:profileData.experience.length,l:"Jobs"}].map(s=>(
                  <div key={s.l} style={{ background:`${B.green}14`,border:`1px solid ${B.greenBd}`,borderRadius:9,padding:"7px 12px",textAlign:"center",minWidth:50 }}>
                    <div style={{ fontFamily:"'Marvel',sans-serif",fontSize:20,color:B.green,lineHeight:1 }}>{s.v}</div>
                    <div style={{ fontSize:9,color:T.txM,textTransform:"uppercase",letterSpacing:"0.07em",marginTop:2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display:"flex",borderBottom:`1px solid ${T.bd}`,padding:"0 28px",background:T.sf,flexShrink:0 }}>
            {[{id:"profile",label:"👤 My Profile Builder"},{id:"resume",label:"✦ AI Resume Generator"}].map(t=>(
              <button key={t.id} className={`dc-tab${profTab===t.id?" on":""}`} onClick={()=>setProfTab(t.id)}
                style={{ padding:"9px 18px",color:profTab===t.id?B.green:T.txM,fontSize:13,fontWeight:500 }}>{t.label}</button>
            ))}
          </div>

          {profTab === "profile" && (
             <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
               <div style={{ width: 220, borderRight: `1px solid ${T.bd}`, padding: "16px 12px", display: 'flex', flexDirection: 'column', gap: 6, background:T.sf, overflowY:"auto" }}>
                 {[
                   {id:"personal", lbl:"Personal Info", ic:"👤"},
                   {id:"social", lbl:"Social Links", ic:"🔗"},
                   {id:"education", lbl:"Education", ic:"🎓"},
                   {id:"experience", lbl:"Experience", ic:"💼"},
                   {id:"projects", lbl:"Projects", ic:"🛠️"},
                   {id:"skills", lbl:"Skills", ic:"⚡"}
                 ].map(sec => (
                     <div key={sec.id} className={`prof-nav ${profSubView===sec.id?'on':''}`} onClick={()=>{setProfSubView(sec.id); setEditingProfile(false);}}>
                        <span style={{fontSize:16}}>{sec.ic}</span> {sec.lbl}
                     </div>
                 ))}
               </div>
               <div style={{ flex: 1, padding: "24px 32px", overflowY: 'auto' }}>
                  <div style={{ maxWidth: 700, margin: "0 auto" }}>
                     <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 20 }}>
                       <div style={{ fontSize: 20, fontFamily:"'Numans',sans-serif", color:T.tx, textTransform:"capitalize" }}>{profSubView}</div>
                       {!editingProfile ? (
                          <button onClick={startEdit} style={{background:T.card,border:`1px solid ${T.bd}`,padding:"6px 16px",borderRadius:8,fontSize:12,fontWeight:600,color:T.txD,cursor:"pointer"}}>✏️ Edit Section</button>
                       ) : (
                          <div style={{display:"flex", gap:8}}>
                            <button onClick={cancelEdit} style={{background:T.sf,border:`1px solid ${T.bd}`,padding:"6px 14px",borderRadius:8,fontSize:12,color:T.txM,cursor:"pointer"}}>Cancel</button>
                            <button onClick={saveProfile} style={{background:B.green,color:"#fff",padding:"6px 16px",borderRadius:8,fontSize:12,fontWeight:600,border:"none",cursor:"pointer"}}>Save Changes</button>
                          </div>
                       )}
                     </div>

                     <div style={{ background:T.card, border:`1px solid ${editingProfile ? B.green : T.bd}`, borderRadius: 12, padding: "20px 24px", transition:"border-color 0.2s" }}>
                        {profSubView === "personal" && (
                           editingProfile ? (
                             <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                               <input value={editDraft.personal.name||""} onChange={e=>updateDraft("personal","name",e.target.value)} placeholder="Full Name" className="prof-field"/>
                               <input value={editDraft.personal.title||""} onChange={e=>updateDraft("personal","title",e.target.value)} placeholder="Professional Title" className="prof-field"/>
                               <div style={{display:"flex",gap:12}}>
                                 <input value={editDraft.personal.email||""} onChange={e=>updateDraft("personal","email",e.target.value)} placeholder="Email" className="prof-field"/>
                                 <input value={editDraft.personal.phone||""} onChange={e=>updateDraft("personal","phone",e.target.value)} placeholder="Phone" className="prof-field"/>
                               </div>
                               <input value={editDraft.personal.location||""} onChange={e=>updateDraft("personal","location",e.target.value)} placeholder="Location" className="prof-field"/>
                               <textarea value={editDraft.personal.about||""} onChange={e=>updateDraft("personal","about",e.target.value)} placeholder="Summary / About Me" className="prof-field" style={{minHeight:100, resize:"vertical"}}/>
                             </div>
                           ) : (
                             <div style={{display:"flex", flexDirection:"column", gap:10}}>
                               <div style={{fontSize:18, fontWeight:600, color:T.tx}}>{profileData.personal.name}</div>
                               <div style={{fontSize:14, color:B.green}}>{profileData.personal.title}</div>
                               <div style={{fontSize:12, color:T.txM}}>{profileData.personal.email} | {profileData.personal.phone} | {profileData.personal.location}</div>
                               <div style={{fontSize:13, color:T.txD, lineHeight:1.7, marginTop:10, borderLeft:`2px solid ${T.bd}`, paddingLeft:12}}>{profileData.personal.about}</div>
                             </div>
                           )
                        )}

                        {profSubView === "social" && (
                           editingProfile ? (
                             <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                               <input value={editDraft.social.linkedin||""} onChange={e=>updateDraft("social","linkedin",e.target.value)} placeholder="LinkedIn URL" className="prof-field"/>
                               <input value={editDraft.social.github||""} onChange={e=>updateDraft("social","github",e.target.value)} placeholder="GitHub URL" className="prof-field"/>
                               <input value={editDraft.social.twitter||""} onChange={e=>updateDraft("social","twitter",e.target.value)} placeholder="Twitter/X URL" className="prof-field"/>
                               <input value={editDraft.social.portfolio||""} onChange={e=>updateDraft("social","portfolio",e.target.value)} placeholder="Portfolio Website" className="prof-field"/>
                             </div>
                           ) : (
                             <div style={{display:"flex", flexDirection:"column", gap:12}}>
                               {profileData.social.linkedin && <div style={{fontSize:13, color:B.li}}>🔗 {profileData.social.linkedin}</div>}
                               {profileData.social.github && <div style={{fontSize:13, color:T.tx}}>⎇ {profileData.social.github}</div>}
                               {profileData.social.twitter && <div style={{fontSize:13, color:B.tw}}>𝕏 {profileData.social.twitter}</div>}
                               {profileData.social.portfolio && <div style={{fontSize:13, color:B.indigo}}>🌐 {profileData.social.portfolio}</div>}
                             </div>
                           )
                        )}

                        {["education", "experience", "projects"].includes(profSubView) && (
                           editingProfile ? (
                             <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
                               {editDraft[profSubView].map((item, idx) => (
                                  <div key={item.id} style={{ position:"relative", padding:16, border:`1px solid ${T.bd}`, borderRadius:8, background:T.sf }}>
                                    <button onClick={()=>removeArrayItem(profSubView, idx)} style={{ position:"absolute", top:8, right:8, color:B.rasp, fontSize:18, cursor:"pointer" }}>×</button>
                                    
                                    {profSubView === "education" && (
                                       <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                                         <input value={item.degree||""} onChange={e=>updateArrayDraft("education",idx,"degree",e.target.value)} placeholder="Degree" className="prof-field" style={{marginBottom:0}}/>
                                         <input value={item.institution||""} onChange={e=>updateArrayDraft("education",idx,"institution",e.target.value)} placeholder="Institution" className="prof-field" style={{marginBottom:0}}/>
                                         <div style={{display:"flex",gap:10}}>
                                            <input value={item.year||""} onChange={e=>updateArrayDraft("education",idx,"year",e.target.value)} placeholder="Year (e.g. 2021-2025)" className="prof-field" style={{marginBottom:0}}/>
                                            <input value={item.grade||""} onChange={e=>updateArrayDraft("education",idx,"grade",e.target.value)} placeholder="Grade/CGPA" className="prof-field" style={{marginBottom:0}}/>
                                         </div>
                                       </div>
                                    )}

                                    {profSubView === "experience" && (
                                       <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                                         <input value={item.role||""} onChange={e=>updateArrayDraft("experience",idx,"role",e.target.value)} placeholder="Role / Title" className="prof-field" style={{marginBottom:0}}/>
                                         <input value={item.company||""} onChange={e=>updateArrayDraft("experience",idx,"company",e.target.value)} placeholder="Company" className="prof-field" style={{marginBottom:0}}/>
                                         <div style={{display:"flex",gap:10}}>
                                            <input value={item.duration||""} onChange={e=>updateArrayDraft("experience",idx,"duration",e.target.value)} placeholder="Duration" className="prof-field" style={{marginBottom:0}}/>
                                            <input value={item.location||""} onChange={e=>updateArrayDraft("experience",idx,"location",e.target.value)} placeholder="Location" className="prof-field" style={{marginBottom:0}}/>
                                         </div>
                                         <textarea value={item.desc||""} onChange={e=>updateArrayDraft("experience",idx,"desc",e.target.value)} placeholder="Description & Achievements" className="prof-field" style={{marginBottom:0, minHeight:60}}/>
                                       </div>
                                    )}

                                    {profSubView === "projects" && (
                                       <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                                         <input value={item.name||""} onChange={e=>updateArrayDraft("projects",idx,"name",e.target.value)} placeholder="Project Name" className="prof-field" style={{marginBottom:0}}/>
                                         <input value={item.tech||""} onChange={e=>updateArrayDraft("projects",idx,"tech",e.target.value)} placeholder="Tech Stack (comma separated)" className="prof-field" style={{marginBottom:0}}/>
                                         <input value={item.link||""} onChange={e=>updateArrayDraft("projects",idx,"link",e.target.value)} placeholder="Project Link" className="prof-field" style={{marginBottom:0}}/>
                                         <textarea value={item.desc||""} onChange={e=>updateArrayDraft("projects",idx,"desc",e.target.value)} placeholder="Description" className="prof-field" style={{marginBottom:0, minHeight:60}}/>
                                       </div>
                                    )}
                                  </div>
                               ))}
                               <button onClick={()=>{
                                  if(profSubView==="education") addArrayItem("education", {degree:"", institution:"", year:"", grade:""});
                                  if(profSubView==="experience") addArrayItem("experience", {role:"", company:"", duration:"", location:"", desc:""});
                                  if(profSubView==="projects") addArrayItem("projects", {name:"", tech:"", desc:"", link:""});
                               }} style={{ background:`${B.green}18`, color:B.green, padding:"10px", borderRadius:8, fontSize:13, fontWeight:600, border:`1px dashed ${B.greenBd}`, cursor:"pointer" }}>
                                 + Add New Entry
                               </button>
                             </div>
                           ) : (
                             <div style={{display:"flex", flexDirection:"column", gap:20}}>
                               {profileData[profSubView].length === 0 && <div style={{fontSize:13, color:T.txM, fontStyle:"italic"}}>No entries added yet.</div>}
                               
                               {profSubView === "education" && profileData.education.map(e => (
                                 <div key={e.id} style={{borderLeft:`2px solid ${T.bd}`, paddingLeft:16}}>
                                   <div style={{fontSize:15, fontWeight:600, color:T.tx}}>{e.degree}</div>
                                   <div style={{fontSize:13, color:T.txD, marginTop:2}}>{e.institution}</div>
                                   <div style={{fontSize:12, color:T.txM, marginTop:4}}>{e.year} • {e.grade}</div>
                                 </div>
                               ))}

                               {profSubView === "experience" && profileData.experience.map(e => (
                                 <div key={e.id} style={{borderLeft:`2px solid ${T.bd}`, paddingLeft:16}}>
                                   <div style={{fontSize:15, fontWeight:600, color:T.tx}}>{e.role}</div>
                                   <div style={{fontSize:13, color:B.indigo, marginTop:2, fontWeight:500}}>{e.company}</div>
                                   <div style={{fontSize:12, color:T.txM, marginTop:4}}>{e.duration} • {e.location}</div>
                                   <div style={{fontSize:13, color:T.txD, marginTop:8, lineHeight:1.6}}>{e.desc}</div>
                                 </div>
                               ))}

                               {profSubView === "projects" && profileData.projects.map(p => (
                                 <div key={p.id} style={{borderLeft:`2px solid ${T.bd}`, paddingLeft:16}}>
                                   <div style={{fontSize:15, fontWeight:600, color:T.tx}}>{p.name}</div>
                                   <div style={{fontSize:12, color:B.rasp, marginTop:4, fontWeight:500}}>{p.tech}</div>
                                   <div style={{fontSize:13, color:T.txD, marginTop:8, lineHeight:1.6}}>{p.desc}</div>
                                   {p.link && <div style={{fontSize:12, color:B.li, marginTop:6}}>🔗 {p.link}</div>}
                                 </div>
                               ))}
                             </div>
                           )
                        )}

                        {profSubView === "skills" && (
                           editingProfile ? (
                             <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
                               <div>
                                 <div style={{fontSize:12, color:T.txD, marginBottom:6, fontWeight:500}}>Technical Skills (Comma separated)</div>
                                 <textarea value={(editDraft.skills.technical||[]).join(", ")} onChange={e=>updateDraft("skills","technical",e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} className="prof-field" style={{minHeight:80}}/>
                               </div>
                               <div>
                                 <div style={{fontSize:12, color:T.txD, marginBottom:6, fontWeight:500}}>Soft Skills (Comma separated)</div>
                                 <textarea value={(editDraft.skills.soft||[]).join(", ")} onChange={e=>updateDraft("skills","soft",e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} className="prof-field" style={{minHeight:80}}/>
                               </div>
                             </div>
                           ) : (
                             <div style={{display:"flex", flexDirection:"column", gap:20}}>
                               <div>
                                 <div style={{fontSize:11, color:T.txM, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10, fontWeight:600}}>Technical</div>
                                 <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                                   {profileData.skills.technical.map(s => <span key={s} style={{background:T.sf, border:`1px solid ${T.bd}`, padding:"6px 12px", borderRadius:6, fontSize:13, color:T.tx}}>{s}</span>)}
                                 </div>
                               </div>
                               <div>
                                 <div style={{fontSize:11, color:T.txM, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10, fontWeight:600}}>Soft Skills</div>
                                 <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                                   {profileData.skills.soft.map(s => <span key={s} style={{background:`${B.olive}18`, border:`1px solid ${B.oliveBd}`, color:B.olive, padding:"6px 12px", borderRadius:6, fontSize:13, fontWeight:500}}>{s}</span>)}
                                 </div>
                               </div>
                             </div>
                           )
                        )}
                     </div>
                  </div>
               </div>
             </div>
          )}
          
          {profTab === "resume" && (
             <div style={{ flex:1, padding: "24px 32px", overflowY: 'auto' }}>
               <div style={{ maxWidth:860, margin:"0 auto" }}>
                <div style={{ background:T.card,border:`1px solid ${T.bd}`,borderRadius:12,padding:"24px",marginBottom:20 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:10 }}>
                     <Logo size={28}/>
                     <div style={{ fontFamily:"'Numans',sans-serif",fontSize:18,color:T.tx }}>Mock Resume Generator</div>
                  </div>
                  <div style={{ fontSize:13,color:T.txD,marginBottom:20,lineHeight:1.65 }}>
                    Type your target role below. Our AI will automatically analyze your profile segments (Experience, Projects, Skills) and generate an ATS-optimized, single-column resume draft. 
                  </div>
                  <div style={{ display:"flex",gap:12 }}>
                    <input className="dc-inp" value={rrole} onChange={e=>{ setRrole(e.target.value); setSuggestDone(false); }} onKeyDown={e=>e.key==="Enter"&&handleAiSuggest()}
                      placeholder="e.g. Junior React Developer…"
                      style={{ flex:1,padding:"12px 16px",fontSize:14,background:T.inp,border:`1px solid ${T.bd}`,color:T.tx,borderRadius:8 }}/>
                    <button className="dc-pri" onClick={handleAiSuggest} disabled={aiSuggesting||!rrole.trim()}
                      style={{ background:B.indigo,color:"#fff",padding:"12px 24px",borderRadius:8,fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:8,flexShrink:0,opacity:(aiSuggesting||!rrole.trim())?.6:1 }}>
                      {aiSuggesting?<><Spin size={14} color="#fff"/> Analysing…</>:"✦ AI Suggest"}
                    </button>
                    <button className="dc-pri" onClick={genResume} disabled={rloading||!rrole.trim()}
                      style={{ background:B.green,color:"#fff",padding:"12px 24px",borderRadius:8,fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:8,flexShrink:0,opacity:(rloading||!rrole.trim())?.6:1 }}>
                      {rloading?<><Spin size={14} color="#fff"/> Generating…</>:"↗ Generate"}
                    </button>
                  </div>
                </div>

                {/* Pre-Selection Fields (Sections & Items) */}
                <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:20, animation:"dc-up 0.25s ease" }}>
                   <div style={{ background:T.card,border:`1px solid ${T.bd}`,borderRadius:12,padding:"16px 20px" }}>
                     <div style={{ fontSize:11,color:T.txM,textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:600,marginBottom:12 }}>1. Include Profile Sections</div>
                     <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
                       {["personal", "social", "education", "experience", "projects", "skills"].map(sec => (
                         <label key={sec} style={{ display:"flex",alignItems:"center",gap:6,cursor:"pointer", background:profSections[sec]?B.greenDim:T.sf, border:`1px solid ${profSections[sec]?B.green:T.bd}`, padding:"8px 12px", borderRadius:6, transition:"all 0.15s" }}>
                           <input type="checkbox" checked={profSections[sec]||false} onChange={e=>setProfSections(p=>({...p,[sec]:e.target.checked}))} style={{accentColor:B.green}}/>
                           <span style={{fontSize:13, color:profSections[sec]?B.green:T.txD, textTransform:"capitalize", fontWeight:500}}>{sec}</span>
                         </label>
                       ))}
                     </div>
                   </div>

                   {(profSections.experience || profSections.projects || profSections.skills) && (
                     <div style={{ background:T.card,border:`1px solid ${T.bd}`,borderRadius:12,padding:"16px 20px" }}>
                       <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                         <div style={{ fontSize:11,color:T.txM,textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:600 }}>2. Select Specific Details</div>
                         {suggestDone && <Pill label="✨ AI Pre-Selected" color={B.indigo} />}
                       </div>
                       
                       {profSections.experience && profileData.experience.length > 0 && (
                         <div style={{ marginBottom:16 }}>
                           <div style={{ fontSize:13, fontWeight:600, color:T.tx, marginBottom:10 }}>💼 Experience</div>
                           <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                             {profileData.experience.map(e => (
                               <label key={e.id} style={{ display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer", background:itemSel.experience.includes(e.id)?B.indigoDim:T.sf, border:`1.5px solid ${itemSel.experience.includes(e.id)?B.indigo:T.bd}`, padding:"10px 14px", borderRadius:8, transition:"all 0.15s" }}>
                                 <input type="checkbox" checked={itemSel.experience.includes(e.id)} onChange={()=>toggleItem("experience", e.id)} style={{accentColor:B.indigo, marginTop:3}}/>
                                 <div>
                                    <div style={{fontSize:14,fontWeight:600,color:itemSel.experience.includes(e.id)?B.indigo:T.tx}}>{e.role} at {e.company}</div>
                                    <div style={{fontSize:12,color:T.txM, marginTop:3}}>{e.desc}</div>
                                 </div>
                               </label>
                             ))}
                           </div>
                         </div>
                       )}

                       {profSections.projects && profileData.projects.length > 0 && (
                         <div style={{ marginBottom:16 }}>
                           <div style={{ fontSize:13, fontWeight:600, color:T.tx, marginBottom:10 }}>🛠️ Projects</div>
                           <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                             {profileData.projects.map(p => (
                               <label key={p.id} style={{ display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer", background:itemSel.projects.includes(p.id)?B.raspDim:T.sf, border:`1.5px solid ${itemSel.projects.includes(p.id)?B.rasp:T.bd}`, padding:"10px 14px", borderRadius:8, transition:"all 0.15s" }}>
                                 <input type="checkbox" checked={itemSel.projects.includes(p.id)} onChange={()=>toggleItem("projects", p.id)} style={{accentColor:B.rasp, marginTop:3}}/>
                                 <div>
                                    <div style={{fontSize:14,fontWeight:600,color:itemSel.projects.includes(p.id)?B.rasp:T.tx}}>{p.name}</div>
                                    <div style={{fontSize:12,color:T.txM, marginTop:3}}>{p.tech}</div>
                                 </div>
                               </label>
                             ))}
                           </div>
                         </div>
                       )}

                       {profSections.skills && profileData.skills.technical.length > 0 && (
                         <div>
                           <div style={{ fontSize:13, fontWeight:600, color:T.tx, marginBottom:10 }}>⚡ Skills</div>
                           <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
                             {profileData.skills.technical.map(s => (
                               <label key={s} style={{ display:"flex",alignItems:"center",gap:6,cursor:"pointer", background:itemSel.skills.includes(s)?B.oliveDim:T.sf, border:`1.5px solid ${itemSel.skills.includes(s)?B.olive:T.bd}`, padding:"6px 12px", borderRadius:6, transition:"all 0.15s" }}>
                                 <input type="checkbox" checked={itemSel.skills.includes(s)} onChange={()=>toggleItem("skills", s)} style={{accentColor:B.olive}}/>
                                 <span style={{fontSize:13,color:itemSel.skills.includes(s)?B.olive:T.tx, fontWeight:500}}>{s}</span>
                               </label>
                             ))}
                           </div>
                         </div>
                       )}
                     </div>
                   )}
                </div>

                {showResume && (
                  <div style={{ background:T.card,border:`1px solid ${B.greenBd}`,borderRadius:12,overflow:"hidden",animation:"dc-up 0.35s ease" }}>
                    <div style={{ padding:"12px 20px",borderBottom:`1px solid ${T.bd}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:T.sf }}>
                      <div style={{ display:"flex",alignItems:"center",gap:9 }}>
                        <span style={{ fontSize:12,color:B.green,fontWeight:600 }}>✦ Draft Generated for: {rrole}</span>
                      </div>
                      <div style={{ display:"flex",gap:7 }}>
                        <button className="dc-ghost" onClick={genResume} style={{ background:T.card,border:`1px solid ${T.bd}`,color:T.txD,padding:"6px 14px",borderRadius:6,fontSize:12,fontWeight:500 }}>↺ Regenerate</button>
                      </div>
                    </div>
                    <textarea value={rtext} onChange={e=>setRtext(e.target.value)} style={{ width:"100%",minHeight:450,border:"none",padding:"30px 40px",fontSize:13,lineHeight:1.85,background:"#fff",color:"#111",fontFamily:"'Roboto Mono','Courier New',monospace",resize:"vertical", outline:"none" }}/>
                  </div>
                )}
               </div>
             </div>
          )}
        </div>

        {/* Global Floating Action Button for Compose Modal */}
        <button className="dc-fab" onClick={()=>setShowCompose(true)} title="Create a social or group post"
          style={{ position:"fixed",bottom:30,right:30,zIndex:100,width:56,height:56,borderRadius:"50%",background:`linear-gradient(135deg,${B.green},${B.greenDk})`,border:`2px solid ${B.greenBd}`,color:"#fff",fontSize:24,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
          ✏️
        </button>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("Crash:", error, info); }
  render() {
    if (this.state.hasError) {
      return <div style={{padding:40, background:"#080D18", color:"#ff6b6b", height:"100vh", fontFamily:"sans-serif", boxSizing:"border-box"}}>
        <h2>React Component Crash Prevented</h2>
        <pre style={{background:"#111", padding:20, borderRadius:8, overflowX:"auto"}}>{this.state.error?.toString()}</pre>
        <button onClick={()=>window.location.reload()} style={{padding:"10px 20px", background:"#2FA478", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", marginTop:20}}>Reload Application</button>
      </div>;
    }
    return this.props.children;
  }
}

export default function AppWrapper() {
  return <ErrorBoundary><Discite /></ErrorBoundary>;
}