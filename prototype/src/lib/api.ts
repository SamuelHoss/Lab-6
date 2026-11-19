import { NextResponse } from "next/server";
import { RequestError, ValidationError } from "@/lib/errors";

export function apiError(error: unknown) {
  if (error instanceof RequestError || error instanceof ValidationError) {
    return NextResponse.json(
      { error: error.message },
      { status: error instanceof RequestError ? error.status : 400 },
    );
  }
  console.error("SplitSmart API request failed:", error);
  return NextResponse.json(
    { error: "We couldn’t complete that request. Please try again." },
    { status: 500 },
  );
}
