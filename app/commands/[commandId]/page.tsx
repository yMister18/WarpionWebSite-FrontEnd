import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/page-header';
import { RequeueCommandButton } from '@/components/dashboard/requeue-command-button';
import { SectionCard } from '@/components/dashboard/section-card';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { TopNav } from '@/components/dashboard/top-nav';
import { getCommandById } from '@/lib/warpion-api';

type PageProps = {
  params: Promise<{
    commandId: string;
  }>;
};

function formatDate(value: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

export default async function CommandDetailPage({ params }: PageProps) {
  try {
    const { commandId } = await params;
    const response = await getCommandById(commandId);
    const command = response.data.shopCommand;

    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <TopNav />

        <div className="mx-auto max-w-6xl px-6 py-10">
          <PageHeader
            title={`Command ${command.id}`}
            description="Detalhe completo do shop command e respetivo contexto operacional."
            meta={`Atualizado em ${new Date(command.updatedAt).toLocaleString()}`}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            <SectionCard title="Resumo do command">
              <div className="space-y-3 text-sm text-zinc-300">
                <p className="break-words">
                  <span className="text-zinc-500">Command:</span> {command.command}
                </p>
                <p><span className="text-zinc-500">Attempts:</span> {command.attempts}</p>
                <p><span className="text-zinc-500">Published:</span> {formatDate(command.publishedAt)}</p>
                <p><span className="text-zinc-500">Processing started:</span> {formatDate(command.processingStartedAt)}</p>
                <p><span className="text-zinc-500">Delivered:</span> {formatDate(command.deliveredAt)}</p>
                <p><span className="text-zinc-500">Owner:</span> {command.processingOwner ?? '—'}</p>
                <p className="break-words">
                  <span className="text-zinc-500">Last error:</span> {command.lastError ?? '—'}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <StatusBadge value={command.status} />
                </div>

                <div className="pt-3">
                  <RequeueCommandButton shopCommandId={command.id} />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Player">
              <div className="space-y-3 text-sm text-zinc-300">
                <p><span className="text-zinc-500">Username:</span> {command.player.username}</p>
                <p><span className="text-zinc-500">UUID:</span> {command.player.uuid}</p>
                <p><span className="text-zinc-500">Player ID:</span> {command.player.id}</p>
              </div>
            </SectionCard>

            <SectionCard title="Order associada">
              <div className="space-y-3 text-sm text-zinc-300">
                <Link
                  href={`/orders/${command.order.id}`}
                  className="inline-flex text-blue-300 underline-offset-4 hover:underline"
                >
                  Abrir order {command.order.id}
                </Link>

                <p><span className="text-zinc-500">External ID:</span> {command.order.externalId ?? '—'}</p>
                <p><span className="text-zinc-500">Amount:</span> {command.order.totalAmount} {command.order.currency}</p>
                <p><span className="text-zinc-500">Paid at:</span> {formatDate(command.order.paidAt)}</p>
                <p><span className="text-zinc-500">Delivery completed:</span> {formatDate(command.order.deliveryCompletedAt)}</p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <StatusBadge value={command.order.status} />
                  <StatusBadge value={command.order.deliveryStatus} />
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="mt-6">
            <SectionCard title="Ações rápidas">
              <div className="flex flex-wrap gap-4 text-sm">
                <Link
                  href="/failed-commands"
                  className="text-blue-300 underline-offset-4 hover:underline"
                >
                  Ir para Failed Commands
                </Link>
                <Link
                  href="/stuck-commands"
                  className="text-blue-300 underline-offset-4 hover:underline"
                >
                  Ir para Stuck Commands
                </Link>
                <Link
                  href="/orders"
                  className="text-blue-300 underline-offset-4 hover:underline"
                >
                  Ir para Orders
                </Link>
              </div>
            </SectionCard>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido ao carregar command.';

    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <TopNav />
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl border border-red-900 bg-red-950/40 p-6">
            <h1 className="text-3xl font-bold text-red-300">Command Detail</h1>
            <p className="mt-4 text-red-200">Falha ao carregar detalhe do command.</p>
            <p className="mt-2 text-sm text-red-300/90">{message}</p>
          </div>
        </div>
      </main>
    );
  }
}