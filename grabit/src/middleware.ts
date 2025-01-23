import { cookies } from "next/headers";
import {  NextResponse } from "next/server";
import { verifyTokenJose } from "./helpers/jwt";
import { string } from "zod";
import { match } from "assert";

export async function middleware(request: Request){
    const authorization = cookies().get("authorization")?.value
    if(!authorization)
        return NextResponse.json(
    {
        message: "Invalid Token"
    },
    {
        status: 401
    }
    )

    const token = authorization.split(" ")[1]

    const decode = await verifyTokenJose<{ _id: string; email: string }>(token)

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", decode._id)

    const response = NextResponse.next({
        request: {
            headers: requestHeaders
        }
    })

    return response
}

export const config = {
    matcher: [
        "/api/outlets/:path*",
        "/api/customers/:path*",
    ]
}