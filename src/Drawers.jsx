import React from "react";
import { Av, Pill } from "./ui";
import { NoteEditor } from "./NoteEditor";
import { useStore } from "./StoreContext";

export function Drawers({
  T, B, drawer, setDrawer,
  grp, setGrp, msgs, setMsgs, chatInput, setChatInput, sendChat, chatEnd, setShowCreateGroup,
  activeNoteId, setActiveNoteId, calDate, setCalDate
}) {
  const { groupsList, notes, setNotes, events } = useStore();

  return (
    <>
      {/* Drawer Overlay - zIndex 40 covering all normal content */}
      {drawer && <div onClick={() => setDrawer(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.46)", zIndex: 40, animation: "dc-in 0.22s ease" }} />}

      {/* Right Drawer Panel - zIndex 50 (above overlay) */}
      <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: "60%", background: T.sf, borderLeft: `1px solid ${T.bd}`, zIndex: 50, display: "flex", flexDirection: "column", transform: drawer ? "translateX(0)" : "translateX(100%)", transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)", boxShadow: drawer ? "-8px 0 40px rgba(0,0,0,0.22)" : "none" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: `1px solid ${T.bd}`, flexShrink: 0, gap: 8 }}>
          <div style={{ display: "flex", gap: 0, border: `1px solid ${T.bd}`, borderRadius: 8, overflow: "hidden" }}>
            {["groups", "notes", "calendar"].map(d => (
              <button key={d} onClick={() => setDrawer(d)} style={{ padding: "6px 18px", fontSize: 12.5, fontWeight: 500, background: drawer === d ? B.green : "transparent", color: drawer === d ? "#fff" : T.txM, transition: "all 0.15s", border: "none", cursor: "pointer" }}>
                {d === "groups" ? "👥 Groups" : d === "notes" ? "📝 Notes" : "📅 Calendar"}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={() => setDrawer(null)} style={{ color: T.txM, fontSize: 22, lineHeight: 1, padding: "0 6px", cursor: "pointer", border: "none", background: "none" }}>×</button>
        </div>
        <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
          
          {/* Group Drawer Content */}
          {drawer === "groups" && (
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
              <div style={{ width: 220, borderRight: `1px solid ${T.bd}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
                <div style={{ padding: "9px 11px 6px", borderBottom: `1px solid ${T.bd}`, flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 9.5, color: T.txM, textTransform: "uppercase", letterSpacing: "0.09em", fontWeight: 600 }}>Your Cohorts</div>
                  <button onClick={() => setShowCreateGroup(true)} style={{ background: B.indigo, color: "#fff", border: "none", borderRadius: 5, padding: "4px 8px", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>+ NEW</button>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: 8, display: "flex", flexDirection: "column", gap: 7 }}>
                  {groupsList.map(g => (
                    <div key={g.id} onClick={() => setGrp(g)} style={{ background: String(grp.id) === String(g.id) ? `${g.color}14` : T.card, border: `1.5px solid ${String(grp.id) === String(g.id) ? g.color : T.bd}`, borderRadius: 10, padding: "9px 11px", cursor: "pointer", transition: "all 0.15s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: g.color, flexShrink: 0 }} /><div style={{ fontSize: 12, fontWeight: 500, color: T.tx }}>{g.name}</div></div>
                      <div style={{ fontSize: 10, color: T.txM, marginBottom: 5 }}>{g.course}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 4 }}>{g.tags.map(tg => <Pill key={tg} label={tg} color={g.color} />)}</div>
                      <div style={{ fontSize: 9.5, color: T.txM, fontFamily: "monospace" }}>👥 {g.members} members</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{ padding: "9px 13px", borderBottom: `1px solid ${T.bd}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 9, height: 9, borderRadius: "50%", background: grp.color, boxShadow: `0 0 5px ${grp.color}90` }} />
                    <div><div style={{ fontFamily: "'Numans',sans-serif", fontSize: 14.5, color: T.tx }}>{grp.name}</div><div style={{ fontSize: 9.5, color: T.txM }}>{grp.members} members · {grp.course}</div></div>
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "11px 13px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {msgs.length === 0 ? (
                    <div style={{ textAlign: "center", color: T.txM, fontSize: 13, marginTop: 40 }}>
                      No messages yet. Be the first to say hello! 👋
                    </div>
                  ) : (
                    msgs.map(m => (
                      <div key={m.id} style={{ display: "flex", gap: 7, flexDirection: m.isMe ? "row-reverse" : "row", animation: "dc-up 0.2s ease" }}>
                        <Av init={m.av} color={m.col} size={29} />
                        <div style={{ maxWidth: "68%", display: "flex", flexDirection: "column", alignItems: m.isMe ? "flex-end" : "flex-start" }}>
                          <div style={{ fontSize: 9.5, color: T.txM, marginBottom: 2, fontFamily: "monospace" }}>{m.isMe ? "You" : m.user} · {m.time}</div>
                          <div style={{ background: m.isMe ? `${grp.color}20` : T.card, border: `1px solid ${m.isMe ? `${grp.color}45` : T.bd}`, borderRadius: m.isMe ? "11px 3px 11px 11px" : "3px 11px 11px 11px", padding: "7px 11px", fontSize: 12.5, color: T.tx, lineHeight: 1.6 }}>{m.text}</div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEnd} />
                </div>
                <div style={{ padding: "8px 13px", borderTop: `1px solid ${T.bd}`, display: "flex", gap: 7, background: T.sf, flexShrink: 0 }}>
                  <input className="dc-inp" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder={`Message ${grp.name}…`} style={{ flex: 1, padding: "8px 12px", background: T.inp, border: `1px solid ${T.bd}`, color: T.tx, fontSize: 12.5 }} />
                  <button className="dc-pri" onClick={sendChat} style={{ background: B.green, color: "#fff", padding: "8px 16px", borderRadius: 7, fontSize: 12.5, fontWeight: 600, flexShrink: 0 }}>Send</button>
                </div>
              </div>
            </div>
          )}

          {/* Notes Drawer Content */}
          {drawer === "notes" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ padding: "9px 13px", borderBottom: `1px solid ${T.bd}`, flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Numans',sans-serif", fontSize: 14.5, color: T.tx }}>My Notes</div>
                  <div style={{ fontSize: 9.5, color: T.txM }}>{activeNoteId ? "Editing Note" : "All Saved Notes"}</div>
                </div>
                {activeNoteId ? (
                  <button onClick={() => setActiveNoteId(null)} style={{ background: T.card, border: `1px solid ${T.bd}`, color: T.txD, padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>← Back</button>
                ) : (
                  <button onClick={() => { const newNote = { id: Date.now(), title: "Untitled Note", content: "", date: new Date().toLocaleDateString() }; setNotes([newNote, ...notes]); setActiveNoteId(newNote.id); }} style={{ background: B.green, color: "#fff", padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none" }}>+ New Note</button>
                )}
              </div>
              <div style={{ flex: 1, padding: "13px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
                {activeNoteId ? (
                  <NoteEditor 
                    note={notes.find(n => n.id === activeNoteId)} 
                    updateNote={(updated) => setNotes(notes.map(n => n.id === updated.id ? updated : n))} 
                    deleteNote={(id) => { 
                      if(window.confirm("Are you sure you want to delete this note?")) {
                        setNotes(notes.filter(n => n.id !== id)); 
                        setActiveNoteId(null); 
                      }
                    }} 
                    T={T} B={B} 
                  />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {notes.length === 0 ? (
                      <div style={{ textAlign: "center", color: T.txM, fontSize: 12, marginTop: 20 }}>No saved notes yet.</div>
                    ) : (
                      notes.map(note => (
                        <div key={note.id} onClick={() => setActiveNoteId(note.id)} style={{ background: T.card, border: `1px solid ${T.bd}`, borderRadius: 8, padding: "10px 12px", cursor: "pointer", transition: "border-color 0.15s" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: T.tx, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginRight: 8 }}>{note.title || "Untitled Note"}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 10, color: T.txM }}>{note.date}</span>
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  if(window.confirm("Are you sure you want to delete this note?")) {
                                    setNotes(notes.filter(n => n.id !== note.id));
                                  }
                                }} 
                                style={{ background: "transparent", border: "none", color: B.rasp, fontSize: 14, cursor: "pointer", opacity: 0.6, transition: "opacity 0.2s", padding: "0 2px" }}
                                onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                                onMouseOut={(e) => e.currentTarget.style.opacity = 0.6}
                                title="Delete Note"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          <div style={{ fontSize: 11.5, color: T.txD, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
          {drawer === "calendar" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ padding: "9px 16px", borderBottom: `1px solid ${T.bd}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}><button className="dc-ghost" onClick={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1))} style={{ background: T.card, border: `1px solid ${T.bd}`, color: T.txD, padding: "4px 12px", borderRadius: 6, fontSize: 14 }}>‹</button><div style={{ fontFamily: "'Marvel',sans-serif", fontSize: 18, color: T.tx }}>{["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][calDate.getMonth()]} {calDate.getFullYear()}</div><button className="dc-ghost" onClick={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1))} style={{ background: T.card, border: `1px solid ${T.bd}`, color: T.txD, padding: "4px 12px", borderRadius: 6, fontSize: 14 }}>›</button></div>
              <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}><div style={{ fontSize: 9.5, color: T.txM, textTransform: "uppercase", letterSpacing: "0.09em", fontWeight: 600, marginBottom: 8 }}>Upcoming</div><div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{events.map((ev, i) => <div key={i} style={{ background: T.card, border: `1px solid ${T.bd}`, borderRadius: 8, padding: "7px 10px", display: "flex", alignItems: "center", gap: 8, animation: "dc-up 0.25s ease" }}><div style={{ width: 3, borderRadius: 2, alignSelf: "stretch", background: ev.color, flexShrink: 0 }} /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, color: T.tx, fontWeight: 500, lineHeight: 1.3 }}>{ev.title}</div><div style={{ fontSize: 9.5, color: T.txM, fontFamily: "monospace", marginTop: 1 }}>{ev.date} · {ev.time}</div></div><Pill label={ev.type} color={ev.type === "group" ? B.indigo : B.olive} /></div>)}</div></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}