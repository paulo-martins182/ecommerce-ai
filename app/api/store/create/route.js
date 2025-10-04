import imagekit from "@/configs/imageKit";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function POST(req){
    try{
        const { userId } = getAuth(req);
        if(!userId){
            return NextResponse({error: "Unauthorized"}, { status: 401 });
        }
        const formData = await req.formData();


        const name = formData.get("name");
        const username = formData.get("username");
        const description = formData.get("description");
        const email = formData.get("email");
        const contact = formData.get("contact");
        const address = formData.get("address");
        const image = formData.get("image");

        if(!name || !username || !description || !email || !contact || !address || !image){
            return NextResponse.json({message: "All fields are required"}, { status: 400 });
        }

        const store = await prisma.store.findFirst({
            where: {userId: userId}
        })


        if(store){
            return NextResponse.json({status: store.status});
        }

        const isUserNameTaken = await prisma.store.findFirst({
            where: {username: username.toLowerCase()}
        })

        if(isUserNameTaken){
            return NextResponse.json({message: "Username is already taken"}, { status: 400 });
        }


        const buffer = Buffer.from(await image.arrayBuffer());
        const response = await imagekit.upload({
            file: buffer,
            fileName: image.name,
            folder: "logos"
        })

        const optimizedImage = imagekit.url({
            path: response.filePath,
            transformation: [
                {quality: "auto"},
                {format:  "webp"},
                {width: '512'}
            ]
        })


        const newStore = await prisma.store.create({
            data: {
                userId,
                name,
                username: username.toLowerCase(),
                description,
                email,
                contact,
                address,
                logo: optimizedImage
            }
        })


        await prisma.user.update({
            where:  {id: userId},
            data: {store: {connect: {id: newStore.id}}}
        })

        return NextResponse.json({data: newStore, message: "aplied waiting for approval"}, { status: 201 });
    }
    catch(e){
        console.error("[STORE_CREATE_POST]", e);
       return NextResponse.json({message: "Internal error"}, { status: 500 });
    }
}



export async function GET(req){
    try{
        const { userId } = getAuth(req);

          const store = await prisma.store.findFirst({
            where: {userId: userId}
        })


        if(store){
            return NextResponse.json({status: store.status});
        }


        return NextResponse.json({status: "no-store"});

    }catch(e){
        console.error("[STORE_GET]", e);
        return NextResponse.json({message: "Internal error"}, { status: 500 });
    }
}