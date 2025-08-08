import { TypeUser } from "#types/user.js";
import { prisma } from "@services/prisma.service.js";

export async function createUser(data: TypeUser){
    return await prisma.user.create({
        data
    })
}

export async function findUserByEmail(email: string){
    return await prisma.user.findFirst({
        where: {
            email
        }
    })
}
