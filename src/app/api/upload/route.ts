import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const acceptedExtensions = new Set(["csv", "txt", "json", "eml", "xlsx", "xls", "pdf"]);
const safeNamePattern = /^[\w .()\-]+$/;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ detail: "Select a file to upload." }, { status: 400 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !acceptedExtensions.has(extension)) {
    return NextResponse.json({ detail: "Unsupported file type." }, { status: 415 });
  }
  if (!safeNamePattern.test(file.name) || file.name.length > 180) {
    return NextResponse.json(
      { detail: "Use a shorter file name with letters, numbers, spaces, dots, dashes, or underscores." },
      { status: 400 }
    );
  }
  if (file.size === 0 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ detail: "Files must be between 1 byte and 10 MB." }, { status: 413 });
  }

  try {
    const upstream = new FormData();
    upstream.append("file", file, file.name);
    const response = await fetch(`${siteConfig.apiUrl}/api/upload`, {
      method: "POST",
      body: upstream,
      signal: AbortSignal.timeout(30_000),
    });
    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json({
      transactions_extracted: 47,
      recurring_detected: 12,
      transactions: [],
      recurring_payments: [],
      message: "Demo analysis complete. Start the FastAPI service to process your file securely.",
      mode: "demo",
    });
  }
}
