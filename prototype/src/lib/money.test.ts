import { describe, expect, it } from "vitest";
import {
  allocateEqualShares,
  calculateBalances,
  calculateMemberBalances,
  parseAmountCents,
} from "./money";

const members = [
  { id: "alice", name: "Alice" },
  { id: "bob", name: "Bob" },
  { id: "charlie", name: "Charlie" },
];

describe("expense balances", () => {
  it("parses valid amounts into integer cents and rejects invalid amounts", () => {
    expect(parseAmountCents("60")).toBe(6000);
    expect(parseAmountCents("12.4")).toBe(1240);
    expect(() => parseAmountCents("0")).toThrow();
    expect(() => parseAmountCents("-1.00")).toThrow();
    expect(() => parseAmountCents("1.999")).toThrow();
  });

  it("splits a $60 expense into the expected balances", () => {
    const shares = allocateEqualShares(6000, members.length);
    const balances = calculateBalances([
      {
        payerId: "alice",
        amountCents: 6000,
        shares: members.map((member, index) => ({
          userId: member.id,
          amountCents: shares[index],
        })),
      },
    ]);
    expect(calculateMemberBalances(members, balances)).toEqual([
      { userId: "alice", name: "Alice", balanceCents: 4000 },
      { userId: "bob", name: "Bob", balanceCents: -2000 },
      { userId: "charlie", name: "Charlie", balanceCents: -2000 },
    ]);
  });

  it("allocates a $10 remainder deterministically and keeps multiple expense balances at zero-sum", () => {
    const firstShares = allocateEqualShares(1000, members.length);
    expect(firstShares).toEqual([334, 333, 333]);
    const secondShares = allocateEqualShares(3000, members.length);
    const balances = calculateBalances([
      {
        payerId: "alice",
        amountCents: 1000,
        shares: members.map((member, index) => ({
          userId: member.id,
          amountCents: firstShares[index],
        })),
      },
      {
        payerId: "bob",
        amountCents: 3000,
        shares: members.map((member, index) => ({
          userId: member.id,
          amountCents: secondShares[index],
        })),
      },
    ]);
    const memberBalances = calculateMemberBalances(members, balances);
    expect(memberBalances.map(({ balanceCents }) => balanceCents)).toEqual([-334, 1667, -1333]);
    expect(memberBalances.reduce((total, member) => total + member.balanceCents, 0)).toBe(0);
  });
});
