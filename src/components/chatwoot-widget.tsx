"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";

declare global {
    interface Window {
        chatwootSettings: {
            hideMessageBubble?: boolean;
            position?: "left" | "right";
            locale?: "en" | "es";
            type?: "standard" | "expanded_bubble";
            launcherTitle?: string;
        };
        $chatwoot: any;
    }
}

export function ChatwootWidget() {
    const { user } = useAuth();
    const [init, setInit] = useState(false);

    useEffect(() => {
        if (init) return;

        const loadChatwoot = async () => {
            // 1. Fetch HMAC if user is logged in
            let identityHash = "";
            if (user) {
                try {
                    const res = await fetch("/api/chat/auth");
                    if (res.ok) {
                        const data = await res.json();
                        identityHash = data.hmac;
                    }
                } catch (error) {
                    console.error("Failed to load chatwoot auth:", error);
                }
            }

            // 2. Load Script
            const BASE_URL = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL || "https://app.chatwoot.com";
            const WEBSITE_TOKEN = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN;

            if (!WEBSITE_TOKEN) {
                console.warn("Chatwoot Website Token is missing");
                return;
            }

            window.chatwootSettings = {
                hideMessageBubble: false,
                position: "right",
                locale: "es",
                type: "standard",
            };

            (function (d, t) {
                var g: any = d.createElement(t),
                    s: any = d.getElementsByTagName(t)[0];
                g.src = BASE_URL + "/packs/js/sdk.js";
                g.defer = true;
                g.async = true;
                s.parentNode.insertBefore(g, s);
                g.onload = function () {
                    window.$chatwoot.run({
                        websiteToken: WEBSITE_TOKEN,
                        baseUrl: BASE_URL,
                    });

                    // 3. Identification with HMAC
                    if (user && identityHash) {
                        window.$chatwoot.setUser(user.id, {
                            email: user.email,
                            name: user.user_metadata?.full_name,
                            avatar_url: user.user_metadata?.avatar_url,
                            identifier_hash: identityHash,
                        });
                    }
                };
            })(document, "script");

            setInit(true);
        };

        loadChatwoot();
    }, [user, init]);

    return null;
}
