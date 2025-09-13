import React from 'react';

interface DebateMessageProps {
  message: string;
  speaker: "for" | "against" | "mediator";
  timestamp: Date;
}

const DebateMessage: React.FC<DebateMessageProps> = ({ message, speaker, timestamp }) => {
  // Function to format the debate message with proper source citations
  const formatMessage = (text: string) => {
    // Split the message into main content and sources
    let mainContent = text;
    let sourcesSection = '';
    
    // Check if there's a "Sources Referenced:" section
    const sourcesMatch = text.match(/(Sources Referenced:|References:|Sources:)([\s\S]*?)$/i);
    if (sourcesMatch) {
      mainContent = text.substring(0, sourcesMatch.index).trim();
      sourcesSection = sourcesMatch[2].trim();
    }
    
    // Format inline citations in the main content
    const formatInlineCitations = (content: string) => {
      // Replace [Source: ...] with formatted citations
      return content.replace(
        /\[Source:\s*([^\]]+)\]/g,
        '<span class="inline-citation">[$1]</span>'
      );
    };
    
    // Format the sources section
    const formatSourcesList = (sources: string) => {
      if (!sources) return '';
      
      const sourceLines = sources.split('\n').filter(line => line.trim());
      return sourceLines.map((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
          return `<div class="source-item">${trimmedLine.substring(1).trim()}</div>`;
        }
        return `<div class="source-item">${trimmedLine}</div>`;
      }).join('');
    };
    
    const formattedMainContent = formatInlineCitations(mainContent);
    const formattedSources = formatSourcesList(sourcesSection);
    
    return {
      mainContent: formattedMainContent,
      sources: formattedSources
    };
  };
  
  const { mainContent, sources } = formatMessage(message);
  
  return (
    <div
      className={`rounded-2xl px-4 py-3 ${
        speaker === "for"
          ? "bg-green-600 text-white rounded-bl-sm"
          : speaker === "against"
          ? "bg-amber-600 text-white rounded-br-sm"
          : "bg-blue-600 text-white rounded-lg"
      }`}
    >
      {/* Main content */}
      <div 
        className="font-serif text-base leading-relaxed prose-invert max-w-none"
        dangerouslySetInnerHTML={{ 
          __html: mainContent.replace(/\n/g, '<br />') 
        }}
      />
      
      {/* Sources section */}
      {sources && (
        <div className="debate-sources-section">
          <div className="debate-sources-title">
            📚 Sources Referenced:
          </div>
          <div 
            className="debate-sources-list"
            dangerouslySetInnerHTML={{ __html: sources }}
          />
        </div>
      )}
      
      {/* Timestamp */}
      <div
        className={`text-xs opacity-70 mt-2 ${
          speaker === "for"
            ? "text-left"
            : speaker === "against"
            ? "text-right"
            : "text-center"
        }`}
      >
        {timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
};

export default DebateMessage;
