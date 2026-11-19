import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getDashboardData } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    return NextResponse.json(await getDashboardData(searchParams.get("groupId") ?? undefined));
  } catch (error) {
    return apiError(error);
  }
}
