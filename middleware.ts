import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Routes protégées
    const protectedRoutes = ["/dashboard"];
    
    // Vérifier si l'utilisateur a accès à la route
    if (protectedRoutes.some((route) => path.startsWith(route))) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Rediriger vers dashboard si déjà connecté et sur login
    if (path === "/login" && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Permettre l'accès à /login sans token
        if (path === "/login") return true;
        // Autres routes protégées
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};