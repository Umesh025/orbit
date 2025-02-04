import React, { useState, useEffect } from 'react';
import { Star, Cloud, Sun as SunIcon, Volume2, VolumeX, Trees as Tree, Flower, Bird, Moon } from 'lucide-react';
import { soundManager } from './sounds';

const BackgroundTheme = {
  DAY: {
    from: 'from-blue-400',
    via: 'via-purple-400',
    to: 'to-pink-400',
    cloudColor: 'text-white/70',
    starColor: 'text-yellow-300',
  },
  SUNSET: {
    from: 'from-orange-400',
    via: 'via-pink-400',
    to: 'to-purple-600',
    cloudColor: 'text-orange-200/70',
    starColor: 'text-orange-200',
  },
  NIGHT: {
    from: 'from-indigo-900',
    via: 'via-purple-900',
    to: 'to-blue-900',
    cloudColor: 'text-gray-400/50',
    starColor: 'text-yellow-200',
  },
} as const;

type Theme = typeof BackgroundTheme[keyof typeof BackgroundTheme];

const Trees = () => (
  <div className="absolute bottom-0 w-full overflow-hidden pointer-events-none">
    <div className="flex justify-around">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="relative animate-float"
          style={{
            animationDelay: `${i * 0.5}s`,
            transform: `scale(${0.8 + Math.random() * 0.4})`,
          }}
        >
          <Tree className="w-24 h-24 text-green-600" />
          <Flower
            className="absolute -right-2 top-1/2 w-6 h-6 text-pink-400 animate-bounce"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        </div>
      ))}
    </div>
  </div>
);

const Birds = () => (
  <div className="absolute w-full overflow-hidden pointer-events-none" style={{ top: '30%' }}>
    {[...Array(3)].map((_, i) => (
      <Bird
        key={i}
        className="absolute w-8 h-8 text-gray-800 animate-bird"
        style={{
          left: `${i * 30}%`,
          animationDelay: `${i * 2}s`,
          transform: `scale(${0.8 + Math.random() * 0.4})`,
        }}
      />
    ))}
  </div>
);

const FloatingElements = ({ theme }: { theme: Theme }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 5}s`
          }}
        >
          {i % 3 === 0 ? (
            <Star className={`w-6 h-6 ${theme.starColor}`} />
          ) : i % 3 === 1 ? (
            <div className="w-4 h-4 rounded-full bg-pink-300/50 animate-pulse" />
          ) : (
            <div className="w-3 h-3 rounded-full bg-purple-300/50 animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
};

const CloudAnimation = ({ theme }: { theme: Theme }) => {
  return (
    <div className="absolute top-0 w-full overflow-hidden h-32">
      <div className="animate-[slide_20s_linear_infinite] absolute flex gap-12">
        {[...Array(4)].map((_, i) => (
          <Cloud
            key={i}
            className={`w-32 h-20 ${theme.cloudColor}`}
            style={{
              transform: `translateX(${i * 160}px) scale(${1 + Math.sin(i) * 0.2})`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const SunMoonCycle = ({ isNight }: { isNight: boolean }) => (
  <div className="absolute top-4 left-4 animate-spin-slow">
    <div className={`w-16 h-16 ${isNight ? 'bg-gray-200' : 'bg-yellow-300'} rounded-full shadow-lg animate-pulse flex items-center justify-center`}>
      {isNight ? (
        <Moon className="w-8 h-8 text-gray-400" />
      ) : (
        <SunIcon className="w-8 h-8 text-yellow-600" />
      )}
    </div>
  </div>
);

const Score = ({ score, lives }: { score: number; lives: number }) => (
  <div className="absolute top-4 right-4 text-xl font-bold bg-white/90 p-3 rounded-lg shadow-md transform hover:scale-110 transition-transform">
    <div className="animate-bounce-gentle">
      Score: {score} | {'❤️'.repeat(lives)}
    </div>
  </div>
);

const FinalScore = ({ score, onRestart }: { score: number; onRestart: () => void }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg text-center transform animate-pop-in">
    <div className="flex justify-center mb-4">
      {[...Array(3)].map((_, i) => (
        <Star
          key={i}
          className="w-8 h-8 text-yellow-400 animate-spin-slow"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
    <h2 className="text-3xl font-bold mb-4 text-gradient animate-rainbow">Game Over!</h2>
    <p className="text-2xl mb-6">Final Score: {score}</p>
    <button
      onClick={onRestart}
      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-lg hover:scale-105 transition-all animate-pulse"
    >
      Play Again
    </button>
  </div>
);

const WigglyText = ({ children }: { children: string }) => {
  return (
    <span className="inline-block">
      {children.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block animate-wiggle"
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

interface Question {
  text: string;
  answer: string;
}

interface QuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  timer: number;
}

const Question = ({ question, onAnswer, timer }: QuestionProps) => {
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setInput('');
  }, [question]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input !== question.answer) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    onAnswer(input);
    setInput('');
  };

  return (
    <div className={`bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full transform transition-all ${shake ? 'animate-shake' : 'hover:scale-105'}`}>
      <div className="mb-6">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-1000"
            style={{ width: `${(timer / 30) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2 animate-pulse">Time left: {timer}s</p>
      </div>
      
      <h2 className="text-4xl font-bold mb-6 text-gradient animate-rainbow">
        <WigglyText>{question.text}</WigglyText>
      </h2>
      
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="text-center text-3xl w-32 p-3 border-4 border-purple-300 rounded-lg focus:border-pink-500 focus:outline-none transform transition-all hover:scale-105"
          autoFocus
        />
        <button type="submit" className="hidden">Submit</button>
      </form>
    </div>
  );
};

