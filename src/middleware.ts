import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, type NextRequest } from "next/server";

const authRoutes = ["/login"];
const protectedRoutes = ["/admin"];

const middleware = async (req: NextRequest) => {
	const res = NextResponse.next();
	const supabase = createMiddlewareClient({ req, res });
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { pathname } = req.nextUrl;
	const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

	// Belum login & mau akses route yang butuh login
	if (!user && isProtected) {
		const loginUrl = req.nextUrl.clone();
		loginUrl.pathname = "/login";
		return NextResponse.redirect(loginUrl);
	}

	// Sudah login & mau akses login/register, redirect ke admin
	if (user && isAuthRoute) {
		const dashboardUrl = req.nextUrl.clone();
		dashboardUrl.pathname = "/admin";
		return NextResponse.redirect(dashboardUrl);
	}
	return res;
};

export const config = {
	matcher: ["/admin/:path*", "/login/:path*"],
};

export default middleware;
