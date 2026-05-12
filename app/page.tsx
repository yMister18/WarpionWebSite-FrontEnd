import { getMetrics } from '@/lib/warpion-api';

export default async function HomePage() {
  try {
    const response = await getMetrics();
    const { commands, orders, generatedAt } = response.data;

    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight">
              Warpion Website
            </h1>
            <p className="mt-2 text-zinc-400">
              Painel administrativo inicial ligado ao Warpion-API.
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-xl font-semibold">Estado da ligação</h2>
            <p className="mt-2 text-green-400">
              Ligação ao Warpion-API estabelecida com sucesso.
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Última geração de métricas: {new Date(generatedAt).toLocaleString()}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="mb-4 text-xl font-semibold">Commands</h2>
              <div className="space-y-2 text-sm text-zinc-300">
                <p>Pending: <span className="font-semibold text-white">{commands.pending}</span></p>
                <p>Published: <span className="font-semibold text-white">{commands.published}</span></p>
                <p>Processing: <span className="font-semibold text-white">{commands.processing}</span></p>
                <p>Delivered: <span className="font-semibold text-white">{commands.delivered}</span></p>
                <p>Failed: <span className="font-semibold text-white">{commands.failed}</span></p>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="mb-4 text-xl font-semibold">Orders</h2>
              <div className="space-y-2 text-sm text-zinc-300">
                <p>Pending payment: <span className="font-semibold text-white">{orders.pendingPayment}</span></p>
                <p>Paid: <span className="font-semibold text-white">{orders.paid}</span></p>
                <p>Failed payment: <span className="font-semibold text-white">{orders.failedPayment}</span></p>
                <p>Delivered: <span className="font-semibold text-white">{orders.delivered}</span></p>
                <p>Partial: <span className="font-semibold text-white">{orders.partial}</span></p>
                <p>Processing: <span className="font-semibold text-white">{orders.processing}</span></p>
              </div>
            </section>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido ao ligar à API.';

    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl border border-red-900 bg-red-950/40 p-6">
            <h1 className="text-3xl font-bold text-red-300">
              Warpion Website
            </h1>
            <p className="mt-4 text-red-200">
              Falha ao ligar ao Warpion-API.
            </p>
            <p className="mt-2 text-sm text-red-300/90">{message}</p>
          </div>
        </div>
      </main>
    );
  }
}