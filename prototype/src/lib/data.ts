import { calculateBalances, calculateMemberBalances } from "@/lib/money";
import { prisma } from "@/lib/prisma";

async function getGroupBalances(groupId: string) {
  const expenses = await prisma.expense.findMany({
    where: { groupId },
    select: {
      payerId: true,
      amountCents: true,
      shares: { select: { userId: true, amountCents: true } },
    },
  });
  return calculateBalances(expenses);
}

export async function getDashboardData(selectedGroupId?: string) {
  const records = await prisma.group.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      memberships: {
        where: { active: true },
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
      expenses: { select: { id: true, amountCents: true } },
    },
  });
  const groups = await Promise.all(
    records.map(async (record) => {
      const members = record.memberships
        .map(({ user }) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          avatarColor: user.avatarColor,
        }))
        .sort((first, second) => first.name.localeCompare(second.name));
      const balances = await getGroupBalances(record.id);
      return {
        id: record.id,
        name: record.name,
        emoji: record.emoji,
        accentColor: record.accentColor,
        members,
        memberCount: members.length,
        expenseCount: record.expenses.length,
        totalExpenseCents: record.expenses.reduce((total, expense) => total + expense.amountCents, 0),
        balances,
        memberBalances: calculateMemberBalances(members, balances),
      };
    }),
  );
  const chosenGroupId =
    groups.find((group) => group.id === selectedGroupId)?.id ?? groups[0]?.id ?? null;
  const groupRecord = records.find((record) => record.id === chosenGroupId);
  const group = groupRecord
    ? {
        id: groupRecord.id,
        name: groupRecord.name,
        emoji: groupRecord.emoji,
        accentColor: groupRecord.accentColor,
        members: groups.find(({ id }) => id === groupRecord.id)?.members ?? [],
        expenses: await prisma.expense.findMany({
          where: { groupId: groupRecord.id },
          include: {
            payer: { select: { id: true, name: true } },
            shares: {
              include: { user: { select: { id: true, name: true, avatarColor: true } } },
              orderBy: { participantOrder: "asc" },
            },
          },
          orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        }).then((expenses) =>
          expenses.map((expense) => ({
            id: expense.id,
            description: expense.description,
            amountCents: expense.amountCents,
            date: expense.date.toISOString(),
            payer: expense.payer,
            participants: expense.shares.map((share) => ({
              id: share.user.id,
              name: share.user.name,
              avatarColor: share.user.avatarColor,
              amountCents: share.amountCents,
            })),
          })),
        ),
        balances: groups.find(({ id }) => id === groupRecord.id)?.balances ?? [],
        memberBalances: groups.find(({ id }) => id === groupRecord.id)?.memberBalances ?? [],
      }
    : null;

  return {
    groups,
    selectedGroupId: chosenGroupId,
    group,
    summary: {
      groupCount: groups.length,
      memberCount: groups.reduce((count, item) => count + item.memberCount, 0),
      expenseCount: groups.reduce((count, item) => count + item.expenseCount, 0),
      totalExpenseCents: groups.reduce((total, item) => total + item.totalExpenseCents, 0),
    },
  };
}
