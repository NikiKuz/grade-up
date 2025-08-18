import { redis } from "@services/redis.service.js";

export async function storeRefreshToken(userId: string,refreshToken: string): Promise<string>{
    return await redis.set(userId, refreshToken)
}

export async function deleteRefreshToken(userId: string, refreshToken: string): Promise<Number>{
    return await redis.del(userId)
}
