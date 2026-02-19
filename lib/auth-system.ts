import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_please_change'
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
        console.error('[AuthSystem] Verify error:', error)
        return null
    }
}
