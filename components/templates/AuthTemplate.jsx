export default function AuthTemplate({
  children,
  title,
  subtitle,
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0c0704] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#180c06] via-[#100703] to-[#1f0e08]"></div>
      <div className="absolute inset-0 opacity-60 mix-blend-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,107,53,0.35),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(255,126,69,0.25),_transparent_60%)]"></div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="w-full">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-10">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2b140a] text-2xl shadow-lg shadow-black/30">🔥</span>
              <div className="leading-tight">
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Gordon College CCS</p>
                <p className="text-lg font-semibold text-white">Membership Portal</p>
              </div>
            </div>
            <a
              href="/"
              className="hidden text-sm font-medium text-white/80 transition-colors hover:text-white md:inline-flex"
            >
              Back to site
            </a>
          </div>
        </header>

        <main className="mx-auto flex w-full flex-1 items-center px-6 pb-16">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
            <section className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-orange-200/90">
                Secure &amp; seamless access
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Welcome back to your CCS community.
                </h1>
                <p className="text-base text-white/70 sm:text-lg">
                  Manage student records, track payments, and stay connected with your campus network—all in one place.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 text-sm text-white/60 sm:flex-row sm:justify-start sm:text-base">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg text-orange-200">✓</span>
                  <span>Role-based dashboards</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg text-orange-200">✓</span>
                  <span>Real-time wallet updates</span>
                </div>
              </div>
            </section>

            <section className="w-full max-w-md justify-self-center">
              <div className="rounded-3xl border border-white/10 bg-[#150a06]/80 p-10 shadow-[0_25px_70px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl">
                <div className="mb-10 space-y-3 text-left">
                  <h2 className="text-3xl font-semibold text-white">
                    {title}
                  </h2>
                  {subtitle && (
                    <div className="text-sm text-white/60">
                      {subtitle}
                    </div>
                  )}
                </div>
                {children}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
