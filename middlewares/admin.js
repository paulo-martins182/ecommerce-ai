import {clerkClient} from '@clerk/nextjs/server'

const authAdmin = async (userId) => {
    try{
       if(!userId) return false

       const client = await clerkClient()
       const user = await client.users.getUser(userId)


       return 
    }catch(e){

    }
}