import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined')
}

const secret = new TextEncoder().encode(JWT_SECRET)

export async function signToken(payload: any): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(secret)
}

export async function verifyToken(token: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(token, secret)
        return payload
    } catch (error) {
        return null
    }
}
