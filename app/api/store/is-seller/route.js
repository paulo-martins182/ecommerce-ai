import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const storeInfo = await prisma.store.findUnique({
      where: { userId },
    });

    return NextResponse.json({ isSeller, storeInfo }, { status: 200 });
  } catch (e) {
    console.error("[STORE_IS_SELLER]", e);
    return NextResponse.json({ message: e.code || e.message }, { status: 400 });
  }
}
