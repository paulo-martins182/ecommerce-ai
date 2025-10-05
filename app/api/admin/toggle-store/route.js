import prisma from "@/lib/prisma"
import authAdmin from "@/middlewares/authAdmin"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req){
    try{
        const {userId} = getAuth(req)
        const isAdmin = authAdmin(userId)

        if(!isAdmin){
            return NextResponse.json({message: 'Not authorized'}, {status: 401})
        }

        const {storeId} = await req.json()

        if(!storeId){
            return NextResponse.json({message: "missing storeId"}, {status: 400})
        }

        const store = await prisma.store.findUnique({where: {id: storeId}})

        if(!store){
            return NextResponse.json({message: "store not found"}, {status: 400})
        }

        await prisma.store.update({
            where: {id: storeId},
            data: {
                isActive: !store.isActive
            }
        })

        return NextResponse.json({message: "Store updated successfully"})

    }catch(e){
        console.error('[GET_ALL_STORES_APPROVED]', e)
        return NextResponse.json({message: e.code || e.message }, {status: 500})
    }
}