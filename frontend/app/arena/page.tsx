'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Arena() {
  const [debateTopic, setDebateTopic] = useState('');

  const handleStartDebate = () => {
    if (debateTopic.trim()) {
      // TODO: Implement debate start logic
      console.log('Starting debate with topic:', debateTopic);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-100 to-amber-100 dark:from-stone-900 dark:via-stone-800 dark:to-amber-900">
      {/* Header */}
      <header className="border-b-4 border-amber-600 dark:border-amber-400 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-600 dark:bg-amber-400 rounded-full flex items-center justify-center">
              <span className="text-white dark:text-stone-900 font-bold text-xl">V</span>
            </div>
            <h1 className="text-2xl font-bold text-amber-800 dark:text-amber-200 font-roman">Vox Dualis</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium">Home</Link>
            <Link href="/arena" className="text-amber-600 dark:text-amber-400 font-medium">Arena</Link>
            <a href="#about" className="text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium">About</a>
            <a href="#philosophy" className="text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium">Philosophy</a>
          </nav>
        </div>
      </header>

      {/* Arena Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl">
          {/* Arena Title */}
          <div className="text-center mb-16">
            <div className="inline-block p-6 bg-amber-600/10 dark:bg-amber-400/10 rounded-full mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-700 dark:from-amber-400 dark:to-amber-500 rounded-full flex items-center justify-center">
                <span className="text-3xl">⚔️</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-stone-800 dark:text-stone-100 mb-6 font-roman">
              The <span className="text-amber-600 dark:text-amber-400">Arena</span>
            </h1>
            
            <p className="text-xl text-stone-600 dark:text-stone-300 mb-4 italic font-serif">
              &ldquo;Veritas vos liberabit&rdquo;
            </p>
            <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
              Enter your philosophical question or ethical dilemma. Watch as AI gladiators engage in intellectual combat, 
              wielding logic and reason as their weapons.
            </p>
          </div>

          {/* Central Arena Interface */}
          <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm rounded-2xl border-4 border-amber-600/30 dark:border-amber-400/30 p-12 shadow-2xl">
            {/* Debate Topic Input */}
            <div className="mb-8">
              <label htmlFor="debate-topic" className="block text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 text-center font-roman">
                Choose Your Battlefield
              </label>
              <textarea
                id="debate-topic"
                value={debateTopic}
                onChange={(e) => setDebateTopic(e.target.value)}
                placeholder="Enter your philosophical question or ethical dilemma here... 
Example: 'Is it morally acceptable to sacrifice one life to save many?' or 'Should AI have rights?'"
                className="w-full h-32 p-6 text-lg border-2 border-amber-300 dark:border-amber-600 rounded-xl 
                         bg-amber-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 
                         focus:outline-none focus:ring-4 focus:ring-amber-500/50 focus:border-amber-500
                         placeholder-stone-500 dark:placeholder-stone-400 resize-none font-serif"
                maxLength={500}
              />
              <div className="text-right mt-2">
                <span className="text-sm text-stone-500 dark:text-stone-400">
                  {debateTopic.length}/500 characters
                </span>
              </div>
            </div>

            {/* Start Debate Button */}
            <div className="text-center">
              <button
                onClick={handleStartDebate}
                disabled={!debateTopic.trim()}
                className={`px-12 py-4 text-xl font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-roman
                  ${debateTopic.trim() 
                    ? 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white cursor-pointer' 
                    : 'bg-stone-400 dark:bg-stone-600 text-stone-200 dark:text-stone-400 cursor-not-allowed'
                  }`}
              >
                {debateTopic.trim() ? '⚔️ Start Debate' : 'Enter a Topic to Begin'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-800 dark:bg-stone-950 text-stone-300 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm">
            &ldquo;In certamine veritas&rdquo; - In competition, truth
          </p>
        </div>
      </footer>
    </div>
  );
}
