import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { allocateEqualShares, parseAmountCents } from "@/lib/money";
import { RequestError, ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { groupId, description, payerId, participantIds } = body;
    const cleanDescription =
      typeof description === "string" ? description.trim() : "";
    if (!cleanDescription || cleanDescription.length > 100) {
      throw new ValidationError("Enter a description between 1 and 100 characters.");
    }
    if (typeof groupId !== "string") {
      throw new ValidationError("Select a group for this expense.");
    }
    if (typeof payerId !== "string") {
      throw new ValidationError("Choose who paid for this expense.");
    }
    const amountCents = parseAmountCents(body.amount);
    if (!Array.isArray(participantIds) || participantIds.length === 0) {
      throw new ValidationError("Select at least one participant.");
    }
    if (
      participantIds.some((id: unknown) => typeof id !== "string") ||
      new Set(participantIds).size !== participantIds.length
    ) {
      throw new ValidationError("Choose each participant only once.");
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { memberships: { where: { active: true }, select: { userId: true } } },
    });
    if (!group) throw new RequestError("Group not found.", 404);
    const memberIds = new Set(group.memberships.map(({ userId }) => userId));
    if (
      !memberIds.has(payerId) ||
      participantIds.some((id: string) => !memberIds.has(id))
    ) {
      throw new ValidationError("The payer and every participant must belong to this group.");
    }

    const shares = allocateEqualShares(amountCents, participantIds.length);
    let date = new Date();
    if (body.date !== undefined && body.date !== null && body.date !== "") {
      if (typeof body.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
        throw new ValidationError("Choose a valid expense date.");
      }
      date = new Date(`${body.date}T12:00:00.000Z`);
      if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== body.date) {
        throw new ValidationError("Choose a valid expense date.");
      }
    }

    const expense = await prisma.expense.create({
      data: {
        groupId,
        creatorId: payerId,
        payerId,
        description: cleanDescription,
        amountCents,
        date,
        splitType: "EQUAL",
        status: "APPROVED",
        shares: {
          create: participantIds.map((userId: string, participantOrder: number) => ({
            userId,
            amountCents: shares[participantOrder],
            participantOrder,
          })),
        },
      },
      select: { id: true },
    });
    return NextResponse.json({ id: expense.id }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
