import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: NextRequest) {
  try {
    const { feedback } = await req.json();
    if (!feedback || typeof feedback !== "string" || feedback.length < 3) {
      return NextResponse.json(
        { error: "Feedback too short." },
        { status: 400 }
      );
    }
    await pool.query("INSERT INTO feedback (message) VALUES ($1)", [feedback]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save feedback." },
      { status: 500 }
    );
  }
}
