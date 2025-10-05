import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { cart } = await req.json();

    await prisma.user.update({
      where: { id: userId },
      data: {
        cart: cart,
      },
    });

    return NextResponse.json({ message: "Cart updated" });
  } catch (e) {
    console.log("[UPDATE_CART]", e);
    return NextResponse.json({ message: e.code || e.message }, { status: 400 });
  }
}

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return NextResponse.json({ cart: user.cart });
  } catch (e) {
    console.log("[GET_CART]", e);
    return NextResponse.json({ message: e.code || e.message }, { status: 400 });
  }
}
