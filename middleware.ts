import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token")?.value

  // If there's no token and the user is trying to access a protected route
  if (!authToken && request.nextUrl.pathname.startsWith("/dashboard")) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/"
    redirectUrl.searchParams.set(`redirectedFrom`, request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If there is a token, verify it's not expired
  if (authToken) {
    try {
      const userData = JSON.parse(Buffer.from(authToken, "base64").toString())
      if (userData.exp < Date.now()) {
        // Token is expired, redirect to login
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = "/"
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      // Invalid token format, redirect to login
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = "/"
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

// Specify which routes to run the middleware on
export const config = {
  matcher: ["/dashboard/:path*"],
}

