import { NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Temporary in-memory store — replace with Redis in production
export const OTP_STORE: Record<string, { otp: string; expires: number }> = {};

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();
        if (!phone) return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        OTP_STORE[phone] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 min expiry

        // Skip actual SMS if keys are placeholders (for dev convenience)
        if (process.env.TWILIO_ACCOUNT_SID?.includes('your_')) {
            console.log(`[DEV] OTP for ${phone}: ${otp}`);
            return NextResponse.json({ success: true, dev: true, otp });
        }

        await client.messages.create({
            body: `Your Arty code: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('OTP Send Error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown Error" }, { status: 500 });
    }
}
