import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    let trailId = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      trailId++;
      setTrail(prev => [...prev.slice(-5), { x: e.clientX, y: e.clientY, id: trailId }]);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.dataset.cursor === 'pointer'
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      {/* Trail effect */}
      {trail.map((point) => (
        <motion.div
          key={point.id}
          className="fixed pointer-events-none z-[10001] rounded-full bg-void-accent/30"
          initial={{ opacity: 0.5, scale: 0.5 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            left: point.x - 4,
            top: point.y - 4,
            width: 8,
            height: 8,
          }}
        />
      ))}
      
      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[10002] mix-blend-difference"
        animate={{
          x: position.x - (isHovering ? 24 : 8),
          y: position.y - (isHovering ? 24 : 8),
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      >
        <div
          className={`rounded-full bg-white transition-all duration-200 ${
            isHovering ? 'w-12 h-12 opacity-50' : 'w-4 h-4 opacity-100'
          }`}
        />
      </motion.div>

      {/* Cursor ring */}
      <motion.div
        className="fixed pointer-events-none z-[10001] border border-white/50 rounded-full"
        animate={{
          x: position.x - 20,
          y: position.y - 20,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.3 : 0.5,
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        style={{ width: 40, height: 40 }}
      />
    </>
  );
};
