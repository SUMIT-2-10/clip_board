import { ClipboardIcon, FileUpIcon, KeyRoundIcon, ShieldCheckIcon } from "lucide-react";

const Home = () => {
  return (
    <main className="flex min-h-full w-full flex-col items-center justify-center bg-background px-4 py-12 text-foreground sm:px-6">
      <section className="w-full max-w-4xl text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-md">
          <ClipboardIcon className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          ClipBoard
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Share what matters, instantly.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Move text and files between devices with a temporary six-digit code.
          No account, no setup, and no complicated workflow.
        </p>

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <FileUpIcon className="mb-4 h-5 w-5" aria-hidden="true" />
            <h2 className="font-semibold">Send text or files</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Share both together under one retrieval code.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <KeyRoundIcon className="mb-4 h-5 w-5" aria-hidden="true" />
            <h2 className="font-semibold">Use one simple code</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Enter the six-digit key on any device to retrieve your content.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <ShieldCheckIcon className="mb-4 h-5 w-5" aria-hidden="true" />
            <h2 className="font-semibold">Temporary by design</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Shared content is designed for quick, time-limited transfers.
            </p>
          </div>
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Choose Send or Retrieve above to get started.
        </p>
      </section>
    </main>
  );
};

export default Home;