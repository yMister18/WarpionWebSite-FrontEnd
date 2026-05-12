import { AuditLogTable } from '@/components/dashboard/audit-log-table';
import { PageHeader } from '@/components/dashboard/page-header';
import { PageToolbar } from '@/components/dashboard/page-toolbar';
import { SectionCard } from '@/components/dashboard/section-card';
import { TopNav } from '@/components/dashboard/top-nav';
import { getAdminActionLogs } from '@/lib/warpion-api';

export default async function AuditLogPage() {
  try {
    const response = await getAdminActionLogs({ take: 200 });
    const { logs, count } = response.data;

    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <TopNav current="audit-log" />

        <div className="mx-auto max-w-7xl px-6 py-10">
          <PageHeader
            title="Audit Log"
            description="Histórico administrativo de ações operacionais executadas no painel."
            meta={`${count} registo(s) encontrados`}
          />

          <PageToolbar />

          <SectionCard
            title="Action History"
            description="Histórico recente de operações administrativas."
          >
            <AuditLogTable logs={logs} />
          </SectionCard>
        </div>
      </main>
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao carregar audit log.';

    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <TopNav current="audit-log" />

        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl border border-red-900 bg-red-950/40 p-6">
            <h1 className="text-3xl font-bold text-red-300">Audit Log</h1>
            <p className="mt-4 text-red-200">Falha ao carregar audit log.</p>
            <p className="mt-2 text-sm text-red-300/90">{message}</p>
          </div>
        </div>
      </main>
    );
  }
}