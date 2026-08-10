import React, { useState } from "react";
import { Spin, Pill, Stars, SkelBox } from "./ui";
import { useStore } from "./StoreContext";

const EQUIPMENT_DATA = [
    { id: 101, cat: 'Computers', title: 'High-Performance Laptop', desc: 'A powerful laptop for all your computing needs.', price: 1200, rating: 4.8, reviews: 150, seller: 'CompStore', img: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400' },
    { id: 102, cat: 'Mobiles', title: 'Latest Smartphone', desc: 'Stay connected with the latest mobile technology.', price: 800, rating: 4.7, reviews: 250, seller: 'MobileWorld', img: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400' },
    { id: 103, cat: 'Lab Equipment', title: 'Digital Microscope', desc: 'High-resolution digital microscope for laboratory use.', price: 2500, rating: 4.9, reviews: 45, seller: 'LabGear', img: 'https://images.unsplash.com/photo-1574983652249-954b1feb9f96?w=400' },
    { id: 104, cat: 'Lab Equipment', title: '3D Printer', desc: 'Bring your digital designs to life with this 3D printer.', price: 600, rating: 4.6, reviews: 80, seller: 'Innovate3D', img: 'https://images.unsplash.com/photo-1611606023213-932d9c154635?w=400' },
    { id: 105, cat: 'Computers', title: 'Mechanical Keyboard', desc: 'RGB mechanical keyboard for a better typing experience.', price: 150, rating: 4.9, reviews: 540, seller: 'CompStore', img: 'https://images.unsplash.com/photo-1618384887924-3366ab1bc427?w=400' },
    { id: 106, cat: 'Mobiles', title: 'Smart Watch', desc: 'A stylish smart watch with fitness tracking.', price: 250, rating: 4.5, reviews: 320, seller: 'MobileWorld', img: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400' },
    { id: 107, cat: 'Lab Equipment', title: 'Advanced Telescope', desc: 'Explore the stars with this powerful telescope.', price: 750, rating: 4.7, reviews: 95, seller: 'LabGear', img: 'https://images.unsplash.com/photo-1534294643553-3c3a3c883118?w=400' },
    { id: 108, cat: 'Computers', title: 'Ultra-Wide Monitor', desc: 'Immerse yourself in a panoramic viewing experience.', price: 550, rating: 4.8, reviews: 180, seller: 'CompStore', img: 'https://images.unsplash.com/photo-1527814223725-ed2a4b93b37a?w=400' },
];

const EVENTS_DATA = [
    { id: 201, cat: 'Events', type: 'Movie Premiere', title: 'Sci-Fi Odyssey: The Quantum Paradox', desc: 'Experience the premiere of the most anticipated sci-fi movie of the year.', price: 25, rating: 4.9, reviews: 500, seller: 'Starlight Pictures', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400', date: '2026-09-15' },
    { id: 202, cat: 'Events', type: 'Workshop', title: 'Advanced React Patterns Workshop', desc: 'A hands-on workshop for experienced developers to learn advanced React techniques.', price: 150, rating: 4.8, reviews: 120, seller: 'DevMasters Academy', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400', date: '2026-10-05' },
    { id: 203, cat: 'Events', type: 'Exhibition', title: 'Digital Art & Future Realities', desc: 'An immersive exhibition showcasing the future of digital and generative art.', price: 30, rating: 4.7, reviews: 300, seller: 'Artverse Gallery', img: 'https://images.unsplash.com/photo-1506241537230-072b5b6de353?w=400', date: '2026-09-20' },
    { id: 204, cat: 'Events', type: 'Seminar', title: 'The Future of AI in Business', desc: 'A seminar featuring industry leaders discussing the impact of AI on modern business.', price: 75, rating: 4.9, reviews: 250, seller: 'InnovateHub', img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400', date: '2026-11-01' },
];

const INTEGRATIONS_DATA = [
  { id: 'udemy', name: 'Udemy', desc: 'Import your existing Udemy courses and track progress.', logo: 'https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg', connected: false },
  { id: 'coursera', name: 'Coursera', desc: 'Sync your Coursera specializations and certificates.', logo: 'https://logospng.org/download/coursera/logo-coursera-4096.png', connected: true },
  { id: 'translate', name: 'Google Translate', desc: 'Translate course content and discussions instantly.', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Translate_logo.svg', connected: true },
  { id: 'gdrive', name: 'Google Drive', desc: 'Attach documents, slides, and sheets from your Drive.', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.svg', connected: false },
  { id: 'github', name: 'GitHub', desc: 'Link repositories to projects and track contributions.', logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', connected: false },
  { id: 'slack', name: 'Slack', desc: 'Send notifications and updates to your Slack channels.', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg', connected: false },
  { id: 'zoom', name: 'Zoom', desc: 'Schedule and manage live video sessions for your courses.', logo: 'https://logodownload.org/wp-content/uploads/2021/02/zoom-logo-1.png', connected: false },
];

export function Marketplace({ T, B, setEditingProg, setShowCreateProgram, deleteProgram }) {
  const { mktItems, setMktItems, programsList, profileData } = useStore();
  const [mktQ, setMktQ] = useState("");
  const [mktLoading, setMktLoading] = useState(false);
  const [mktCat, setMktCat] = useState("All");
  const [searchResults, setSearchResults] = useState(null);
  const allItems = [...mktItems, ...EQUIPMENT_DATA, ...EVENTS_DATA];

  const displayedItems = searchResults || allItems;
  const filtMkt = mktCat === "All" ? displayedItems : displayedItems.filter(i => i.cat === mktCat);

  function mktSearch() {
    if(!mktQ.trim()) {
      setSearchResults(null);
      return;
    }
    setMktLoading(true);
    setTimeout(() => {
      const results = allItems.filter(item => JSON.stringify(item).toLowerCase().includes(mktQ.toLowerCase()));
      setSearchResults(results);
      setMktCat("All");
      setMktLoading(false);
    }, 500);
  }

  return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
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
        {["All","Courses", "Events", "Integrations", "Software","Books","Materials","Computers","Mobiles","Lab Equipment"].map(c=><button key={c} onClick={()=>setMktCat(c)} className={mktCat===c?"mkt-cat-on":""} style={{ background:T.card,border:`1px solid ${T.bd}`,color:T.txD,padding:"5px 13px",borderRadius:20,fontSize:11.5,fontWeight:mktCat===c?600:400,whiteSpace:"nowrap",cursor:"pointer",transition:"all 0.14s" }}>{c}</button>)}
        <div style={{ flex:1 }}/><span style={{ fontSize:10.5,color:T.txM,whiteSpace:"nowrap" }}>{mktCat === 'Integrations' ? INTEGRATIONS_DATA.length : filtMkt.length} items</span>
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:"14px 18px", background: mktCat === 'Integrations' ? T.bg : 'transparent' }}>
        {mktLoading?<div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:13 }}>{[1,2,3,4,5,6].map(i=><SkelBox key={i} T={T} lines={[60,40,100,80,55,70]}/>)}</div>:(
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:13 }}>
            {filtMkt.map((item,i)=>{const cc=B.green; return (
              <div key={item.id||i} style={{ background:T.card,border:`1px solid ${T.bd}`,borderRadius:12,padding:"13px 14px",display:"flex",flexDirection:"column",gap:7,animation:"dc-up 0.28s ease" }}>
                {item.img && <img src={item.img} alt={item.title} style={{ width:"100%", height:120, objectFit:"cover", borderRadius:8, marginBottom:4, background:T.bd }}/>}
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:7 }}><div style={{ fontSize:13.5,fontWeight:600,color:T.tx,lineHeight:1.3,flex:1 }}>{item.title}</div><Pill label={item.cat} color={cc}/></div>
                <div style={{ fontSize:11.5,color:T.txD,lineHeight:1.65, flex:1 }}>{item.desc}</div>
                {item.date && (
                  <div style={{ fontSize:11, color:B.indigo, fontWeight:600, display:'flex', alignItems:'center', gap: 4, marginTop: 4 }}>
                    <span>📅</span> {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                )}
                <div style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,color:T.txM }}><Stars r={item.rating}/><span>{item.rating}</span><span>({(item.reviews||0).toLocaleString()})</span>{item.badge&&<Pill label={item.badge} color={B.rasp}/>}</div>
                <div style={{ fontSize:10.5,color:T.txM }}>by {item.seller}</div>
                <div style={{ display:"flex",gap:6,marginTop:"auto",paddingTop:3 }}>
                  {item.seller === profileData.personal.name ? (
                    <>
                      <button className="dc-pri" onClick={() => {
                        const p = programsList.find(prog => String(prog.id) === String(item.progId));
                        if (p) {
                            setEditingProg(p);
                            setShowCreateProgram(true);
                        } else {
                            alert("Cannot edit: This course data was not found in your personal library.");
                        }
                      }} style={{ flex:1,background:B.indigo,border:`1px solid ${B.indigoBd}`,color:"#fff",padding:"7px 8px",borderRadius:8,fontSize:12,fontWeight:600 }}>✏️ Edit</button>
                      <button className="dc-pri" onClick={(e) => deleteProgram(e, item.progId)} style={{ flex:1,background:B.rasp,border:`1px solid ${B.raspBd}`,color:"#fff",padding:"7px 8px",borderRadius:8,fontSize:12,fontWeight:600 }}>🗑 Delete</button>
                    </>
                  ) : (
                    <>
                      {item.price!=null&&<button className="dc-pri" style={{ flex:1,background:B.green,color:"#fff",padding:"7px 8px",borderRadius:8,fontSize:12,fontWeight:600 }}>{item.cat === 'Events' ? 'Book Ticket' : 'Buy'} ₹{item.price.toLocaleString()}</button>}
                      {item.rent!=null&&<button className="dc-pri" style={{ flex:item.price==null?1:0,background:B.indigoDim,border:`1px solid ${B.indigoBd}`,color:B.indigo,padding:"7px 8px",borderRadius:8,fontSize:12,fontWeight:600,whiteSpace:"nowrap" }}>Rent ₹{item.rent}/mo</button>}
                    </>
                  )}
                </div>
              </div>
            );})}
          </div>
        )}

        {mktCat === 'Integrations' && (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:13 }}>
          {INTEGRATIONS_DATA.map(app => (
            <div key={app.id} style={{ background:T.card,border:`1px solid ${T.bd}`,borderRadius:12,padding:"16px",display:"flex",flexDirection:"column",gap:10,animation:"dc-up 0.3s ease" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <img src={app.logo} alt={`${app.name} logo`} style={{ width:36, height:36, objectFit:'contain', borderRadius:6, background:app.id === 'github' ? '#fff' : 'transparent', padding: app.id === 'github' ? 4 : 0 }}/>
                <div style={{ fontSize:14, fontWeight:600, color:T.tx }}>{app.name}</div>
              </div>
              <div style={{ fontSize:11.5,color:T.txD,lineHeight:1.6, flex:1 }}>{app.desc}</div>
              <div style={{ marginTop:"auto", paddingTop:8 }}>
                {app.connected ? (
                  <button disabled style={{ width:"100%",background:T.card,border:`1px solid ${B.greenBd}`,color:B.green,padding:"7px 8px",borderRadius:8,fontSize:12,fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>✓ Connected</button>
                ) : (
                  <button className="dc-pri" style={{ width:"100%",background:B.indigo,color:"#fff",padding:"7px 8px",borderRadius:8,fontSize:12,fontWeight:600 }}>Connect</button>
                )}
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}