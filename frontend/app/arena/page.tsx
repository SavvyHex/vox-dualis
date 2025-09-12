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
    <div className="vox-page-bg">
      {/* Header */}
      <header className="vox-header">
        <div className="vox-container flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="vox-logo">
              <span className="text-white dark:text-stone-900 font-bold text-xl">V</span>
            </div>
            <h1 className="vox-logo-text">Vox Dualis</h1>
          </div>
          <nav className="vox-nav">
            <Link href="/" className="vox-nav-link">Home</Link>
            <Link href="/arena" className="vox-nav-link-active">Arena</Link>
            <a href="#about" className="vox-nav-link">About</a>
            <a href="#philosophy" className="vox-nav-link">Philosophy</a>
          </nav>
        </div>
      </header>

      {/* Arena Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl">
          {/* Arena Title */}
          <div className="text-center mb-16">
            <div className="vox-icon-container">
              <div className="vox-icon-medium">
                <span className="text-3xl">⚔️</span>
              </div>
            </div>
            
            <h1 className="vox-title-large mb-6">
              The <span className="vox-text-accent">Arena</span>
            </h1>
            
            <p className="vox-subtitle mb-4">
              &ldquo;Veritas vos liberabit&rdquo;
            </p>
            <p className="vox-description">
              Enter your philosophical question or ethical dilemma. Watch as AI gladiators engage in intellectual combat, 
              wielding logic and reason as their weapons.
            </p>
          </div>

          {/* Central Arena Interface */}
          <div className="vox-arena-interface">
            {/* Debate Topic Input */}
            <div className="mb-8">
              <label htmlFor="debate-topic" className="vox-label">
                Choose Your Battlefield
              </label>
              <textarea
                id="debate-topic"
                value={debateTopic}
                onChange={(e) => setDebateTopic(e.target.value)}
                placeholder="Enter your philosophical question or ethical dilemma here... 
Example: 'Is it morally acceptable to sacrifice one life to save many?' or 'Should AI have rights?'"
                className="vox-input"
                maxLength={500}
              />
              <div className="vox-character-count">
                {debateTopic.length}/500 characters
              </div>
            </div>

            {/* Start Debate Button */}
            <div className="text-center">
              <button
                onClick={handleStartDebate}
                disabled={!debateTopic.trim()}
                className={`px-12 py-4 text-xl font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-roman
                  ${debateTopic.trim() 
                    ? 'vox-btn-primary' 
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
      <footer className="vox-footer">
        <div className="vox-container text-center py-8">
          <p className="text-sm">
            &ldquo;In certamine veritas&rdquo; - In competition, truth
          </p>
        </div>
      </footer>
    </div>
  );
}
