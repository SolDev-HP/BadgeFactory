// Generate nonce for 24 hour, register session

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// export async function POST(req: NextRequest) {
//     // Try to address from the request
//     // generate a random nonce
//     // assign 24 hour deadline
//     try {
//         const { user_wallet } = await req.json();

//         // get a nonce
//         const nonce = crypto.randomBytes(32).toString("hex");

//         // expiry
//         const expires = new Date(new Date().getTime() + 24 * 60 * 60);

//         return NextResponse.json({
//             nonce,
//             expires: expires.toISOString()
//         })
//     } catch (error: unknown) {
//         // Return what error occurred
//         console.log(error);
//         if (error instanceof Error) {
//             return NextResponse.json({
//                 error: error.message
//             })
//         } else {
//             return NextResponse.json({
//                 error: error
//             })
//         }
//     }
// }