import { B } from "./theme";

export const LESSONS = [
  { id:1, type:"video", title:"Course Introduction & Environment Setup", dur:"8:42",  vid:"rfscVS0vtbw", done:true,  tags:["Python","environment setup","programming"], references: [{id:1, title:"Python Setup Guide", url:"https://www.python.org/downloads/", type:"link"}, {id:2, title:"Env Cheatsheet", url:"dummy.pdf", type:"pdf"}] },
  { id:2, type:"video", title:"Core Concepts & Data Structures",         dur:"15:20", vid:"PkZNo7MFNFg", done:true,  tags:["JavaScript","data structures","algorithms"], references: [{id:3, title:"MDN Array Docs", url:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array", type:"link"}] },
  { id:3, type:"pdf",   title:"Clean Code Handbook - Chapter 1",         dur:"24 pages", url:"https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf", done:false, tags:["Reading","Clean Code","PDF"], references: [{id:4, title:"Book Exercises Repo", url:"https://github.com", type:"link"}] },
  { id:4, type:"video", title:"Building Full-Stack Projects",            dur:"22:15", vid:"W6NZfCO5SIk", done:false, tags:["React","Node.js","REST API"], references: [] },
  { id:5, type:"video", title:"Advanced Patterns & Architecture",        dur:"18:33", vid:"ysEN5RaKOlA", done:false, tags:["software architecture","design patterns"], references: [] },
];

export const INIT_PROGRAMS = [
  { id:1, title:"Full-Stack Web Development", instructor:"Discite Core", color:B.green,  tags:["React","Node.js","MongoDB"], status:"active",    level:"Intermediate", duration:"14 wks", desc:"Build production-ready MERN stack applications from scratch.", lessons:LESSONS, done:2, total:5 },
  { id:2, title:"Python for Data Science",    instructor:"Dr. Kavya R.",  color:B.indigo, tags:["Python","Pandas","ML"],     status:"enrolled",  level:"Beginner",     duration:"10 wks", desc:"Master data manipulation, visualisation and ML with Python.", lessons:[], done:0, total:12 },
  { id:3, title:"DSA Masterclass",            instructor:"Rahul G.",      color:B.rasp,   tags:["Algorithms","C++","LeetCode"], status:"enrolled",level:"Advanced",     duration:"8 wks",  desc:"Deep dive into algorithms and competitive programming.", lessons:[], done:5, total:8 },
];

export const INIT_GROUPS = [
  { id:1, name:"Full-Stack Builders",  course:"Full-Stack Web Dev",  members:24, color:B.green,  desc:"A cohort building real projects together. Code reviews every Sunday 8 PM IST.", tags:["React","Node.js"] },
  { id:2, name:"Algorithm Aces",       course:"DSA Masterclass",     members:18, color:B.indigo, desc:"Solving LeetCode daily. No question too basic!", tags:["Algorithms","LeetCode"] },
];

export const SEED_MSGS = [
  { id:1, user:"Priya S.",  av:"PS", col:B.green,  text:"Just finished Lesson 3 — the async/await section was mind-blowing 🤯", time:"10:32 AM" },
  { id:2, user:"Rahul M.",  av:"RM", col:B.indigo, text:"Got stuck on error handling though. Anyone willing to share their approach?", time:"10:35 AM" },
  { id:3, user:"You",       av:"ME", col:B.olive,  text:"I can share! Also check the transcript in Lesson 3 — it's super detailed.", time:"10:38 AM", isMe:true },
];

export const MKT_SEED = [
  { id:1, title:"AWS Cloud Credits Starter Pack", cat:"Computing", desc:"AWS Free Tier + ₹4,000 credits for EC2, S3, Lambda.", price:999,  rent:null, rating:4.8, reviews:234,  seller:"Amazon Web Services", badge:"Popular" },
  { id:2, title:"React: The Complete 2025 Guide",  cat:"Courses",   desc:"Build 20 real-world projects. 52 hrs of content.", price:1299, rent:249,  rating:4.9, reviews:5892,  seller:"Discite Learn",       badge:"Bestseller" },
  { id:3, title:"JetBrains WebStorm — Student",    cat:"Software",  desc:"The smartest JavaScript IDE. 1-year student license.", price:3499, rent:299,  rating:4.7, reviews:1203,  seller:"JetBrains",            badge:"Student Deal" },
  { id:4, title:"Clean Code by Robert Martin",     cat:"Books",     desc:"A handbook of Agile software craftsmanship.", price:649,  rent:79,   rating:4.8, reviews:8934,  seller:"Pearson India",        badge:null },
];

export const TRANSCRIPT = `Welcome to this comprehensive learning journey. In today's session we'll explore the foundational concepts that underpin modern software engineering.

The architecture we're working with consists of three primary layers. First is the data layer, which manages all information flowing through your application. Second is the business logic layer, where core functionality lives. Third is the presentation layer.

Understanding how these layers interact is crucial for building scalable, maintainable applications.

When you approach any new engineering problem, start by breaking it into core components. What data do you need? What rules govern how it's processed? How should results be presented?

Debugging is another critical skill. When something doesn't work, a systematic approach is key: isolate the problem, form hypotheses, test methodically, and document what you learn.`;

export const LANGS = ["Hindi","Telugu","Tamil","Spanish","French","German","Japanese"];

export const INIT_PROFILE = {
  personal: { name:"Arjun Sharma", title:"Aspiring Full-Stack Developer", email:"arjun.sharma@email.com", phone:"+91 98765 43210", location:"Hyderabad, India", about:"Passionate Computer Science student with hands-on experience building full-stack applications. Committed to clean code and constant learning." },
  social: { linkedin:"linkedin.com/in/arjun-sharma", github:"github.com/arjun-dev", portfolio:"", twitter:"" },
  education: [{ id:1, degree:"B.Tech in Computer Science", institution:"JNTU Hyderabad", year:"2021–2025", grade:"8.4 CGPA", coursework:"DSA, DBMS, OS" }],
  experience: [{ id:1, role:"Frontend Intern", company:"TechFlow Solutions", duration:"May 2023 - Aug 2023", location:"Remote", desc:"Developed responsive UI components using React and Tailwind. Improved load time by 15%." }],
  projects: [{ id:1, name:"TaskFlow — Full-Stack App", tech:"React, Node.js, MongoDB", desc:"CRUD app with auth. Deployed to Vercel.", link:"github.com/arjun-dev/taskflow" }],
  skills: { technical:["JavaScript","React.js","Node.js","MongoDB","Python","Git"], soft:["Problem Solving","Team Collaboration"] },
};

export const INIT_NOTES = [
  { id: 1, title: "Course Introduction", content: "Remember to install <b>Python 3.10+</b> as mentioned. Setup virtual environments using <i>venv</i>.", date: new Date().toLocaleDateString() },
  { id: 2, title: "Data Structures Ideas", content: "<ul><li>Arrays vs Linked Lists</li><li>Arrays have O(1) access time but O(n) insertions.</li></ul><span style=\"background-color: #ffe066;\">Good to remember for technical interviews.</span>", date: new Date().toLocaleDateString() }
];

export function mkInitEvents() {
  const n=new Date();
  const ds=(off)=>{ const d=new Date(n); d.setDate(d.getDate()+off); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
  return [
    { id:1, title:"Study: React Hooks Deep Dive",  date:ds(0), type:"personal", color:B.olive,  time:"09:00" },
    { id:2, title:"Full-Stack Builders Call",      date:ds(2), type:"group",    color:B.indigo, time:"20:00" },
  ];
}