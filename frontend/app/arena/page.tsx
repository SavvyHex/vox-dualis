"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

interface DebateMessage {
  id: number;
  speaker: "for" | "against";
  message: string;
  timestamp: Date;
}

export default function Arena() {
  const [debateTopic, setDebateTopic] = useState("");
  const [isDebateStarted, setIsDebateStarted] = useState(false);
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [isRoundInProgress, setIsRoundInProgress] = useState(false);
  const [roundNumber, setRoundNumber] = useState(0);

  const handleStartDebate = () => {
    if (debateTopic.trim()) {
      setIsDebateStarted(true);
      setRoundNumber(1);
      startNextRound();
    }
  };

  const startNextRound = () => {
    setIsRoundInProgress(true);

    // First message is always "for", second is "against"
    setTimeout(() => {
      const forMessage: DebateMessage = {
        id: messages.length + 1,
        speaker: "for",
        message: "Hi",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, forMessage]);

      // Add "against" response after a delay
      setTimeout(() => {
        const againstMessage: DebateMessage = {
          id: messages.length + 2,
          speaker: "against",
          message: "Hi",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, againstMessage]);
        setIsRoundInProgress(false);
      }, 1500);
    }, 1000);
  };

  const handleContinue = () => {
    setRoundNumber((prev) => prev + 1);
    startNextRound();
  };

  if (isDebateStarted) {
    return (
      <div className="vox-page-bg">
        <Navbar />

        {/* Debate Interface */}
        <main className="flex-1 px-6 py-8">
          <div className="w-full max-w-[90%] mx-auto">
            {/* Debate Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-amber-400 font-roman mb-2">
                The Arena - Round {roundNumber}
              </h1>
              <p className="text-stone-300 font-serif text-lg">
                Here is the debate arena, where your AI gladiators clash. The{" "}
                <span className="text-green-600 italic">For</span> side argues
                in favor of the topic, while the{" "}
                <span className="text-amber-600 italic">Against</span> side
                presents counterarguments. Both sides will be able to read each
                other&#39;s arguments and respond accordingly.
              </p>
            </div>

            {/* Chat Interface - WhatsApp Style */}
            <div className="w-full mx-auto">
              <div className="vox-arena-interface">
                {/* Chat Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-600">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                      <span className="text-xl">⚖️</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-amber-400 font-roman">
                        {debateTopic.replace(
                          /\w\S*/g,
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )}
                      </h3>
                    </div>
                  </div>
                  <div className="text-stone-400 text-sm">
                    Round {roundNumber}
                  </div>
                </div>

                {/* Messages Container */}
                <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto mb-6 px-2 vox-scrollbar">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.speaker === "for"
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          message.speaker === "for" ? "order-1" : "order-2"
                        }`}
                      >
                        {/* Speaker Label */}
                        <div
                          className={`text-xs font-medium mb-1 ${
                            message.speaker === "for"
                              ? "text-green-400 text-left"
                              : "text-red-400 text-right"
                          }`}
                        >
                          {message.speaker === "for" ? "🛡️ For" : "⚔️ Against"}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.speaker === "for"
                              ? "bg-green-600 text-white rounded-bl-sm"
                              : "bg-amber-600 text-white rounded-br-sm"
                          }`}
                        >
                          <p className="font-serif text-sm leading-relaxed">
                            {message.message}
                          </p>
                          <div
                            className={`text-xs opacity-70 mt-2 ${
                              message.speaker === "for"
                                ? "text-left"
                                : "text-right"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Thinking Indicator */}
                  {isRoundInProgress && (
                    <div className="flex justify-start">
                      <div className="max-w-[70%]">
                        <div className="text-xs font-medium mb-1 text-green-400 text-left">
                          🛡️ For
                        </div>
                        <div className="bg-green-600 rounded-2xl rounded-bl-sm px-4 py-3">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-white rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-white rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isRoundInProgress &&
                    messages.length > 0 &&
                    messages.length % 2 === 1 && (
                      <div className="flex justify-end">
                        <div className="max-w-[70%]">
                          <div className="text-xs font-medium mb-1 text-red-400 text-right">
                            ⚔️ Against
                          </div>
                          <div className="bg-amber-600 rounded-2xl rounded-br-sm px-4 py-3">
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-white rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-white rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="text-center mt-8">
              <button
                onClick={handleContinue}
                disabled={isRoundInProgress}
                className={`px-8 py-3 text-lg font-bold rounded-lg transition-all duration-300 font-roman ${
                  isRoundInProgress
                    ? "bg-stone-600 text-stone-400 cursor-not-allowed"
                    : "vox-btn-primary hover:scale-105"
                }`}
              >
                {isRoundInProgress ? "Round in Progress..." : "Continue Debate"}
              </button>

              <button
                onClick={() => {
                  setIsDebateStarted(false);
                  setMessages([]);
                  setRoundNumber(0);
                  setDebateTopic("");
                }}
                className="ml-4 px-6 py-3 text-lg font-bold rounded-lg bg-stone-600 text-stone-200 hover:bg-stone-500 transition-all duration-300 font-roman"
              >
                New Topic
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="vox-page-bg">
      <Navbar />

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
              Enter your philosophical question or ethical dilemma. Watch as AI
              gladiators engage in intellectual combat, wielding logic and
              reason as their weapons.
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
                  ${
                    debateTopic.trim()
                      ? "vox-btn-primary"
                      : "bg-stone-400 dark:bg-stone-600 text-stone-200 dark:text-stone-400 cursor-not-allowed"
                  }`}
              >
                {debateTopic.trim()
                  ? "⚔️ Start Debate"
                  : "Enter a Topic to Begin"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
