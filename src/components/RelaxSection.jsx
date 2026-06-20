import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icons';

export default function RelaxSection() {
  const [subTab, setSubTab] = useState('game'); // 'game', 'clips'
  const [activeGame, setActiveGame] = useState(null); // null, 'santrungvang', 'memory', 'snake'

  return (
    <div className="relax-section">
      <div className="section-header">
        <h2 className="section-title">Góc thư giãn & Giải trí</h2>
        <div className="exams-filter" style={{ marginBottom: 0 }}>
          <button 
            className={`filter-btn ${subTab === 'game' ? 'active' : ''}`}
            onClick={() => { setSubTab('game'); setActiveGame(null); }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="Cpu" style={{ width: '16px', height: '16px' }} />
              Game giải trí
            </span>
          </button>
          <button 
            className={`filter-btn ${subTab === 'clips' ? 'active' : ''}`}
            onClick={() => setSubTab('clips')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="MessageSquare" style={{ width: '16px', height: '16px' }} />
              Clip vui công nghệ
            </span>
          </button>
        </div>
      </div>

      {subTab === 'game' && (
        <div style={{ marginTop: '24px' }}>
          {!activeGame ? (
            <div className="topics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {/* Game 1 Card: Săn Trứng Vàng */}
              <div 
                className="glass-card interactive" 
                onClick={() => setActiveGame('santrungvang')}
                style={{ borderTop: '4px solid var(--color-warning)' }}
              >
                <div className="topic-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }}>
                  <Icon name="Award" style={{ width: '28px', height: '28px', color: 'var(--color-warning)' }} />
                </div>
                <h3 className="topic-title">Săn Trứng Vàng</h3>
                <p className="topic-desc">Huyền thoại game Săn Trứng Vàng kinh điển. Chơi trực tiếp trên màn hình rộng hoặc chế độ phóng to toàn màn hình cực đỉnh.</p>
                <div className="topic-footer">
                  <span>Kinh điển • Vui nhộn</span>
                  <button className="btn btn-primary btn-sm" style={{ backgroundColor: 'var(--color-warning)', color: '#fff', borderColor: 'var(--color-warning)' }}>Chơi ngay</button>
                </div>
              </div>

              {/* Game 2 Card: Khớp Thẻ */}
              <div 
                className="glass-card interactive" 
                onClick={() => setActiveGame('memory')}
                style={{ borderTop: '4px solid var(--color-primary)' }}
              >
                <div className="topic-icon-wrapper" style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)' }}>
                  <Icon name="Cpu" style={{ width: '28px', height: '28px', color: 'var(--color-primary)' }} />
                </div>
                <h3 className="topic-title">Khớp Thẻ Công Nghệ</h3>
                <p className="topic-desc">Trò chơi lật thẻ rèn luyện trí nhớ. Tìm các cặp biểu tượng phần cứng, mạng và cơ sở dữ liệu giống nhau.</p>
                <div className="topic-footer">
                  <span>Trí tuệ • Nhẹ nhàng</span>
                  <button className="btn btn-primary btn-sm">Chơi ngay</button>
                </div>
              </div>

              {/* Game 3 Card: Rắn Săn Mồi */}
              <div 
                className="glass-card interactive" 
                onClick={() => setActiveGame('snake')}
                style={{ borderTop: '4px solid var(--color-secondary)' }}
              >
                <div className="topic-icon-wrapper" style={{ backgroundColor: 'rgba(14, 165, 233, 0.15)' }}>
                  <Icon name="Terminal" style={{ width: '28px', height: '28px', color: 'var(--color-secondary)' }} />
                </div>
                <h3 className="topic-title">Rắn Săn Mồi Neon</h3>
                <p className="topic-desc">Điều khiển chú rắn ăn các bit dữ liệu 0 và 1 trên màn hình thiết bị đầu cuối để lớn lên. Tránh đụng tường!</p>
                <div className="topic-footer">
                  <span>Phản xạ • Cổ điển</span>
                  <button className="btn btn-secondary btn-sm" style={{ backgroundColor: 'var(--color-secondary)', color: '#fff', borderColor: 'var(--color-secondary)' }}>Chơi ngay</button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <button 
                className="back-btn" 
                onClick={() => setActiveGame(null)} 
                style={{ marginBottom: '20px', gap: '8px', display: 'inline-flex', alignItems: 'center' }}
              >
                <Icon name="X" style={{ width: '16px', height: '16px' }} />
                <span>Quay lại kho game</span>
              </button>

              {activeGame === 'santrungvang' && <SanTrungVangGame />}
              {activeGame === 'memory' && <MemoryMatchGame />}
              {activeGame === 'snake' && <SnakeGame />}
            </div>
          )}
        </div>
      )}

      {subTab === 'clips' && <FunnyClipsSection />}
    </div>
  );
}

/* ==================== RUFFLE FLASH GAME ==================== */
function SanTrungVangGame() {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      } else {
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else {
        setIsFullscreen(false);
      }
    }
  };

  const containerStyle = isFullscreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'var(--bg-main)',
    zIndex: 99999,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0,
    border: 'none',
    maxWidth: 'none',
    margin: 0,
    padding: 0
  } : {
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative'
  };

  return (
    <div 
      ref={containerRef}
      className={isFullscreen ? "" : "glass-card"} 
      style={containerStyle}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isFullscreen ? '16px 24px' : '0 0 16px 0',
        borderBottom: isFullscreen ? '1px solid var(--border-color)' : 'none',
        backgroundColor: isFullscreen ? 'var(--bg-nav)' : 'transparent',
      }}>
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: isFullscreen ? '1.35rem' : '1.5rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            🥚 Săn Trứng Vàng
          </h3>
          {!isFullscreen && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', textAlign: 'left' }}>
              Trải nghiệm game Săn Trứng Vàng kinh điển trực tiếp trong trình duyệt.
            </p>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            className="btn btn-primary btn-sm"
            onClick={toggleFullscreen}
            style={{ 
              padding: '8px 16px',
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isFullscreen ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/></svg>
                Thoát toàn màn hình
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3M10 21V10H21M14 3v7H3"/></svg>
                Toàn màn hình
              </>
            )}
          </button>
        </div>
      </div>

      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: isFullscreen ? 'calc(100vh - 72px)' : '600px', 
        backgroundColor: '#000', 
        borderRadius: isFullscreen ? '0' : '12px', 
        overflow: 'hidden',
        border: isFullscreen ? 'none' : '1px solid var(--border-color)'
      }}>
        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0f172a',
            color: 'var(--text-muted)',
            zIndex: 10
          }}>
            <div className="pulse-button" style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', marginBottom: '16px' }}>
              🥚
            </div>
            <span>Đang tải game Săn Trứng Vàng...</span>
          </div>
        )}
        <iframe
          src="https://socvui.com/san-trung-vang.html"
          title="Săn Trứng Vàng"
          style={{ width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
}

/* ==================== MEMORY MATCH GAME ==================== */
function MemoryMatchGame() {
  const iconsList = ['Cpu', 'Network', 'Globe', 'Database', 'Terminal', 'MessageSquare', 'Briefcase', 'BookOpen'];
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initGame = () => {
    const doubleIcons = [...iconsList, ...iconsList];
    const shuffled = doubleIcons
      .map((icon, index) => ({ id: index, icon, isFlipped: false, isMatched: false }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (id) => {
    if (flippedCards.length === 2 || matchedPairs.includes(id) || flippedCards.includes(id)) return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const firstCard = cards.find(c => c.id === newFlipped[0]);
      const secondCard = cards.find(c => c.id === newFlipped[1]);

      if (firstCard.icon === secondCard.icon) {
        setMatchedPairs(prev => [...prev, firstCard.id, secondCard.id]);
        setFlippedCards([]);
        
        if (matchedPairs.length + 2 === cards.length) {
          setGameWon(true);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Khớp Thẻ Công Nghệ</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Lượt đi: <strong>{moves}</strong> | Cặp đã tìm: <strong>{matchedPairs.length / 2} / 8</strong></p>

      {gameWon ? (
        <div style={{ padding: '30px 0' }}>
          <h4 style={{ color: 'var(--color-success)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>🎉 CHIẾN THẮNG!</h4>
          <p style={{ marginBottom: '24px' }}>Bạn đã hoàn thành trò chơi trong <strong>{moves}</strong> lượt lật thẻ.</p>
          <button className="btn btn-primary" onClick={initGame}>Chơi lại</button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          {cards.map(card => {
            const isFlipped = flippedCards.includes(card.id) || matchedPairs.includes(card.id);
            return (
              <div 
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                style={{
                  aspectRatio: '1',
                  backgroundColor: isFlipped ? 'var(--bg-active)' : 'var(--bg-card-hover)',
                  border: isFlipped 
                    ? (matchedPairs.includes(card.id) ? '2px solid var(--color-success)' : '2px solid var(--color-primary)') 
                    : '1px solid var(--border-color)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transform: isFlipped ? 'rotateY(180deg)' : 'none',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                  boxShadow: isFlipped && matchedPairs.includes(card.id) ? '0 0 10px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              >
                {isFlipped ? (
                  <div style={{ transform: 'rotateY(180deg)' }}>
                    <Icon 
                      name={card.icon} 
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        color: matchedPairs.includes(card.id) ? 'var(--color-success)' : 'var(--color-primary)' 
                      }} 
                    />
                  </div>
                ) : (
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-muted)' }}>?</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button className="btn btn-secondary" onClick={initGame} style={{ marginTop: '24px' }}>
        Tải lại bảng
      </button>
    </div>
  );
}

/* ==================== RETRO SNAKE GAME ==================== */
function SnakeGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('snake_highscore') || '0'));
  const [gameOver, setGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const GRID_SIZE = 20;
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 400;

  const snakeRef = useRef([{ x: 200, y: 200 }]);
  const directionRef = useRef({ x: 0, y: -GRID_SIZE });
  const foodRef = useRef({ x: 0, y: 0 });
  const foodBitRef = useRef('1');
  const isStartedRef = useRef(false);

  const getNewFoodPosition = (snake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)) * GRID_SIZE,
        y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE)) * GRID_SIZE,
      };
      const insideSnake = snake.some(part => part.x === newFood.x && part.y === newFood.y);
      if (!insideSnake) break;
    }
    return newFood;
  };

  const initGame = () => {
    snakeRef.current = [
      { x: 200, y: 200 },
      { x: 200, y: 220 },
      { x: 200, y: 240 }
    ];
    directionRef.current = { x: 0, y: -GRID_SIZE };
    foodRef.current = getNewFoodPosition(snakeRef.current);
    foodBitRef.current = Math.random() > 0.5 ? '1' : '0';
    setScore(0);
    setGameOver(false);
    setIsStarted(false);
    isStartedRef.current = false;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code) && directionRef.current.y === 0) {
        directionRef.current = { x: 0, y: -GRID_SIZE };
        startOnKey();
      } else if (['ArrowDown', 'KeyS'].includes(e.code) && directionRef.current.y === 0) {
        directionRef.current = { x: 0, y: GRID_SIZE };
        startOnKey();
      } else if (['ArrowLeft', 'KeyA'].includes(e.code) && directionRef.current.x === 0) {
        directionRef.current = { x: -GRID_SIZE, y: 0 };
        startOnKey();
      } else if (['ArrowRight', 'KeyD'].includes(e.code) && directionRef.current.x === 0) {
        directionRef.current = { x: GRID_SIZE, y: 0 };
        startOnKey();
      }
    };

    const startOnKey = () => {
      if (!isStartedRef.current && !gameOver) {
        setIsStarted(true);
        isStartedRef.current = true;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (!isStarted || gameOver) return;

    const gameTick = () => {
      const snake = [...snakeRef.current];
      const direction = directionRef.current;
      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

      if (head.x < 0 || head.x >= CANVAS_WIDTH || head.y < 0 || head.y >= CANVAS_HEIGHT) {
        handleGameOver();
        return;
      }

      const selfCollide = snake.some(part => part.x === head.x && part.y === head.y);
      if (selfCollide) {
        handleGameOver();
        return;
      }

      snake.unshift(head);

      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(prev => {
          const next = prev + 10;
          if (next > highScore) {
            setHighScore(next);
            localStorage.setItem('snake_highscore', next.toString());
          }
          return next;
        });
        foodRef.current = getNewFoodPosition(snake);
        foodBitRef.current = Math.random() > 0.5 ? '1' : '0';
      } else {
        snake.pop();
      }

      snakeRef.current = snake;
      drawGame();
    };

    const handleGameOver = () => {
      setGameOver(true);
      setIsStarted(false);
      isStartedRef.current = false;
    };

    const drawGame = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < CANVAS_WIDTH; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_HEIGHT);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_WIDTH, i);
        ctx.stroke();
      }

      ctx.fillStyle = '#0ea5e9';
      ctx.font = 'bold 16px Courier New';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#0ea5e9';
      ctx.shadowBlur = 10;
      ctx.fillText(foodBitRef.current, foodRef.current.x + GRID_SIZE/2, foodRef.current.y + GRID_SIZE/2);

      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 8;
      snakeRef.current.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? '#818cf8' : '#6366f1';
        ctx.beginPath();
        ctx.roundRect(part.x + 1, part.y + 1, GRID_SIZE - 2, GRID_SIZE - 2, 4);
        ctx.fill();
      });

      ctx.shadowBlur = 0;
    };

    const intervalId = setInterval(gameTick, 100);
    return () => clearInterval(intervalId);
  }, [isStarted, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Nhấn bất kỳ nút di chuyển nào để bắt đầu!', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
  }, [gameOver]);

  const changeDir = (x, y) => {
    if (!isStarted && !gameOver) {
      setIsStarted(true);
      isStartedRef.current = true;
    }
    const currentDir = directionRef.current;
    if (x !== 0 && currentDir.x === 0) directionRef.current = { x, y: 0 };
    if (y !== 0 && currentDir.y === 0) directionRef.current = { x: 0, y };
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Rắn Săn Mồi Neon</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Điểm: <strong style={{ color: 'var(--color-secondary)' }}>{score}</strong> | Kỷ lục: <strong>{highScore}</strong></p>

      <div style={{ position: 'relative', width: '400px', height: '400px', margin: '0 auto', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />

        {gameOver && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(4px)'
          }}>
            <h4 style={{ color: 'var(--color-danger)', fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>GAME OVER</h4>
            <p style={{ color: '#fff', marginBottom: '20px' }}>Số điểm đạt được: <strong style={{ color: 'var(--color-secondary)' }}>{score}</strong></p>
            <button className="btn btn-primary" onClick={initGame}>Chơi lại</button>
          </div>
        )}
      </div>

      <div style={{
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px'
      }}>
        <button className="btn btn-secondary btn-icon" onClick={() => changeDir(0, -GRID_SIZE)} style={{ width: '44px', height: '44px' }}>▲</button>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button className="btn btn-secondary btn-icon" onClick={() => changeDir(-GRID_SIZE, 0)} style={{ width: '44px', height: '44px' }}>◀</button>
          <button className="btn btn-secondary btn-icon" onClick={() => changeDir(GRID_SIZE, 0)} style={{ width: '44px', height: '44px' }}>▶</button>
        </div>
        <button className="btn btn-secondary btn-icon" onClick={() => changeDir(0, GRID_SIZE)} style={{ width: '44px', height: '44px' }}>▼</button>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '16px' }}>Sử dụng phím mũi tên hoặc nút W/A/S/D trên bàn phím để chơi nhanh.</p>
    </div>
  );
}

