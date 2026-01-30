import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';
    const type = searchParams.get('type') ?? '';
    const error = searchParams.get('error');
    const error_description = searchParams.get('error_description');

    if (error) {
        console.error('Auth error:', error, error_description);
        return NextResponse.redirect(`${origin}/login?error=${error}&error_description=${error_description}`);
    }

    if (!code) {
        return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
    }

    const supabase = await createClient();
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError || !data?.user) {
        console.error('Exchange error:', exchangeError);
        return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
    }

    if (type === 'recovery') {
        return NextResponse.redirect(`${origin}${next}`);
    }

    const { data: profile } = await supabase
        .from('organizers')
        .select('id')
        .eq('user_id', data.user.id)
        .maybeSingle();

    if (!profile) {
        return NextResponse.redirect(`${origin}/onboarding`);
    }

    return NextResponse.redirect(`${origin}${next}`);
}
