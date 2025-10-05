import prisma from "@/lib/prisma"
import authAdmin from "@/middlewares/authAdmin"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req){
    try{

        const {userId} = getAuth(req)
        const isAdmin = await authAdmin(userId)

        if(!isAdmin){
            return NextResponse.json({message: 'Not authorized'}, {status: 401})
        }

        const {storeId, status} = await req.json()

        if(!storeId){
            return NextResponse.json({message: "missing storeId"}, {status: 400})
        }

        if(status === 'approved'){
            await prisma.store.update({
                where: {id: storeId},
                data: {status: "approved", isActive: true}
            })
        }else if(status === 'rejected'){
             await prisma.store.update({
                where: {id: storeId},
                data: {status: "rejected"}
            })
        }

        return NextResponse.json({message: `${status} successfully`})

    }catch(e){
        console.error('[APPROVE_STORE_POST]', e)
        return NextResponse.json({message: e.code || e.message }, {status: 500})
    }
}


export async function GET(req){
    try{
        const {userId} = getAuth(req)
        const isAdmin = authAdmin(userId)

        if(!isAdmin){
            return NextResponse.json({message: 'Not authorized'}, {status: 401})
        }

        const stores = await prisma.store.findMany({
            where: {status: {in: ["pending", "rejected"]}},
            include: {
                user: true
            }
        })

        return NextResponse.json({stores})

    }catch(e){
        console.error('[GET_ALL_STORES_PENDING]', e)
        return NextResponse.json({message: e.code || e.message }, {status: 500})
    }
}