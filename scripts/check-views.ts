import { db } from "../src/lib/db";
const rows = await db.pageView.findMany({ orderBy: [{ path: "asc" }, { locale: "asc" }] });
console.log(JSON.stringify(rows.map(r => ({ day: r.day, path: r.path, locale: r.locale, views: r.views })), null, 1));
