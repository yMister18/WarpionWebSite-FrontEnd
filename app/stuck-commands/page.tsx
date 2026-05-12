import { PageHeader } from '@/components/dashboard/page-header';
import { PageToolbar } from '@/components/dashboard/page-toolbar';
import { SectionCard } from '@/components/dashboard/section-card';
import { StuckCommandsTable } from '@/components/dashboard/stuck-commands-table';
import { TopNav } from '@/components/dashboard/top-nav';
import { getStuckCommands } from '@/lib/warpion-api';

export default async function StuckCommandsPage() {
  try {
    const response = await getStuckCommands();
    const { commands, count, cutoff } = response.data;

    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <TopNav current="stuck-commands" />

        <div className="mx-auto max-w-7xl px-6 py-10">
          <PageHeader
            title="Stuck Commands"
            description="Comandos presos em PROCESSING para além do timeout configurado."
            meta={`Cutoff usado: ${new Date(cutoff).toLocaleString()} • ${count} comando(s) encontrados`}
          />

          <PageToolbar />

          <SectionCard
            title="Lista de comandos presos"
            description="Pesquisa e requeue manual de comandos stuck."
          >
            <StuckCommandsTable commands={commands} />
          </SectionCard>
        </div>
      </main>
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao carregar stuck commands.';

    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <TopNav current="stuck-commands" />

        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl border border-red-900 bg-red-950/40 p-6">
            <h1 className="text-3xl font-bold text-red-300">Stuck Commands</h1>
            <p className="mt-4 text-red-200">
              Falha ao carregar comandos presos.
            </p>
            <p className="mt-2 text-sm text-red-300/90">{message}</p>
          </div>
        </div>
      </main>
    );
  }
}