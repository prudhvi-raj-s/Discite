import React, { useState } from "react";
import { Logo, Spin, Pill } from "./ui";
import { LESSONS } from "./data";
import { useStore } from "./StoreContext";

export function Profile({ T, B }) {
  const { profileData, setProfileData } = useStore();
  const [profTab, setProfTab] = useState("profile");
  const [profSubView, setProfSubView] = useState("personal"); 
  const [editingProfile, setEditingProfile] = useState(false);
  const [editDraft, setEditDraft] = useState(null);
  
  const [rrole, setRrole] = useState("");
  const [rtext, setRtext] = useState("");
  const [rloading, setRloading] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [suggestDone, setSuggestDone] = useState(false);
  const [profSections, setProfSections] = useState({
    personal:true,social:true,education:true,experience:true,
    projects:true,skills:true,certifications:true,languages:true,
    achievements:true,hobbies:false,references:false,
  });
  const [itemSel, setItemSel] = useState({ skills:[], projects:[], experience:[], achievements:[], certifications:[] });

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

  return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
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
  );
}