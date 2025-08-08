import { TypeUser } from '#types/user.js'
import { createUser, findUserByEmail } from '@models/user.models.js'
import { logger } from '@services/logger.service.js'
import { comparePasswords, hashPassword } from '@utils/hashPassword.js'
import { generateAuthTokens, setAuthCookies } from '@utils/jwt.js'
import { sanitizeUser } from '@utils/sanitizeUser.js'
import { Request, Response } from 'express'
import { z } from 'zod'

interface CreateUserBody{
    email: string,
    password: string,
}

const UserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

type CreateUserRequest = Request<{}, {}, CreateUserBody>

export async function register(req: CreateUserRequest, res: Response): Promise<Response | any>{
    const validation = UserSchema.safeParse(req.body)

    if(!validation.success){
        logger.info(validation.error)
        return res.status(400).json({ message: "invalid credentials" })
    }

    const { email, password } = validation.data

    const user: TypeUser | null = await findUserByEmail(email)

    if(user){
        return res.status(409).json({ message: "User already exists" })
    }

    const newUser: TypeUser = {
        email,
        password: await hashPassword(password)
    }
    
    const createdUser: TypeUser = await createUser(newUser)

    if (!createdUser.id) {
        throw new Error("User ID is missing after creation");
    }

    const { accessToken, refreshToken } = await generateAuthTokens({
          email: createdUser.email,
          id: createdUser.id.toString(),
    });
    
    setAuthCookies(res, { accessToken, refreshToken });

    const userWithoutPassword = sanitizeUser(createdUser);

    return res.json({
      message: "User was successfully created",
      createdUser: { ...userWithoutPassword, id: createdUser.id.toString() }
    });
}


export async function login(req: CreateUserRequest, res: Response): Promise<Response | any>{
    const validation = UserSchema.safeParse(req.body)

    if (!validation.success){
        logger.info(validation.error)
        return res.status(400).json({ message: "invalid credentials" })
    }

    const { email, password } = validation.data

    const user: TypeUser | null = await findUserByEmail(email)

    if(!user){
        return res.status(401).json({ message: "email or password are incorrect" })
    }

    const matchedPassword = await comparePasswords(password, user.password)

    if(!matchedPassword){
        return res.status(401).json({ message: "email or password are incorrect" })
    }

    if (!user.id){
        throw new Error("User ID is missing")
    }

    const { accessToken, refreshToken } = await generateAuthTokens({
          email: user.email,
          id: user.id.toString(),
    });
    
    setAuthCookies(res, { accessToken, refreshToken });

    const userWithoutPassword = sanitizeUser(user);

    return res.json({
      message: "user logged in successfully",
      auth: true,
      createdUser: { ...userWithoutPassword, id: user.id.toString() }
    })
}
