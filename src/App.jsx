import React, { useState, useEffect, useRef } from "react";
import { Av, Pill, Logo, Spin } from "./ui";
import { NoteEditor } from "./NoteEditor";
import { B, TH } from "./theme";
import { INIT_PROGRAMS, INIT_GROUPS, SEED_MSGS, TRANSCRIPT } from "./data";
import { ComposeModal, CreateGroupModal, CreateProgramModal } from "./modals";
import { Learn } from "./Learn";
import { Marketplace } from "./Marketplace";
import { Profile } from "./Profile";
import { StoreProvider, useStore } from "./StoreContext";
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { Drawers } from "./Drawers";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Auth } from "./Auth";
import { db } from "./firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, setDoc, deleteDoc } from "firebase/firestore";

function AiChatOverlay({ T, B, onClose, prog, cur }) {
  const [aiMsgs, setAiMsgs] = useState([{ role: "model", text: "Hi there! I'm your Gemini AI assistant. What can I help you learn today?" }]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const aiChatEnd = useRef(null);

  useEffect(() => { aiChatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [aiMsgs]);

  async function sendAiMsg() {
    if (!aiInput.trim()) return;
    const userMsg = { role: "user", text: aiInput };
    setAiMsgs(prev => [...prev, userMsg]);
    setAiInput("");
    setAiLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey.includes("your_actual_gemini")) throw new Error("Gemini API Key missing in .env file (VITE_GEMINI_API_KEY)");

      const contextStr = prog?.title ? `[System Context: User is currently studying the Course "${prog.title}", specifically the Lesson "${cur?.title}". Keep this context in mind to provide accurate assistance.]\n` : "";
      const prompt = `${contextStr}User: ${userMsg.text}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that.";
      setAiMsgs(prev => [...prev, { role: "model", text: aiText }]);
    } catch (err) {
      setAiMsgs(prev => [...prev, { role: "model", text: `Error: ${err.message}` }]);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div style={{ position: "fixed", bottom: 100, right: 30, width: 380, height: 500, background: T.sf, border: `1px solid ${T.bd}`, borderRadius: 16, zIndex: 100, display: "flex", flexDirection: "column", boxShadow: "0 12px 40px rgba(0,0,0,0.2)", animation: "dc-up 0.2s ease", overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.bd}`, background: B.indigo, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: "'Numans',sans-serif", fontSize: 15, fontWeight: 600 }}>✨ Gemini AI</div>
          <div style={{ fontSize: 10, opacity: 0.8 }}>Course Assistant</div>
        </div>
        <button onClick={onClose} style={{ color: "#fff", fontSize: 20, background: "none", border: "none", cursor: "pointer", opacity: 0.8 }}>×</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 10 }}>
        {aiMsgs.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 7, flexDirection: m.role === "user" ? "row-reverse" : "row", animation: "dc-up 0.2s ease" }}>
            <Av init={m.role === "user" ? "ME" : "AI"} color={m.role === "user" ? B.olive : B.indigo} size={26} />
            <div style={{ maxWidth: "80%", display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ background: m.role === "user" ? `${B.olive}20` : T.card, border: `1px solid ${m.role === "user" ? `${B.olive}45` : T.bd}`, borderRadius: m.role === "user" ? "11px 3px 11px 11px" : "3px 11px 11px 11px", padding: "7px 11px", fontSize: 12.5, color: T.tx, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{m.text}</div>
            </div>
          </div>
        ))}
        {aiLoading && <div style={{ display: "flex", gap: 7, animation: "dc-up 0.2s ease" }}><Av init="AI" color={B.indigo} size={26} /><div style={{ padding: "7px 11px" }}><Spin size={12} color={B.indigo} /></div></div>}
        <div ref={aiChatEnd} />
      </div>
      <div style={{ padding: "10px", borderTop: `1px solid ${T.bd}`, display: "flex", gap: 7, background: T.sf, flexShrink: 0 }}>
        <input className="dc-inp" value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendAiMsg()} placeholder="Ask Gemini..." style={{ flex: 1, padding: "8px 12px", background: T.inp, border: `1px solid ${T.bd}`, color: T.tx, fontSize: 12.5 }} disabled={aiLoading}/>
        <button className="dc-pri" onClick={sendAiMsg} disabled={aiLoading || !aiInput.trim()} style={{ background: B.indigo, color: "#fff", padding: "8px 14px", borderRadius: 7, fontSize: 12.5, fontWeight: 600, opacity: (aiLoading || !aiInput.trim()) ? 0.6 : 1, border: "none", cursor: "pointer" }}>Send</button>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
