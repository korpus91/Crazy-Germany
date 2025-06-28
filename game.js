import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, RotateCcw, Heart, Briefcase, MapPin, User, Smartphone, Coffee, Skull, Zap, Flame, AlertTriangle, Euro, Home, Users, Shield, Pill, Brain, Clock, Eye, HandMetal, AlertCircle, FileText, Stamp, Calculator, Ban, CheckCircle, XCircle, Timer, Target, Mouse, Hash } from 'lucide-react';

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

  // Enhanced Visual Effects State
  const [particles, setParticles] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [screenShake, setScreenShake] = useState(false);
  const [screenFlash, setScreenFlash] = useState(false);
  const [floatingDocuments, setFloatingDocuments] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [actionBars, setActionBars] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Enhanced Visual Effects System
  const createParticleExplosion = useCallback((x, y, type = 'success', count = 10) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 5,
        size: Math.random() * 8 + 4,
        type,
        life: 1,
        decay: 0.02 + Math.random() * 0.02
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  const createExplosion = useCallback((x, y, type = 'impact') => {
    const explosion = {
      id: Date.now(),
      x,
      y,
      type,
      scale: 0,
      opacity: 1,
      duration: 600
    };
    setExplosions(prev => [...prev, explosion]);
    
    setTimeout(() => {
      setExplosions(prev => prev.filter(e => e.id !== explosion.id));
    }, explosion.duration);
  }, []);

  const triggerScreenShake = useCallback((duration = 500) => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), duration);
  }, []);

  const triggerScreenFlash = useCallback((color = 'bg-white', duration = 200) => {
    setScreenFlash(color);
    setTimeout(() => setScreenFlash(false), duration);
  }, []);

  const addFloatingDocument = useCallback((type, message) => {
    const doc = {
      id: Date.now(),
      type,
      message,
      x: Math.random() * 80 + 10,
      y: 100,
      vy: -2,
      life: 3000
    };
    setFloatingDocuments(prev => [...prev, doc]);
    
    setTimeout(() => {
      setFloatingDocuments(prev => prev.filter(d => d.id !== doc.id));
    }, doc.life);
  }, []);

  const showAchievement = useCallback((title, description, icon) => {
    const achievement = {
      id: Date.now(),
      title,
      description,
      icon,
      opacity: 0,
      scale: 0.8
    };
    setAchievements(prev => [...prev, achievement]);
    
    // Animate in
    setTimeout(() => {
      setAchievements(prev => prev.map(a => 
        a.id === achievement.id ? { ...a, opacity: 1, scale: 1 } : a
      ));
    }, 50);
    
    // Remove after delay
    setTimeout(() => {
      setAchievements(prev => prev.filter(a => a.id !== achievement.id));
    }, 4000);
  }, []);

  const createActionBar = useCallback((message, duration = 2000) => {
    const bar = {
      id: Date.now(),
      message,
      progress: 0,
      duration
    };
    setActionBars(prev => [...prev, bar]);
    
    const interval = setInterval(() => {
      setActionBars(prev => prev.map(b => {
        if (b.id === bar.id) {
          const newProgress = b.progress + (100 / (duration / 50));
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setActionBars(prev => prev.filter(ab => ab.id !== bar.id));
            }, 500);
            return { ...b, progress: 100 };
          }
          return { ...b, progress: newProgress };
        }
        return b;
      }));
    }, 50);
  }, []);

  // Particle animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        return prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.3, // gravity
          life: particle.life - particle.decay
        })).filter(particle => particle.life > 0);
      });

      setFloatingDocuments(prev => {
        return prev.map(doc => ({
          ...doc,
          y: doc.y + doc.vy,
          x: doc.x + Math.sin(Date.now() / 1000 + doc.id) * 0.5
        })).filter(doc => doc.y > -50);
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

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
        
        // Enhanced visual feedback with particles
        const docElement = gameAreaRef.current?.querySelector(`[data-doc-id="${docId}"]`);
        if (docElement) {
          const rect = docElement.getBoundingClientRect();
          const gameRect = gameAreaRef.current.getBoundingClientRect();
          const x = rect.left - gameRect.left + rect.width / 2;
          const y = rect.top - gameRect.top + rect.height / 2;
          
          // Create particle explosion
          createParticleExplosion(x, y, 'document', 8);
        }
        
        // Original visual feedback (enhanced)
        const effect = document.createElement('div');
        effect.innerHTML = `<div style="color: #facc15; font-weight: bold; font-size: 24px; animation: popEffect 1s ease-out forwards; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">+${doc.points}</div>`;
        effect.style.position = 'absolute';
        effect.style.left = doc.x + '%';
        effect.style.top = doc.y + '%';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '1000';
        gameAreaRef.current?.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
        
        // Show achievement for special documents
        if (doc.points >= 30) {
          showAchievement(`Critical Document!`, `Collected ${doc.name}`, doc.emoji);
        }
      }
    };

    const endGame = () => {
      setGameActive(false);
      const success = score >= 150;
      const requiredDocs = ['Passport', 'Anmeldung', 'Work Contract'];
      const hasRequired = requiredDocs.every(doc => collected.includes(doc));
      
      // Epic visual finale
      if (success && hasRequired) {
        // Success explosion
        createExplosion(50, 50, 'success');
        triggerScreenFlash('bg-green-500', 300);
        showAchievement('Mission Complete!', 'Bureaucracy conquered!', '🏆');
      } else {
        // Failure effects
        triggerScreenShake(800);
        triggerScreenFlash('bg-red-500', 200);
        createExplosion(50, 50, 'failure');
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
          <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-green-400 h-full rounded-full transition-all"
              style={{ width: `${Math.min((score / 150) * 100, 100)}%` }}
            />
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
                  data-doc-id={doc.id}
                  className="absolute cursor-pointer transition-all duration-200 hover:scale-125 hover:rotate-12 hover:z-10"
                  style={{
                    left: `${doc.x}%`,
                    top: `${doc.y}%`,
                    transform: 'translate(-50%, -50%) rotate(' + (Math.sin(Date.now() / 1000 + doc.id) * 5) + 'deg)',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                  }}
                  onClick={() => collectDocument(doc.id)}
                  onMouseEnter={() => {
                    // Add subtle particle trail on hover
                    if (Math.random() > 0.7) {
                      createParticleExplosion(doc.x, doc.y, 'hover', 3);
                    }
                  }}
                >
                  <div className="text-center">
                    <div className="text-5xl animate-bounce" style={{ 
                      animation: `bounce 1s infinite ${doc.id % 500}ms` 
                    }}>
                      {doc.emoji}
                    </div>
                    <div className="text-xs text-yellow-400 font-bold bg-black/70 rounded px-2 py-1 border border-yellow-600/50">
                      +{doc.points}
                    </div>
                  </div>
                </div>
              ))}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold animate-pulse text-xl bg-black/50 px-4 py-2 rounded-xl">
                🎯 CLICK THE FALLING DOCUMENTS! 🎯
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="text-3xl text-yellow-400 font-bold mb-4">Game Over!</div>
              <div className="text-xl text-white">Final Score: {score}</div>
            </div>
          )}
        </div>
        
        <style>{`
          @keyframes popEffect {
            0% { transform: scale(1) translateY(0); opacity: 1; }
            100% { transform: scale(2) translateY(-50px); opacity: 0; }
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
      
      // Visual click effect
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now() + Math.random();
      
      setClickEffects(prev => [...prev, { id, x, y, power: clickPower }]);
      setTimeout(() => {
        setClickEffects(prev => prev.filter(effect => effect.id !== id));
      }, 1000);

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
          <div className="w-full bg-gray-800 rounded-full h-6 mb-2 overflow-hidden">
            <div 
              className="h-full transition-all relative"
              style={{ 
                width: `${Math.min(progress, 100)}%`,
                background: progress >= 100 ? 
                  'linear-gradient(to right, #10b981, #facc15)' : 
                  'linear-gradient(to right, #facc15, #ef4444)'
              }}
            >
              {progress >= 100 && (
                <div className="absolute inset-0 flex items-center justify-center text-black font-bold text-xs">
                  TARGET REACHED!
                </div>
              )}
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
        "Relocation papers require 47 stamps. We currently have 46 different stamp colors.",
        "Fun fact: Your future address needs to be verified by your future neighbor's dog.",
        "Plot twist: The building you're moving to hasn't been built yet, but you still need the forms.",
        "Good news: Only 73 documents required! Bad news: They expire every 2 weeks.",
        "Pro tip: The Anmeldung office closes for lunch... and breakfast... and dinner.",
        "Did you know German has 127 words for 'administrative delay'? You'll learn them all.",
        "Your moving truck is ready. Your paperwork approval ETA: Next century."
      ],
      business: [
        "Starting a business in Germany? Your descendants might see it registered.",
        "The Finanzamt already knows you're here. They can smell entrepreneurial spirit.",
        "Fun fact: The business registration form has more pages than your business plan.",
        "Small business = Big forms. Medium business = Enormous forms. Large business = Why are you here?",
        "Your business idea died of old age while waiting for the permit to be born.",
        "German business law: If it's not explicitly permitted, it's definitely forbidden.",
        "Trade license requires proof that your great-grandmother wasn't a witch.",
        "Congratulations! Your business is approved for 1823. Current year: 2025.",
        "Your business plan looks great! Too bad you need Plan B through Plan Z as backup.",
        "Breaking: Local entrepreneur finally gets approval. Retires immediately from exhaustion."
      ],
      marriage: [
        "Getting married? The paperwork lasts longer than most marriages.",
        "Love is patient, love is kind, love requires 37 certified documents.",
        "Romance level: Spending date nights at the Standesamt.",
        "Wedding vows: 'Till death or form rejection do us part.'",
        "Marriage certificate requires birth certificate, which requires existence certificate.",
        "Your engagement ring costs less than the mandatory notary fees.",
        "Love knows no boundaries. Except geographical ones. Those require Forms A-Z.",
        "Wedding planning: 10% venue, 20% dress, 70% bureaucratic nightmare.",
        "Fun fact: German law requires proof your spouse actually exists.",
        "Prenup includes agreement to share administrative burden 50/50."
      ],
      dog: [
        "Registering a dog? Hope your pet speaks German and has patience.",
        "Dog registration: Because even Fido needs government approval to exist.",
        "Your dog needs a CV, three references, and proof of good character.",
        "Pet tax calculation requires advanced mathematics and a philosophy degree.",
        "Fun fact: Your dog's paperwork is more complex than your own residency permit.",
        "Bark tax, wag tax, tail tax – each movement requires separate documentation.",
        "Your dog needs permission to be cute. Form approval time: 6-8 weeks.",
        "Plot twist: Your dog becomes a German citizen before you do.",
        "Dog registration office only accepts applications on the third Tuesday of months ending in 'r'.",
        "Your pet's German fluency test results: Better than yours."
      ]
    },
    experience: {
      newbie: [
        "Sweet summer child, your innocence is about to be bureaucratically destroyed.",
        "First time? How delightfully naive. The system will cure that quickly.",
        "Newbie detected. Initiating maximum chaos protocol.",
        "Virgin bureaucracy experience? The system loves fresh souls.",
        "Your optimism levels are dangerously high. We'll fix that.",
        "First-timer alert! Sound the alarms! Deploy the confusing forms!",
        "Beginner's luck doesn't apply here. Only beginner's despair.",
        "New to Germany? Here's your complimentary lifetime supply of frustration.",
        "Pro tip: Crying is allowed but requires Form TR-47 (Emotional Release Permit).",
        "Welcome to the machine. Please insert your sanity and press any button."
      ],
      some: [
        "Some experience? That just means you know enough to be truly terrified.",
        "Ah, a returning customer! The system missed making you suffer.",
        "Previous experience detected. Deploying advanced confusion tactics.",
        "Back for more? Stockholm syndrome is surprisingly common here.",
        "You've survived before. This time we're going full nightmare mode.",
        "Experienced victim... I mean, citizen! Welcome back to hell.",
        "Some battle scars, I see. Time to add a few more!",
        "Previous encounters noted. Increasing difficulty to 'Kafkaesque'.",
        "Oh good, you know the basics. Time to throw them out the window.",
        "Veteran status: Recognized. Mercy level: Still zero."
      ],
      veteran: [
        "A true veteran! You probably remember when we only needed 15 forms.",
        "Seasoned warrior! Your eye twitch tells the story of a thousand queues.",
        "Bureaucracy veteran detected. Respect... and our deepest condolences.",
        "You've seen things. Terrible, administrative things.",
        "Elder status confirmed. Please share your wisdom with the fresh meat.",
        "A survivor of the great form shortage of 2019. Legendary.",
        "Veteran benefits include: Nothing. The struggle continues.",
        "Your service record: 847 forms filed, 1,243 rejections survived.",
        "Master class bureaucracy navigator. Unfortunately, the rules changed yesterday.",
        "You've reached final boss level. Plot twist: There's no final boss, just more forms."
      ]
    },
    paperwork: {
      confidence_high: [
        "Such confidence! The system will enjoy breaking that spirit.",
        "100% confident? That's mathematically impossible in Germany.",
        "Your confidence is noted and will be used against you in court.",
        "High confidence detected. Deploying special punishment protocols.",
        "Overconfidence is a slow and insidious killer... of applications.",
        "Famous last words: 'How hard can German paperwork be?'",
        "Confidence level: Dangerous. System response: Maximum chaos.",
        "Your arrogance will make excellent seasoning for your tears.",
        "High confidence? We'll have you questioning your own name by lunch.",
        "Bold assumption that logic applies here. How refreshing!"
      ],
      confidence_medium: [
        "Moderate confidence? A wise approach to certain doom.",
        "Medium confidence shows experience with German administrative reality.",
        "Cautious optimism is the closest thing to wisdom you'll find here.",
        "Realistic expectations? In Germany? How wonderfully unusual!",
        "Medium confidence: The goldilocks zone of bureaucratic preparation.",
        "Measured approach detected. Still won't save you, but points for trying.",
        "Moderate expectations will be thoroughly exceeded... in the wrong direction.",
        "Balanced perspective noted. Balance will be promptly destroyed.",
        "Medium confidence suggests previous bureaucratic trauma. Good.",
        "Reasonable expectations about unreasonable systems. Paradoxically logical."
      ],
      confidence_low: [
        "Smart move! Low expectations are the only rational response.",
        "Wise to fear the system. It feeds on confidence and grows stronger.",
        "Your despair is premature but appropriately calibrated.",
        "Low confidence shows proper respect for the administrative overlords.",
        "Excellent! Pre-emptive hopelessness saves time later.",
        "Your pessimism is well-founded and professionally appreciated.",
        "Low expectations: The German way! You're already integrating!",
        "Fear is the beginning of wisdom in bureaucratic contexts.",
        "Your lack of confidence gives me confidence... in your suffering.",
        "Proper German attitude achieved: Expect nothing, receive less."
      ]
    },
    general: [
      "The bureaucracy acknowledges your existence with mild disapproval.",
      "Your request has been forwarded to the Department of Forwarding Requests.",
      "Error 404: Efficiency not found.",
      "Please take a number. Current number serving: 7. Your number: 847,293.",
      "Your patience is appreciated and will be thoroughly tested.",
      "Thank you for choosing German bureaucracy! No refunds, exchanges, or mercy.",
      "Processing... Error... Processing... Coffee break... Processing...",
      "Your suffering contributes to our quarterly efficiency metrics.",
      "Complaint department is located in room 237B, which doesn't exist.",
      "Your tears are noted and filed under 'Unprocessable Emotions'."
    ],
    achievements: [
      "First rejection received! Welcome to the club!",
      "Survived your first queue! Only 47,382 more to go!",
      "Form completion speedrun: Personal best of 4.7 hours!",
      "Mastered the art of bureaucratic patience!",
      "Successfully confused the system by following instructions correctly!",
      "Unlocked: Advanced Standing in Line Techniques!",
      "Discovered a functioning office! (Achievement discontinued due to error)",
      "Perfect attendance at impossible appointments!",
      "Collected all 17 variants of Form 42-B!",
      "Achievement: Made a Beamter smile! (Rare, possibly mythical)"
    ],
    office_hours: [
      "Office hours: 10:03 to 10:07 AM, alternate Tuesdays, when Venus is in retrograde.",
      "We're open! Except when we're not. Which is most of the time.",
      "Hours of operation: Whenever you're not available.",
      "Open 24/7*! (*Except between 7 AM and 7 AM)",
      "Business hours: Yes, we have them. No, we won't tell you what they are.",
      "Currently closed for: Lunch, training, holidays, Mondays, and existing.",
      "Office hours subject to change without notice, reason, or logic.",
      "Open by appointment only. Appointments available by appointment only.",
      "We're here! But not for you. Never for you.",
      "Hours of operation: It's complicated. Like everything else here."
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

  // Handle answer with smart commentary and enhanced effects
  const handleAnswer = async (questionId, value, option) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    // Visual feedback for selection
    createParticleExplosion(50, 50, 'success', 12);
    createActionBar(`Processing: ${option.label}`, 2000);
    
    // Update meters with visual feedback
    if (option.shock) {
      const oldShock = shockMeter;
      const newShock = Math.min(oldShock + option.shock, 100);
      setShockMeter(newShock);
      if (newShock - oldShock >= 20) {
        triggerScreenFlash('bg-red-500', 300);
        showAchievement('System Shock!', `+${option.shock} shock damage`, '⚡');
      }
    }
    if (option.frustration) {
      const oldFrustration = frustrationMeter;
      const newFrustration = Math.min(oldFrustration + option.frustration, 100);
      setFrustrationMeter(newFrustration);
      if (newFrustration - oldFrustration >= 15) {
        triggerScreenShake(400);
        showAchievement('Rage Building!', `+${option.frustration} frustration`, '🤬');
      }
    }
    if (option.kafka) {
      const oldKafka = kafkaScore;
      const newKafka = Math.min(oldKafka + option.kafka, 100);
      setKafkaScore(newKafka);
      if (newKafka >= 80 && oldKafka < 80) {
        showAchievement('Kafkaesque!', 'Reality is now questionable', '🧘');
      }
    }
    
    // Enhanced transition effects
    setIsTransitioning(true);
    addFloatingDocument('choice', option.desc);
    
    // Generate commentary from pre-written pools
    const commentary = getRandomCommentary(questionId, value) || 
                      getRandomCommentary('general') ||
                      `You chose ${option.label}. The bureaucracy notes your decision with indifference.`;
    
    setCurrentCommentary(commentary);
    setShowCommentary(true);
    
    // Always trigger mini-game after questions for maximum engagement
    const shouldTriggerMiniGame = currentStep === 0 || currentStep === 1 || currentStep === 2;
    
    const displayTime = 3000; // Shorter display time
    
    if (shouldTriggerMiniGame) {
      setTimeout(() => {
        setShowCommentary(false);
        setIsTransitioning(false);
        const gameKeys = Object.keys(miniGames);
        const selectedGame = gameKeys[currentStep % gameKeys.length];
        setCurrentMiniGame(miniGames[selectedGame]);
        setMiniGameActive(true);
        
        // Mini-game intro effect
        createExplosion(50, 30, 'impact');
        showAchievement('Mini-Game!', miniGames[selectedGame].title, '🎮');
      }, displayTime);
    } else {
      setTimeout(() => {
        setShowCommentary(false);
        setIsTransitioning(false);
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
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-black p-4 transition-transform duration-150 ${screenShake ? 'animate-shake' : ''}`}>
      <div className="max-w-2xl mx-auto relative">{/* Enhanced Visual Effects Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Floating background particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-600/20 rounded-full"
              style={{
                left: `${10 + (i * 12)}%`,
                top: `${20 + Math.sin(Date.now() / 2000 + i) * 10}%`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite ${i * 0.2}s`
              }}
            />
          ))}
        </div>
        {/* Progress and meters */}
        <div className="mb-6 space-y-2 relative z-10">
          <div className="bg-gray-800 rounded-full h-6 overflow-hidden border border-gray-600 relative shadow-lg">
            <div 
              className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 h-full transition-all duration-700 ease-out"
              style={{ 
                width: `${progress}%`,
                boxShadow: progress > 0 ? '0 0 10px rgba(251, 191, 36, 0.5)' : 'none'
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-xs font-bold drop-shadow-lg">
                Step {currentStep + 1} of {baseQuestions.length}
              </p>
            </div>
            {/* Progress sparkle effect */}
            {progress > 0 && (
              <div 
                className="absolute top-1/2 h-1 w-1 bg-white rounded-full opacity-70"
                style={{
                  left: `${progress}%`,
                  transform: 'translate(-50%, -50%)',
                  animation: 'sparkle 1s ease-in-out infinite'
                }}
              />
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="bg-gray-800/80 rounded-lg px-3 py-2 border border-gray-700 backdrop-blur-sm hover:bg-gray-700/80 transition-colors">
              <span className="text-red-400">Shock:</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-400 font-bold">{shockMeter}%</span>
                <div className="flex-1 bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${shockMeter}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-800/80 rounded-lg px-3 py-2 border border-gray-700 backdrop-blur-sm hover:bg-gray-700/80 transition-colors">
              <span className="text-red-400">Rage:</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-400 font-bold">{frustrationMeter}%</span>
                <div className="flex-1 bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${frustrationMeter}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-800/80 rounded-lg px-3 py-2 border border-gray-700 backdrop-blur-sm hover:bg-gray-700/80 transition-colors">
              <span className="text-red-400">Kafka:</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-400 font-bold">{kafkaScore}%</span>
                <div className="flex-1 bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${kafkaScore}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-800/80 rounded-lg px-3 py-2 border border-gray-700 backdrop-blur-sm hover:bg-gray-700/80 transition-colors">
              <span className="text-red-400">Will:</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`font-bold ${survivalPoints > 50 ? 'text-green-400' : survivalPoints > 25 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {survivalPoints}%
                </span>
                <div className="flex-1 bg-gray-700 rounded-full h-1">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      survivalPoints > 50 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                      survivalPoints > 25 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      'bg-gradient-to-r from-red-500 to-red-700'
                    }`}
                    style={{ width: `${survivalPoints}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Commentary overlay */}
        {showCommentary && !miniGameActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-gradient-to-br from-red-950 to-black p-8 rounded-3xl max-w-lg border-4 border-yellow-500 shadow-2xl animate-bounce-subtle">
              <div className="text-4xl mb-4 text-center">
                {shockMeter > 70 ? '🤯' : frustrationMeter > 70 ? '🤬' : '😱'}
              </div>
              <p className="text-yellow-300 font-bold text-xl text-center leading-relaxed">
                {currentCommentary}
              </p>
            </div>
          </div>
        )}

        {/* Mini-game overlay */}
        {miniGameActive && currentMiniGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="bg-gradient-to-br from-red-950 to-black p-8 rounded-3xl max-w-2xl w-full border-4 border-yellow-600 shadow-2xl">
              <h3 className="text-3xl font-black text-yellow-400 mb-6 text-center">
                {currentMiniGame.title}
              </h3>
              <div className="bg-black/50 rounded-2xl p-4" style={{ minHeight: '500px' }}>
                {(() => {
                  const GameComponent = currentMiniGame.component;
                  return <GameComponent onComplete={handleMiniGameComplete} />;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Main question card */}
        {!miniGameActive && (
          <div className="bg-black/90 backdrop-blur-xl rounded-3xl p-8 text-white shadow-2xl border-4 border-red-600">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black mb-3 text-red-500">
                Who Gets F*cked by German Bureaucracy?
              </h1>
              <p className="text-gray-300 text-lg">Everyone. Equally. Efficiently.</p>
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
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(currentQuestion.id, option.value, option)}
                      onMouseEnter={() => {
                        // Hover particle effect
                        if (Math.random() > 0.6) {
                          createParticleExplosion(
                            Math.random() * window.innerWidth, 
                            Math.random() * window.innerHeight, 
                            'hover', 
                            2
                          );
                        }
                      }}
                      className={`bg-red-950/70 hover:bg-red-900/90 rounded-2xl p-5 text-left transition-all duration-300 border-2 border-red-800 hover:border-yellow-500 group hover:scale-[1.02] shadow-lg hover:shadow-2xl hover:shadow-yellow-600/20 transform-gpu ${
                        isTransitioning ? 'opacity-50 pointer-events-none' : ''
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: !isTransitioning ? `slideInFromLeft 0.5s ease-out ${index * 100}ms both` : 'none'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-4xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 filter group-hover:drop-shadow-lg">
                            {option.emoji}
                          </span>
                          <div>
                            <div className="font-bold text-lg text-yellow-200 group-hover:text-yellow-100 transition-colors">
                              {option.label}
                            </div>
                            <div className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">
                              {option.desc}
                            </div>
                            {/* Risk indicators */}
                            <div className="flex gap-2 mt-2">
                              {option.shock >= 20 && (
                                <span className="text-xs bg-red-600/50 text-red-200 px-2 py-1 rounded-full">
                                  ⚡ High Shock
                                </span>
                              )}
                              {option.frustration >= 15 && (
                                <span className="text-xs bg-orange-600/50 text-orange-200 px-2 py-1 rounded-full">
                                  😤 Frustration
                                </span>
                              )}
                              {option.kafka >= 10 && (
                                <span className="text-xs bg-purple-600/50 text-purple-200 px-2 py-1 rounded-full">
                                  🌀 Kafkaesque
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <ChevronRight className="w-6 h-6 text-gray-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all duration-300" />
                          {(option.shock || option.frustration || option.kafka) && (
                            <div className="text-xs text-gray-500 mt-1 group-hover:text-yellow-500">
                              Click for chaos
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Visual Effects Overlay */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {/* Particle System */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.life,
              backgroundColor: 
                particle.type === 'success' ? '#10b981' :
                particle.type === 'document' ? '#f59e0b' :
                particle.type === 'hover' ? '#8b5cf6' :
                particle.type === 'failure' ? '#ef4444' :
                '#6b7280',
              transform: `scale(${particle.life})`,
              filter: 'blur(0.5px)',
              boxShadow: '0 0 4px currentColor'
            }}
          />
        ))}

        {/* Explosion Effects */}
        {explosions.map(explosion => (
          <div
            key={explosion.id}
            className="absolute flex items-center justify-center"
            style={{
              left: `${explosion.x}%`,
              top: `${explosion.y}%`,
              transform: 'translate(-50%, -50%)',
              animation: `explosion-${explosion.type} ${explosion.duration}ms ease-out forwards`
            }}
          >
            <div className="text-6xl">
              {explosion.type === 'success' ? '🎉' : 
               explosion.type === 'failure' ? '💥' : 
               explosion.type === 'impact' ? '⚡' : '✨'}
            </div>
          </div>
        ))}

        {/* Floating Documents */}
        {floatingDocuments.map(doc => (
          <div
            key={doc.id}
            className="absolute text-2xl transition-all duration-1000"
            style={{
              left: `${doc.x}%`,
              top: `${doc.y}%`,
              transform: 'translate(-50%, -50%) rotate(' + (Math.sin(Date.now() / 1000) * 10) + 'deg)',
              opacity: Math.max(0, (doc.life - Date.now()) / doc.life)
            }}
          >
            📄
          </div>
        ))}

        {/* Achievement Notifications */}
        {achievements.map(achievement => (
          <div
            key={achievement.id}
            className="absolute top-20 right-8 bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-4 rounded-xl shadow-2xl border-2 border-yellow-400 max-w-xs"
            style={{
              opacity: achievement.opacity,
              transform: `scale(${achievement.scale}) translateX(${achievement.opacity === 1 ? 0 : 100}px)`,
              transition: 'all 0.3s ease-out'
            }}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{achievement.icon}</div>
              <div>
                <div className="font-bold text-lg">{achievement.title}</div>
                <div className="text-sm text-yellow-100">{achievement.description}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Action Bars */}
        {actionBars.map(bar => (
          <div
            key={bar.id}
            className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-xl border border-yellow-600"
          >
            <div className="text-center text-sm font-bold mb-2">{bar.message}</div>
            <div className="w-48 bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-green-400 h-full rounded-full transition-all duration-75"
                style={{ width: `${bar.progress}%` }}
              />
            </div>
          </div>
        ))}

        {/* Screen Flash Effect */}
        {screenFlash && (
          <div
            className={`fixed inset-0 ${screenFlash} pointer-events-none z-50`}
            style={{
              opacity: 0.3,
              animation: 'flash 200ms ease-out'
            }}
          />
        )}
      </div>

      {/* Screen Shake Container */}
      <div
        className={`fixed inset-0 pointer-events-none z-30 ${screenShake ? 'animate-shake' : ''}`}
        style={{
          background: screenShake ? 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)' : 'none'
        }}
      />

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 0.5s ease-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes flash {
          0% { opacity: 0; }
          50% { opacity: 0.4; }
          100% { opacity: 0; }
        }

        @keyframes explosion-success {
          0% { 
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.5) rotate(180deg);
            opacity: 0.8;
          }
          100% { 
            transform: translate(-50%, -50%) scale(3) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes explosion-failure {
          0% { 
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          30% { 
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
          }
          100% { 
            transform: translate(-50%, -50%) scale(2.5);
            opacity: 0;
          }
        }

        @keyframes explosion-impact {
          0% { 
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
          }
          100% { 
            transform: translate(-50%, -50%) scale(2) rotate(180deg);
            opacity: 0;
          }
        }

        @keyframes slideInFromLeft {
          0% { 
            transform: translateX(-50px);
            opacity: 0;
          }
          100% { 
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px);
          }
          50% { 
            transform: translateY(-10px);
          }
        }

        @keyframes sparkle {
          0%, 100% { 
            opacity: 0.7;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.5);
          }
        }
      `}</style>
    </div>
  );
};

export default BureaucracyHellGame;