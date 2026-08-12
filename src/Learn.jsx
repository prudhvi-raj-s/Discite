import React, { useState } from "react";
import { Spin, Pill, Av, SkelBox } from "./ui";
import { YouTubePlayer } from "./YouTubePlayer";
import { CustomPdfRenderer } from "./CustomPdfRenderer";
import { LANGS } from "./data";
import { useStore } from "./StoreContext";

export function Learn({
  T, B,
  plUrl, setPlUrl, loadPlaylist, plLoading, plStatus, loadLocalFiles,
  prog, lessons, curIdx, cur, prevProg, progId, setPreviewId,
  plUrl, setPlUrl, loadPlaylist, plLoading, plStatus, loadLocalFiles, 
  prog, lessons, curIdx, cur, prevProg, progId, setPreviewId, setDrawer, setSocialUrl,
  selLesson, enterProg, deleteProgram, setEditingProg, setShowCreateProgram,
  ytPlayerRef, captureVideoNote, captureNewsNote, annotateVideo, annotating,
  autoScroll, setAutoScroll, scrollPct, lang, setLang, translate, translating, showTrans, setShowTrans, translation,
  transcript, setTranscript,
  txRef, tlRef,
  rightTab, setRightTab, socSearch, setSocSearch, aiSocSearch, loadSoc, filtSoc,
  newsSearch, setNewsSearch, aiNewsSearch, loadNews, filtNews
}) {
  const { programsList, profileData } = useStore();
  const [socTab, setSocTab] = useState("twitter");
  const localFileInputRef = React.useRef(null);
  const localFolderInputRef = React.useRef(null);
  const handleLocalFileClick = () => {
    localFileInputRef.current.click();
  };
  const handleLocalFolderClick = () => {
    localFolderInputRef.current.click();
  };

  return (
    <div style={{ flex:1,display:"flex",overflow:"hidden" }}>
      <aside style={{ width:300,background:T.sf,borderRight:`1px solid ${T.bd}`,display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden" }}>
        <div style={{ padding:"9px 9px 7px",borderBottom:`1px solid ${T.bd}`,flexShrink:0 }}>
          <div style={{ fontFamily:"'Marvel',sans-serif",fontSize:15,color:T.tx,letterSpacing:"0.3px",marginBottom:6 }}>LearnStack</div>
          <div style={{ display:"flex",gap:4 }}>
            <input className="dc-inp" value={plUrl} onChange={e=>setPlUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&loadPlaylist()} placeholder="YouTube or PDF URL…"
              style={{ flex:1,padding:"5px 7px",fontSize:10,background:T.inp,border:`1px solid ${T.bd}`,color:T.tx,minWidth:0 }} disabled={plLoading} />
            <button className="dc-pri" onClick={loadPlaylist} disabled={plLoading} style={{ background:B.green,color:"#fff",padding:"5px 8px",borderRadius:6,fontSize:11,fontWeight:700,flexShrink:0,opacity:plLoading?0.6:1 }}>
              {plLoading ? <Spin size={11} color="#fff"/> : "🔗"}
            </button>
            <button className="dc-pri" onClick={handleLocalFileClick} disabled={plLoading} title="Import Local Video Files" style={{ background:B.indigo,color:"#fff",padding:"5px 8px",borderRadius:6,fontSize:11,fontWeight:700,flexShrink:0,opacity:plLoading?0.6:1 }}>
              {plLoading ? <Spin size={11} color="#fff"/> : "📄"}
            </button>
            <button className="dc-pri" onClick={handleLocalFolderClick} disabled={plLoading} title="Import Local Video Folder" style={{ background:B.indigo,color:"#fff",padding:"5px 8px",borderRadius:6,fontSize:11,fontWeight:700,flexShrink:0,opacity:plLoading?0.6:1 }}>
              {plLoading ? <Spin size={11} color="#fff"/> : "📁"}
            </button>
          </div>
          <input type="file" ref={localFileInputRef} onChange={loadLocalFiles} multiple accept="video/*" style={{ visibility: 'hidden', position: 'absolute', left: '-9999px' }} />
          <input type="file" ref={localFolderInputRef} onChange={loadLocalFiles} multiple webkitdirectory directory style={{ visibility: 'hidden', position: 'absolute', left: '-9999px' }} />
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
               <>
                 <button className="dc-pri" onClick={annotateVideo} disabled={annotating} style={{ background:B.indigo, color:"#fff", padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:600, display:"flex", alignItems:"center", gap:4, opacity:annotating?0.6:1 }}>
                    {annotating ? <Spin size={10} color="#fff"/> : "✨ AI Annotate"}
                 </button>
                 <button className="dc-pri" onClick={captureVideoNote} style={{ background:B.indigoDim, border:`1px solid ${B.indigoBd}`, color:B.indigo, padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
                    📸 Capture Note
                 </button>
               </>
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
                {transcript ? transcript.split("\n\n").map((p,i)=><p key={i} style={{ marginBottom:11 }}>{p}</p>) : <div style={{color:T.txM, fontSize:12, fontStyle:"italic", paddingTop: 20, textAlign: "center"}}>No transcript available for this video.</div>}
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
          <div style={{ display:"flex",borderBottom:`1px solid ${T.bd}`,flexShrink:0,background:T.card }}>
            <button onClick={() => setSocTab("twitter")} style={{ flex:1, padding:"8px 0", fontSize:11, fontWeight:600, color:socTab==="twitter"?B.tw:T.txM, borderBottom:socTab==="twitter"?`2px solid ${B.tw}`:"2px solid transparent", background:"none", cursor:"pointer", transition:"all 0.15s" }}>𝕏 / Twitter Feed</button>
            <button onClick={() => setSocTab("linkedin")} style={{ flex:1, padding:"8px 0", fontSize:11, fontWeight:600, color:socTab==="linkedin"?"#0A66C2":T.txM, borderBottom:socTab==="linkedin"?`2px solid #0A66C2`:"2px solid transparent", background:"none", cursor:"pointer", transition:"all 0.15s" }}>LinkedIn</button>
            <button onClick={() => { setSocialUrl({ platform: 'Twitter', url: 'https://twitter.com' }); setDrawer('social'); }} style={{ flex:1, padding:"8px 0", fontSize:11, fontWeight:600, color:B.tw, borderBottom:`2px solid transparent`, background:"none", cursor:"pointer", transition:"all 0.15s" }}>
              𝕏 / Twitter
            </button>
            <button onClick={() => { setSocialUrl({ platform: 'LinkedIn', url: 'https://linkedin.com' }); setDrawer('social'); }} style={{ flex:1, padding:"8px 0", fontSize:11, fontWeight:600, color:"#0A66C2", borderBottom:`2px solid transparent`, background:"none", cursor:"pointer", transition:"all 0.15s" }}>
              LinkedIn
            </button>
          </div>
          {socTab === "twitter" ? (
            <>
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
          <div style={{ padding:"6px 9px",borderBottom:`1px solid ${T.bd}`,flexShrink:0 }}>
            <div style={{ display:"flex",gap:5 }}>
              <input className="dc-inp" value={socSearch} onChange={e=>setSocSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&aiSocSearch()} placeholder="Search X/Twitter or ↵ for results…" style={{ flex:1,padding:"5px 8px",fontSize:10.5,background:T.inp,border:`1px solid ${T.bd}`,color:T.tx }}/>
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
                   <Av init={(p.name||"U").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()} color={[B.green,B.indigo,B.rasp][i%3]} size={29}/>
                   <div><div style={{ fontSize:11.5,fontWeight:500,color:T.tx }}>{p.name||"X User"}</div><div style={{ fontSize:9.5,color:B.tw }}>{p.handle} · {p.time}</div></div>
                 </div>
                 <div style={{ fontSize:11.5,color:T.txD,lineHeight:1.65,marginBottom:5 }}>{p.content}</div>
                 <div style={{ fontSize:9.5,color:T.txM,fontFamily:"monospace" }}>♥ {(p.likes||0).toLocaleString()} · 🔁 {(p.retweets||0).toLocaleString()}</div>
               </div>
              <div style={{ flex:1,overflowY:"auto",padding:8 }}>
                {loadSoc?[1,2].map(i=><SkelBox key={i} T={T}/>):filtSoc.length===0?<div style={{ textAlign:"center",color:T.txM,fontSize:12,paddingTop:24 }}>No posts found</div>
                :filtSoc.map((p,i)=>(
                  <div key={i} style={{ background:T.card,border:`1px solid ${T.bd}`,borderRadius:9,padding:"9px 11px",marginBottom:7,animation:"dc-up 0.28s ease" }}>
                    <div style={{ display:"flex",gap:7,marginBottom:6 }}>
                      <Av init={(p.name||"U").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()} color={[B.green,B.indigo,B.rasp][i%3]} size={29}/>
                      <div><div style={{ fontSize:11.5,fontWeight:500,color:T.tx }}>{p.name||"X User"}</div><div style={{ fontSize:9.5,color:B.tw }}>{p.handle} · {p.time}</div></div>
                    </div>
                    <div style={{ fontSize:11.5,color:T.txD,lineHeight:1.65,marginBottom:5 }}>{p.content}</div>
                    <div style={{ fontSize:9.5,color:T.txM,fontFamily:"monospace" }}>♥ {(p.likes||0).toLocaleString()} · 🔁 {(p.retweets||0).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ flex:1,overflowY:"auto",padding:8, display:"flex", flexDirection:"column", gap:10 }}>
               <iframe src="https://www.linkedin.com/" target = "_blank" height="700" width="100%" frameBorder="0" allowFullScreen="" title="Embedded post" style={{borderRadius: 8, background: "#fff"}}></iframe>
               <div style={{textAlign:"center", fontSize:11, color:T.txM, padding:"10px 0"}}>Sign in to LinkedIn to view full feed and interact.</div>
            </div>
          )}
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
                  <a href={n.url} target="_blank" rel="noopener noreferrer" style={{ flex:1,fontSize:12,fontWeight:500,color:T.tx,lineHeight:1.35,textDecoration:"none" }} onMouseOver={e=>e.currentTarget.style.color=B.indigo} onMouseOut={e=>e.currentTarget.style.color=T.tx}>{n.title}</a>
                  <Pill label={n.category} color={B.rasp}/>
                </div>
                <div style={{ fontSize:11,color:T.txD,lineHeight:1.6,marginBottom:5 }}>{n.summary}</div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ fontSize:9.5,color:T.txM,fontFamily:"monospace" }}>{n.source} · {n.time}</div>
                  <button onClick={() => captureNewsNote(n)} style={{ background:"transparent", border:"none", color:B.indigo, fontSize:10.5, cursor:"pointer", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>📝 Take Note</button>
                </div>
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
  );
}