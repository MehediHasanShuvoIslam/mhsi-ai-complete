import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "system",
            content: "You are MHSI AI, a helpful and intelligent assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const text = await response.text();
    console.log("Raw OpenRouter response text:", text);

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("❌ Failed to parse JSON from MHSI AI:", err);
      return NextResponse.json(
        { success: false, message: "Invalid JSON response from MHSI AI." },
        { status: 500 }
      );
    }

    // Check if message exists
    const aiMessage = data.choices?.[0]?.message;
    if (!aiMessage) {
      return NextResponse.json(
        { success: false, message: "No AI response from MHSI AI." },
        { status: 500 }
      );
    }

    // Return wrapped response for frontend
    return NextResponse.json({
      success: true,
      data: {
        role: aiMessage.role,
        content: aiMessage.content,
        timestamp: Date.now(),
      },
    });

  } catch (error) {
    console.error("🔥 Error in /api/chat:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong on the server." },
      { status: 500 }
    );
  }
}
