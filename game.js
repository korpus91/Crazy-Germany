import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, RotateCcw, Heart, Briefcase, MapPin, User, Smartphone, Coffee, Skull, Zap, Flame, AlertTriangle, Euro, Home, Users, Shield, Pill, Brain, Clock, Eye, HandMetal, AlertCircle, FileText, Stamp, Calculator, Ban, CheckCircle, XCircle, Timer, Target, Mouse, Hash, Star, Trophy, Medal } from 'lucide-react';

const BureaucracyHellGame = () => {
  // Core game state
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  
  // Interactive elements state
  const [showCommentary, setShowCommentary] = useState(false);
  const [currentCommentary, setCurrentCommentary] = useState('');
  const [commentaryDuration, setCommentaryDuration] = useState(5000);
  
  // Game meters
  const [shockMeter, setShockMeter] = useState(0);
  const [frustrationMeter, setFrustrationMeter] = useState(0);
  const [kafkaScore, setKafkaScore] = useState(0);
  const [survivalPoints, setSurvivalPoints] = useState(100);
  
  // Mini-game state
  const [currentMiniGame, setCurrentMiniGame] = useState(null);
  const [miniGameActive, setMiniGameActive] = useState(false);
  const [miniGameState, setMiniGameState] = useState({});
  
  // Path tracking
  const [bureaucracyPath, setBureaucracyPath] = useState('standard');
  const [documentsCollected, setDocumentsCollected] = useState([]);
  const [formsRejected, setFormsRejected] = useState(0);
  
  // Enhanced visual effects state
  const [particles, setParticles] = useState([]);
  const [backgroundParticles, setBackgroundParticles] = useState([]);
  const [screenShake, setScreenShake] = useState(false);
  const [flashEffect, setFlashEffect] = useState(null);
  const [rippleEffects, setRippleEffects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animatedMeters, setAnimatedMeters] = useState({
    shock: 0,
    frustration: 0,
    kafka: 0,
    survival: 100
  });
  
  // Refs for animation control
  const gameContainerRef = useRef(null);
  const particleIdCounter = useRef(0);

  // Particle Explosion System
  const createParticleExplosion = useCallback((x, y, type = 'success', customParticles = null) => {
    const particleTypes = {
      success: ['📄', '✅', '🎉', '⭐', '💫', '🏆'],
      failure: ['❌', '💥', '😤', '📋', '⚠️', '💔'],
      milestone: ['🎊', '🏅', '🎯', '💎', '👑', '🌟'],
      documents: ['📜', '📋', '📄', '💼', '📊', '📝'],
      stamps: ['📮', '🏛️', '📋', '✉️', '📪', '🔖']
    };
    
    const particles = customParticles || particleTypes[type] || particleTypes.success;
    const newParticles = [];
    
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const velocity = 100 + Math.random() * 100;
      const particle = {
        id: particleIdCounter.current++,
        emoji: particles[Math.floor(Math.random() * particles.length)],
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.4,
        life: 1,
        gravity: 200 + Math.random() * 100
      };
      newParticles.push(particle);
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    
    // Clean up particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 2000);
  }, []);

  // Screen shake effect
  const triggerScreenShake = useCallback((intensity = 'medium') => {
    const intensityMap = {
      light: 'shake-light',
      medium: 'shake-medium',
      heavy: 'shake-heavy'
    };
    
    setScreenShake(intensityMap[intensity] || 'shake-medium');
    setTimeout(() => setScreenShake(false), 600);
  }, []);

  // Flash effect
  const triggerFlashEffect = useCallback((color = 'white', duration = 300) => {
    setFlashEffect(color);
    setTimeout(() => setFlashEffect(null), duration);
  }, []);

  // Ripple effect
  const createRippleEffect = useCallback((x, y, color = 'rgba(255, 255, 255, 0.6)') => {
    const ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
      color
    };
    
    setRippleEffects(prev => [...prev, ripple]);
    
    setTimeout(() => {
      setRippleEffects(prev => prev.filter(r => r.id !== ripple.id));
    }, 1000);
  }, []);

  // Achievement system
  const unlockAchievement = useCallback((achievement) => {
    if (!achievements.find(a => a.id === achievement.id)) {
      setAchievements(prev => [...prev, achievement]);
      setShowAchievement(achievement);
      createParticleExplosion(400, 200, 'milestone');
      triggerFlashEffect('gold', 500);
      
      setTimeout(() => setShowAchievement(null), 4000);
    }
  }, [achievements, createParticleExplosion, triggerFlashEffect]);

  // Animated meter updates with spring physics
  const updateMeterAnimated = useCallback((meterType, newValue, duration = 800) => {
    const startValue = animatedMeters[meterType];
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for spring effect
      const easeOutBounce = (t) => {
        if (t < 1 / 2.75) return 7.5625 * t * t;
        if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      };
      
      const easedProgress = easeOutBounce(progress);
      const currentValue = startValue + (newValue - startValue) * easedProgress;
      
      setAnimatedMeters(prev => ({ ...prev, [meterType]: currentValue }));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [animatedMeters]);

  // Background particle system
  useEffect(() => {
    const createBackgroundParticle = () => {
      const particles = ['📄', '☕', '📮', '🏛️', '📋', '✉️'];
      return {
        id: Date.now() + Math.random(),
        emoji: particles[Math.floor(Math.random() * particles.length)],
        x: Math.random() * 100,
        y: -10,
        speed: 0.3 + Math.random() * 0.7,
        rotation: Math.random() * 360,
        opacity: 0.3 + Math.random() * 0.4,
        scale: 0.5 + Math.random() * 0.3
      };
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setBackgroundParticles(prev => {
          const filtered = prev.filter(p => p.y < 110);
          return [...filtered, createBackgroundParticle()];
        });
      }
    }, 2000);

    const animationInterval = setInterval(() => {
      setBackgroundParticles(prev => 
        prev.map(p => ({ ...p, y: p.y + p.speed })).filter(p => p.y < 110)
      );
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(animationInterval);
    };
  }, []);

  // Enhanced meter updates
  useEffect(() => {
    updateMeterAnimated('shock', shockMeter);
  }, [shockMeter, updateMeterAnimated]);

  useEffect(() => {
    updateMeterAnimated('frustration', frustrationMeter);
  }, [frustrationMeter, updateMeterAnimated]);

  useEffect(() => {
    updateMeterAnimated('kafka', kafkaScore);
  }, [kafkaScore, updateMeterAnimated]);

  useEffect(() => {
    updateMeterAnimated('survival', survivalPoints);
  }, [survivalPoints, updateMeterAnimated]);

  // Interactive Mini-Game Components
  const DocumentCollectionGame = ({ onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(30);
    const [documents, setDocuments] = useState([]);
    const [collected, setCollected] = useState([]);
    const [score, setScore] = useState(0);
    const [gameActive, setGameActive] = useState(false);
    const [fallingDocs, setFallingDocs] = useState([]);
    const gameAreaRef = useRef(null);

    const documentTypes = [
      { name: 'Passport', emoji: '📔', points: 10, speed: 2 },
      { name: 'Birth Certificate', emoji: '📜', points: 15, speed: 1.5 },
      { name: 'Bank Statement', emoji: '💳', points: 20, speed: 3 },
      { name: 'Work Contract', emoji: '📋', points: 25, speed: 2.5 },
      { name: 'Anmeldung', emoji: '🏠', points: 30, speed: 1 },
      { name: 'Tax Form', emoji: '💶', points: 35, speed: 4 }
    ];

    useEffect(() => {
      if (gameActive && timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else if (timeLeft === 0 && gameActive) {
        endGame();
      }
    }, [timeLeft, gameActive]);

    useEffect(() => {
      if (gameActive) {
        const interval = setInterval(spawnDocument, 1500);
        return () => clearInterval(interval);
      }
    }, [gameActive]);

    // Animate falling documents
    useEffect(() => {
      if (!gameActive) return;

      const animationInterval = setInterval(() => {
        setFallingDocs(prev => prev.map(doc => ({
          ...doc,
          y: doc.y + (doc.speed * 2)
        })).filter(doc => doc.y < 100));
      }, 50);

      return () => clearInterval(animationInterval);
    }, [gameActive, fallingDocs]);

    const startGame = () => {
      setGameActive(true);
      setTimeLeft(30);
      setScore(0);
      setDocuments([]);
      setCollected([]);
      setFallingDocs([]);
    };

    const spawnDocument = () => {
      const type = documentTypes[Math.floor(Math.random() * documentTypes.length)];
      const id = Date.now() + Math.random();
      const newDoc = {
        id,
        ...type,
        x: Math.random() * 80 + 10,
        y: 0
      };
      setFallingDocs(prev => [...prev, newDoc]);
    };

    const collectDocument = (docId) => {
      const doc = fallingDocs.find(d => d.id === docId);
      if (doc) {
        setScore(prev => prev + doc.points);
        setCollected(prev => [...prev, doc.name]);
        setFallingDocs(prev => prev.filter(d => d.id !== docId));
        
        // Enhanced visual feedback with particle explosion
        createParticleExplosion(
          (doc.x / 100) * (gameAreaRef.current?.offsetWidth || 400),
          (doc.y / 100) * (gameAreaRef.current?.offsetHeight || 300),
          'documents'
        );
        
        // Ripple effect at collection point
        createRippleEffect(
          (doc.x / 100) * (gameAreaRef.current?.offsetWidth || 400),
          (doc.y / 100) * (gameAreaRef.current?.offsetHeight || 300),
          'rgba(250, 204, 21, 0.6)'
        );
        
        // Traditional score popup with enhanced styling
        const effect = document.createElement('div');
        effect.innerHTML = `<div style="color: #facc15; font-weight: bold; font-size: 24px; animation: popEffect 1s ease-out forwards; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">+${doc.points}</div>`;
        effect.style.position = 'absolute';
        effect.style.left = doc.x + '%';
        effect.style.top = doc.y + '%';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '1000';
        gameAreaRef.current?.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
        
        // Screen shake for high-value documents
        if (doc.points >= 25) {
          triggerScreenShake('light');
        }
      }
    };

    const endGame = () => {
      setGameActive(false);
      const success = score >= 150;
      const requiredDocs = ['Passport', 'Anmeldung', 'Work Contract'];
      const hasRequired = requiredDocs.every(doc => collected.includes(doc));
      
      // Trigger dramatic effects based on performance
      if (success && hasRequired) {
        createParticleExplosion(400, 200, 'milestone');
        triggerFlashEffect('gold', 800);
        triggerScreenShake('medium');
        
        // Check for achievements
        if (score >= 200) {
          unlockAchievement({
            id: 'document_master',
            title: 'Document Master',
            description: 'Scored 200+ points in document collection',
            icon: '🏆',
            rarity: 'epic'
          });
        }
      } else {
        createParticleExplosion(400, 200, 'failure');
        triggerFlashEffect('red', 500);
        triggerScreenShake('light');
      }
      
      onComplete({
        success: success && hasRequired,
        score,
        message: success && hasRequired ? 
          `Amazing! You collected ${collected.length} documents with ${score} points! Even the Beamter is impressed!` :
          `You only scored ${score} points. Missing critical documents. The bureaucracy wins again.`,
        stats: { 
          frustration: success ? -20 : 30, 
          kafka: 15,
          shock: success ? 10 : 25
        }
      });
    };

    return (
      <div className="w-full h-full flex flex-col">
        <div className="bg-red-900/40 p-4 rounded-t-2xl">
          <div className="flex justify-between items-center mb-2">
            <div className="text-yellow-400 font-bold text-xl">Score: {score}</div>
            <div className="text-white font-bold text-xl flex items-center gap-2">
              <Timer className="w-5 h-5" />
              {timeLeft}s
            </div>
          </div>
          <div className="text-sm text-gray-300">
            Target: 150 points | Collected: {collected.length} documents
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 mt-2 relative overflow-hidden">
            <div 
              className="bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 h-full rounded-full transition-all duration-700 ease-out relative"
              style={{ 
                width: `${Math.min((score / 150) * 100, 100)}%`,
                animation: score > 0 ? 'progress-pulse 2s ease-in-out infinite' : 'none'
              }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            </div>
            {score >= 150 && (
              <div className="absolute right-2 top-0 h-full flex items-center">
                <div className="text-yellow-300 animate-bounce">🎯</div>
              </div>
            )}
          </div>
        </div>
        
        <div 
          ref={gameAreaRef}
          className="relative flex-1 bg-gradient-to-b from-gray-900 to-black rounded-b-2xl overflow-hidden"
          style={{ minHeight: '400px', cursor: gameActive ? 'crosshair' : 'default' }}
        >
          {!gameActive && timeLeft === 30 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={startGame}
                className="bg-yellow-600 hover:bg-yellow-500 text-black font-black text-2xl px-8 py-4 rounded-xl transform hover:scale-110 transition-all shadow-2xl"
              >
                START COLLECTING!
              </button>
            </div>
          ) : gameActive ? (
            <>
              {fallingDocs.map(doc => (
                <div
                  key={doc.id}
                  className="absolute cursor-pointer transition-transform hover:scale-125 animate-pulse"
                  style={{
                    left: `${doc.x}%`,
                    top: `${doc.y}%`,
                    transform: 'translate(-50%, -50%)',
                    animation: `fall-wiggle 2s ease-in-out infinite`
                  }}
                  onClick={() => collectDocument(doc.id)}
                >
                  <div className="relative text-center">
                    {/* Particle trail effect */}
                    <div 
                      className="absolute inset-0 animate-ping opacity-50"
                      style={{
                        background: `radial-gradient(circle, rgba(250, 204, 21, 0.3) 0%, transparent 70%)`,
                        borderRadius: '50%'
                      }}
                    ></div>
                    <div className="relative z-10">
                      <div className="text-5xl animate-bounce drop-shadow-lg">{doc.emoji}</div>
                      <div className="text-xs text-yellow-400 font-bold bg-black/70 rounded px-1 mt-1 shadow-lg">+{doc.points}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold animate-pulse text-xl bg-black/70 px-4 py-2 rounded-xl shadow-lg">
                🎯 CLICK THE FALLING DOCUMENTS! 🎯
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center flex-col bg-black/50 backdrop-blur-sm">
              <div className="text-3xl text-yellow-400 font-bold mb-4 animate-bounce">Game Over!</div>
              <div className="text-xl text-white mb-2">Final Score: <span className="text-yellow-400">{score}</span></div>
              <div className="text-sm text-gray-300">
                {score >= 150 ? '🎉 Excellent work!' : '📋 Practice makes perfect!'}
              </div>
            </div>
          )}
        </div>
        
        <style>{`
          @keyframes popEffect {
            0% { transform: scale(1) translateY(0); opacity: 1; }
            100% { transform: scale(2) translateY(-50px); opacity: 0; }
          }
          @keyframes fall-wiggle {
            0%, 100% { transform: translateX(0) rotate(0deg); }
            25% { transform: translateX(-3px) rotate(-2deg); }
            75% { transform: translateX(3px) rotate(2deg); }
          }
          @keyframes progress-pulse {
            0%, 100% { box-shadow: 0 0 5px rgba(250, 204, 21, 0.5); }
            50% { box-shadow: 0 0 20px rgba(250, 204, 21, 0.8), 0 0 30px rgba(34, 197, 94, 0.4); }
          }
        `}</style>
      </div>
    );
  };

  const AnmeldungClickerGame = ({ onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(10);
    const [clicks, setClicks] = useState(0);
    const [targetClicks, setTargetClicks] = useState(50);
    const [competitors, setCompetitors] = useState(0);
    const [gameActive, setGameActive] = useState(false);
    const [clickEffects, setClickEffects] = useState([]);
    const [clickPower, setClickPower] = useState(1);
    const [powerUpActive, setPowerUpActive] = useState(false);

    useEffect(() => {
      if (gameActive && timeLeft > 0) {
        const timer = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
          setCompetitors(prev => prev + Math.floor(Math.random() * 10));
        }, 1000);
        return () => clearTimeout(timer);
      } else if (timeLeft === 0 && gameActive) {
        endGame();
      }
    }, [timeLeft, gameActive]);

    // Random power-up
    useEffect(() => {
      if (gameActive && Math.random() > 0.9 && !powerUpActive) {
        setPowerUpActive(true);
        setClickPower(3);
        setTimeout(() => {
          setPowerUpActive(false);
          setClickPower(1);
        }, 2000);
      }
    }, [clicks, gameActive, powerUpActive]);

    const startGame = () => {
      setGameActive(true);
      setTimeLeft(10);
      setClicks(0);
      setCompetitors(0);
      setTargetClicks(40 + Math.floor(Math.random() * 20));
      setClickEffects([]);
      setClickPower(1);
    };

    const handleClick = (e) => {
      if (!gameActive) return;
      
      const newClicks = clicks + clickPower;
      setClicks(newClicks);
      
      // Visual click effect with enhanced feedback
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now() + Math.random();
      
      setClickEffects(prev => [...prev, { id, x, y, power: clickPower }]);
      
      // Create particle explosion at click point
      if (powerUpActive) {
        createParticleExplosion(x, y, 'success', ['💥', '⚡', '🔥', '💫']);
        triggerScreenShake('light');
      } else {
        createRippleEffect(x, y, 'rgba(250, 204, 21, 0.7)');
      }
      
      setTimeout(() => {
        setClickEffects(prev => prev.filter(effect => effect.id !== id));
      }, 1000);
      
      // Achievement check for rapid clicking
      if (newClicks >= 30 && timeLeft >= 5) {
        unlockAchievement({
          id: 'speed_clicker',
          title: 'Lightning Fingers',
          description: 'Reached 30 clicks with time to spare',
          icon: '⚡',
          rarity: 'rare'
        });
      }
    };

      // Screen shake on power clicks
      if (clickPower > 1) {
        e.currentTarget.style.animation = 'shake 0.2s';
        setTimeout(() => {
          e.currentTarget.style.animation = '';
        }, 200);
      }
    };

    const endGame = () => {
      setGameActive(false);
      const success = clicks >= targetClicks;
      
      // Dramatic end game effects
      if (success) {
        createParticleExplosion(400, 200, 'milestone');
        triggerFlashEffect('green', 1000);
        triggerScreenShake('heavy');
        
        // Special achievements for exceptional performance
        if (clicks >= targetClicks + 20) {
          unlockAchievement({
            id: 'overachiever',
            title: 'Bureaucratic Overachiever',
            description: 'Exceeded target by 20+ clicks',
            icon: '🚀',
            rarity: 'legendary'
          });
        }
      } else {
        createParticleExplosion(400, 200, 'failure');
        triggerFlashEffect('red', 600);
        triggerScreenShake('medium');
      }
      
      onComplete({
        success,
        message: success ? 
          `INCREDIBLE! ${clicks} clicks in 10 seconds! You DESTROYED ${competitors} other applicants! The website crashed from your power!` :
          `Only ${clicks} clicks. You needed ${targetClicks}. ${competitors} people got appointments instead. The German efficiency wins.`,
        stats: { 
          frustration: success ? 10 : 40, 
          shock: 20,
          kafka: success ? 10 : 30
        }
      });
    };

    const progress = (clicks / targetClicks) * 100;

    return (
      <div className="w-full h-full flex flex-col">
        <div className="bg-red-900/40 p-4 rounded-t-2xl">
          <div className="flex justify-between items-center mb-2">
            <div className="text-yellow-400 font-bold text-xl flex items-center gap-2">
              Clicks: {clicks}
              {powerUpActive && <span className="text-green-400 animate-pulse">x3!</span>}
            </div>
            <div className="text-white font-bold text-xl flex items-center gap-2">
              <Timer className="w-5 h-5" />
              {timeLeft}s
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-6 mb-2 overflow-hidden relative">
            <div 
              className="h-full transition-all duration-300 ease-out relative"
              style={{ 
                width: `${Math.min(progress, 100)}%`,
                background: progress >= 100 ? 
                  'linear-gradient(to right, #10b981, #facc15)' : 
                  'linear-gradient(to right, #facc15, #ef4444)',
                animation: progress >= 100 ? 'progress-celebration 1s ease-in-out infinite' : 
                          progress > 50 ? 'progress-pulse 2s ease-in-out infinite' : 'none'
              }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
              {progress >= 100 && (
                <div className="absolute inset-0 flex items-center justify-center text-black font-bold text-xs animate-bounce">
                  🎯 TARGET REACHED! 🎯
                </div>
              )}
            </div>
            {/* Progress milestones */}
            <div className="absolute top-0 w-full h-full flex items-center">
              {[25, 50, 75].map(milestone => (
                <div 
                  key={milestone}
                  className={`absolute w-1 h-full ${progress >= milestone ? 'bg-white' : 'bg-gray-600'} transition-all`}
                  style={{ left: `${milestone}%` }}
                >
                  {progress >= milestone && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-xs">
                      ⭐
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-300 flex justify-between">
            <span>Target: {targetClicks} clicks</span>
            <span className="text-red-400">Competitors: {competitors} 😰</span>
          </div>
        </div>
        
        <div 
          className="relative flex-1 bg-gradient-to-br from-blue-900 to-black rounded-b-2xl overflow-hidden select-none"
          style={{ minHeight: '400px' }}
          onClick={handleClick}
          onMouseDown={(e) => e.preventDefault()}
        >
          {!gameActive && timeLeft === 10 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-black text-2xl px-8 py-4 rounded-xl transform hover:scale-110 transition-all shadow-2xl animate-pulse"
              >
                START CLICKING BATTLE!
              </button>
            </div>
          ) : gameActive ? (
            <>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`transition-all ${powerUpActive ? 'scale-150' : 'scale-100'}`}>
                  <Mouse className={`w-32 h-32 ${powerUpActive ? 'text-green-400' : 'text-blue-400'} ${powerUpActive ? 'animate-spin' : 'animate-pulse'}`} />
                  {powerUpActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-green-400 font-black text-3xl animate-bounce">POWER!</span>
                    </div>
                  )}
                </div>
              </div>
              
              {clickEffects.map(effect => (
                <div
                  key={effect.id}
                  className="absolute pointer-events-none animate-ping"
                  style={{ 
                    left: effect.x - 20, 
                    top: effect.y - 20,
                    animation: 'clickBurst 1s ease-out forwards'
                  }}
                >
                  <div className="text-yellow-400 font-black text-3xl">
                    +{effect.power}
                  </div>
                </div>
              ))}
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
                <div className="text-yellow-400 font-black text-2xl animate-bounce mb-2">
                  CLICK ANYWHERE! FASTER!
                </div>
                <div className="text-white text-sm">
                  {targetClicks - clicks} clicks to go!
                </div>
              </div>

              {/* Competitor alerts */}
              {competitors > 50 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-xl animate-pulse">
                  ⚠️ {competitors} people ahead of you! ⚠️
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="text-4xl text-yellow-400 font-black mb-4">TIME'S UP!</div>
              <div className="text-2xl text-white mb-2">Your Clicks: {clicks}</div>
              <div className="text-xl text-gray-400">Target was: {targetClicks}</div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes clickBurst {
            0% { 
              transform: scale(1) translateY(0); 
              opacity: 1; 
            }
            100% { 
              transform: scale(3) translateY(-100px); 
              opacity: 0; 
            }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
        `}</style>
      </div>
    );
  };

  const FormNumberPuzzleGame = ({ onComplete }) => {
    const [gameActive, setGameActive] = useState(false);
    const [currentPuzzle, setCurrentPuzzle] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [attempts, setAttempts] = useState(3);
    const [hints, setHints] = useState([]);
    const [solved, setSolved] = useState(false);

    const puzzles = [
      {
        question: "Form A requires Form B. Form B requires Form C. Form C requires Form A. Which form do you submit first?",
        answer: "D",
        hints: ["Think outside the circle", "The answer isn't A, B, or C", "German logic: create a new form"],
        explanation: "In German bureaucracy, when faced with circular dependencies, you create Form D to break the cycle!"
      },
      {
        question: "Office hours: Mon 10:00-10:15, Wed 14:30-14:45, Fri during full moon. If today is Tuesday, when can you visit?",
        answer: "NEVER",
        hints: ["Read carefully", "What day is today?", "Tuesday isn't listed"],
        explanation: "Classic German bureaucracy: The office isn't open on Tuesdays at all!"
      },
      {
        question: "You need 3 copies. Original + 2 copies = 3 total. But they keep all 3. How many do you bring?",
        answer: "4",
        hints: ["They keep everything", "You need one too", "3 + your copy"],
        explanation: "Bring 4: they keep 3, you keep 1 for your records. German efficiency!"
      }
    ];

    const startGame = () => {
      const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
      setCurrentPuzzle(puzzle);
      setGameActive(true);
      setUserInput('');
      setAttempts(3);
      setHints([]);
      setSolved(false);
    };

    const submitAnswer = () => {
      if (userInput.toUpperCase() === currentPuzzle.answer) {
        setSolved(true);
        setTimeout(() => {
          onComplete({
            success: true,
            message: `Brilliant! ${currentPuzzle.explanation}`,
            stats: { 
              kafka: 50, 
              frustration: -30,
              shock: 20
            }
          });
        }, 2000);
      } else {
        setAttempts(prev => prev - 1);
        if (attempts <= 1) {
          onComplete({
            success: false,
            message: `The answer was "${currentPuzzle.answer}". ${currentPuzzle.explanation}`,
            stats: { 
              kafka: 30, 
              frustration: 40,
              shock: 15
            }
          });
        }
      }
    };

    const getHint = () => {
      if (hints.length < currentPuzzle.hints.length) {
        setHints([...hints, currentPuzzle.hints[hints.length]]);
      }
    };

    return (
      <div className="w-full h-full flex flex-col">
        {!gameActive ? (
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={startGame}
              className="bg-purple-600 hover:bg-purple-500 text-white font-black text-2xl px-8 py-4 rounded-xl transform hover:scale-110 transition-all"
            >
              START PUZZLE!
            </button>
          </div>
        ) : (
          <>
            <div className="bg-purple-900/40 p-6 rounded-t-2xl">
              <div className="text-yellow-400 font-bold text-xl mb-4">Bureaucratic Logic Puzzle</div>
              <div className="text-white text-lg mb-4">{currentPuzzle.question}</div>
              <div className="flex gap-2 mb-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${
                      i < attempts ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                ))}
                <span className="text-gray-300 ml-2">Attempts left</span>
              </div>
            </div>
            
            <div className="flex-1 bg-gradient-to-b from-purple-900 to-black p-6 rounded-b-2xl">
              {solved ? (
                <div className="text-center">
                  <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4 animate-bounce" />
                  <div className="text-2xl text-green-400 font-bold">SOLVED!</div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                      className="w-full bg-gray-800 text-white text-xl p-4 rounded-xl border-2 border-purple-600 focus:border-yellow-400 focus:outline-none"
                      placeholder="Type your answer..."
                      autoFocus
                    />
                  </div>
                  
                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={submitAnswer}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all"
                    >
                      Submit Answer
                    </button>
                    <button
                      onClick={getHint}
                      disabled={hints.length >= currentPuzzle.hints.length}
                      className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white font-bold px-6 py-3 rounded-xl transition-all"
                    >
                      Hint ({currentPuzzle.hints.length - hints.length})
                    </button>
                  </div>
                  
                  {hints.length > 0 && (
                    <div className="bg-gray-800 p-4 rounded-xl">
                      <div className="text-yellow-400 font-bold mb-2">Hints:</div>
                      {hints.map((hint, i) => (
                        <div key={i} className="text-gray-300 mb-1">• {hint}</div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const QueueSimulatorGame = ({ onComplete }) => {
    const [position, setPosition] = useState(50);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [gameActive, setGameActive] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [queuePeople, setQueuePeople] = useState([]);
    const [officeOpen, setOfficeOpen] = useState(true);
    const [playerAnimation, setPlayerAnimation] = useState('');

    const events = [
      { 
        text: "Someone cuts in line!", 
        emoji: "😤", 
        action: "PROTEST", 
        effect: () => {
          setPosition(p => p + 5);
          setPlayerAnimation('shake');
          setTimeout(() => setPlayerAnimation(''), 500);
        }
      },
      { 
        text: "Coffee break announced", 
        emoji: "☕", 
        action: "WAIT", 
        effect: () => {
          setTimeElapsed(t => t + 30);
          setOfficeOpen(false);
          setTimeout(() => setOfficeOpen(true), 3000);
        }
      },
      { 
        text: "Express lane opens!", 
        emoji: "🎉", 
        action: "RUSH", 
        effect: () => {
          setPosition(p => Math.max(1, p - 10));
          setPlayerAnimation('jump');
          setTimeout(() => setPlayerAnimation(''), 500);
        }
      },
      { 
        text: "System crash!", 
        emoji: "💥", 
        action: "PANIC", 
        effect: () => {
          setTimeElapsed(t => t + 60);
          setQueuePeople(prev => prev.map(p => ({ ...p, angry: true })));
          setTimeout(() => setQueuePeople(prev => prev.map(p => ({ ...p, angry: false }))), 2000);
        }
      }
    ];

    // Initialize queue visualization
    useEffect(() => {
      if (gameActive) {
        const people = [];
        for (let i = 0; i < position + 20; i++) {
          people.push({
            id: i,
            emoji: ['👨', '👩', '🧑', '👴', '👵'][Math.floor(Math.random() * 5)],
            angry: false
          });
        }
        setQueuePeople(people);
      }
    }, [gameActive, position]);

    useEffect(() => {
      if (gameActive && position > 0 && officeOpen) {
        const moveInterval = setInterval(() => {
          setPosition(p => {
            const newPos = Math.max(0, p - 1);
            if (newPos === 0) {
              endGame(true);
            }
            return newPos;
          });
          setTimeElapsed(t => t + 6);
        }, 1000);

        const eventInterval = setInterval(() => {
          if (Math.random() > 0.6 && !currentEvent) {
            const event = events[Math.floor(Math.random() * events.length)];
            setCurrentEvent(event);
            event.effect();
            setTimeout(() => setCurrentEvent(null), 3000);
          }
        }, 4000);

        return () => {
          clearInterval(moveInterval);
          clearInterval(eventInterval);
        };
      }
    }, [gameActive, position, officeOpen]);

    const startGame = () => {
      setGameActive(true);
      setPosition(30 + Math.floor(Math.random() * 20));
      setTimeElapsed(0);
      setOfficeOpen(true);
      setQueuePeople([]);
    };

    const handleEventAction = () => {
      if (currentEvent && currentEvent.action === "RUSH") {
        setPosition(p => Math.max(1, p - 5));
        setCurrentEvent(null);
      }
    };

    const endGame = (reached) => {
      setGameActive(false);
      const hours = Math.floor(timeElapsed / 60);
      const minutes = timeElapsed % 60;
      
      onComplete({
        success: reached && hours < 4,
        message: reached ? 
          `MIRACLE! You reached the counter in ${hours}h ${minutes}m! The Beamter actually acknowledged your existence!` :
          `After ${hours}h ${minutes}m, the office closed. You were still #${position}. Tomorrow you start at #${position + 20}.`,
        stats: { 
          frustration: reached && hours < 4 ? 20 : 60, 
          kafka: timeElapsed / 6,
          shock: reached ? 10 : 30
        }
      });
    };

    return (
      <div className="w-full h-full flex flex-col">
        {!gameActive ? (
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={startGame}
              className="bg-gray-600 hover:bg-gray-500 text-white font-black text-2xl px-8 py-4 rounded-xl transform hover:scale-110 transition-all shadow-2xl"
            >
              JOIN THE QUEUE!
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gray-800 p-4 rounded-t-2xl">
              <div className="flex justify-between items-center mb-2">
                <div className="text-yellow-400 font-bold text-xl">Position: #{position}</div>
                <div className="text-white font-bold text-xl">
                  Time: {Math.floor(timeElapsed / 60)}h {timeElapsed % 60}m
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className={`${officeOpen ? 'text-green-400' : 'text-red-400'} font-bold`}>
                  Office: {officeOpen ? 'OPEN' : 'CLOSED (Coffee Break)'}
                </div>
                <div className="text-gray-300">
                  Speed: {position <= 10 ? 'FAST!' : position <= 30 ? 'Normal' : 'Glacial'}
                </div>
              </div>
            </div>
            
            <div className="flex-1 bg-gradient-to-b from-gray-700 to-black p-6 rounded-b-2xl relative overflow-hidden">
              {/* Queue visualization */}
              <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2">
                <div className="relative h-20 overflow-hidden">
                  <div className="absolute flex items-center gap-2 transition-all duration-1000"
                       style={{ transform: `translateX(${-position * 30}px)` }}>
                    {queuePeople.map((person, i) => (
                      <div
                        key={person.id}
                        className={`text-4xl transition-all ${
                          i === position ? 'scale-150 animate-bounce' : 'scale-100'
                        } ${person.angry ? 'animate-pulse text-red-500' : ''}`}
                        style={{
                          opacity: Math.abs(i - position) > 10 ? 0.3 : 1,
                          animation: i === position && playerAnimation ? `${playerAnimation} 0.5s` : ''
                        }}
                      >
                        {i === position ? '🙋' : person.emoji}
                      </div>
                    ))}
                    <div className="text-6xl ml-8">🏢</div>
                  </div>
                </div>
              </div>
              
              {/* Events */}
              {currentEvent && (
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl animate-bounce">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{currentEvent.emoji}</div>
                    <div className="font-bold text-lg">{currentEvent.text}</div>
                    {currentEvent.action === "RUSH" && (
                      <button
                        onClick={handleEventAction}
                        className="mt-2 bg-yellow-500 text-black px-4 py-1 rounded font-bold hover:bg-yellow-400"
                      >
                        RUSH FORWARD!
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-yellow-400 font-bold text-lg">
                  {position > 30 ? "This is your life now..." : 
                   position > 20 ? "Getting warmer..." : 
                   position > 10 ? "Almost there!" : 
                   position > 5 ? "So close!" : 
                   "YOUR TURN SOON!"}
                </div>
                {!officeOpen && (
                  <div className="text-red-400 text-sm mt-2 animate-pulse">
                    ⏸️ Queue paused for coffee break
                  </div>
                )}
              </div>

              {/* Queue info */}
              <div className="absolute top-4 right-4 bg-black/50 rounded-lg p-2 text-xs text-gray-300">
                <div>People ahead: {position}</div>
                <div>People behind: {queuePeople.length - position - 1}</div>
                <div>Total in queue: {queuePeople.length}</div>
              </div>
            </div>
          </>
        )}

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          @keyframes jump {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    );
  };

  // Mini-game configurations with actual game components
  const miniGames = {
    documentRace: {
      title: "Document Collection Speedrun",
      component: DocumentCollectionGame
    },
    anmeldungSpeedrun: {
      title: "Anmeldung Appointment Clicker",
      component: AnmeldungClickerGame
    },
    formLogicPuzzle: {
      title: "Bureaucratic Logic Puzzle",
      component: FormNumberPuzzleGame
    },
    queueSimulator: {
      title: "German Queue Simulator 2025",
      component: QueueSimulatorGame
    }
  };

  // Pre-generated response pools for token efficiency
  const commentaryPools = {
    reason: {
      moving: [
        "Ah, fresh meat for the bureaucracy grinder! Your optimism is adorable.",
        "Moving to Germany? The paperwork alone weighs more than your furniture.",
        "Welcome to the land where you need permission to get permission to apply for permission.",
        "Pro tip: The Anmeldung office is like Mordor, but with longer queues and less helpful orcs.",
        "Your moving plans? Cute. The Bürgeramt has other plans for your soul.",
        "Fun fact: Germans invented bureaucracy because warfare was too straightforward.",
        "The first thing you'll learn: Forms are not suggestions, they're divine commandments.",
        "Moving here is like joining a cult, except the cult worships filing systems.",
        "Did you bring your Beglaubigungsschein for your Bescheinigungsantrag? Of course not.",
        "Welcome to Germany, where even your shadow needs proper documentation."
      ],
      business: [
        "Starting a business in Germany? Your descendants might see it registered.",
        "The Finanzamt already knows you're here. They can smell entrepreneurial spirit.",
        "Fun fact: The business registration form has more pages than your business plan.",
        "Ahh, the sweet sound of dreams being crushed by Gewerbeanmeldung forms.",
        "Your business idea is revolutionary? Wait until you meet the Handwerkskammer.",
        "IHK membership is mandatory. Resistance is futile. Your wallet will be assimilated.",
        "Business license? That's just the appetizer. The main course is the Steuernummer maze.",
        "The GmbH registration process makes Game of Thrones look like a children's book.",
        "Plot twist: Your business will spend more on bureaucracy than on actual business.",
        "Congratulations! You've successfully registered to register to begin thinking about starting."
      ],
      marriage: [
        "Getting married? The paperwork lasts longer than most marriages.",
        "Love is patient, love is kind, love requires 37 certified documents.",
        "Romance level: Spending date nights at the Standesamt.",
        "Till death do us part? More like till the Ehefähigkeitszeugnis expires.",
        "Your wedding vows will be shorter than the list of required documents.",
        "Plot twist: The real test of your relationship is surviving the Anmeldung together.",
        "Nothing says 'I love you' like a properly notarized Geburtsurkunde.",
        "German efficiency: Making divorce paperwork easier than marriage paperwork since 1949.",
        "Your marriage certificate needs its own marriage certificate to be valid.",
        "Fun fact: The average German wedding has more stamps than guests."
      ],
      dog: [
        "Registering a dog? Even Fido needs a Personalausweis here.",
        "Your dog will have more official documentation than most humans.",
        "Hundesteuer: Because even German dogs must contribute to society.",
        "Plot twist: Your dog speaks better German than you do.",
        "The dog registration office has seen things. Terrible, unleashed things.",
        "Your pet's paperwork will outlive your pet. And probably you too.",
        "German dogs don't bark, they file formal noise complaints.",
        "Breaking: Local dog refused entry to park for lacking proper vaccination certificate.",
        "Your dog's insurance will cost more than your car insurance. This is normal.",
        "Fun fact: German dogs are the only ones who actually enjoy bureaucracy."
      ]
    },
    general: [
      "Meanwhile, in the Bürgeramt, another soul is being processed.",
      "The machine demands sacrifice. Today, it hungers for your time and sanity.",
      "German efficiency is a myth. German thoroughness, however, is terrifyingly real.",
      "Form 47-B requires Form 23-A, which needs approval from Office C, which is currently on coffee break.",
      "You thought you understood paperwork. You were adorably wrong.",
      "The bureaucracy doesn't make mistakes. It makes learning opportunities. Very expensive ones.",
      "Plot twist: The person behind the counter is just as confused as you are.",
      "Breaking: Local human spotted leaving government office with approved form. Scientists baffled.",
      "Your German vocabulary will expand rapidly. Mostly with curse words.",
      "Fun fact: 73% of German trees exist solely to be turned into government forms."
    ],
    motivation: [
      "Remember: Every rejected form brings you closer to bureaucratic enlightenment.",
      "The path to German residency is paved with properly stamped intentions.",
      "You're not stuck in traffic, you're part of the Warteschlange experience.",
      "Each 'Nein' from a civil servant is just German for 'try again with more documents.'",
      "Embrace the chaos. Let the paperwork flow through you.",
      "You are becoming one with the system. Resistance is paperwork.",
      "The Beamter is not your enemy. They are merely vessels of the great bureaucratic truth.",
      "Your suffering has meaning. It feeds the machine that keeps Germany running.",
      "Every hour spent in a queue is an hour spent growing stronger.",
      "Remember: You chose this. The paperwork didn't choose you."
    ]
  };

  // Get random commentary without AI
  const getRandomCommentary = (category, subcategory) => {
    const pool = commentaryPools[category]?.[subcategory] || commentaryPools[category];
    if (Array.isArray(pool)) {
      return pool[Math.floor(Math.random() * pool.length)];
    }
    return "The bureaucracy is processing your request. Estimated time: ∞";
  };

  // Question pools
  const baseQuestions = [
    {
      id: 'reason',
      title: 'Why are you entering the bureaucratic thunderdome?',
      subtitle: 'Choose your adventure in administrative hell',
      icon: <FileText className="w-6 h-6" />,
      options: [
        { value: 'moving', label: 'Moving to Germany', emoji: '🏠', desc: 'Sweet innocent soul', shock: 10 },
        { value: 'business', label: 'Starting a business', emoji: '💼', desc: 'Entrepreneurial masochist', shock: 25 },
        { value: 'marriage', label: 'Getting married', emoji: '💑', desc: 'Love conquers paperwork?', shock: 20 },
        { value: 'dog', label: 'Registering a dog', emoji: '🐕', desc: 'Even dogs need papers', shock: 15 }
      ]
    },
    {
      id: 'experience',
      title: 'What\'s your bureaucracy experience level?',
      subtitle: 'How dead are you inside?',
      icon: <Brain className="w-6 h-6" />,
      options: [
        { value: 'virgin', label: 'First timer', emoji: '🌱', desc: 'Still have hope', frustration: 0 },
        { value: 'scarred', label: 'Been hurt before', emoji: '😔', desc: 'PTSD activated', frustration: 30 },
        { value: 'veteran', label: 'Grizzled veteran', emoji: '🎖️', desc: 'Dead inside', frustration: 50 },
        { value: 'legendary', label: 'Bureaucracy wizard', emoji: '🧙', desc: 'Speaks fluent Amtsdeutsch', frustration: -20 }
      ]
    },
    {
      id: 'preparation',
      title: 'How did you prepare for battle?',
      subtitle: 'Spoiler: It won\'t help',
      icon: <Shield className="w-6 h-6" />,
      options: [
        { value: 'google', label: 'Googled it', emoji: '🔍', desc: '47 contradicting answers', kafka: 10 },
        { value: 'friend', label: 'Asked Germans', emoji: '🤝', desc: 'They said "it depends"', kafka: 15 },
        { value: 'lawyer', label: 'Hired a lawyer', emoji: '⚖️', desc: 'Now broke AND confused', kafka: 20 },
        { value: 'nothing', label: 'YOLO', emoji: '🎲', desc: 'Chaotic neutral energy', kafka: 50 }
      ]
    }
  ];

  // Get current question
  const getCurrentQuestion = () => {
    return baseQuestions[currentStep] || baseQuestions[0];
  };

  // Handle answer with smart commentary
  const handleAnswer = async (questionId, value, option) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    // Create visual feedback based on choice severity
    if (option.shock && option.shock >= 20) {
      triggerScreenShake('medium');
      triggerFlashEffect('red', 400);
    } else if (option.frustration && option.frustration >= 30) {
      triggerScreenShake('light');
      triggerFlashEffect('orange', 300);
    }
    
    // Update meters with animations
    if (option.shock) {
      const newShock = Math.min(shockMeter + option.shock, 100);
      setShockMeter(newShock);
      if (newShock >= 50 && shockMeter < 50) {
        unlockAchievement({
          id: 'shock_therapy',
          title: 'Shock Therapy',
          description: 'Reached 50% shock level',
          icon: '⚡',
          rarity: 'common'
        });
      }
    }
    
    if (option.frustration) {
      const newFrustration = Math.min(frustrationMeter + option.frustration, 100);
      setFrustrationMeter(newFrustration);
      if (newFrustration >= 75 && frustrationMeter < 75) {
        unlockAchievement({
          id: 'rage_mode',
          title: 'Bureaucratic Rage Mode',
          description: 'Reached 75% frustration level',
          icon: '🤬',
          rarity: 'rare'
        });
      }
    }
    
    if (option.kafka) {
      const newKafka = Math.min(kafkaScore + option.kafka, 100);
      setKafkaScore(newKafka);
      if (newKafka >= 60 && kafkaScore < 60) {
        unlockAchievement({
          id: 'kafka_understanding',
          title: 'Kafkaesque Understanding',
          description: 'Entered the realm of bureaucratic surrealism',
          icon: '🌀',
          rarity: 'epic'
        });
      }
    }
    
    // Enhanced commentary selection with more variety
    let commentary;
    if (Math.random() > 0.7) {
      // 30% chance for general bureaucracy humor
      commentary = getRandomCommentary('general') || getRandomCommentary('motivation');
    } else {
      // 70% chance for choice-specific commentary
      commentary = getRandomCommentary('reason', value) || 
                  getRandomCommentary('general') ||
                  `You chose ${option.label}. The bureaucracy notes your decision with indifference.`;
    }
    
    setCurrentCommentary(commentary);
    setShowCommentary(true);
    
    // Trigger transition effects
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 500);
    
    // Always trigger mini-game after questions for maximum engagement
    const shouldTriggerMiniGame = currentStep === 0 || currentStep === 1 || currentStep === 2;
    
    const displayTime = 3000; // Shorter display time
    
    if (shouldTriggerMiniGame) {
      setTimeout(() => {
        setShowCommentary(false);
        const gameKeys = Object.keys(miniGames);
        const selectedGame = gameKeys[currentStep % gameKeys.length];
        setCurrentMiniGame(miniGames[selectedGame]);
        setMiniGameActive(true);
      }, displayTime);
    } else {
      setTimeout(() => {
        setShowCommentary(false);
        if (currentStep < 2) {
          setCurrentStep(currentStep + 1);
        } else {
          generateFinalResult();
        }
      }, displayTime);
    }
  };

  // Handle mini-game completion
  const handleMiniGameComplete = (result) => {
    // Update stats from mini-game
    if (result.stats) {
      if (result.stats.frustration) setFrustrationMeter(prev => Math.max(0, Math.min(100, prev + result.stats.frustration)));
      if (result.stats.shock) setShockMeter(prev => Math.min(prev + result.stats.shock, 100));
      if (result.stats.kafka) setKafkaScore(prev => Math.min(prev + result.stats.kafka, 100));
    }
    
    if (!result.success) {
      setSurvivalPoints(prev => Math.max(0, prev - 20));
      setFormsRejected(prev => prev + 1);
    }
    
    setCurrentCommentary(result.message);
    setShowCommentary(true);
    setMiniGameActive(false);
    
    setTimeout(() => {
      setShowCommentary(false);
      setCurrentMiniGame(null);
      
      if (currentStep < baseQuestions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        generateFinalResult();
      }
    }, 4000);
  };

  // Generate final result
  const generateFinalResult = () => {
    const stats = {
      shock: shockMeter,
      frustration: frustrationMeter,
      kafka: kafkaScore,
      survival: survivalPoints,
      rejected: formsRejected
    };
    
    let resultType = 'survivor';
    if (kafkaScore >= 80) resultType = 'transcended';
    else if (frustrationMeter >= 80) resultType = 'broken';
    else if (survivalPoints <= 20) resultType = 'defeated';
    
    const results = {
      transcended: {
        title: "Bureaucratic Enlightenment Achieved",
        germanWord: "Amtserleuchtungszustandserreichung",
        description: "You've become one with the paperwork",
        verdict: "You no longer fight the system. You ARE the system.",
        advice: "Use your powers wisely. With great Formulars comes great Verantwortung.",
        certificate: "Certificate of Transcendence (Form TR-2025-∞)",
        emoji: "🧘📋"
      },
      broken: {
        title: "Bureaucratically Broken",
        germanWord: "Bürokratiezerstörungsopfer",
        description: "The system has won. You have lost.",
        verdict: `After ${stats.rejected} rejections, your spirit is crushed.`,
        advice: "Therapy is available with Form TH-1 through TH-47.",
        certificate: "Participation Trophy (Invalid stamp color)",
        emoji: "💔📄"
      },
      defeated: {
        title: "Tactical Bureaucratic Retreat",
        germanWord: "Strategischerbürokratierückzug",
        description: "You've decided life is too short",
        verdict: "Sometimes wisdom is knowing when to give up.",
        advice: "Try another country. France has wine.",
        certificate: "Exit Visa (Processing: 6-8 months)",
        emoji: "🏃💨"
      },
      survivor: {
        title: "Bureaucracy Survivor",
        germanWord: "Bürokratieüberlebender",
        description: "Bloodied but not broken",
        verdict: "You've navigated the maze and lived!",
        advice: "Frame your approved forms. They're priceless.",
        certificate: "Official Survival Certificate",
        emoji: "🏆📋"
      }
    };
    
    setResult({
      ...results[resultType],
      stats: `Shock: ${stats.shock}% | Frustration: ${stats.frustration}% | Kafka: ${stats.kafka}%`
    });
  };

  // Restart game
  const restart = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setShockMeter(0);
    setFrustrationMeter(0);
    setKafkaScore(0);
    setSurvivalPoints(100);
    setFormsRejected(0);
  };

  // Get current question
  const currentQuestion = getCurrentQuestion();

  // Results screen
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-black p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-black/90 backdrop-blur-xl rounded-3xl p-8 text-white shadow-2xl border-4 border-red-600">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4 animate-pulse">{result.emoji}</div>
              <h1 className="text-4xl font-black mb-4 text-red-500">{result.title}</h1>
              <p className="text-2xl text-yellow-400 mb-2 font-mono break-all">{result.germanWord}</p>
              <p className="text-xl text-gray-300 italic">{result.description}</p>
            </div>
            
            <div className="bg-gradient-to-r from-red-950/80 to-black/80 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-black mb-3 text-yellow-300">VERDICT:</h2>
              <p className="text-lg">{result.verdict}</p>
            </div>
            
            <div className="bg-black/60 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-2 text-yellow-300">ADVICE:</h3>
              <p className="text-gray-200">{result.advice}</p>
            </div>
            
            <div className="text-center text-sm text-gray-400 mb-6">{result.stats}</div>
            
            <button
              onClick={restart}
              className="w-full bg-gradient-to-r from-red-700 to-red-900 text-white py-4 px-6 rounded-2xl font-black text-xl hover:from-red-800 hover:to-black transition-all transform hover:scale-105"
            >
              <RotateCcw className="w-6 h-6 inline mr-2" />
              TRY AGAIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main game screen
  const progress = ((currentStep + 1) / baseQuestions.length) * 100;

  return (
    <div 
      ref={gameContainerRef}
      className={`min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-black p-4 relative overflow-hidden transition-all duration-300 ${screenShake ? screenShake : ''}`}
    >
      {/* Background particles */}
      {backgroundParticles.map(particle => (
        <div
          key={particle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${particle.scale * 20}px`,
            opacity: particle.opacity,
            transform: `rotate(${particle.rotation}deg)`,
            zIndex: 0
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Particle explosion system */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute pointer-events-none z-50"
          style={{
            left: particle.x,
            top: particle.y,
            fontSize: `${particle.scale * 24}px`,
            animation: `particle-explosion 2s ease-out forwards`,
            transform: `rotate(${particle.rotation}deg)`
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Ripple effects */}
      {rippleEffects.map(ripple => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x - 50,
            top: ripple.y - 50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: `2px solid ${ripple.color}`,
            animation: 'ripple-expand 1s ease-out forwards',
            zIndex: 40
          }}
        />
      ))}

      {/* Flash effect overlay */}
      {flashEffect && (
        <div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            backgroundColor: flashEffect === 'gold' ? 'rgba(250, 204, 21, 0.3)' :
                            flashEffect === 'green' ? 'rgba(34, 197, 94, 0.3)' :
                            flashEffect === 'red' ? 'rgba(239, 68, 68, 0.3)' :
                            'rgba(255, 255, 255, 0.2)',
            animation: 'flash-fade 0.3s ease-out'
          }}
        />
      )}

      {/* Achievement notification */}
      {showAchievement && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-black p-4 rounded-xl shadow-2xl border-2 border-yellow-300 animate-slide-in">
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-bounce">{showAchievement.icon}</div>
            <div>
              <div className="font-bold text-lg">Achievement Unlocked!</div>
              <div className="font-semibold">{showAchievement.title}</div>
              <div className="text-sm opacity-80">{showAchievement.description}</div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Progress and meters */}
        <div className="mb-6 space-y-3">
          <div className="bg-gray-800 rounded-full h-8 overflow-hidden border-2 border-gray-600 relative shadow-xl">
            <div 
              className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 h-full transition-all duration-700 ease-out relative"
              style={{ 
                width: `${progress}%`,
                animation: progress > 0 ? 'progress-glow 3s ease-in-out infinite' : 'none'
              }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-sm font-bold drop-shadow-lg">
                Step {currentStep + 1} of {baseQuestions.length}
              </p>
            </div>
            {/* Progress milestones */}
            {[25, 50, 75].map(milestone => (
              <div 
                key={milestone}
                className={`absolute top-0 w-1 h-full ${progress >= milestone ? 'bg-white shadow-lg' : 'bg-gray-500'} transition-all duration-500`}
                style={{ left: `${milestone}%` }}
              />
            ))}
          </div>
          
          <div className="grid grid-cols-4 gap-3 text-xs">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-gray-600 hover:border-red-400 transition-all">
              <div className="text-red-400 font-semibold">Shock:</div>
              <div className="flex items-center gap-1">
                <div className="w-8 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-red-600 h-full transition-all duration-500"
                    style={{ width: `${Math.round(animatedMeters.shock)}%` }}
                  />
                </div>
                <span className="text-yellow-400 font-bold">{Math.round(animatedMeters.shock)}%</span>
              </div>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-gray-600 hover:border-orange-400 transition-all">
              <div className="text-orange-400 font-semibold">Rage:</div>
              <div className="flex items-center gap-1">
                <div className="w-8 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-500"
                    style={{ width: `${Math.round(animatedMeters.frustration)}%` }}
                  />
                </div>
                <span className="text-yellow-400 font-bold">{Math.round(animatedMeters.frustration)}%</span>
              </div>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-gray-600 hover:border-purple-400 transition-all">
              <div className="text-purple-400 font-semibold">Kafka:</div>
              <div className="flex items-center gap-1">
                <div className="w-8 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                    style={{ width: `${Math.round(animatedMeters.kafka)}%` }}
                  />
                </div>
                <span className="text-yellow-400 font-bold">{Math.round(animatedMeters.kafka)}%</span>
              </div>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-gray-600 hover:border-green-400 transition-all">
              <div className="text-green-400 font-semibold">Will:</div>
              <div className="flex items-center gap-1">
                <div className="w-8 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-500"
                    style={{ width: `${Math.round(animatedMeters.survival)}%` }}
                  />
                </div>
                <span className="text-yellow-400 font-bold">{Math.round(animatedMeters.survival)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Commentary overlay */}
        {showCommentary && !miniGameActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-gradient-to-br from-red-950 to-black p-8 rounded-3xl max-w-lg border-4 border-yellow-500 shadow-2xl transform transition-all duration-500 animate-slide-up">
              <div className="text-6xl mb-6 text-center animate-bounce-slow">
                {shockMeter > 70 ? '🤯' : frustrationMeter > 70 ? '🤬' : kafkaScore > 50 ? '🌀' : '😱'}
              </div>
              <div className="bg-black/50 rounded-2xl p-6 mb-4">
                <p className="text-yellow-300 font-bold text-xl text-center leading-relaxed">
                  {currentCommentary}
                </p>
              </div>
              <div className="text-center">
                <div className="inline-block bg-gray-800 rounded-full px-4 py-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    Processing your bureaucratic destiny...
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mini-game overlay */}
        {miniGameActive && currentMiniGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="bg-gradient-to-br from-red-950 to-black p-8 rounded-3xl max-w-2xl w-full border-4 border-yellow-600 shadow-2xl transform transition-all duration-700 animate-scale-in">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-full mr-4 animate-pulse">
                  <Target className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-3xl font-black text-yellow-400 animate-type-writer">
                  {currentMiniGame.title}
                </h3>
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-700" style={{ minHeight: '500px' }}>
                {(() => {
                  const GameComponent = currentMiniGame.component;
                  return <GameComponent onComplete={handleMiniGameComplete} />;
                })()}
              </div>
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  Mini-game active
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main question card */}
        {!miniGameActive && (
          <div className="bg-black/90 backdrop-blur-xl rounded-3xl p-8 text-white shadow-2xl border-4 border-red-600">
            <div className="text-center mb-8">
              <h1 
                className="text-4xl font-black mb-3 text-red-500 cursor-pointer hover:text-yellow-400 transition-all duration-300 hover:scale-105"
                onClick={(e) => {
                  // Easter egg: Konami code reference
                  createParticleExplosion(e.clientX, e.clientY, 'documents', ['🎮', '🕹️', '🎯', '🎊']);
                  triggerScreenShake('light');
                  const surprises = [
                    "Achievement Unlocked: Found the secret title click!",
                    "Plot twist: You are the bureaucracy now.",
                    "Fun fact: Clicking this title is technically a form submission.",
                    "🎉 Congratulations! You just created more paperwork for yourself.",
                    "Error 404: Efficiency not found.",
                    "The title has been noted in your permanent record."
                  ];
                  const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];
                  setCurrentCommentary(randomSurprise);
                  setShowCommentary(true);
                  setTimeout(() => setShowCommentary(false), 3000);
                }}
              >
                Who Gets F*cked by German Bureaucracy?
                <div className="text-xs text-gray-500 mt-1 opacity-50 hover:opacity-100 transition-opacity">
                  (psst... click me for a surprise 🎭)
                </div>
              </h1>
              <p className="text-gray-300 text-lg">
                Everyone. Equally. Efficiently.
                <span 
                  className="ml-2 text-xs text-gray-600 cursor-pointer hover:text-yellow-400 transition-colors"
                  onClick={() => {
                    unlockAchievement({
                      id: 'easter_egg_hunter',
                      title: 'Easter Egg Hunter',
                      description: 'Found a hidden secret!',
                      icon: '🥚',
                      rarity: 'rare'
                    });
                  }}
                >
                  🥚
                </span>
              </p>
            </div>

            {currentQuestion && (
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6 bg-red-950/60 rounded-2xl p-5 border-2 border-red-600/50">
                  <div className="bg-gradient-to-r from-red-600 to-yellow-600 rounded-full p-4 shadow-xl">
                    {currentQuestion.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-yellow-200">
                      {currentQuestion.title}
                    </h2>
                    {currentQuestion.subtitle && (
                      <p className="text-gray-400 text-sm mt-1">{currentQuestion.subtitle}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(currentQuestion.id, option.value, option)}
                      className="bg-red-950/70 hover:bg-red-900/90 rounded-2xl p-5 text-left transition-all duration-300 border-2 border-red-800 hover:border-yellow-500 group hover:scale-[1.02] shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-4xl transform group-hover:scale-125 transition-all">
                            {option.emoji}
                          </span>
                          <div>
                            <div className="font-bold text-lg text-yellow-200">
                              {option.label}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              {option.desc}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-500 group-hover:text-yellow-400 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 0.5s ease-out;
        }

        /* Particle system animations */
        @keyframes particle-explosion {
          0% { 
            transform: translate(0, 0) rotate(0deg) scale(1); 
            opacity: 1; 
          }
          50% { 
            transform: translate(var(--vx, 0), var(--vy, 0)) rotate(180deg) scale(1.2); 
            opacity: 1; 
          }
          100% { 
            transform: translate(calc(var(--vx, 0) * 2), calc(var(--vy, 0) * 2 + 100px)) rotate(360deg) scale(0.5); 
            opacity: 0; 
          }
        }

        @keyframes ripple-expand {
          0% { 
            transform: scale(0); 
            opacity: 1; 
          }
          100% { 
            transform: scale(8); 
            opacity: 0; 
          }
        }

        @keyframes flash-fade {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        /* Screen shake animations */
        .shake-light {
          animation: shake-light 0.6s ease-in-out;
        }

        .shake-medium {
          animation: shake-medium 0.6s ease-in-out;
        }

        .shake-heavy {
          animation: shake-heavy 0.6s ease-in-out;
        }

        @keyframes shake-light {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }

        @keyframes shake-medium {
          0%, 100% { transform: translateX(0) translateY(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px) translateY(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(5px) translateY(2px); }
        }

        @keyframes shake-heavy {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px) translateY(-4px) rotate(-1deg); }
          20%, 40%, 60%, 80% { transform: translateX(8px) translateY(4px) rotate(1deg); }
        }

        /* Progress and meter animations */
        @keyframes progress-pulse {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(250, 204, 21, 0.5); 
            filter: brightness(1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(250, 204, 21, 0.9), 0 0 50px rgba(34, 197, 94, 0.4); 
            filter: brightness(1.2);
          }
        }

        @keyframes progress-celebration {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.8); 
            filter: hue-rotate(0deg);
          }
          25% { 
            box-shadow: 0 0 40px rgba(250, 204, 21, 0.8); 
            filter: hue-rotate(90deg);
          }
          50% { 
            box-shadow: 0 0 40px rgba(239, 68, 68, 0.8); 
            filter: hue-rotate(180deg);
          }
          75% { 
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.8); 
            filter: hue-rotate(270deg);
          }
        }

        @keyframes progress-glow {
          0%, 100% { filter: brightness(1) saturate(1); }
          50% { filter: brightness(1.2) saturate(1.3); }
        }

        /* Transition animations */
        @keyframes slide-up {
          from { 
            transform: translateY(100px); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0); 
            opacity: 1; 
          }
        }

        @keyframes slide-in {
          from { 
            transform: translateX(100px); 
            opacity: 0; 
          }
          to { 
            transform: translateX(0); 
            opacity: 1; 
          }
        }

        @keyframes scale-in {
          from { 
            transform: scale(0.8) rotate(-5deg); 
            opacity: 0; 
          }
          to { 
            transform: scale(1) rotate(0deg); 
            opacity: 1; 
          }
        }

        @keyframes type-writer {
          from { 
            max-width: 0; 
            opacity: 0; 
          }
          to { 
            max-width: 100%; 
            opacity: 1; 
          }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes clickBurst {
          0% { 
            transform: scale(0.5); 
            opacity: 1; 
          }
          50% { 
            transform: scale(1.5); 
            opacity: 0.8; 
          }
          100% { 
            transform: scale(2); 
            opacity: 0; 
          }
        }

        /* Game-specific animations */
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.7s ease-out;
        }

        .animate-type-writer {
          animation: type-writer 1s ease-out;
          overflow: hidden;
          white-space: nowrap;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        /* Enhanced hover effects */
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        /* Meter-specific animations */
        .meter-bar {
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .meter-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: meter-shine 2s ease-in-out infinite;
        }

        @keyframes meter-shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        /* Background particle effects */
        .background-particle {
          animation: float-down 10s linear infinite;
        }

        @keyframes float-down {
          0% { 
            transform: translateY(-10vh) rotate(0deg); 
            opacity: 0; 
          }
          10% { 
            opacity: 0.6; 
          }
          90% { 
            opacity: 0.6; 
          }
          100% { 
            transform: translateY(110vh) rotate(360deg); 
            opacity: 0; 
          }
        }

        /* Document-specific animations */
        @keyframes fall-wiggle {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-3px) rotate(-2deg); }
          75% { transform: translateX(3px) rotate(2deg); }
        }

        /* Achievement animation */
        .achievement-popup {
          animation: achievement-appear 0.5s ease-out, achievement-disappear 0.5s ease-in 3.5s;
        }

        @keyframes achievement-appear {
          from { 
            transform: translateX(400px) scale(0.8); 
            opacity: 0; 
          }
          to { 
            transform: translateX(0) scale(1); 
            opacity: 1; 
          }
        }

        @keyframes achievement-disappear {
          from { 
            transform: translateX(0) scale(1); 
            opacity: 1; 
          }
          to { 
            transform: translateX(400px) scale(0.8); 
            opacity: 0; 
          }
        }

        /* Loading animations */
        @keyframes skeleton-loading {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }

        .skeleton {
          background: linear-gradient(90deg, #374151 25%, #4b5563 37%, #374151 63%);
          background-size: 400px 100%;
          animation: skeleton-loading 1.5s ease-in-out infinite;
        }

        /* Enhanced button animations */
        .btn-enhanced {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .btn-enhanced::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .btn-enhanced:hover::before {
          left: 100%;
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BureaucracyHellGame;