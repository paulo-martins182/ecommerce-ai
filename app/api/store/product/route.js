import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";


export async function POST(req){
    try{
        const { userId } = getAuth(req);
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({message: "Unauthorized"}, { status: 401 });
        }

        const formData = await req.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const mrp = Number(formData.get("mrp"));
        const price = Number(formData.get("price"));
        const category = formData.get("category");
        const images = formData.getAll("images");

        if(!name || !description || !mrp || !price || !category || images.length === 0){
            return NextResponse.json({message: "Missing product details"}, { status: 400 });
        }

        const imagesUrl = await Promise.all(images.map(async (image) => {
            const buffer = Buffer.from(await image.arrayBuffer());
            const response = await ImageKit.upload({
                file: buffer,
                fileName: image.name,
                folder: "products"
            })

            const url = ImageKit.url({
                path: response.filePath,
                transformation: [
                    {quality: "auto"},
                    {format:  "webp"},
                    {width: '1024'}
                
                ]
            })

            return url
        }))

        await prisma.product.create({
            data: {
                name,
                description,
                mrp,
                price,
                category,
                images: imagesUrl,
                storeId
            }
        })


        return NextResponse.json({message: "Product added successfully"}, { status: 201 });

    }catch(e){
        console.error("[CREATE_PRODUCT_POST]", e);
        return NextResponse.json({message: "Internal error"}, { status: 500 });
    }
}


export async function GET(req){
    try{
        const { userId } = getAuth(req);
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({message: "Unauthorized"}, { status: 401 });
        }

        const products = await prisma.product.findMany({
            where: {storeId},
            orderBy: {createdAt: "desc"}
        })

        return NextResponse.json({data: products}, { status: 200 });

    }catch(e){
        console.error("[PRODUCT_GET]", e);
        return NextResponse.json({message: "Internal error"}, { status: 500 });
    }
}