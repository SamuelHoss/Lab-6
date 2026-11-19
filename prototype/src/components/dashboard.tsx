"use client";

import type { getDashboardData } from "@/lib/data";
import { useState } from "react";

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
type Section = "overview" | "groups";
type Group = NonNullable<DashboardData["group"]>;

const formatMoney = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(date),
  );
const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
const localDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

function Icon({
  name,
  size = 20,
}: {
  name: "home" | "users" | "receipt" | "plus" | "chevron" | "menu" | "close";
  size?: number;
}) {
  const paths: Record<typeof name, React.ReactNode> = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    receipt: <><path d="M4 3h16v18l-3-2-3 2-3-2-3 2-4-2z" /><path d="M8 8h8M8 12h8" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    chevron: <><path d="m9 18 6-6-6-6" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function Avatar({ name, color, size = "" }: { name: string; color: string; size?: string }) {
  return (
    <span className={`avatar ${size}`} style={{ backgroundColor: color }} title={name}>
      {initials(name)}
    </span>
  );
}

export function Dashboard({
  initialData,
  dateLabel,
}: {
  initialData: DashboardData;
  dateLabel: string;
}) {
  const [data, setData] = useState(initialData);
  const [section, setSection] = useState<Section>("overview");
  const [modal, setModal] = useState<"group" | "member" | "expense" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const group = data.group;

  async function loadDashboard(groupId = data.selectedGroupId) {
    const url = groupId ? `/api/dashboard?groupId=${encodeURIComponent(groupId)}` : "/api/dashboard";
    const response = await fetch(url, { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? "Could not load your groups.");
    setData(payload as DashboardData);
  }

  async function runAction(
    path: string,
    body: unknown,
    successMessage: string,
    nextGroupId?: string,
  ) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not complete that action.");
      const targetGroupId = nextGroupId ?? payload.groupId ?? data.selectedGroupId;
      await loadDashboard(targetGroupId);
      setModal(null);
      setNotice(successMessage);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function selectGroup(groupId: string) {
    setSection("groups");
    setMobileNavOpen(false);
    setBusy(true);
    setError("");
    try {
      await loadDashboard(groupId);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not open this group.");
    } finally {
      setBusy(false);
    }
  }

  function navigate(next: Section) {
    setSection(next);
    setMobileNavOpen(false);
    setError("");
    setNotice("");
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <a
          className="brand"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            navigate("overview");
          }}
        >
          <span className="brand-mark">S</span>
          <span>split<span className="brand-light">smart</span></span>
        </a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          <button
            className={`nav-item ${section === "overview" ? "nav-active" : ""}`}
            onClick={() => navigate("overview")}
          >
            <Icon name="home" size={19} /><span>Overview</span>
          </button>
          <button
            className={`nav-item ${section === "groups" ? "nav-active" : ""}`}
            onClick={() => navigate("groups")}
          >
            <Icon name="users" size={19} /><span>Groups</span>
          </button>
        </nav>
        <div className="sidebar-group-label">
          <span>YOUR GROUPS</span>
          <button aria-label="Create a group" onClick={() => setModal("group")}>+</button>
        </div>
        <div className="sidebar-groups">
          {data.groups.map((item) => (
            <button
              key={item.id}
              className={`group-nav ${item.id === data.selectedGroupId ? "group-nav-active" : ""}`}
              onClick={() => void selectGroup(item.id)}
            >
              <span className="group-emoji">{item.emoji}</span>
              <span>{item.name}</span>
              {item.expenseCount > 0 && <span className="group-dot" />}
            </button>
          ))}
          {data.groups.length === 0 && <p className="sidebar-empty">No groups yet</p>}
        </div>
        <div className="sidebar-bottom">
          <div className="prototype-note"><span className="note-dot" /> Local demo · no sign-in</div>
        </div>
      </aside>

      {mobileNavOpen && (
        <button
          className="mobile-backdrop"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation"
          >
            <Icon name="menu" />
          </button>
          <div className="breadcrumb">
            <span>SplitSmart</span><Icon name="chevron" size={15} />
            <strong>{section === "overview" ? "Overview" : "Groups"}</strong>
          </div>
          <div className="topbar-actions"><span className="demo-pill"><span /> Prototype</span></div>
        </header>

        <div className="page-content">
          {error && (
            <div className="flash flash-error" role="alert">
              {error}<button onClick={() => setError("")}><Icon name="close" size={16} /></button>
            </div>
          )}
          {notice && (
            <div className="flash flash-success" role="status">
              {notice}<button onClick={() => setNotice("")}><Icon name="close" size={16} /></button>
            </div>
          )}
          {busy && <div className="busy-line"><span /> Saving your changes…</div>}

          <section className="welcome-row">
            <div>
              <p className="eyebrow">{section === "overview" ? dateLabel : "YOUR SHARED SPACES"}</p>
              <h1>{section === "overview" ? "Shared costs, less awkward." : "Your groups"}</h1>
              <p className="welcome-copy">
                {section === "overview"
                  ? "Bring your people together and keep every split clear."
                  : "Create a group, add the people in it, and track shared expenses."}
              </p>
            </div>
            <div className="button-row">
              {group && group.members.length > 0 && (
                <button className="button button-secondary" onClick={() => setModal("expense")}>
                  <Icon name="receipt" size={17} /> Add expense
                </button>
              )}
              <button className="button button-primary" onClick={() => setModal("group")}>
                <Icon name="plus" size={18} /> Create a group
              </button>
            </div>
          </section>

          <section className="summary-grid" aria-label="SplitSmart totals">
            <div className="summary-card">
              <div className="summary-top"><span className="summary-icon green-icon"><Icon name="users" size={18} /></span><span className="card-overline">GROUPS</span></div>
              <strong className="summary-number">{data.summary.groupCount}</strong>
              <span className="summary-caption">shared spaces</span>
              <div className="summary-muted">Create a group for the next shared plan</div>
            </div>
            <div className="summary-card">
              <div className="summary-top"><span className="summary-icon peach-icon"><Icon name="users" size={18} /></span><span className="card-overline">MEMBERS</span></div>
              <strong className="summary-number">{data.summary.memberCount}</strong>
              <span className="summary-caption">across all groups</span>
              <div className="summary-muted">Everyone who shares the costs</div>
            </div>
            <div className="summary-card">
              <div className="summary-top"><span className="summary-icon lilac-icon"><Icon name="receipt" size={18} /></span><span className="card-overline">EXPENSES</span></div>
              <strong className="summary-number">{data.summary.expenseCount}</strong>
              <span className="summary-caption">recorded so far</span>
              <div className="summary-muted">Your shared spending history</div>
            </div>
            <div className="summary-card">
              <div className="summary-top"><span className="summary-icon yellow-icon"><Icon name="receipt" size={18} /></span><span className="card-overline">TOTAL SHARED</span></div>
              <strong className="summary-number">{formatMoney(data.summary.totalExpenseCents)}</strong>
              <span className="summary-caption">across all groups</span>
              <div className="summary-muted">All amounts stored in exact cents</div>
            </div>
          </section>

          {section === "overview" ? (
            <>
              {data.groups.length === 0 ? (
                <section className="panel first-group-card">
                  <span className="first-group-icon">✳</span>
                  <h2>Start with your first group</h2>
                  <p>Create a group for roommates, a trip, or anyone you share expenses with.</p>
                  <button className="button button-primary" onClick={() => setModal("group")}>
                    <Icon name="plus" size={17} /> Create your first group
                  </button>
                </section>
              ) : (
                <>
                  <div className="dashboard-columns">
                    <section className="panel balances-panel">
                      <div className="panel-heading">
                        <div><p className="eyebrow">CURRENT GROUP</p><h2>{group?.emoji} {group?.name ?? "Group balances"}</h2></div>
                        <button className="text-button" onClick={() => navigate("groups")}>Open group <Icon name="chevron" size={15} /></button>
                      </div>
                      {group ? (
                        <MemberBalances balances={group.memberBalances} />
                      ) : <EmptyState title="Select a group" copy="Choose one of your groups to see its balances." />}
                    </section>
                    <section className="panel activity-panel">
                      <div className="panel-heading">
                        <div><p className="eyebrow">LATEST SHARES</p><h2>Recent expenses</h2></div>
                        {group && <button className="text-button" onClick={() => navigate("groups")}>Expense history <Icon name="chevron" size={15} /></button>}
                      </div>
                      {group ? <RecentExpenses expenses={group.expenses.slice(0, 5)} /> : null}
                    </section>
                  </div>
                  <section className="panel people-panel">
                    <div className="panel-heading">
                      <div><p className="eyebrow">YOUR PEOPLE</p><h2>Groups you share with</h2></div>
                      <button className="text-button" onClick={() => navigate("groups")}>Browse all <Icon name="chevron" size={15} /></button>
                    </div>
                    <div className="people-groups">
                      {data.groups.map((item) => (
                        <button className="people-group" key={item.id} onClick={() => void selectGroup(item.id)}>
                          <span className="people-group-top">
                            <span className="group-emblem" style={{ backgroundColor: `${item.accentColor}20` }}>{item.emoji}</span>
                            <Icon name="chevron" size={17} />
                          </span>
                          <strong>{item.name}</strong>
                          <span className="people-avatars">
                            {item.members.slice(0, 4).map((member) => (
                              <Avatar key={member.id} name={member.name} color={member.avatarColor} size="avatar-small" />
                            ))}
                            <small>{item.memberCount} members · {item.expenseCount} expenses</small>
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </>
          ) : group ? (
            <>
              <div className="group-switcher">
                {data.groups.map((item) => (
                  <button
                    key={item.id}
                    className={item.id === group.id ? "switcher-active" : ""}
                    onClick={() => void selectGroup(item.id)}
                  >
                    {item.emoji} {item.name}
                  </button>
                ))}
              </div>
              <section className="group-detail-grid">
                <section className="panel member-panel">
                  <div className="panel-heading">
                    <div><p className="eyebrow">THE CREW</p><h2>Members <span className="heading-count">{group.members.length}</span></h2></div>
                    <button className="text-button" onClick={() => setModal("member")}><Icon name="plus" size={15} /> Add member</button>
                  </div>
                  <MemberList members={group.members} />
                </section>
                <section className="panel member-panel">
                  <div className="panel-heading">
                    <div><p className="eyebrow">EVERYONE SQUARE</p><h2>Balances</h2></div>
                    <span className="small-muted">Net amount per member</span>
                  </div>
                  <MemberBalances balances={group.memberBalances} />
                </section>
              </section>
              <section className="panel expense-table-panel">
                <div className="panel-heading">
                  <div><p className="eyebrow">GROUP LEDGER</p><h2>Expense history</h2></div>
                  <button
                    className="button button-primary"
                    disabled={group.members.length === 0}
                    onClick={() => setModal("expense")}
                  >
                    <Icon name="plus" size={16} /> Add expense
                  </button>
                </div>
                <ExpenseTable expenses={group.expenses} />
              </section>
            </>
          ) : (
            <section className="panel first-group-card">
              <span className="first-group-icon">✳</span>
              <h2>No group selected</h2>
              <p>Create a group, then add members to start sharing expenses.</p>
              <button className="button button-primary" onClick={() => setModal("group")}>
                <Icon name="plus" size={17} /> Create a group
              </button>
            </section>
          )}
        </div>
      </main>

      {modal === "group" && (
        <CreateGroupModal
          busy={busy}
          error={error}
          onClose={() => { setModal(null); setError(""); }}
          onSubmit={(body) => void runAction("/api/groups", body, "Your group is ready.")}
        />
      )}
      {modal === "member" && group && (
        <AddMemberModal
          group={group}
          busy={busy}
          error={error}
          onClose={() => { setModal(null); setError(""); }}
          onSubmit={(body) => void runAction(`/api/groups/${encodeURIComponent(group.id)}/members`, body, "Member added to the group.")}
        />
      )}
      {modal === "expense" && group && (
        <ExpenseModal
          group={group}
          busy={busy}
          error={error}
          onClose={() => { setModal(null); setError(""); }}
          onSubmit={(body) => void runAction("/api/expenses", body, "Expense recorded and balances updated.")}
        />
      )}
    </div>
  );
}

function MemberList({ members }: { members: Group["members"] }) {
  if (members.length === 0) {
    return <EmptyState title="Add your first member" copy="Everyone who shares an expense should be in this group." />;
  }
  return (
    <div className="compact-members">
      {members.map((member) => (
        <div key={member.id}>
          <Avatar name={member.name} color={member.avatarColor} size="avatar-small" />
          <span>{member.name}</span>
        </div>
      ))}
    </div>
  );
}

function MemberBalances({ balances }: { balances: Group["memberBalances"] }) {
  if (balances.length === 0) {
    return <EmptyState title="No balances yet" copy="Record a group expense to see how the costs split." />;
  }
  const sum = balances.reduce((total, balance) => total + balance.balanceCents, 0);
  return (
    <div className="member-balance-list">
      {balances.map((balance) => (
        <div className="member-balance-row" key={balance.userId}>
          <span className="member-balance-name">
            <Avatar name={balance.name} color="#57816a" size="avatar-small" />
            <strong>{balance.name}</strong>
          </span>
          <span className={`member-balance-amount ${balance.balanceCents > 0 ? "amount-positive" : balance.balanceCents < 0 ? "amount-negative" : ""}`}>
            {balance.balanceCents > 0 ? "+" : balance.balanceCents < 0 ? "−" : ""}
            {formatMoney(Math.abs(balance.balanceCents))}
          </span>
        </div>
      ))}
      <div className="balance-zero-check">
        <span>Group balances add up to</span>
        <strong className={sum === 0 ? "zero-valid" : "zero-invalid"}>{formatMoney(sum)}</strong>
      </div>
    </div>
  );
}

function RecentExpenses({ expenses }: { expenses: Group["expenses"] }) {
  if (expenses.length === 0) {
    return <EmptyState title="No expenses yet" copy="Record the first shared cost for this group." />;
  }
  return (
    <div className="activity-list">
      {expenses.map((expense) => (
        <div className="activity-row" key={expense.id}>
          <span className="activity-icon"><Icon name="receipt" size={17} /></span>
          <span className="activity-copy">
            <strong>{expense.description}</strong>
            <small>Paid by {expense.payer.name} · {formatDate(expense.date)}</small>
          </span>
          <span className="activity-amount">{formatMoney(expense.amountCents)}</span>
        </div>
      ))}
    </div>
  );
}

function ExpenseTable({ expenses }: { expenses: Group["expenses"] }) {
  if (expenses.length === 0) {
    return <EmptyState title="No expenses yet" copy="Add a description, amount, payer, and participants to get started." />;
  }
  return (
    <div className="table-scroll">
      <table className="expense-table">
        <thead><tr><th>Expense</th><th>Paid by</th><th>Participants</th><th>Date</th><th className="align-right">Amount</th></tr></thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td><span className="expense-name"><span className="table-receipt"><Icon name="receipt" size={16} /></span><strong>{expense.description}</strong></span></td>
              <td>{expense.payer.name}</td>
              <td>{expense.participants.map((member) => member.name).join(", ")}</td>
              <td>{formatDate(expense.date)}</td>
              <td className="align-right"><strong>{formatMoney(expense.amountCents)}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon name="receipt" size={20} /></span>
      <strong>{title}</strong><p>{copy}</p>
    </div>
  );
}

function ModalFrame({
  title,
  eyebrow,
  error,
  onClose,
  children,
}: {
  title: string;
  eyebrow: string;
  error: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading">
          <div><p className="eyebrow">{eyebrow}</p><h2 id="modal-title">{title}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        </div>
        {children}
        {error && <p className="form-error" role="alert">{error}</p>}
      </section>
    </div>
  );
}

function CreateGroupModal({
  busy,
  error,
  onClose,
  onSubmit,
}: {
  busy: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (body: unknown) => void;
}) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🏡");
  return (
    <ModalFrame title="Create a group" eyebrow="A NEW SHARED SPACE" error={error} onClose={onClose}>
      <form onSubmit={(event) => { event.preventDefault(); onSubmit({ name, emoji }); }}>
        <label className="form-field">Group name
          <input autoFocus required maxLength={50} placeholder="e.g. Apartment 4B" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="form-field">Group icon
          <select value={emoji} onChange={(event) => setEmoji(event.target.value)}>
            <option value="🏡">🏡 Home</option><option value="✈️">✈️ Trip</option>
            <option value="🎉">🎉 Event</option><option value="🍽️">🍽️ Dinner</option>
          </select>
        </label>
        <p className="modal-description">You can add members as soon as the group is created.</p>
        <div className="modal-actions">
          <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
          <button className="button button-primary" disabled={busy}>{busy ? "Creating…" : "Create group"}</button>
        </div>
      </form>
    </ModalFrame>
  );
}

function AddMemberModal({
  group,
  busy,
  error,
  onClose,
  onSubmit,
}: {
  group: Group;
  busy: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (body: unknown) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  return (
    <ModalFrame title="Add a member" eyebrow={`JOIN ${group.name.toUpperCase()}`} error={error} onClose={onClose}>
      <form onSubmit={(event) => { event.preventDefault(); onSubmit({ name, email }); }}>
        <label className="form-field">Name
          <input autoFocus required maxLength={80} placeholder="e.g. Alex Morgan" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="form-field">Email <span className="optional-label">optional</span>
          <input type="email" placeholder="alex@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <p className="modal-description">Email is just a contact label in this local prototype; there are no accounts or sign-ins.</p>
        <div className="modal-actions">
          <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
          <button className="button button-primary" disabled={busy}>{busy ? "Adding…" : "Add member"}</button>
        </div>
      </form>
    </ModalFrame>
  );
}

function ExpenseModal({
  group,
  busy,
  error,
  onClose,
  onSubmit,
}: {
  group: Group;
  busy: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (body: unknown) => void;
}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(localDate);
  const [payerId, setPayerId] = useState(group.members[0]?.id ?? "");
  const [participantIds, setParticipantIds] = useState(group.members.map((member) => member.id));

  function toggleParticipant(memberId: string, checked: boolean) {
    setParticipantIds((current) =>
      checked ? [...current, memberId] : current.filter((id) => id !== memberId),
    );
  }

  return (
    <ModalFrame title="Record an expense" eyebrow={group.name.toUpperCase()} error={error} onClose={onClose}>
      <form onSubmit={(event) => {
        event.preventDefault();
        const orderedParticipantIds = group.members
          .map((member) => member.id)
          .filter((memberId) => participantIds.includes(memberId));
        onSubmit({ groupId: group.id, description, amount, date, payerId, participantIds: orderedParticipantIds });
      }}>
        <label className="form-field">What was it for?
          <input autoFocus required maxLength={100} placeholder="e.g. Groceries" value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <div className="form-row">
          <label className="form-field">Amount
            <input required type="number" inputMode="decimal" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={(event) => setAmount(event.target.value)} />
          </label>
          <label className="form-field">Date
            <input required type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
        </div>
        <label className="form-field">Who paid?
          <select required value={payerId} onChange={(event) => setPayerId(event.target.value)}>
            {group.members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
        </label>
        <div className="form-field">
          <span className="field-label">Split equally between</span>
          <div className="participant-options">
            {group.members.map((member) => (
              <label key={member.id} className="participant-option">
                <input type="checkbox" checked={participantIds.includes(member.id)} onChange={(event) => toggleParticipant(member.id, event.target.checked)} />
                <Avatar name={member.name} color={member.avatarColor} size="avatar-tiny" />
                <span>{member.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="prototype-helper"><Icon name="users" size={15} /><span>Any cents left over are given to participants in the order shown.</span></div>
        <div className="modal-actions">
          <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
          <button className="button button-primary" disabled={busy || group.members.length === 0}>
            {busy ? "Saving…" : "Record expense"}
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
