'use client';

import { useEffect, useRef, useState } from 'react';

interface ProtectedVideoProps {
  src: string;
  title: string;
}

export default function ProtectedVideo({ src, title }: ProtectedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // طبقة حماية كاملة
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const preventKeydown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U' || e.key === 'p' || e.key === 'P')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c')) ||
        e.key === 'F12' ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        return false;
      }
    };

    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // منع DevTools
    const detectDevTools = () => {
      const threshold = 160;
      if (window.outerWidth - window.innerWidth > threshold || 
          window.outerHeight - window.innerHeight > threshold) {
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-size:24px;">🔒 المحتوى محمي</div>';
      }
    };

    // تشويش على Screen Recorders
    const addWatermark = () => {
      if (!video) return;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '5';
      
      video.parentElement?.appendChild(canvas);

      const draw = () => {
        if (!video.paused && !video.ended) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'rgba(255,255,255,0.03)';
          ctx.font = '16px Arial';
          
          // علامات مائية متحركة
          for (let y = 0; y < canvas.height; y += 80) {
            ctx.fillText(`${title} - Doctor Academy`, (Date.now() / 10) % canvas.width, y);
          }
        }
        requestAnimationFrame(draw);
      };
      draw();
    };

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventKeydown);
    document.addEventListener('dragstart', preventDrag);
    window.addEventListener('resize', detectDevTools);

    addWatermark();

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventKeydown);
      document.removeEventListener('dragstart', preventDrag);
      window.removeEventListener('resize', detectDevTools);
    };
  }, [title]);

  return (
    <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl" style={{ userSelect: 'none' }}>
      {/* شريط حماية */}
      <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-red-600 to-red-800 text-white text-center text-xs py-2 z-20 flex items-center justify-center gap-2">
        <span>🔒</span>
        <span>Protected Content - Doctor Academy</span>
        <span>|</span>
        <span>{title}</span>
        <span>|</span>
        <span>ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
      </div>
      
      {/* طبقة حماية ضد Screen Recorder */}
      <div className="absolute inset-0 z-10 pointer-events-none" 
        style={{ 
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.01) 2px, rgba(0,0,0,0.01) 4px)' 
        }} 
      />

      <video
        ref={videoRef}
        controls
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        className="w-full relative z-0"
        style={{ userSelect: 'none' }}
        crossOrigin="anonymous"
        playsInline
      >
        <source src={src} type="video/mp4" />
        متصفحك لا يدعم تشغيل الفيديو
      </video>
    </div>
  );
}