// API utility functions for communicating with the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface DebateRequest {
  topic: string;
}

export interface DebateResponse {
  topic: string;
  pro_argument: string;
  con_argument: string;
  mediator_analysis: string;
  summary: string;
}

export interface DebateMessage {
  id: number;
  speaker: "for" | "against" | "mediator";
  message: string;
  timestamp: Date;
  round?: number;
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function generateDebate(topic: string): Promise<DebateResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/debate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors or other unexpected errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to generate debate'
    );
  }
}

export async function checkHealthStatus(): Promise<{ status: string; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new ApiError(`Health check failed with status: ${response.status}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to check backend health'
    );
  }
}

// Convert backend response to frontend message format
export function convertToMessages(debateResponse: DebateResponse, roundNumber: number, existingMessagesCount: number = 0): DebateMessage[] {
  const messages: DebateMessage[] = [];
  const baseId = existingMessagesCount;
  
  // Add pro argument (for)
  messages.push({
    id: baseId + 1,
    speaker: "for",
    message: debateResponse.pro_argument,
    timestamp: new Date(),
    round: roundNumber,
  });

  // Add con argument (against)
  messages.push({
    id: baseId + 2,
    speaker: "against", 
    message: debateResponse.con_argument,
    timestamp: new Date(),
    round: roundNumber,
  });

  return messages;
}

// Utility function to format error messages for display
export function formatErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return "Please provide a valid debate topic.";
    } else if (error.status === 500) {
      return "There was an issue processing your request. Please try again.";
    } else if (error.status === 0 || !error.status) {
      return "Unable to connect to the server. Please ensure the backend is running.";
    }
    return error.message;
  }
  
  return error instanceof Error ? error.message : "An unexpected error occurred.";
}
