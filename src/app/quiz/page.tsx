'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizCard from '@/components/ui/QuizCard';
import { getQuizByOrgan, getRandomQuiz } from '@/lib/data/quizzes';
import { organs } from '@/lib/data/organs';
import { Shuffle, Award, BookOpen, TrendingUp } from 'lucide-react';

type QuizMode = 'setup' | 'active' | 'results';

export default function QuizPage() {
  const [mode, setMode] = useState<QuizMode>('setup');
  const [selectedOrganFilter, setSelectedOrganFilter] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const questions = useMemo(() => {
    if (selectedOrganFilter) {
      return getQuizByOrgan(selectedOrganFilter);
    }
    return getRandomQuiz(15);
  }, [selectedOrganFilter]);

  const startQuiz = (organSlug: string | null) => {
    setSelectedOrganFilter(organSlug);
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setMode('active');
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, correct]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setMode('results');
    }
  };

  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="pt-24 pb-16 px-6 max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {/* Setup Mode */}
        {mode === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-cream-white mb-3 font-display">
                Anatomy Quiz
              </h1>
              <p className="text-soft-pistachio/50">
                Test your knowledge of human anatomy — choose an organ or take a mixed challenge
              </p>
            </div>

            {/* Mixed Quiz Button */}
            <motion.button
              onClick={() => startQuiz(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full glass-panel-hover p-6 mb-6 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-jade/20 to-mint-bloom/10 flex items-center justify-center border border-forest-jade/20">
                  <Shuffle className="w-6 h-6 text-mint-bloom" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-cream-white font-display">
                    Mixed Challenge
                  </h3>
                  <p className="text-sm text-soft-pistachio/40">15 random questions from all organs</p>
                </div>
                <span className="ml-auto text-mint-bloom text-xl">→</span>
              </div>
            </motion.button>

            {/* Organ-specific quizzes */}
            <h3 className="text-xs font-mono text-soft-pistachio/40 uppercase tracking-wider mb-4 px-1">By Organ System</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {organs.map((organ, i) => {
                const questionCount = getQuizByOrgan(organ.slug).length;
                return (
                  <motion.button
                    key={organ.slug}
                    onClick={() => startQuiz(organ.slug)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-panel-hover p-5 text-left"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${organ.color}20` }}
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: organ.color }} />
                      </div>
                    </div>
                    <h4 className="text-cream-white font-medium mb-1 font-display">{organ.name}</h4>
                    <p className="text-xs text-soft-pistachio/40 font-mono">{questionCount} questions</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Active Quiz */}
        {mode === 'active' && questions.length > 0 && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Score tracker */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setMode('setup')}
                className="text-sm text-soft-pistachio/40 hover:text-cream-white transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
              <div className="flex items-center gap-4 text-sm font-mono">
                <span className="text-mint-bloom">✓ {score}</span>
                <span className="text-red-400">✗ {answers.length - score}</span>
              </div>
            </div>
            
            <QuizCard
              question={questions[currentIndex]}
              index={currentIndex}
              total={questions.length}
              onAnswer={handleAnswer}
              onNext={handleNext}
            />
          </motion.div>
        )}

        {/* Results */}
        {mode === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel max-w-lg mx-auto p-8 text-center"
          >
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-forest-jade/20 to-mint-bloom/10 border border-forest-jade/20">
              {percentage >= 80 ? (
                <Award className="w-8 h-8 text-mint-bloom" />
              ) : percentage >= 60 ? (
                <TrendingUp className="w-8 h-8 text-mint-bloom" />
              ) : (
                <BookOpen className="w-8 h-8 text-soft-pistachio/60" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-cream-white mb-2 font-display">
              {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : percentage >= 40 ? 'Keep Learning!' : 'Don\'t Give Up!'}
            </h2>
            
            <p className="text-soft-pistachio/50 mb-6">
              You scored {score} out of {questions.length}
            </p>

            {/* Score Ring */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke={percentage >= 60 ? '#73E2A7' : '#ef4444'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - percentage / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-cream-white font-display">{percentage}%</span>
              </div>
            </div>

            {/* Answer breakdown */}
            <div className="flex justify-center gap-1 mb-8">
              {answers.map((correct, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${correct ? 'bg-mint-bloom' : 'bg-red-500'}`}
                  title={`Q${i + 1}: ${correct ? 'Correct' : 'Wrong'}`}
                />
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <motion.button
                onClick={() => { setMode('setup'); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button"
              >
                Choose Another
              </motion.button>
              <motion.button
                onClick={() => startQuiz(selectedOrganFilter)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button-primary"
              >
                Retry Quiz
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
