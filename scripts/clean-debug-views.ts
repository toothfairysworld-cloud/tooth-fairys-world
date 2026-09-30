import { db } from "../src/lib/db";
await db.pageView.deleteMany({ where: { path: "/debug" } });
console.log("cleaned");
