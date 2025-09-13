"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ConnectionStatus from "../../components/ConnectionStatus";
import DebateMessageComponent from "../../components/DebateMessage";
import { generateDebate, convertToMessages, formatErrorMessage, type DebateMessage } from "../../lib/api";

export default function Arena() {
  const [debateTopic, setDebateTopic] = useState("");
  const [isDebateStarted, setIsDebateStarted] = useState(false);
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [isRoundInProgress, setIsRoundInProgress] = useState(false);
  const [roundNumber, setRoundNumber] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDebate = async () => {
    if (debateTopic.trim()) {
      setIsDebateStarted(true);
      setRoundNumber(1);
      setError(null);
      await startNextRound();
    }
  };

  const startNextRound = async () => {
    setIsRoundInProgress(true);
    setIsLoading(true);
    setError(null);

    try {
      // Call the backend API to generate the debate
      const debateResponse = await generateDebate(debateTopic);
      
      // Convert the response to messages format
      const newMessages = convertToMessages(debateResponse, roundNumber, messages.length);
      
      // Add messages with a slight delay to simulate conversation
      setMessages((prev) => [...prev, newMessages[0]]);
      
      setTimeout(() => {
        setMessages((prev) => [...prev, newMessages[1]]);
        
        // Add mediator analysis after both arguments
        setTimeout(() => {
          setMessages((prev) => [...prev, newMessages[2]]);
          setIsRoundInProgress(false);
          setIsLoading(false);
        }, 1500);
      }, 1500);
      
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      setIsRoundInProgress(false);
      setIsLoading(false);
      
      // Show a fallback message if there's an error
      console.error("Debate generation failed:", err);
    }
  };

  const handleContinue = async () => {
    setRoundNumber((prev) => prev + 1);
    await startNextRound();
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
                Here is the debate arena, where your AI gladiators clash. 
                <span className="text-green-400 italic font-semibold"> Marcus Advocatus</span> argues
                in favor of the topic, while 
                <span className="text-amber-400 italic font-semibold"> Gaius Contradictor </span>
                presents counterarguments, with 
                <span className="text-blue-400 italic font-semibold"> Lucius Moderator </span>
                providing impartial analysis. All sides will be able to read each
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
                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-stone-400 text-sm">
                      Round {roundNumber}
                    </div>
                    <ConnectionStatus />
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <span className="text-red-400 text-lg">⚠️</span>
                      <div>
                        <p className="text-red-400 font-medium">Debate Generation Failed</p>
                        <p className="text-red-300 text-sm mt-1">{error}</p>
                        <button
                          onClick={() => {
                            setError(null);
                            if (isDebateStarted && messages.length === 0) {
                              startNextRound();
                            }
                          }}
                          className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages Container */}
                <div className="space-y-4 min-h-[600px] max-h-[800px] overflow-y-auto mb-6 px-2 vox-scrollbar">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.speaker === "for"
                          ? "justify-start"
                          : message.speaker === "against"
                          ? "justify-end"
                          : "justify-center"
                      }`}
                    >
                      <div
                        className={`${
                          message.speaker === "mediator" 
                            ? "max-w-[85%]" 
                            : "max-w-[70%]"
                        } ${
                          message.speaker === "for" ? "order-1" : "order-2"
                        }`}
                      >
                        {/* Speaker Label */}
                        <div
                          className={`text-sm font-medium mb-1 ${
                            message.speaker === "for"
                              ? "text-green-400 text-left"
                              : message.speaker === "against"
                              ? "text-red-400 text-right"
                              : "text-blue-400 text-center"
                          }`}
                        >
                          {message.speaker === "for" 
                            ? "🛡️ Marcus Advocatus" 
                            : message.speaker === "against"
                            ? "⚔️ Gaius Contradictor" 
                            : "🏛️ Lucius Moderator"
                          }
                        </div>

                        {/* Message Bubble with improved formatting */}
                        <DebateMessageComponent
                          message={message.message}
                          speaker={message.speaker}
                          timestamp={message.timestamp}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Thinking Indicator */}
                  {isRoundInProgress && (
                    <div className="flex justify-center">
                      <div className="max-w-[70%]">
                        <div className="text-xs font-medium mb-1 text-amber-400 text-center">
                          🏛️ Senate in Session
                        </div>
                        <div className="bg-amber-600 rounded-2xl px-4 py-3">
                          <div className="flex items-center justify-center space-x-1">
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
                          <p className="text-white text-xs text-center mt-2">
                            {isLoading ? "Generating arguments..." : "Debaters are thinking..."}
                          </p>
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
                  setError(null);
                  setIsLoading(false);
                  setIsRoundInProgress(false);
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
            <div className="text-center space-y-4">
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
              
              {/* Connection Status */}
              <div className="flex justify-center">
                <ConnectionStatus />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
