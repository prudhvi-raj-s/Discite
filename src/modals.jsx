import React, { useState } from "react";
import { Logo, Av } from "./ui";
import { B } from "./theme";

export function ComposeModal({ T, groupsList, onClose, onPostToGroup }) {
  const [platform,setPlatform]=useState("twitter");
  const [selectedGroup, setSelectedGroup] = useState(groupsList[0]?.id);
  const [postText,setPostText]=useState("");
  const [enhancing,setEnhancing]=useState(false);
  const [posted,setPosted]=useState(false);
  const [enhanceType, setEnhanceType] = useState("polish");

  const twMax=280; const grpMax=1500;
  const charLimit=platform==="twitter"?twMax:grpMax;
  const charsLeft=charLimit-postText.length;
  const overLimit=charsLeft<0;

  const PLATFORMS=[
    {id:"twitter",label:"Twitter/X",color:B.tw,icon:"𝕏"},
    {id:"linkedin",label:"LinkedIn",color:B.li,icon:"in"},
    {id:"group",label:"Group",color:B.indigo,icon:"👥"},
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
                  style={{ flex:1,padding:"8px 10px",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.15s",border:`1.5px solid ${platform===p.id?p.color:T.bd}`,background:platform===p.id?`${p.color}18`:"transparent",color:platform===p.id?p.color:T.txM,display:"flex",alignItems:"center",justifyContent:"center",gap:p.id === 'linkedin' ? 6 : 8 }}>
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
              placeholder={platform==="twitter"?"What's happening? (280 chars)":platform==="linkedin"?"Share a professional update...":platform==="group"?"Ask a question or share an insight with the cohort...":"Share an update..."}
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
              style={{ padding:"8px 22px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",transition:"all 0.15s",background:posted?B.green:(platform==="twitter"?B.tw:platform==="linkedin"?B.li:B.indigo),color:"#fff",opacity:(!postText.trim()||overLimit)?0.5:1,display:"flex",alignItems:"center",gap:6 }}>
              {posted?"✓ Posted!":(platform==="twitter"?"Post to Twitter/X":platform==="linkedin"?"Post to LinkedIn":"Post to Group")}
            </button>
          </div>
        </div>
        <div style={{ padding:"8px 18px",borderTop:`1px solid ${T.bd}`,background:T.card,fontSize:10.5,color:T.txM }}>💡 Tip: Use the <b>AI Enhancement</b> tools to rewrite, expand, or add a catchy hook to your draft instantly.</div>
      </div>
    </div>
  );
}

export function CreateGroupModal({ T, onClose, onCreateGroup }) {
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

export function CreateProgramModal({ T, onClose, onSaveProgram, initialData, currentUser }) {
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

  function handleSave() {
    if(!title.trim()) return;
    const newId = initialData?.id || Date.now();
    
    const mockLessons = topics.filter(t => t.title.trim()).map((t, idx) => {
      const isPdf = t.type === "pdf";
      let vidId = "";
      
      if (!isPdf && t.url) {
         const vMatch = t.url.match(/[?&]v=([^&]+)/)?.[1] || t.url.match(/youtu\.be\/([^?]+)/)?.[1];
         vidId = vMatch || t.url || "rfscVS0vtbw";
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
                  <input value={t.url} onChange={e=>updateTopic(t.id, 'url', e.target.value)} placeholder={t.type === "video" ? "YouTube Video URL (Optional)" : "Google Drive PDF Link"} style={{ flex:1, padding:"8px 10px", background:T.inp, border:`1px solid ${T.bd}`, borderRadius:6, color:T.tx, fontSize:12, outline:"none" }}/>
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