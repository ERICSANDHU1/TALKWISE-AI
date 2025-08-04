// import { AssemblyAI } from "assemblyai"
// import { NextResponse } from "next/server";

// const AssemblyAi=new AssemblyAI({apiKey:process.env.ASSEMBLY_API_KEY})
// export async function GET(req) {

//     const token=await AssemblyAi.realtime.createTemporaryToken({expires_in:3600});
//     return NextResponse.json(token);
// }

import { AssemblyAI } from "assemblyai"
import { NextResponse } from "next/server";

const AssemblyAi = new AssemblyAI({ apiKey: process.env.ASSEMBLY_API_KEY });

export async function GET(req) {
    try {
        const token = await AssemblyAi.realtime.createTemporaryToken({ expires_in: 3600 });
        return NextResponse.json(token);
    } catch (error) {
        console.error("AssemblyAI token error:", error.message);
        return NextResponse.json({ error: "AssemblyAI token fetch failed" }, { status: 500 });
    }
}
