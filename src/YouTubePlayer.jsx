import React, { useEffect, useRef } from "react";

export function YouTubePlayer({ vid, onPlayerReady }) {
  const containerRef = useRef(null);
  
  const cbRef = useRef(onPlayerReady);
  useEffect(() => { cbRef.current = onPlayerReady; }, [onPlayerReady]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    containerRef.current.innerHTML = '<div id="yt-player-target" style="width:100%; height:100%;"></div>';
    const target = containerRef.current.firstElementChild;
    
    let player;
    const init = () => {
      if (window.YT && window.YT.Player) {
        player = new window.YT.Player(target, {
          videoId: vid,
          playerVars: { rel: 0, modestbranding: 1 },
          events: { onReady: (e) => cbRef.current?.(e.target) }
        });
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = init;
    } else if (!window.YT.Player) {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if(prev) prev(); init(); }
    } else { init(); }
    
    return () => { if(player?.destroy) player.destroy(); };
  }, [vid]); 

  return <div ref={containerRef} style={{width:'100%', height:'100%'}}/>;
}