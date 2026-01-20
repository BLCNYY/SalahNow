import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const ilceId = request.nextUrl.searchParams.get("ilceId")

  if (!ilceId) {
    return NextResponse.json({ error: "ilceId is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://ezanvakti.emushaf.net/vakitler/${ilceId}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "SalahNow",
      },
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch from Diyanet" }, { status: response.status })
    }

    const text = await response.text()
    const sanitized = text.replace(/^\uFEFF/, "")
    const data = JSON.parse(sanitized)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Diyanet proxy error:", error)
    return NextResponse.json({ error: "Failed to fetch prayer times" }, { status: 500 })
  }
}
