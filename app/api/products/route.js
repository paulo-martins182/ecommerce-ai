import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true },
      include: {
        rating: {
          select: {
            createdAt: true,
            rating: true,
            review: true,
            user: {
              select: { name: true, image: true },
            },
          },
        },
        store: true,
      },

      orderBy: { createdAt: "desc" },
    });

    const onlyActiveProducts = products.filter(
      (product) => product.store.isActive
    );

    return NextResponse.json({ products: onlyActiveProducts });
  } catch (e) {
    console.log("[LIST_PRODUCTS]", e);
    return NextResponse.json({ message: e.code || e.message }, { status: 400 });
  }
}
