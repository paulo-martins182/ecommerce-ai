import prisma from "@/lib/prisma";

import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId, has } = getAuth(req);
    const { code } = await req.json();

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase(), expiresAt: { gt: new Date() } },
    });

    if (!coupon) {
      return NextResponse.json(
        { message: "Coupon not found" },
        { status: 404 }
      );
    }

    if (coupon.forNewUser) {
      const useOrders = await prisma.order.findMany({
        where: { userId },
      });
      if (useOrders.length > 0) {
        return NextResponse.json(
          { message: "Coupon valid for new users" },
          { status: 400 }
        );
      }
    }

    if (coupon.forMember) {
      const hasPlusPlan = has({ plan: "plus" });
      if (!hasPlusPlan) {
        return NextResponse.json(
          { message: "Coupon valid for members only" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ coupon });
  } catch (e) {
    console.log("[VALIDATE_COUPON]", e);
    return NextResponse.json({ message: e.code || e.message }, { status: 400 });
  }
}
