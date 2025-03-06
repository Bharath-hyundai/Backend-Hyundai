import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === "bharathyundaihyderabad@gmail.com" && password === "Bharath@123") {
    const response = NextResponse.json({ success: true });

    // Set token in cookies
    response.cookies.set("token", "yourAuthTokenHere", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