function Discite({ user }) {
  const [tn,setTn]=useState("light"); const T=TH[tn];
  const location = useLocation();
  const navigate = useNavigate();
  const view = location.pathname.substring(1) || "learn"; // Defaults to learn
  const [drawer,setDrawer]=useState(null);

  // FAB States
  const [showCompose,setShowCompose]=useState(false);
  const [showCreateGroup, setShowCreateGroup]=useState(false);
  const [showCreateProgram, setShowCreateProgram]=useState(false);
  const [editingProg, setEditingProg] = useState(null);
  const [showAiChat, setShowAiChat] = useState(false);

  // Global Data Store
  const { programsList, setProgramsList, groupsList, notes, setNotes, mktItems, profileData } = useStore();

  // Dynamic Programs List
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
  const [transcript,setTranscript]=useState(TRANSCRIPT);
  const [showTrans,setShowTrans]=useState(false);
  const [autoScroll,setAutoScroll]=useState(false);
  const [scrollPct,setScrollPct]=useState(0);

  // Social/News/Resources
  const [rightTab,setRightTab]=useState("social");
  const [socSearch,setSocSearch]=useState("");
  const [newsSearch,setNewsSearch]=useState("");
  const [social,setSocial]=useState({twitter:[]});
  const [loadSoc,setLoadSoc]=useState(false);
  const [news,setNews]=useState([]);
  const [loadNews,setLoadNews]=useState(false);

  // Notes Drawer State
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [annotating, setAnnotating] = useState(false);

  // Groups
  const [grp,setGrp]=useState(INIT_GROUPS[0]);
  const [msgs,setMsgs]=useState([]);
  const [chatInput,setChatInput]=useState("");

  // Calendar
  const [calDate,setCalDate]=useState(new Date());

  const txRef=useRef(null); const tlRef=useRef(null);
  const chatEnd=useRef(null); const stmr=useRef(null);

  // Robustly derive current program/lesson data
  const prog = programsList.find(p=>p.id===progId) || programsList[0] || { id:0, title:"No Programs", color:B.green, tags:[], lessons:[], done:0, total:0 };
  const lessons = prog.lessons?.length ? prog.lessons : [{ id:0, type:"video", title:"No lessons available", dur:"0:00", vid:"" }];
  const cur = lessons[curIdx] || lessons[0];
  const prevProg = programsList.find(p=>p.id===previewId);
  const filtSoc = (social.twitter||[]).filter(p=>!socSearch||JSON.stringify(p).toLowerCase().includes(socSearch.toLowerCase()));
  const filtNews = news.filter(n=>!newsSearch||JSON.stringify(n).toLowerCase().includes(newsSearch.toLowerCase()));

  // Get user details from Firebase Auth
  const userInitials = user?.displayName ? user.displayName.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() : (user?.email?.slice(0,2).toUpperCase() || "U");
  const userPhoto = user?.photoURL;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{ 
    // Initial fetch when the lesson changes
    fetchSoc(cur.tags); 
    fetchNews(cur.tags); 
  },[progId, cur?.id]); // Re-run ONLY if the lesson changes, not when tags are added

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{ 
    // REALTIME POLLING: Refetch data every 60 seconds for the current search query
    const pollInterval = setInterval(() => {
      if (socSearch) aiSocSearch(socSearch, true);
      if (newsSearch) aiNewsSearch(newsSearch, true);
    }, 60000);
    return () => clearInterval(pollInterval);
  },[socSearch, newsSearch]); // Reset interval if user types a new search
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{ chatEnd.current?.scrollIntoView({behavior:"smooth"}); },[msgs, drawer]);
  
  // Listen to messages for active group
  useEffect(() => {
    if (!grp?.id) return;
    const q = query(collection(db, "groups", String(grp.id), "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const fetchedMsgs = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          isMe: data.uid === user?.uid
        };
      });
      setMsgs(fetchedMsgs);
    }, (err) => {
      console.error("Firebase Chat Error:", err.message);
    });
    return () => unsubscribe();
  }, [grp?.id, user?.uid]);

  // Fetch Real YouTube Transcripts when the video changes

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Helper to fetch real tweets via Official X API
  async function fetchTwitter(query) {
    const token = import.meta.env.VITE_TWITTER_BEARER_TOKEN;
    if (!token) return null; // Fallback to mock if no token exists
    
    const safeQuery = encodeURIComponent(query + " -is:retweet"); // Exclude retweets for a cleaner feed
    const targetUrl = `https://api.x.com/2/tweets/search/recent?query=${safeQuery}&max_results=10&tweet.fields=public_metrics,created_at&expansions=author_id&user.fields=name,username`;
    const url = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
    const options = { method: 'GET', headers: { Authorization: `Bearer ${token}` } };
    
    let data;
    try {
      const res = await fetch(url, options);
      data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.title || `HTTP ${res.status}`);
      if (data.error || data.errors) throw new Error(data.detail || data.errors[0]?.message || "X API Error");
    } catch(err) {
      throw new Error(`X API: ${err.message}`);
    }
    
    const users = data.includes?.users || [];
    return (data.data || []).map(t => {
      const user = users.find(u => u.id === t.author_id) || {};
      return {
        handle: user.username ? `@${user.username}` : "@user",
        name: user.name || "X User",
        content: t.text,
        likes: t.public_metrics?.like_count || 0,
        retweets: t.public_metrics?.retweet_count || 0,
        time: new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    });
  }

  // MOCK API FUNCTIONS
  async function fetchSoc(tags, isPolling = false) {
    if (!isPolling) { setLoadSoc(true); setSocial({twitter:[]}); }
    const q = tags?.[0] || 'technology';
    setSocSearch(q); // Assign the automated query to the search box
    try {
      const tweets = await fetchTwitter(q);
      if (tweets) { // API call was attempted
        const results = tweets.length > 0 ? tweets : [{ handle: "@system", name: "Discite Bot", content: `No recent tweets found for "${q}". Try a different keyword!`, likes: 0, retweets: 0, time: "Now" }];
        setSocial({ twitter: results });
      } else { // No token, use mock
        setSocial({ twitter: [{ handle: "@tech_enthusiast", name: "Tech Enthusiast", content: `Just learned about ${q}. The ecosystem is moving fast! 🚀 #learning`, likes: 120, retweets: 12, time: "45m ago" }] });
      }
    } catch (err) {
      console.error(err);
      setSocial({ twitter: [{ handle: "@error", name: "API Error", content: err.message, likes: 0, retweets: 0, time: "Now" }]});
    } finally {
      if (!isPolling) setLoadSoc(false);
    }
  }

  async function fetchNews(tags, isPolling = false) {
    if (!isPolling) { setLoadNews(true); setNews([]); }
    const q = tags?.[0] || 'Tech';
    setNewsSearch(q); // Assign the automated query to the search box

    const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
    if (!newsApiKey) {
      // Fallback to mock if no API key is provided
      setTimeout(() => {
        setNews([
          { title: `Industry update on ${q}`, source: "Tech Mock Daily", summary: "Recent trends show a 40% increase in adoption for these specific architectures across enterprise companies.", time: "3h ago", category: "Tech", url: "#" },
          { title: `New tools released for ${tags?.[1]||'Development'}`, source: "Dev Weekly", summary: "A breakdown of the top 5 tools you should add to your workflow this year.", time: "1d ago", category: "Tools", url: "#" }
        ]);
        if (!isPolling) setLoadNews(false);
      }, 600);
      return;
    }

    try {
      const res = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&sortBy=publishedAt&language=en&pageSize=15&apiKey=${newsApiKey}`);
      const data = await res.json();
      if (data.status === "ok") {
        const mappedNews = data.articles.map(a => ({ title: a.title, source: a.source.name, summary: a.description || "Click to read more...", time: new Date(a.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), category: "News", url: a.url }));
        setNews(mappedNews);
      }
    } catch (err) {
      console.error("News API Error:", err);
    } finally {
      if (!isPolling) setLoadNews(false);
    }
  }
  async function aiSocSearch(qOverride, isPolling = false) {
    const q = typeof qOverride === 'string' ? qOverride : socSearch;
    if(!q || !q.trim()) return; 
    if (!isPolling) setLoadSoc(true);

    // Dynamically assign newly searched queries to the appeared keywords (Pills)
    if (!isPolling && !cur.tags?.some(t => t.toLowerCase() === q.toLowerCase())) {
      setProgramsList(prev => prev.map(p => {
        if (p.id === progId) {
          const newLessons = [...p.lessons];
          newLessons[curIdx] = { ...newLessons[curIdx], tags: [...(newLessons[curIdx].tags || []), q] };
          return { ...p, lessons: newLessons };
        }
        return p;
      }));
    }

    try {
      const tweets = await fetchTwitter(q);
      if (tweets) { // API call was attempted
        const results = tweets.length > 0 ? tweets : [{ handle: "@system", name: "Discite Bot", content: `No recent tweets found for "${q}". Try a different keyword!`, likes: 0, retweets: 0, time: "Now" }];
        setSocial({ twitter: results });
      } else { // No token, use mock
        setSocial({ twitter: [{ handle: "@searcher", name: "Searcher", content: `Here is a tweet about ${q}. Highly relevant. #search`, likes: 89, retweets: 13, time: "2h ago" }] });
      }
    } catch (err) {
      console.error(err);
      setSocial({ twitter: [{ handle: "@error", name: "API Error", content: err.message, likes: 0, retweets: 0, time: "Now" }]});
    } finally {
      if (!isPolling) setLoadSoc(false);
    }
  }
  async function aiNewsSearch(qOverride, isPolling = false) {
    const q = typeof qOverride === 'string' ? qOverride : newsSearch;
    if(!q || !q.trim()) return; 
    if (!isPolling) setLoadNews(true);

    // Dynamically assign newly searched queries to the appeared keywords (Pills)
    if (!isPolling && !cur.tags?.some(t => t.toLowerCase() === q.toLowerCase())) {
      setProgramsList(prev => prev.map(p => {
        if (p.id === progId) {
          const newLessons = [...p.lessons];
          newLessons[curIdx] = { ...newLessons[curIdx], tags: [...(newLessons[curIdx].tags || []), q] };
          return { ...p, lessons: newLessons };
        }
        return p;
      }));
    }

    const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
    if (!newsApiKey) {
      setTimeout(() => {
        setNews([{ title: `Search result for ${q}`, source: "Mock Search", summary: `Mocked summary focusing entirely on the keyword ${q}.`, time: "2h ago", category: "Search", url: "#" }]);
          if (!isPolling) setLoadNews(false);
      }, 500);
      return;
    }

    try {
      const res = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&sortBy=publishedAt&language=en&pageSize=15&apiKey=${newsApiKey}`);
      const data = await res.json();
      if (data.status === "ok" && data.articles.length > 0) {
        const mappedNews = data.articles.map(a => ({ title: a.title, source: a.source.name, summary: a.description || "Click to read more...", time: new Date(a.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), category: "Search", url: a.url }));
        setNews(mappedNews);
      } else {
        setNews([{ title: `No results for ${q}`, source: "System", summary: "Try a different search term.", time: "Now", category: "Search", url: "#" }]);
      }
    } catch (err) {
      console.error("News API Search Error:", err);
    } finally {
      if (!isPolling) setLoadNews(false);
    }
  }
  function translate() {
    setTranslating(true); setShowTrans(false); setTranslation("");
    
    const langCodes = { "Hindi":"hi", "Telugu":"te", "Tamil":"ta", "Spanish":"es", "French":"fr", "German":"de", "Japanese":"ja" };
    const targetCode = langCodes[lang] || "hi";
    const textToTranslate = transcript.substring(0, 499);
    
    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${targetCode}`)
      .then(res => res.json())
      .then(data => {
         const translated = data.responseData?.translatedText || "Translation failed.";
         setTranslation(`${translated}\n\n[Note: This is a free translation preview via MyMemory API.]`);
         setShowTrans(true);
         tlRef.current && (tlRef.current.scrollTop = 0);
      })
      .catch(err => {
         console.error(err);
         setTranslation(`Failed to translate. Please try again later.`);
         setShowTrans(true);
      })
      .finally(() => {
         setTranslating(false);
      });
  }

  function selLesson(i) {
    setCurIdx(i); setScrollPct(0); setAutoScroll(false); setShowTrans(false); setTranslation(""); 
    ytPlayerRef.current = null;
    txRef.current&&(txRef.current.scrollTop=0);
  }
  function enterProg(id) {
    setProgId(id); setCurIdx(0); setPreviewId(null); setShowTrans(false); setTranslation(""); 
    ytPlayerRef.current = null;
  }
  
  async function loadPlaylist() {
    const isPdf = plUrl.toLowerCase().endsWith(".pdf") || plUrl.includes("drive.google.com");
    const listMatch = plUrl.match(/[?&]list=([^&]+)/);
    const vidMatch = plUrl.match(/youtu\.be\/([^?]+)/) || plUrl.match(/v=([^&]+)/);

    if(isPdf || listMatch || vidMatch) {
      setPlLoading(true); setPlStatus(isPdf ? "Fetching document..." : "Fetching videos...");
      
      try {
        const newId = Date.now();
        let mockLessons = [];
        
        if (isPdf) {
           mockLessons = [
              { id: newId+1, type: "pdf", title: "1. Imported Document", dur: "1 Document", url: plUrl, done: false, tags: ["Imported", "PDF"], references: [] }
           ];
        } else {
           const ytKey = import.meta.env.VITE_YOUTUBE_API_KEY;
           
           if (ytKey) {
             if (listMatch) {
               const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=25&playlistId=${listMatch[1]}&key=${ytKey}`);
               const data = await res.json();
               if(data.error) throw new Error(data.error.message);
               mockLessons = data.items.map((it, idx) => ({ id: newId+1+idx, type: "video", title: `${idx+1}. ${it.snippet.title}`, dur: "Video", vid: it.snippet.resourceId.videoId, done: false, tags: ["Imported", "Playlist"], references: [] }));
             } else {
               const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${vidMatch[1]}&key=${ytKey}`);
               const data = await res.json();
               if(data.error || !data.items.length) throw new Error("Video not found");
               mockLessons = [{ id: newId+1, type: "video", title: `1. ${data.items[0].snippet.title}`, dur: "Video", vid: vidMatch[1], done: false, tags: ["Imported", "Video"], references: [] }];
             }
           } else {
             const mainVid = listMatch ? `videoseries?list=${listMatch[1]}` : vidMatch[1];
             mockLessons = [
               { id: newId+1, type: "video", title: "1. Imported Source (Mock)", dur: "10:15", vid: mainVid, done: false, tags: ["Imported", "Intro"], references: [] }
             ];
           }
        }
        
        const newProg = { id: newId, title: isPdf ? "Imported Book/PDF" : (listMatch ? "Imported Playlist" : "Imported Video"), instructor: isPdf ? "Document Source" : "YouTube Creator", color: B.indigo, tags: isPdf ? ["Document"] : ["YouTube"], status: "active", level: "All Levels", duration: "Custom", desc: "Custom imported content: " + plUrl, lessons: mockLessons, done: 0, total: mockLessons.length, isCustom: true };
        
        setProgramsList(prev => [newProg, ...prev.filter(p => p.id !== newId)]);
        setProgId(newId); setCurIdx(0); ytPlayerRef.current = null;
        setPlStatus("✓ Loaded to My Programs");
      } catch(err) {
        setPlStatus("✗ Error: " + err.message);
      } finally {
        setPlLoading(false);
        setTimeout(() => setPlStatus(""), 4000);
        setPlUrl("");
      }
    } else {
      setPlStatus("✗ Invalid URL");
      setTimeout(() => setPlStatus(""), 3000);
    }
  }

  async function loadLocalFiles(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setPlLoading(true);
    setPlStatus("Loading local files...");

    try {
      const newId = Date.now();
      const videoFiles = Array.from(files).filter(file => file.type.startsWith("video/"));

      if (videoFiles.length === 0) {
        throw new Error("No valid video files selected.");
      }

      const mockLessons = videoFiles.map((file, idx) => ({
        id: newId + 1 + idx, type: "video", title: `${idx + 1}. ${file.name}`, dur: "Local Video", vid: URL.createObjectURL(file), done: false, tags: ["Local", "Video"], references: []
      }));

      const newProg = { id: newId, title: "Local Video Playlist", instructor: "Local Files", color: B.indigo, tags: ["Local"], status: "active", level: "All Levels", duration: "Custom", desc: `Playlist of ${videoFiles.length} local video(s)`, lessons: mockLessons, done: 0, total: mockLessons.length, isCustom: true };
      setProgramsList(prev => [newProg, ...prev.filter(p => p.id !== newId)]);
      setProgId(newId); setCurIdx(0); ytPlayerRef.current = null;
      setPlStatus(`✓ Loaded ${videoFiles.length} local video(s)`);
    } catch (err) {
      setPlStatus(`✗ Error: ${err.message}`);
    } finally {
      setPlLoading(false); setTimeout(() => setPlStatus(""), 4000); if (e.target) e.target.value = null;
    }
  }

  function deleteProgram(e, id) {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this program? This action cannot be undone.")) {
      return;
    }

    const targetId = String(id);
    
    const progToRemove = programsList.find(p => String(p.id) === targetId);
    const mktMatch = mktItems.find(m => String(m.progId) === targetId);
    const isCreator = (progToRemove?.creator === profileData.personal.name) || (mktMatch?.seller === profileData.personal.name);


    // Remove from My Programs list
    
    setProgramsList(prev => prev.filter(p => String(p.id) !== targetId)); // This now persists the deletion
    
    // If user is creator, also delete it from Marketplace
    if (isCreator) {
      
        const itemsToDelete = mktItems.filter(m => String(m.progId) === targetId);
        itemsToDelete.forEach(async item => {
            try { await deleteDoc(doc(db, "marketplace", String(item.id))); } catch(e) {}
        });
    }

     if (String(progId) === targetId) { 
        const remaining = programsList.filter(p => String(p.id) !== targetId);
        setProgId(remaining.length > 0 ? remaining[0].id : (INIT_PROGRAMS[0]?.id || 1)); 
        setCurIdx(0); 
        ytPlayerRef.current = null;
    }
     if (String(previewId) === targetId) { setPreviewId(null); }
  }

  async function handlePostToGroup(groupId, text) {
    const targetGroup = groupsList.find(g => String(g.id) === String(groupId));
    if (!targetGroup) return;
    const now = new Date();
    await addDoc(collection(db, "groups", String(groupId), "messages"), {
      user: profileData?.personal?.name || user?.displayName || "You",
      av: userInitials,
      col: B.olive,
      text: text,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      uid: user?.uid,
      createdAt: serverTimestamp()
    });
    setGrp(targetGroup);
    setDrawer("groups");
  }

  async function handleCreateGroup(newGroup) {
    const { id, ...groupData } = newGroup;
    try {
      const docRef = await addDoc(collection(db, "groups"), groupData);
      setGrp({ ...groupData, id: docRef.id });
      setDrawer("groups");
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSaveProgram(progData) {
    const targetId = String(progData.id);
    if (editingProg) {
        setProgramsList(prev => prev.map(p => String(p.id) === targetId ? progData : p)); // This now persists the edit
        
       
        const mktItem = mktItems.find(m => String(m.progId) === targetId);
        if (mktItem) {
            try { await setDoc(doc(db, "marketplace", String(mktItem.id)), { title: progData.title, desc: progData.desc }, { merge: true }); } catch(e) {}
        }
        setEditingProg(null);
    } else {
        setProgramsList(prev => [progData, ...prev.filter(p => p.id !== progData.id)]); // This now persists the creation
        const newMktId = Date.now() + 100;
        try {
          await setDoc(doc(db, "marketplace", String(newMktId)), {
            id: newMktId,
            progId: progData.id,
            title: progData.title,
            cat: "Courses",
            desc: progData.desc,
            price: 0, rent: null, rating: 5.0, reviews: 0, seller: progData.creator, badge: "New"
          });
        } catch(e) {}
    }
    setProgId(progData.id);
    navigate("/learn");
    setRightTab("resources"); // Switch to resources to show the references of the first lesson
  }

  async function sendChat() {
    if(!chatInput.trim() || !grp?.id) return;
    const text = chatInput;
    setChatInput("");
    const now = new Date();
    await addDoc(collection(db, "groups", String(grp.id), "messages"), {
      user: profileData?.personal?.name || user?.displayName || "You",
      av: userInitials,
      col: B.olive,
      text: text,
      time: now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
      uid: user?.uid,
      createdAt: serverTimestamp()
    });
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

  // Handle Clipping News to Notes
  function captureNewsNote(newsItem) {
    const html = `<div contenteditable="false" style="display:inline-block; margin:10px 0; border:1px solid #C4D0EE; border-radius:8px; overflow:hidden; width:100%; box-shadow:0 4px 12px rgba(40,60,140,0.1);"><div style="padding:10px 14px; background:#F4F6FF;"><div style="font-size:11px; color:#2FA478; font-weight:700; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.05em;">News Clipping</div><div style="font-size:13px; color:#0A1030; font-weight:600; margin-bottom:6px;">${newsItem.title}</div><div style="font-size:11.5px; color:#555; line-height:1.5; margin-bottom:8px;">${newsItem.summary}</div><a href="${newsItem.url}" target="_blank" style="font-size:11px; color:#3D2FA4; text-decoration:none; font-weight:600;">Read Full Article →</a></div></div><br/>`;

    if (activeNoteId) {
       setNotes(notes.map(n => n.id === activeNoteId ? { ...n, content: n.content + html } : n));
    } else {
       const newId = Date.now();
       setNotes([{ id: newId, title: "Notes on: " + newsItem.title.substring(0,25) + "...", content: html, date: new Date().toLocaleDateString() }, ...notes]);
       setActiveNoteId(newId);
    }
    setDrawer("notes");
  }

  // Handle AI Annotation of Video to Text
  async function annotateVideo() {
    if(!transcript) return alert("No transcript available to annotate.");
    setAnnotating(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey.includes("your_actual_gemini")) throw new Error("Gemini API Key missing in .env file");

      const prompt = `Please act as an expert study assistant. Read the following video transcript for the lesson titled "${cur.title}" and provide a well-structured text annotation and summary. Extract key concepts, important definitions, and format it with clear bullet points so I can save it as study notes:\n\n${transcript.substring(0, 15000)}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      
      let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No annotation generated.";
      
      // Convert Markdown bold/italic to HTML for the rich-text editor
      aiText = aiText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\*(.*?)\*/g, '<i>$1</i>').replace(/\n/g, '<br/>');

      const formattedHtml = `<div contenteditable="false" style="background:#F4F6FF; border-left:4px solid #3D2FA4; padding:14px; margin:10px 0; border-radius:0 8px 8px 0; box-shadow:0 4px 12px rgba(40,60,140,0.05);"><div style="font-size:11px; color:#3D2FA4; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px; display:flex; align-items:center; gap:6px;"><span>✨</span> AI Video Annotation</div><div style="font-size:12.5px; color:#0A1030; white-space:pre-wrap; line-height:1.7;">${aiText}</div></div><br/>`;
      
      if (activeNoteId) {
         setNotes(notes.map(n => n.id === activeNoteId ? { ...n, content: n.content + formattedHtml } : n));
      } else {
         const newId = Date.now();
         setNotes([{ id: newId, title: "Annotation: " + cur.title, content: formattedHtml, date: new Date().toLocaleDateString() }, ...notes]);
         setActiveNoteId(newId);
      }
      setDrawer("notes");
    } catch (err) {
      alert("Failed to annotate video: " + err.message);
    } finally {
      setAnnotating(false);
    }
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

  return (
    <div style={{ "--inp":T.inp,"--bd":T.bd,"--tx":T.tx, "--txM":T.txM, "--card":T.card, "--cardHv":T.cardHv, "--sh":T.sh, fontFamily:"'Roboto',sans-serif",background:T.bg,color:T.tx,height:"100vh",display:"flex",overflow:"hidden",position:"relative" }}>
      <style>{css}</style>
      
      {showCompose && <ComposeModal T={T} groupsList={groupsList} onClose={()=>setShowCompose(false)} onPostToGroup={handlePostToGroup} />}
      {showCreateGroup && <CreateGroupModal T={T} onClose={()=>setShowCreateGroup(false)} onCreateGroup={handleCreateGroup} />}
      {showCreateProgram && <CreateProgramModal T={T} currentUser={profileData.personal.name} onClose={()=>{setShowCreateProgram(false); setEditingProg(null);}} onSaveProgram={handleSaveProgram} initialData={editingProg} />}

      {/* Drawers Component */}
      <Drawers
        T={T} B={B} drawer={drawer} setDrawer={setDrawer}
        grp={grp} setGrp={setGrp} msgs={msgs} setMsgs={setMsgs} chatInput={chatInput} setChatInput={setChatInput} sendChat={sendChat} chatEnd={chatEnd} setShowCreateGroup={setShowCreateGroup}
        activeNoteId={activeNoteId} setActiveNoteId={setActiveNoteId} calDate={calDate} setCalDate={setCalDate}
      />

      {/* Main Nav (Left Icon Bar) */}
      <nav style={{ width:56,background:T.sf,borderRight:`1px solid ${T.bd}`,display:"flex",flexDirection:"column",alignItems:"center",padding:"11px 0 12px",gap:2,flexShrink:0,zIndex:30 }}>
        <div style={{ marginBottom:14 }}><Logo size={34}/></div>
        {[{id:"learn",lbl:"Learn",ico:"▶"},{id:"marketplace",lbl:"Market",ico:"🛒"}].map(n=>(
          <button key={n.id} className={`dc-nav${view===n.id?" v-on":""}`} style={{ color:view===n.id?B.green:T.txM }} onClick={()=>navigate(`/${n.id}`)}>
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
        <button onClick={() => signOut(auth)} title="Sign Out"
          style={{ marginTop:14, cursor:"pointer", border:"none", background:"none", fontSize:18, opacity:0.7, transition:"opacity 0.15s" }}
          onMouseOver={e=>e.currentTarget.style.opacity=1} onMouseOut={e=>e.currentTarget.style.opacity=0.7}>
          🚪
        </button>
        <div onClick={() => navigate("/profile")} style={{ marginTop:8, cursor: "pointer", transition: "opacity 0.2s" }} onMouseOver={e=>e.currentTarget.style.opacity=0.8} onMouseOut={e=>e.currentTarget.style.opacity=1} title={user?.displayName || user?.email || "Profile"}>
          {userPhoto ? (
             <img src={userPhoto} alt="Profile" style={{ width: 30, height: 30, borderRadius: "50%", border: `1.5px solid ${B.olive}` }} referrerPolicy="no-referrer" />
          ) : (
             <Av init={userInitials} color={B.olive} size={30}/>
          )}
        </div>
      </nav>

      <div style={{ flex:1,display:"flex",overflow:"hidden",minWidth:0,position:"relative" }}>
        
        <Routes>
          <Route path="/" element={<Navigate to="/learn" replace />} />
          <Route path="/learn" element={
            <Learn
              T={T} B={B} 
              plUrl={plUrl} setPlUrl={setPlUrl} loadPlaylist={loadPlaylist} plLoading={plLoading} plStatus={plStatus} loadLocalFiles={loadLocalFiles}
              prog={prog} lessons={lessons} curIdx={curIdx} cur={cur} prevProg={prevProg} progId={progId} setPreviewId={setPreviewId}
              selLesson={selLesson} enterProg={enterProg} deleteProgram={deleteProgram} setEditingProg={setEditingProg} setShowCreateProgram={setShowCreateProgram}
              ytPlayerRef={ytPlayerRef} captureVideoNote={captureVideoNote} captureNewsNote={captureNewsNote} annotateVideo={annotateVideo} annotating={annotating}
              autoScroll={autoScroll} setAutoScroll={setAutoScroll} scrollPct={scrollPct} lang={lang} setLang={setLang} translate={translate} translating={translating} showTrans={showTrans} setShowTrans={setShowTrans} translation={translation}
              transcript={transcript} setTranscript={setTranscript}
              txRef={txRef} tlRef={tlRef}
              rightTab={rightTab} setRightTab={setRightTab} socSearch={socSearch} setSocSearch={setSocSearch} aiSocSearch={aiSocSearch} loadSoc={loadSoc} filtSoc={filtSoc}
              newsSearch={newsSearch} setNewsSearch={setNewsSearch} aiNewsSearch={aiNewsSearch} loadNews={loadNews} filtNews={filtNews}
            />
          } />
          <Route path="/marketplace" element={<Marketplace T={T} B={B} setEditingProg={setEditingProg} setShowCreateProgram={setShowCreateProgram} deleteProgram={deleteProgram} />} />
          <Route path="/profile" element={<Profile T={T} B={B} />} />
        </Routes>

        {/* Floating AI Chat Overlay */}
        {showAiChat && <AiChatOverlay T={T} B={B} onClose={() => setShowAiChat(false)} prog={prog} cur={cur} />}
        <button className="dc-fab" onClick={() => setShowAiChat(v => !v)} title="✨ Gemini AI"
          style={{ position:"fixed",bottom:100,right:30,zIndex:100,width:56,height:56,borderRadius:"50%",background:`linear-gradient(135deg,${B.indigo},#4F46E5)`,border:`2px solid #ffffff40`,color:"#fff",fontSize:24,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 8px 24px rgba(79,70,229,0.35)" }}>
          ✨
        </button>

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
  const [user, setUser] = useState(undefined); // undefined means still loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) return <div style={{height: "100vh", background: TH.light.bg}} />; // Loading screen

  return (
    <ErrorBoundary>
      <HashRouter>
        {!user ? (
          <Auth T={TH.light} B={B} />
        ) : (
          <StoreProvider user={user}>
            <Discite user={user} />
          </StoreProvider>
        )}
      </HashRouter>
    </ErrorBoundary>
  );
}
