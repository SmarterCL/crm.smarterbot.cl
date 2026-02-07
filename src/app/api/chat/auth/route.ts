
import { NextResponse } from "next/server";
import { createServerComponentSupabaseClient } from "@/lib/supabase-server";
import crypto from "crypto";

export async function GET() {
    try {
        const supabase = await createServerComponentSupabaseClient();
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = session.user.email;
        const secret = process.env.CHATWOOT_IDENTITY_VALIDATION_KEY || process.env.CHATWOOT_ACCESS_TOKEN;

        if (!secret) {
            console.error("CHATWOOT_IDENTITY_VALIDATION_KEY or CHATWOOT_ACCESS_TOKEN is missing");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // Generate HMAC SHA256 signature
        const hmac = crypto
            .createHmac("sha256", secret)
            .update(email)
            .digest("hex");

        return NextResponse.json({
            hmac,
            user: {
                email: session.user.email,
                name: session.user.user_metadata?.full_name || session.user.email.split("@")[0],
                avatar_url: session.user.user_metadata?.avatar_url,
                identifier_hash: hmac,
            },
        });
    } catch (error) {
        console.error("Chatwoot Auth Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
