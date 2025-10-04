import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req){
    try{
        const { userId } = getAuth(req);
        const {productId } = await req.json();

        if(!productId){
            return NextResponse.json({message: "Product ID is required"}, { status: 400 });
        }

        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({message: "Unauthorized"}, { status: 401 });
        }


        const product = await prisma.product.findFirst({
            where: {id: productId, storeId}
        })

        if(!product){
            return NextResponse.json({message: "Product not found"}, { status: 404 });
        }

        await prisma.product.update({
            where: {id: productId},
            data: {inStock: !product.inStock}
        })

        return NextResponse.json({message: "Product stock updated", inStock: !product.inStock}, { status: 200 });

    }catch(e){
        console.error("[STORE_STOCK]", e);
        return NextResponse.json({message: "Internal error"}, { status: 500 });
    }
}