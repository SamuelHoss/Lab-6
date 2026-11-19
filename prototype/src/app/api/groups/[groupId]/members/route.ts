import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { RequestError, ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ groupId: string }> },
) {
  try {
    const { groupId } = await context.params;
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!name || name.length > 80) {
      throw new ValidationError("Enter a member name between 1 and 80 characters.");
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ValidationError("Enter a valid email address, or leave it blank.");
    }

    const groupExists = await prisma.group.findUnique({ where: { id: groupId }, select: { id: true } });
    if (!groupExists) throw new RequestError("Group not found.", 404);

    const member = await prisma.$transaction(async (transaction) => {
      let user = email ? await transaction.user.findUnique({ where: { email } }) : null;
      if (!user) {
        user = await transaction.user.create({
          data: {
            name,
            email: email || `member-${randomUUID()}@splitsmart.local`,
          },
        });
      }

      const membership = await transaction.membership.findUnique({
        where: { groupId_userId: { groupId, userId: user.id } },
      });
      if (membership?.active) {
        throw new ValidationError(`${user.name} is already in this group.`);
      }
      if (membership) {
        await transaction.membership.update({
          where: { id: membership.id },
          data: { active: true },
        });
      } else {
        await transaction.membership.create({ data: { groupId, userId: user.id } });
      }
      return user;
    });

    return NextResponse.json(
      { member: { id: member.id, name: member.name } },
      { status: 201 },
    );
  } catch (error) {
    return apiError(error);
  }
}
