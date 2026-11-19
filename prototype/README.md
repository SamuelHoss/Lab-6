# SplitSmart prototype

A responsive Next.js demo for creating expense groups, adding members, recording
equal-split expenses, viewing expense history, and calculating zero-sum member
balances. SQLite stores amounts as integer cents; Prisma is used only in server
components, route handlers, and the seed script.

## Run locally

From this directory, provide a SQLite URL in `DATABASE_URL` (or in an ignored
`.env` file). If you don’t already have a `.env`, you can start with
`.env.example`:

```env
DATABASE_URL="file:./dev.db"
```

Then initialize and seed the local database:

```bash
cp -n .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `db:seed` is safe to run
again: it upserts the named demo records and does not clear the database. Keep
your existing `DATABASE_URL`; migration and seed commands do not reset or
delete the database. The normal Prisma migration workflow is available through
`npm run db:migrate`.

This prototype has no authentication or payment processing. A member’s email is
an optional contact label only. Every saved expense is applied to balances
immediately. Equal-split remainder cents go to participants in the displayed
order. Invalid amounts, duplicate members, and participants outside the group
are rejected with an explanation.

Run the available quality checks with:

```bash
npm run lint
npm test
npm run build
```
