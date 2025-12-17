import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const ilceId = request.nextUrl.searchParams.get("ilceId")

  if (!ilceId) {
    return NextResponse.json({ error: "ilceId is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://ezanvakti.emushaf.net/vakitler/${ilceId}`)
    
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch from Diyanet" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Diyanet proxy error:", error)
    return NextResponse.json({ error: "Failed to fetch prayer times" }, { status: 500 })
  }
}
