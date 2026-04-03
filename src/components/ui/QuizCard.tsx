'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizQuestion } from '@/lib/data/quizzes';
import { Check, X } from 'lucide-react';

interface QuizCardProps {
  question: QuizQuestion;
  index: number;
  total: number;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}

export default function QuizCard({ question, index, total, onAnswer, onNext }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    setShowExplanation(true);
    onAnswer(optionIndex === question.correctIndex);
  };

  const handleNext = () => {
    setSelected(null);
    setShowExplanation(false);
    onNext();
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-panel max-w-2xl mx-auto"
    >
      {/* Progress */}
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-mint-bloom uppercase tracking-wider">
            Question {index + 1} of {total}
          </span>
          <span className="text-xs font-mono text-soft-pistachio/50">
            {question.organSlug.toUpperCase()}
          </span>
        </div>
        <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(to right, #1b4332, #73e2a7)' }}
            initial={{ width: 0 }}
            animate={{ width: `${((index + 1) / total) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-5">
        <h3 className="text-lg text-cream-white font-medium leading-relaxed mb-6 font-display">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, i) => {
            const isSelected = selected === i;
            const isCorrect = i === question.correctIndex;
            const isAnswered = selected !== null;
            
            let borderColor = 'border-white/[0.08]';
            let bgColor = 'bg-white/[0.02]';
            let textColor = 'text-soft-pistachio/80';
            
            if (isAnswered) {
              if (isCorrect) {
                borderColor = 'border-mint-bloom/50';
                bgColor = 'bg-mint-bloom/10';
                textColor = 'text-mint-bloom';
              } else if (isSelected) {
                borderColor = 'border-red-400/50';
                bgColor = 'bg-red-400/10';
                textColor = 'text-red-400';
              } else {
                textColor = 'text-soft-pistachio/40';
              }
            }

            return (
              <motion.button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={isAnswered}
                whileHover={!isAnswered ? { scale: 1.01, x: 4 } : {}}
                whileTap={!isAnswered ? { scale: 0.99 } : {}}
                className={`w-full text-left p-4 rounded-xl border ${borderColor} ${bgColor} transition-all duration-200 ${
                  !isAnswered ? 'hover:border-forest-jade/50 hover:bg-white/[0.04] cursor-pointer' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                    isAnswered && isCorrect ? 'bg-mint-bloom/20 text-mint-bloom' :
                    isAnswered && isSelected ? 'bg-red-400/20 text-red-400' :
                    'bg-white/[0.06] text-soft-pistachio/60'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className={`text-sm tracking-wide ${textColor}`}>{option}</span>
                  
                  {isAnswered && isCorrect && (
                    <Check className="w-5 h-5 ml-auto text-mint-bloom" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <X className="w-5 h-5 ml-auto text-red-400" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 overflow-hidden"
            >
              <div className="glass-panel !p-5 border-l-2 border-l-mint-bloom/50">
                <p className="text-xs font-mono uppercase tracking-wider text-mint-bloom mb-2">Explanation</p>
                <p className="text-sm text-soft-pistachio/70 leading-relaxed tracking-wide">{question.explanation}</p>
              </div>
              
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 w-full py-3.5 rounded-xl bg-forest-jade/20 hover:bg-forest-jade/30 text-mint-bloom font-medium tracking-wide text-sm transition-colors border border-forest-jade/30 shadow-lg shadow-forest-jade/10"
              >
                {index < total - 1 ? 'Next Question →' : 'View Results'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
