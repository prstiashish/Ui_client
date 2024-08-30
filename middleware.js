import { NextResponse } from "next/server";

export function middleware() {
  alert();
  return NextResponse.json({
    hello: "middleware",
  });
}
