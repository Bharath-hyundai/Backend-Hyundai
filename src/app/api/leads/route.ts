import { db } from "@/lib/db";
import { NextResponse } from "next/server";




export async function GET() {
  try {
    const data = await db.carInterest.findMany({
      
    })
    console.log(data)
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}