const MathGame = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [timer, setTimer] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const [theme, setTheme] = useState(BackgroundTheme.DAY);
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTheme(prev => {
        if (prev === BackgroundTheme.DAY) {
          setIsNight(false);
          return BackgroundTheme.SUNSET;
        }
        if (prev === BackgroundTheme.SUNSET) {
          setIsNight(true);
          return BackgroundTheme.NIGHT;
        }
        setIsNight(false);
        return BackgroundTheme.DAY;
      });
    }, 20000); // Change background every 20 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    soundManager.playBackground();
    return () => soundManager.stopAll();
  }, []);

  useEffect(() => {
    if (!gameOver && question) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            handleWrongAnswer();
            return 30;
          }
          if (prev <= 6) {
            soundManager.play('tick');
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [question, gameOver]);

  const generateQuestion = (): Question => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return {
      text: `${num1} × ${num2}`,
      answer: String(num1 * num2)
    };
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setQuestion(generateQuestion());
    setTimer(30);
    soundManager.playBackground();
  };

  const handleAnswer = (answer: string) => {
    if (answer === question?.answer) {
      soundManager.play('correct');
      setScore((prev) => prev + 1);
      setQuestion(generateQuestion());
      setTimer(30);
    } else {
      handleWrongAnswer();
    }
  };

  const handleWrongAnswer = () => {
    soundManager.play('wrong');
    setLives((prev) => {
      if (prev <= 1) {
        soundManager.play('gameOver');
        setGameOver(true);
        return 0;
      }
      setQuestion(generateQuestion());
      setTimer(30);
      return prev - 1;
    });
  };

  const toggleMute = () => {
    setIsMuted(soundManager.toggleMute());
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <div className={`relative min-h-screen bg-gradient-to-b ${theme.from} ${theme.via} ${theme.to} flex items-center justify-center p-4 overflow-hidden transition-colors duration-1000`}>
      <FloatingElements theme={theme} />
      <CloudAnimation theme={theme} />
      <Birds />
      <Trees />
      <SunMoonCycle isNight={isNight} />
      
      <button
        onClick={toggleMute}
        className="absolute top-4 left-24 bg-white/90 p-3 rounded-lg shadow-md hover:scale-110 transition-transform"
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-gray-600" />
        ) : (
          <Volume2 className="w-6 h-6 text-gray-600" />
        )}
      </button>
      
      {!gameOver && <Score score={score} lives={lives} />}
      
      {gameOver ? (
        <FinalScore score={score} onRestart={startGame} />
      ) : (
        question && (
          <Question
            question={question}
            onAnswer={handleAnswer}
            timer={timer}
          />
        )
      )}
    </div>
  );
};

export default MathGame;