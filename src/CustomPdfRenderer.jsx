import React, { useState, useEffect, useRef } from "react";
import { Spin } from "./ui";

export function CustomPdfRenderer({ url, B }) {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  
  const [pdf, setPdf] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(typeof window.pdfjsLib !== 'undefined');

  const [tool, setTool] = useState("pen"); 
  const [color, setColor] = useState("#e03131"); 
  const [savedStatus, setSavedStatus] = useState(false);
  const [paths, setPaths] = useState({}); 

  const isDrawing = useRef(false);
  const currentPoints = useRef([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!scriptLoaded || !url || url.includes("drive.google.com")) return;
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const getPos = (e) => {
    const rect = overlayRef.current.getBoundingClientRect();
    const scaleX = overlayRef.current.width / rect.width;
    const scaleY = overlayRef.current.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const applyToolStyles = (ctx, currentTool, currentColor) => {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (currentTool === 'highlight') {
        ctx.globalCompositeOperation = 'multiply'; ctx.strokeStyle = currentColor + '80'; ctx.lineWidth = 15;
    } else if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'; ctx.strokeStyle = 'rgba(0,0,0,1)'; ctx.lineWidth = 20;
    } else {
        ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = currentColor; ctx.lineWidth = 2;
    }
  };

  const startDraw = (e) => { isDrawing.current = true; currentPoints.current = [getPos(e)]; };

  const draw = (e) => {
    if (!isDrawing.current || !overlayRef.current) return;
    const pos = getPos(e);
    currentPoints.current.push(pos);
    const ctx = overlayRef.current.getContext('2d');
    if (!ctx) return;
    applyToolStyles(ctx, tool, color);
    ctx.beginPath();
    const prev = currentPoints.current[currentPoints.current.length - 2];
    if (prev) { ctx.moveTo(prev.x, prev.y); ctx.lineTo(pos.x, pos.y); ctx.stroke(); }
  };

  const stopDraw = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (currentPoints.current.length > 1) {
      setPaths(prev => ({ ...prev, [pageNum]: [...(prev[pageNum] || []), { tool, color, points: [...currentPoints.current] }] }));
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

  const saveAnnotations = () => { setSavedStatus(true); setTimeout(() => setSavedStatus(false), 2000); };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (!loading && !error && overlayRef.current) redrawAnnotations(); }, [paths, pageNum]);

  const isDrive = url && url.includes("drive.google.com");
  if (isDrive) {
    const embedUrl = url.includes("/view") ? url.replace(/\/view.*$/, "/preview") : url;
    return (
      <div style={{ display:'flex', flexDirection:'column', background:'#323639', padding:'20px', flex:1 }}>
        <div style={{ padding: "10px 16px", background: "#202124", color: "#aaa", fontSize: 12, borderRadius: "8px 8px 0 0", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
           Google Drive Viewer
        </div>
        <iframe src={embedUrl} style={{ flex: 1, width: "100%", border: "none", borderRadius: "0 0 8px 8px", background: "#fff" }} title="Google Drive PDF" />
      </div>
    );
  }

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
         <canvas ref={overlayRef} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} style={{ position:'absolute', top:0, left:0, zIndex:5, cursor:tool==='eraser'?'cell':'crosshair' }} />
         <div style={{ display:'flex', justifyContent:'center', gap:15, marginTop:20, color:'#fff', alignItems:'center', background:'#202124', padding:'10px 20px', borderRadius:30, position:"sticky", bottom:0, boxShadow:'0 4px 15px rgba(0,0,0,0.4)', zIndex:10 }}>
            <button disabled={pageNum <= 1} onClick={()=>setPageNum(p=>p-1)} style={{ background:pageNum<=1?"#444":B.green, color:'#fff', padding:'6px 14px', borderRadius:20, border:'none', cursor:pageNum<=1?'not-allowed':'pointer', fontWeight:600, fontSize:12 }}>← Prev</button>
            <span style={{ fontSize:12, fontWeight:500, fontFamily:"monospace" }}>Page {pageNum} of {pdf?.numPages || 1}</span>
            <button disabled={pageNum >= (pdf?.numPages || 1)} onClick={()=>setPageNum(p=>p+1)} style={{ background:pageNum >= (pdf?.numPages || 1)?"#444":B.green, color:'#fff', padding:'6px 14px', borderRadius:20, border:'none', cursor:pageNum >= (pdf?.numPages || 1)?'not-allowed':'pointer', fontWeight:600, fontSize:12 }}>Next →</button>
         </div>
      </div>
    </div>
  );
}