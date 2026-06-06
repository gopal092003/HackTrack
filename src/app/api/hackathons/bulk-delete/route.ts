import { NextRequest, NextResponse } from "next/server";
import { bulkDeleteHackathons } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids) || ids.length === 0) return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    const { error } = await bulkDeleteHackathons(ids);
    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
