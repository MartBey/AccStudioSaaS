import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container relative grid min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div
        className="relative hidden h-full flex-col p-10 text-white lg:flex"
        style={{
          background: "hsl(var(--surface-low))",
          borderRight: "1px solid hsl(var(--border))",
        }}
      >
        {/* Ambient glow instead of solid block */}
        <div
          className="pointer-events-none absolute left-0 top-0 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-[100px]"
          style={{ background: "hsl(var(--primary))" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full opacity-[0.08] blur-[80px]"
          style={{ background: "hsl(var(--secondary))" }}
        />

        <div className="relative z-20 flex items-center gap-2">
          <span
            className="font-manrope text-2xl font-extrabold tracking-tight"
            style={{ color: "hsl(var(--primary))" }}
          >
            AccStudio
          </span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-4">
            <p
              className="font-manrope text-lg font-medium leading-relaxed sm:text-2xl"
              style={{ color: "hsl(var(--on-surface))" }}
            >
              &ldquo;AccStudio sayesinde markalarımızı ve yetenekli freelancer&apos;ları tek bir çatı
              altında, mükemmel bir uyumla yönetebiliyoruz.&rdquo;
            </p>
            <footer
              className="label-md"
              style={{ color: "hsl(var(--on-surface-variant))" }}
            >
              Sofia Davis, Agency Founder
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {children}
        </div>
      </div>
    </div>
  );
}
