import { NextRequest, NextResponse } from "next/server";
import {
  Pinecone,
  type ScoredPineconeRecord,
} from "@pinecone-database/pinecone";
import axios from "axios";
import { GoogleAuth } from "google-auth-library";

const PINECONE_API_KEY = process.env.PINECONE_API_KEY!;
const PINECONE_INDEX = process.env.PINECONE_INDEX!;
const GEMINI_PROJECT_ID = process.env.GEMINI_PROJECT_ID!;
const GEMINI_LOCATION = process.env.GEMINI_LOCATION!;
const GEMINI_MODEL = process.env.GEMINI_MODEL!;

async function getGeminiAccessToken() {
  const auth = new GoogleAuth({
    credentials: {
      client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    projectId: process.env.GCP_PROJECT_ID,
    scopes: "https://www.googleapis.com/auth/cloud-platform",
  });
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token;
}

async function getGeminiEmbedding(text: string) {
  const accessToken = await getGeminiAccessToken();
  const url = `https://${GEMINI_LOCATION}-aiplatform.googleapis.com/v1/projects/${GEMINI_PROJECT_ID}/locations/${GEMINI_LOCATION}/publishers/google/models/${GEMINI_MODEL}:predict`;

  const response = await axios.post(
    url,
    { instances: [{ content: text }] },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.predictions[0].embeddings.values;
}

export async function POST(req: NextRequest) {
  try {
    const {
      user_blurb,
      num_courses = 10,
      departments,
      levels,
    } = await req.json();

    // 1. Get embedding for user blurb
    const embedding = await getGeminiEmbedding(user_blurb);

    // 2. Query Pinecone
    const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
    const index = pinecone.index<{
      title: string;
      department: string;
      description: string;
      prerequisites?: string;
      max_enrollment?: number;
      seats_available?: number;
      course_number?: number;
      level_band?: string;
    }>(PINECONE_INDEX);

    let filter: Record<string, unknown> | undefined = undefined;
    const hasDepartments = Array.isArray(departments) && departments.length > 0;
    const hasLevels = Array.isArray(levels) && levels.length > 0;
    if (hasDepartments || hasLevels) {
      filter = {};
      if (hasDepartments) (filter as any).department = { $in: departments };
      if (hasLevels) (filter as any).level_band = { $in: levels };
    }

    const queryResponse = await index.query({
      vector: embedding,
      topK: num_courses,
      includeMetadata: true,
      filter,
    });

    // 3. Format and return results
    const results = queryResponse.matches.map(
      (
        match: ScoredPineconeRecord<{
          title: string;
          department: string;
          description: string;
          prerequisites?: string;
          max_enrollment?: number;
          seats_available?: number;
          course_number?: number;
          level_band?: string;
        }>
      ) => ({
        id: match.id,
        title: match.metadata?.title ?? "",
        department: match.metadata?.department ?? "",
        description: match.metadata?.description ?? "",
        prerequisites: match.metadata?.prerequisites ?? "",
        max_enrollment: match.metadata?.max_enrollment ?? null,
        seats_available: match.metadata?.seats_available ?? null,
        course_number: match.metadata?.course_number ?? null,
        level_band: match.metadata?.level_band ?? "",
        score: match.score,
      })
    );

    return NextResponse.json({ results });
  } catch (error: unknown) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
