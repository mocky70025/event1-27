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
        let done = false;
        const applyUser = (u: unknown) => {
            if (done) return;
            done = true;
            setUser(u ?? null);
            setIsLoading(false);
        };
        // Validate with server so we don't show ログアウト on stale session
        supabase.auth.getUser().then(({ data: { user: u } }) => applyUser(u ?? null));
        // If getUser() is slow or fails, show guest nav after 2.5s so something is always visible
        const t = setTimeout(() => applyUser(null), 2500);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
            const { data: { user: u } } = await supabase.auth.getUser();
            applyUser(u ?? null);
        });

        return () => {
            done = true;
            clearTimeout(t);
            subscription.unsubscribe();
        };
    }, [supabase.auth]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    };

    const guestNav = (
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
            </div>
    );

    // While loading, show guest nav so the page is never blank (getUser timeout will switch to real state)
    if (!mounted || isLoading) {
        return guestNav;
    }

    if (!user) return guestNav;

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
