import React, { useEffect, useState } from 'react';

const Confetti = () => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const colors = ['#f39c12', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6'];
    const pieces = [];

    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2
      });
    }

    setConfetti(pieces);

    // Clean up confetti after animation
    const timer = setTimeout(() => {
      setConfetti([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            left: piece.x + 'px',
            background: piece.color,
            animationDelay: piece.delay + 's'
          }}
        />
      ))}
    </>
  );
};

export default Confetti; 