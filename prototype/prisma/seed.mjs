import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  { id: "user_alex", name: "Alex Morgan", email: "alex@demo.local", avatarColor: "#315c4d" },
  { id: "user_jamie", name: "Jamie Lee", email: "jamie@demo.local", avatarColor: "#d68d67" },
  { id: "user_taylor", name: "Taylor Kim", email: "taylor@demo.local", avatarColor: "#6d84bc" },
  { id: "user_morgan", name: "Morgan Chen", email: "morgan@demo.local", avatarColor: "#9b79a7" },
];

const groups = [
  {
    id: "group_apt",
    name: "The Greenhouse",
    emoji: "🏡",
    accentColor: "#e99b72",
    members: ["user_alex", "user_jamie", "user_taylor"],
  },
  {
    id: "group_trip",
    name: "Coast weekend",
    emoji: "🌊",
    accentColor: "#7f9ec4",
    members: ["user_alex", "user_jamie", "user_taylor", "user_morgan"],
  },
];

async function seed() {
  for (const user of users) {
    await prisma.user.upsert({ where: { id: user.id }, create: user, update: user });
  }
  for (const group of groups) {
    const { members, ...data } = group;
    await prisma.group.upsert({ where: { id: group.id }, create: data, update: data });
    for (const [index, userId] of members.entries()) {
      await prisma.membership.upsert({
        where: { groupId_userId: { groupId: group.id, userId } },
        create: {
          groupId: group.id,
          userId,
          role: index === 0 ? "MANAGER" : "MEMBER",
        },
        update: { active: true },
      });
    }
  }

  const expenses = [
    {
      id: "expense_rent",
      groupId: "group_apt",
      creatorId: "user_jamie",
      payerId: "user_alex",
      description: "Monthly rent",
      amountCents: 18650,
      date: new Date("2026-11-17T12:00:00.000Z"),
      splitType: "EQUAL",
      status: "APPROVED",
      shares: [
        ["user_alex", 6217],
        ["user_jamie", 6217],
        ["user_taylor", 6216],
      ],
      approverId: "user_taylor",
    },
    {
      id: "expense_groceries",
      groupId: "group_apt",
      creatorId: "user_alex",
      payerId: "user_jamie",
      description: "Saturday groceries",
      amountCents: 8236,
      date: new Date("2026-11-15T12:00:00.000Z"),
      splitType: "EQUAL",
      status: "APPROVED",
      shares: [
        ["user_alex", 4118],
        ["user_jamie", 4118],
      ],
      approverId: "user_taylor",
    },
    {
      id: "expense_cleaning",
      groupId: "group_apt",
      creatorId: "user_jamie",
      payerId: "user_jamie",
      description: "Shared cleaning supplies",
      amountCents: 4860,
      date: new Date("2026-11-19T12:00:00.000Z"),
      splitType: "EQUAL",
      status: "PENDING",
      shares: [
        ["user_alex", 2430],
        ["user_jamie", 2430],
      ],
    },
    {
      id: "expense_cabin",
      groupId: "group_trip",
      creatorId: "user_morgan",
      payerId: "user_morgan",
      description: "Cabin booking",
      amountCents: 24000,
      date: new Date("2026-11-12T12:00:00.000Z"),
      splitType: "EQUAL",
      status: "APPROVED",
      shares: [
        ["user_alex", 6000],
        ["user_jamie", 6000],
        ["user_taylor", 6000],
        ["user_morgan", 6000],
      ],
      approverId: "user_taylor",
    },
  ];

  for (const expense of expenses) {
    const { shares, approverId, ...data } = expense;
    await prisma.expense.upsert({
      where: { id: expense.id },
      create: {
        ...data,
        shares: {
          create: shares.map(([userId, amountCents], participantOrder) => ({
            userId,
            amountCents,
            participantOrder,
          })),
        },
        ...(approverId
          ? {
              approvals: {
                create: { approverId, decision: "APPROVED" },
              },
            }
          : {}),
      },
      update: {},
    });
  }

  const payments = [
    {
      id: "payment_apt",
      groupId: "group_apt",
      senderId: "user_jamie",
      recipientId: "user_alex",
      recorderId: "user_alex",
      amountCents: 1000,
      date: new Date("2026-11-18T12:00:00.000Z"),
      note: "November settle-up",
    },
    {
      id: "payment_trip",
      groupId: "group_trip",
      senderId: "user_alex",
      recipientId: "user_morgan",
      recorderId: "user_alex",
      amountCents: 3500,
      date: new Date("2026-11-16T12:00:00.000Z"),
      note: "Cabin deposit",
    },
  ];
  for (const payment of payments) {
    await prisma.payment.upsert({
      where: { id: payment.id },
      create: payment,
      update: {},
    });
  }

  for (const [index, recipientId] of ["user_alex", "user_taylor"].entries()) {
    await prisma.notification.upsert({
      where: { id: `notification_cleaning_${index}` },
      create: {
        id: `notification_cleaning_${index}`,
        groupId: "group_apt",
        expenseId: "expense_cleaning",
        recipientId,
      },
      update: {},
    });
  }
  console.log("SplitSmart demo data is ready.");
}

seed()
  .catch((error) => {
    console.error("Could not seed SplitSmart demo data:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
