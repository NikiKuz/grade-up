import { logger } from "@services/logger.service.js";
import jwt from 'jsonwebtoken'
import { Response } from "express";
import { storeRefreshToken } from "@models/redis.models.js";

export const { ACCESS_SECRET, REFRESH_SECRET } = process.env

export async function generateAccessToken(payload: { emaail: string }){
    try {
        return jwt.sign(payload, process.env.ACCESS_SECRET as string, { expiresIn: "15m" })
    } catch (error) {
        logger.error("error creating accessToken", error)
        throw new Error("error creating accessToken")
    }
}

export async function generateAuthTokens(payload: { email: string, id: string;}) {
    try {
        const accessToken = jwt.sign(payload, ACCESS_SECRET as string, { expiresIn: "15m" });
        const refreshToken = jwt.sign(payload, REFRESH_SECRET as string, { expiresIn: "7d" });
        return { accessToken, refreshToken };
      } catch (error) {
        logger.error('JWT sign error:', error);
        throw new Error('Ошибка при генерации токенов');
      }
      
}

export async function setAndStoreAuthCookies(res: Response, userId: string, tokens: { accessToken: string, refreshToken?: string }) {
  res.cookie("ACCESS_SECRET", tokens.accessToken, {
    httpOnly: true,
    secure: true, 
    sameSite: "none",
    maxAge: Number(new Date(Date.now() + 15 * 60 * 1000)),
  });

  if (tokens.refreshToken) {
    await storeRefreshToken(userId, tokens.refreshToken)
    res.cookie("REFRESH_SECRET", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: Number(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    });
  }
}

export async function deleteCookies(): Promise<any>{
  return
}
