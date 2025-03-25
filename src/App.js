
import React, { useState } from "react";
import { motion } from "framer-motion";
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import celebrationSfx from './celebration.mp3';
import './App.css';

const steps = [
  "Think of any number (don't tell me).",
  "Now double it.",
  "Add an even number (choose one).",
  "Now split the total in half.",
  "Subtract the number you first thought of.",
  "Your final answer is..."
];

const evenChoices = [4, 6, 10];

function App() {
  const [step, setStep] = useState(0);
  const [evenAdd, setEvenAdd] = useState(null);
  const [finalNumber, setFinalNumber] = useState(null);
  const [playCelebration] = useSound(celebrationSfx);

  const handleNext = () => {
    if (step === 2 && evenAdd === null) return;
    if (step === 4 && evenAdd) {
      const result = evenAdd / 2;
      setFinalNumber(result);
      playCelebration();
      confetti({ particleCount: 100, spread: 70 });
    }
    setStep((prev) => prev + 1);
  };

  const handleRestart = () => {
    setStep(0);
    setEvenAdd(null);
    setFinalNumber(null);
  };

  return (
    <div className="app">
      <div className="employer-line">
        <motion.div
          className="employer"
          animate={{ x: `${step * 33}%` }}
          transition={{ duration: 0.5 }}
        >
          👨‍💼
        </motion.div>
        <div className="stations">
          <span>Hiring</span>
          <span>Scheduling</span>
          <span>Payroll</span>
        </div>
      </div>

      <div className="step-box">
        <h2>{steps[step]}</h2>
        {step === 2 && (
          <div className="choices">
            {evenChoices.map((num) => (
              <button
                key={num}
                className={\`choice \${evenAdd === num ? "selected" : ""}\`}
                onClick={() => setEvenAdd(num)}
              >
                {num}
              </button>
            ))}
          </div>
        )}
        {step === 5 && finalNumber !== null && (
          <div className="reveal">🎉 Your final answer is: {finalNumber}</div>
        )}
        {step < steps.length - 1 ? (
          <button className="next-btn" onClick={handleNext}>
            Next ➡️
          </button>
        ) : (
          <button className="next-btn" onClick={handleRestart}>
            🔁 Play Again
          </button>
        )}
      </div>

      {step === 5 && (
        <motion.div
          className="footer-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          💰 Employee paid. Chaos avoided. Powered by <strong>Workfission</strong> 💼
        </motion.div>
      )}
    </div>
  );
}

export default App;
