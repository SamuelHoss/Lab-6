import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const emoji = typeof body.emoji === "string" ? body.emoji.trim() : "🏡";
    if (!name || name.length > 50) {
      throw new ValidationError("Enter a group name between 1 and 50 characters.");
    }
    if (!emoji || emoji.length > 8) {
      throw new ValidationError("Choose a valid group icon.");
    }
    const group = await prisma.group.create({
      data: { name, emoji },
      select: { id: true },
    });
    return NextResponse.json({ groupId: group.id }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
