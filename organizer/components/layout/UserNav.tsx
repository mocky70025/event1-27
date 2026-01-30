"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User, LogOut, LayoutDashboard, ClipboardList } from "lucide-react";

export function UserNav() {
    const [user, setUser] = useState<unknown>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        // Use getSession() so we only show logged-in UI when there's a real session (avoids stale cache)
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh(); // Refresh to update server-side state
        router.push("/login"); // Redirect to login
    };

    // Until we know auth state, show guest nav so we never show ログアウト when not logged in
    if (!mounted || isLoading) {
        return (
            <div className="flex items-center gap-4">
                <Link href="/login">
                    <Button variant="ghost" size="sm">
                        ログイン
                    </Button>
                </Link>
                <Link href="/signup">
                    <Button size="sm">
                        新規登録
                    </Button>
                </Link>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center gap-4">
                <Link href="/login">
                    <Button variant="ghost" size="sm">
                        ログイン
                    </Button>
                </Link>
                <Link href="/signup">
                    <Button size="sm">
                        新規登録
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <Link href="/">
                <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-orange-700 hover:text-orange-800 hover:bg-orange-50">
                    <LayoutDashboard className="h-4 w-4" />
                    ダッシュボード
                </Button>
            </Link>
            <Link href="/applications">
                <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-orange-700 hover:text-orange-800 hover:bg-orange-50">
                    <ClipboardList className="h-4 w-4" />
                    申込管理
                </Button>
            </Link>
            <Link href="/profile">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-orange-700 hover:text-orange-800 hover:bg-orange-50"
                >
                    <User className="h-4 w-4" />
                    プロフィール
                </Button>
            </Link>
            <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="h-8 gap-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
            >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">ログアウト</span>
            </Button>
        </div>
    );
}
