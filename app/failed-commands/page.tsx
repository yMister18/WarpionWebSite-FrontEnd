import { FailedCommandsTable } from '@/components/dashboard/failed-commands-table';
import { PageHeader } from '@/components/dashboard/page-header';
import { PageToolbar } from '@/components/dashboard/page-toolbar';
import { SectionCard } from '@/components/dashboard/section-card';
import { TopNav } from '@/components/dashboard/top-nav';
import { getFailedCommands } from '@/lib/warpion-api';

export default async function FailedCommandsPage() {
  try {
    const response = await getFailedCommands();
    const { commands, count } = response.data;

    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <TopNav current="failed-commands" />

        <div className="mx-auto max-w-7xl px-6 py-10">
          <PageHeader
            title="Failed Commands"
            description="Comandos que falharam durante a execução e podem precisar de requeue."
            meta={`${count} comando(s) em FAILED`}
          />

          <PageToolbar />

          <SectionCard
            title="Lista de comandos falhados"
            description="Pesquisa e requeue manual de comandos failed."
          >
            <FailedCommandsTable commands={commands} />
          </SectionCard>
        </div>
      </main>
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao carregar failed commands.';

    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <TopNav current="failed-commands" />

        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl border border-red-900 bg-red-950/40 p-6">
            <h1 className="text-3xl font-bold text-red-300">Failed Commands</h1>
            <p className="mt-4 text-red-200">
              Falha ao carregar comandos falhados.
            </p>
            <p className="mt-2 text-sm text-red-300/90">{message}</p>
          </div>
        </div>
      </main>
    );
  }
}