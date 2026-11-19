import { ValidationError } from "./errors";

export type ExpenseLedgerEntry = {
  payerId: string;
  amountCents: number;
  shares: { userId: string; amountCents: number }[];
};

export type Balance = {
  fromId: string;
  toId: string;
  amountCents: number;
};

export type MemberBalance = {
  userId: string;
  name: string;
  balanceCents: number;
};

export function parseAmountCents(value: unknown): number {
  if (typeof value !== "string" || !/^\d+(?:\.\d{1,2})?$/.test(value.trim())) {
    throw new ValidationError("Enter a positive amount with up to two decimal places.");
  }

  const [whole, fraction = ""] = value.trim().split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(cents) || cents <= 0) {
    throw new ValidationError("Amount must be greater than $0.00.");
  }
  return cents;
}

export function allocateEqualShares(amountCents: number, participantCount: number): number[] {
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
    throw new ValidationError("Amount must be a positive number of cents.");
  }
  if (!Number.isInteger(participantCount) || participantCount < 1) {
    throw new ValidationError("Select at least one participant.");
  }

  const baseShare = Math.floor(amountCents / participantCount);
  const remainingCents = amountCents % participantCount;
  return Array.from(
    { length: participantCount },
    (_, index) => baseShare + (index < remainingCents ? 1 : 0),
  );
}

export function calculateBalances(expenses: ExpenseLedgerEntry[]): Balance[] {
  const obligations = new Map<string, number>();
  const add = (fromId: string, toId: string, cents: number) => {
    const key = `${fromId}\u0000${toId}`;
    obligations.set(key, (obligations.get(key) ?? 0) + cents);
  };

  for (const expense of expenses) {
    const shareTotal = expense.shares.reduce((total, share) => total + share.amountCents, 0);
    if (shareTotal !== expense.amountCents) {
      throw new ValidationError("Expense shares must add up to the expense total.");
    }
    for (const share of expense.shares) {
      if (!Number.isSafeInteger(share.amountCents) || share.amountCents < 0) {
        throw new ValidationError("Expense shares must be non-negative cents.");
      }
      if (share.userId !== expense.payerId) {
        add(share.userId, expense.payerId, share.amountCents);
      }
    }
  }

  const pairs = new Set<string>();
  for (const key of obligations.keys()) {
    const [first, second] = key.split("\u0000");
    pairs.add(first < second ? `${first}\u0000${second}` : `${second}\u0000${first}`);
  }

  const balances: Balance[] = [];
  for (const pair of pairs) {
    const [first, second] = pair.split("\u0000");
    const net =
      (obligations.get(`${first}\u0000${second}`) ?? 0) -
      (obligations.get(`${second}\u0000${first}`) ?? 0);
    if (net > 0) balances.push({ fromId: first, toId: second, amountCents: net });
    if (net < 0) balances.push({ fromId: second, toId: first, amountCents: -net });
  }
  return balances;
}

export function calculateMemberBalances(
  members: { id: string; name: string }[],
  balances: Balance[],
): MemberBalance[] {
  const amounts = new Map(members.map((member) => [member.id, 0]));
  for (const balance of balances) {
    const from = amounts.get(balance.fromId);
    const to = amounts.get(balance.toId);
    if (from === undefined || to === undefined) {
      throw new ValidationError("An expense contains a person who is not in this group.");
    }
    amounts.set(balance.fromId, from - balance.amountCents);
    amounts.set(balance.toId, to + balance.amountCents);
  }
  return members.map((member) => ({
    userId: member.id,
    name: member.name,
    balanceCents: amounts.get(member.id) ?? 0,
  }));
}
