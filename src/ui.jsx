import React from "react";

export function Spin({ size=13, color="#fff" }) {
  return <span style={{ display:"inline-block",width:size,height:size,border:`2px solid ${color}28`,borderTopColor:color,borderRadius:"50%",animation:"dc-spin 0.7s linear infinite",flexShrink:0 }} />;
}
export function Av({ init, color, size=32 }) {
  const fs=Math.round(size*0.34);
  return <div style={{ width:size,height:size,borderRadius:"50%",background:`${color}18`,border:`1.5px solid ${color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:fs,fontWeight:700,color,fontFamily:"'Marvel',sans-serif",flexShrink:0,letterSpacing:"0.02em" }}>{init}</div>;
}
export function Pill({ label, color }) {
  return <span style={{ background:`${color}18`,border:`1px solid ${color}44`,color,borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:500,whiteSpace:"nowrap" }}>{label}</span>;
}
export function Stars({ r }) {
  const f=Math.floor(r); return <span style={{ color:"#F5A623",fontSize:11 }}>{"★".repeat(f)}{"☆".repeat(5-f)}</span>;
}
export function Logo({ size=36, color="#2FA478" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="22" fill={color}/>
      <text x="22" y="17.5" textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="700" fontFamily="Marvel,sans-serif" letterSpacing="1.5">DIS</text>
      <text x="22" y="30.5" textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="700" fontFamily="Marvel,sans-serif" letterSpacing="1.5">CITE</text>
    </svg>
  );
}
export function SkelBox({ T, lines=[70,50,100,75] }) {
  return (
    <div style={{ background:T.card,border:`1px solid ${T.bd}`,borderRadius:10,padding:13,marginBottom:8 }}>
      {lines.map((w,i)=><div key={i} style={{ height:9,width:`${w}%`,background:T.bd,borderRadius:4,marginBottom:i<lines.length-1?7:0,animation:"dc-pulse 1.4s ease infinite" }} />)}
    </div>
  );
}