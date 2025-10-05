import prisma from "@/lib/prisma"
import authAdmin from "@/middlewares/authAdmin"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req){
    try{
        const {userId } = await getAuth(req)
        const isAdmin  = await authAdmin(userId)

        if(!isAdmin){
            return NextResponse.json({message: 'not authorized'}, {status: 401})
        }
    
        const {coupon} = await req.json()
        coupon.code = coupon.code.toUpperCase()


        await prisma.coupon.create({
            data: coupon
        })

        return NextResponse.json({message: 'Coupon added successfully'})

    }catch(e){
        console.log('[CREATE_COUPON]', e)
        return NextResponse.json({message: e.code || e.message }, {status: 400})
    }
}


export async function DELETE(req){
    try{
        const {userId } = await getAuth(req)
        const isAdmin  = await authAdmin(userId)

        if(!isAdmin){
            return NextResponse.json({message: 'not authorized'}, {status: 401})
        }

        const {searchParams} = req.nextUrl;
        const code = searchParams.get('code')

        await prisma.coupon.delete({
            where: {code: code}
        })

        return NextResponse.json({message: "Coupon deleted successfully"})
    }catch(e){
        console.log('[DELETE_COUPON]', e)
        return NextResponse.json({message: e.code || e.message }, {status: 400})
    }
}


export async function GET(req){
    try{
        const {userId } = await getAuth(req)
        const isAdmin  = await authAdmin(userId)

        if(!isAdmin){
            return NextResponse.json({message: 'not authorized'}, {status: 401})
        }

        const coupon = await prisma.coupon.findMany({})

        return NextResponse.json({coupon})

    }catch(e){
        console.log('[GET_ALL_COUPON]', e)
        return NextResponse.json({message: e.code || e.message }, {status: 400})
    }
}