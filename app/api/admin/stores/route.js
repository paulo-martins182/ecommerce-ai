import prisma from "@/lib/prisma"
import authAdmin from "@/middlewares/authAdmin"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req){
    try{
        const {userId} = getAuth(req)
        const isAdmin = authAdmin(userId)

        if(!isAdmin){
            return NextResponse.json({message: 'Not authorized'}, {status: 401})
        }

        const stores = await prisma.store.findMany({
            where: {status: "approved"},
            include: {
                user: true
            }
        })

        return NextResponse.json({stores})

    }catch(e){
        console.error('[GET_ALL_STORES_APPROVED]', e)
        return NextResponse.json({message: e.code || e.message }, {status: 500})
    }
}