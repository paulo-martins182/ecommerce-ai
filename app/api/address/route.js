import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { address } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    if (!address?.zip) {
      return NextResponse.json(
        { message: "Missing Zip Code" },
        { status: 400 }
      );
    }

    const existingAddress = await prisma.address.findFirst({
      where: {
        userId,
        zip: address.zip,
      },
    });

    if (existingAddress) {
      return NextResponse.json(
        { message: "This zip code alredy existing" },
        { status: 400 }
      );
    }

    const newAddress = await prisma.address.create({
      data: {
        ...address,
        userId,
      },
    });

    return NextResponse.json({
      newAddress,
      message: "Address added successfully",
    });
  } catch (e) {
    console.error("[CREATE_ADDRESS]", e);
    return NextResponse.json(
      { message: e.message || "Internal Error" },
      { status: 400 }
    );
  }
}

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    const address = await prisma.address.findMany({
      where: { userId },
    });

    return NextResponse.json({ address });
  } catch (e) {
    console.log("[GET_ADDRESS]", e);
    return NextResponse.json({ message: e.code || e.message }, { status: 400 });
  }
}
