import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: `Backend health check failed with status: ${response.status}`,
          backend_connected: false
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      ...data,
      backend_connected: true,
      frontend_status: 'healthy'
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Failed to connect to backend',
        backend_connected: false,
        frontend_status: 'healthy'
      },
      { status: 503 }
    );
  }
}
