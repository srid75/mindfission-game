import React, { useState, useCallback } from 'react';
import './App.css';
import Confetti from './components/Confetti';

function App() {
  // Function to generate 3 random unique even numbers between 2 and 20
  const generateRandomEvenNumbers = useCallback(() => {
    const allEvenNumbers = Array.from({ length: 10 }, (_, i) => (i + 1) * 2); // [2,4,6,...,20]
    const shuffled = allEvenNumbers.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, []);

  const [gameState, setGameState] = useState({
    step: 0,
    originalNumber: null,
    addedNumber: null,
    employeeProgress: 0,
    hiringProgress: 0,
    schedulingProgress: 0,
    payrollProgress: 0,
    gameComplete: false,
    showConfetti: false,
    evenOptions: generateRandomEvenNumbers() // Store the random numbers in state
  });

  const [audio] = useState(new Audio('/celebration.mp3'));

  const steps = [
    {
      instruction: "Welcome to the Shift Trick — a game that reads your mind 🧠\nReady to play?",
      buttonText: "Start"
    },
    {
      instruction: "Think of any positive number (but don't tell me!)",
      buttonText: "Next"
    },
    {
      instruction: "Now double that number.",
      buttonText: "Next"
    },
    {
      instruction: "Now add one of these even numbers:",
      options: gameState.evenOptions, // Use the stored random numbers
      buttonText: "Next"
    },
    {
      instruction: "Now divide everything in half.",
      buttonText: "Next"
    },
    {
      instruction: "Now subtract the number you first thought of from the half we did.",
      buttonText: "Next"
    },
    {
      instruction: "Do you know what Workfission is?",
      options: [
        "Smart Scheduling",
        "Smart Hiring",
        "Smart Job Search",
        "All of the above"
      ],
      buttonText: "Reveal Answer"
    }
  ];

  const handleOptionSelect = (option) => {
    if (typeof option === 'number') {
      setGameState(prev => ({
        ...prev,
        addedNumber: option
      }));
    } else if (option === "All of the above" && gameState.step === 6) {
      handleNext();
    }
  };

  const handleNext = () => {
    const nextStep = gameState.step + 1;
    
    if (nextStep >= steps.length) {
      if (typeof gameState.addedNumber === 'number') {
        setGameState(prev => ({
          ...prev,
          gameComplete: true,
          showConfetti: true,
          employeeProgress: 100,
          hiringProgress: 100,
          schedulingProgress: 100,
          payrollProgress: 100
        }));
        
        audio.play().catch(error => console.log("Audio playback failed:", error));
      }
    } else {
      setGameState(prev => ({
        ...prev,
        step: nextStep,
        employeeProgress: Math.min(100, prev.employeeProgress + 20),
        hiringProgress: Math.min(100, prev.hiringProgress + 20),
        schedulingProgress: Math.min(100, prev.schedulingProgress + 20),
        payrollProgress: Math.min(100, prev.payrollProgress + 20)
      }));
    }
  };

  const handlePlayAgain = () => {
    setGameState({
      step: 0,
      originalNumber: null,
      addedNumber: null,
      employeeProgress: 0,
      hiringProgress: 0,
      schedulingProgress: 0,
      payrollProgress: 0,
      gameComplete: false,
      showConfetti: false,
      evenOptions: generateRandomEvenNumbers() // Generate new random numbers for next game
    });
  };

  const renderProgressBars = () => (
    <div className="progress-container">
      <div className="employee-track">
        <span className="employee-emoji" style={{ left: `${gameState.employeeProgress}%` }}>👨‍🔧</span>
        <div className="stations">
          <span>📌 Job</span>
          <span>📆 Schedule</span>
          <span>💰 Pay</span>
        </div>
      </div>
      <div className="employer-progress">
        <div className="progress-bar">
          <div className="progress-label">📥 Hiring</div>
          <div className="progress-fill" style={{ width: `${gameState.hiringProgress}%` }}></div>
        </div>
        <div className="progress-bar">
          <div className="progress-label">📅 Scheduling</div>
          <div className="progress-fill" style={{ width: `${gameState.schedulingProgress}%` }}></div>
        </div>
        <div className="progress-bar">
          <div className="progress-label">💸 Payroll</div>
          <div className="progress-fill" style={{ width: `${gameState.payrollProgress}%` }}></div>
        </div>
      </div>
    </div>
  );

  const renderGameContent = () => {
    const currentStep = steps[gameState.step];
    
    if (gameState.gameComplete) {
      return (
        <div className="game-complete">
          <h2>🎉 Your final answer is: {gameState.addedNumber / 2}</h2>
          <p>Employee paid. Chaos avoided. Powered by Workfission.</p>
          <button onClick={handlePlayAgain}>🔁 Play Again</button>
        </div>
      );
    }

    return (
      <div className="game-content">
        <p>{currentStep.instruction}</p>
        {currentStep.options && (
          <div className="options">
            {currentStep.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={
                  (gameState.addedNumber === option || 
                   (option === "All of the above" && gameState.step === 6)) 
                  ? 'selected' : ''
                }
                disabled={gameState.step === 6 && option !== "All of the above"}
              >
                {option}
              </button>
            ))}
          </div>
        )}
        <button 
          onClick={handleNext}
          className="next-button"
          disabled={
            (gameState.step === 3 && !gameState.addedNumber) ||
            (gameState.step === 6 && gameState.addedNumber === null)
          }
        >
          {currentStep.buttonText}
        </button>
      </div>
    );
  };

  return (
    <div className="App">
      <main>
        {renderProgressBars()}
        {renderGameContent()}
      </main>
      {gameState.showConfetti && <Confetti />}
    </div>
  );
}

export default App;
