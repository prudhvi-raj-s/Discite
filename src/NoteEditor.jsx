import React, { useEffect, useRef } from "react";

export function NoteEditor({ note, updateNote, deleteNote, T, B }) {
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
      <div ref={editorRef} contentEditable onInput={e => updateNote({ ...note, content: e.currentTarget.innerHTML })} style={{ flex:1, background:T.inp, border:`1px solid ${T.bd}`, borderRadius:8, padding:14, fontSize:13, color:T.tx, outline:"none", fontFamily:"'Roboto',sans-serif", lineHeight:1.6, boxShadow:`inset 0 2px 4px rgba(0,0,0,0.03)`, overflowY:"auto" }} />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:10 }}>
        <span style={{fontSize:10, color:T.txM}}>Auto-saving...</span>
        <button onClick={()=>deleteNote(note.id)} style={{ color:B.rasp, fontSize:11, background:"none", border:"none", cursor:"pointer" }}>🗑 Delete Note</button>
      </div>
    </div>
  );
}