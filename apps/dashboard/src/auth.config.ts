import type { NextAuthConfig } from "next-auth";

// so it is compatible with Edge runtimes (like nextjs middleware).

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = (auth?.user as any)?.role;
      const pathname = nextUrl.pathname;

      const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
      const isMarkaRoute = pathname.startsWith("/marka");
      const isAjansRoute = pathname.startsWith("/ajans");
      const isFreelancerRoute = pathname.startsWith("/freelancer");
      const isAdminRoute = pathname.startsWith("/admin");
      const isProtectedRoute = isMarkaRoute || isAjansRoute || isFreelancerRoute || isAdminRoute;

      // Giriş yapmış kullanıcılar auth sayfalarına girmesin, dashboard'a yönlendirilsin
      if (isAuthRoute && isLoggedIn) {
        const redirectMap: Record<string, string> = {
          BRAND: "/marka",
          AGENCY: "/ajans",
          FREELANCER: "/freelancer",
          ADMIN: "/admin",
        };
        return Response.redirect(new URL(redirectMap[userRole] || "/", nextUrl));
      }

      // Korunan rotalar — giriş zorunlu
      if (isProtectedRoute) {
        if (!isLoggedIn) return false; // NextAuth login sayfasına yönlendirir

        // ADMIN tüm rotalara erişebilir
        if (userRole === "ADMIN") return true;

        // Rol kontrolü
        if (isMarkaRoute && userRole !== "BRAND") return false;
        if (isAjansRoute && userRole !== "AGENCY") return false;
        if (isFreelancerRoute && userRole !== "FREELANCER") return false;
        if (isAdminRoute && userRole !== "ADMIN") return false;

        return true;
      }

      // Public rotalar (landing page, /api, vs.)
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }

      // For updates
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        // @ts-ignore
        session.user.role = token.role;
      }

      return session;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
