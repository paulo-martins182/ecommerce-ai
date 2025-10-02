import prisma from "@/lib/prisma";
import { inngest } from "./client";


// Inngest function save User Infos to database 
export const syncUserCreate = inngest.createFunction(
    { id: "sync-user-create" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const {data } = event;
        await prisma.user.create({
            data: {
                id: data.id,
                email: data.email_addresses[0].email_address,
                name: `${data.first_name} ${data.last_name}`,
                image: data.image_url,
            }
        })
    }
)


// Inngest update user infos in database
export const syncUserUpdate = inngest.createFunction(
        { id: "sync-user-update" },
        { event: "clerk/user.updated" },
        async ({ event }) => {
            const {data} = event;

            await prisma.user.update({
                where: { id: data.id },
                data: {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    image: data.image_url,
                }
            })
        }
)

// Inngest delete user from database
export const syncUserDelete = inngest.createFunction(
    { id: "sync-user-delete" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const {data} = event;
        await prisma.user.delete({
            where: { id: data.id }
        })
    }
    )