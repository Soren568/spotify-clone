// MIDDLEWARE - NEXT12 
// Every time a user does something it goes through the middle ware. Here we are checking that they are authorized with token - if not they are redirected
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    // Token will exist if user is logged in
    const token = await getToken({ req, secret: process.env.JWT_SECRET})

    const { pathname } = req.nextUrl

    // Allow request if following is true...
    // 1. Its a request for a next-auth session & provider fetching
    // 2. the token exists
    if(pathname.includes('api/auth/') || token){
        return NextResponse.next();
    }

    // Redirect them to login if they dont have a token and are requesting a protected route
    if(!token && pathname !== '/login'){
        return NextResponse.redirect('/login')
    }
}