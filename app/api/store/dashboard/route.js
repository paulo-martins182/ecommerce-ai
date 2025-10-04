import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req){
    try{
        const { userId } = getAuth(req);
        const storeId = await authSeller(userId)

        const orders = await prisma.order.findMany({
            where: {storeId},
        })

        const products = await prisma.product.findMany({
            where: {storeId},
        })

        const rating = await prisma.rating.findMany({
            where: {productId: {in: products.map(p => p.id)}},
            include: {user: true, product: true}
        })

        const dashboardData = {
            rating,
            totalOrders: orders.length,
            totalEarnings: Math.round(orders.reduce((acc, order) => acc + order.total, 0)),
            totalProducts: products.length,
        }

        return NextResponse.json({data: dashboardData}, { status: 200 });

    }catch(e){
        console.error("[DASHBOARD_GET]", e);
        return NextResponse.json({message: "Internal error"}, { status: 500 });
    }
}