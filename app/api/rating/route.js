import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { orderId, productId, rating, review } = await req.json();
    const order = await prisma.order.findUnique({
      where: { id: orderId, userId },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const isAlreadyRated = await prisma.rating.findFirst({
      where: { productId, orderId },
    });

    if (isAlreadyRated) {
      return NextResponse.json(
        { message: "Product already rated" },
        { status: 400 }
      );
    }

    const response = await prisma.rating.create({
      data: {
        userId,
        productId,
        rating,
        review,
        orderId,
      },
    });

    return NextResponse.json(
      { message: "Rating added successfully", rating: response },
      { status: 200 }
    );
  } catch (e) {
    console.log("[CREATE_RATING]", e);
    return NextResponse.json({ message: e.code || e.message }, { status: 400 });
  }
}

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const ratings = await prisma.rating.findMany({
      where: { userId },
    });

    return NextResponse.json({ ratings }, { status: 200 });
  } catch (e) {
    console.log("[GET_RATINGS]", e);
    return NextResponse.json({ message: e.code || e.message }, { status: 400 });
  }
}
