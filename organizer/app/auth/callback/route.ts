import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const error_description = searchParams.get('error_description');
    const next = searchParams.get('next') ?? '/';
    const type = searchParams.get('type') ?? '';

    if (error) {
        console.error('Auth error:', error, error_description);
        return NextResponse.redirect(`${origin}/login?error=${error}&error_description=${error_description}`);
    }

    if (!code) {
        return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
    }

    const cookieStore = await cookies();
    const cookieList: { name: string; value: string; options: CookieOptions }[] = [];

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieList.push({ name, value, options });
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (_) {
                        // Route Handler: ensure we still collect for redirect response
                    }
                },
                remove(name: string, options: CookieOptions) {
                    cookieList.push({ name, value: '', options });
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (_) {}
                },
            },
            cookieOptions: {
                name: 'sb-event-organizer-v1',
            },
        }
    );

    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError || !data?.user) {
        console.error('Exchange error:', exchangeError);
        return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
    }

    if (type === 'recovery') {
        const res = NextResponse.redirect(`${origin}${next}`);
        cookieList.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, { ...options, path: '/' });
        });
        return res;
    }

    const { data: profile, error: profileError } = await supabase
        .from('organizers')
        .select('id, user_id, company_name')
        .eq('user_id', data.user.id)
        .maybeSingle();

    const redirectPath = profileError || !profile ? '/onboarding' : next;
    const redirectUrl = `${origin}${redirectPath}`;
    const res = NextResponse.redirect(redirectUrl);

    // Ensure session cookies are set with path=/ so they're sent on all requests
    cookieList.forEach(({ name, value, options }) => {
        res.cookies.set(name, value, { ...options, path: '/' });
    });
    return res;
}
