import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined')
}

const secret = new TextEncoder().encode(JWT_SECRET)

export interface JwtPayload {
    userId: string
    email: string
    role: string
}

export async function signToken(payload: JwtPayload): Promise<string> {
    return new SignJWT(payload as any)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(secret)
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret)
        return payload as unknown as JwtPayload
    } catch (error) {
        return null
    }
}
