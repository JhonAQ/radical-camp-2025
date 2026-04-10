import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  // Regular expression to detect mobile devices
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-device-type", isMobile ? "mobile" : "desktop");

  const url = request.nextUrl.clone();

  // If mobile, keep routing normally but inject header
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: "/",
};
