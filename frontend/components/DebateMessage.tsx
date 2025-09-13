import React from 'react';
import ReactMarkdown from 'react-markdown';

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
    
    // Format inline citations in the main content for markdown
    const formatInlineCitations = (content: string) => {
      // Replace [Source: ...] with markdown-style citations that will be styled
      return content.replace(
        /\[Source:\s*([^\]]+)\]/g,
        '`[$1]`'
      );
    };
    
    // Format the sources section
    const formatSourcesList = (sources: string) => {
      if (!sources) return '';
      
      const sourceLines = sources.split('\n').filter(line => line.trim());
      return sourceLines.map((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
          return trimmedLine.substring(1).trim();
        }
        return trimmedLine;
      });
    };
    
    return {
      mainContent: formatInlineCitations(mainContent),
      sourcesList: formatSourcesList(sourcesSection) as string[]
    };
  };
  
  const { mainContent, sourcesList } = formatMessage(message);
  
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
      {/* Main content rendered as markdown */}
      <div className="font-serif text-base leading-relaxed prose prose-invert max-w-none markdown-content text-white">
        <ReactMarkdown>
          {mainContent}
        </ReactMarkdown>
      </div>
      
      {/* Sources section */}
      {sourcesList && sourcesList.length > 0 && (
        <div className="debate-sources-section">
          <div className="debate-sources-title">
            📚 Sources Referenced:
          </div>
          <div className="debate-sources-list">
            {sourcesList && sourcesList.length > 0 && sourcesList.map((source: string, index: number) => (
              <div key={index} className="source-item">
                {source}
              </div>
            ))}
          </div>
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