/* ==================== FUNNY CLIPS SECTION ==================== */
function FunnyClipsSection() {
  const clips = [
    {
      id: 'clip_1',
      title: 'Khi học sinh ôn thi Tin Học THPT kiểu...',
      description: 'Khi bạn nghĩ lập trình web chỉ là copy-paste và cái kết đầy hài hước.',
      embedId: 'dQw4w9WgXcQ',
      duration: '02:15'
    },
    {
      id: 'clip_2',
      title: 'HTML có thực sự là ngôn ngữ lập trình?',
      description: 'Hài hước tranh luận muôn thuở giữa lập trình viên chính hiệu và dân học thiết kế web.',
      embedId: 'dQw4w9WgXcQ',
      duration: '01:45'
    },
    {
      id: 'clip_3',
      title: 'Cuộc đời của một bug trong mã nguồn',
      description: 'Tìm ra bug đã khó, sửa xong bug đẻ thêm 10 bug khác còn khó hơn!',
      embedId: 'dQw4w9WgXcQ',
      duration: '03:10'
    }
  ];

  return (
    <div style={{ marginTop: '24px' }}>
      <div className="topics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
        {clips.map(clip => (
          <div key={clip.id} className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000' }}>
              <iframe
                src={`https://www.youtube.com/embed/${clip.embedId}`}
                title={clip.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none' }}
              ></iframe>
            </div>
            <div style={{ padding: '16px 20px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>{clip.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{clip.description}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Icon name="Clock" style={{ width: '12px', height: '12px' }} />
                  {clip.duration}
                </span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Giải trí</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
