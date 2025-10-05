import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req){
    try{
        const {userId} = getAuth(req)
        const isAdmin = await authAdmin(userId)

        if(!isAdmin){
            return NextResponse.json({message: 'Not authorized'}, {status: 401})
        }

        return NextResponse.json({isAdmin})

    }catch(e){
        console.error('[VALIDATE_ADMIN_GET]', e)
        return NextResponse.json({message: 'Internal Error'}, {status: 500})
    }
}