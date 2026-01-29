import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
            cookieOptions: {
                name: 'sb-event-admin-v1',
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // ログインページ以外で未認証ならログインへ
    if (!user && !request.nextUrl.pathname.startsWith('/login')) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // ログイン済みの場合、管理者権限をチェック
    if (user) {
        // 管理者メールアドレスのチェック
        const adminEmailsString = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
        const adminEmails = adminEmailsString
            ? adminEmailsString.split(',').map(e => e.trim().toLowerCase())
            : [];

        // 管理者メールアドレスが設定されている場合、チェック
        if (adminEmails.length > 0) {
            const userEmail = user.email?.toLowerCase();
            if (!userEmail || !adminEmails.includes(userEmail)) {
                // 管理者でない場合はログアウトしてログインページへ
                await supabase.auth.signOut();
                const url = request.nextUrl.clone()
                url.pathname = '/login'
                url.searchParams.set('error', 'unauthorized')
                return NextResponse.redirect(url)
            }
        }

        // ログイン済みでログインページにアクセスしようとしたらトップへ
        if (request.nextUrl.pathname.startsWith('/login')) {
            const url = request.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)
        }
    }

    return response
}
