import { MetricCard } from '@/components/dashboard/metric-card';
import { SectionCard } from '@/components/dashboard/section-card';
import { TopNav } from '@/components/dashboard/top-nav';
import { getMetrics } from '@/lib/warpion-api';

export default async function HomePage() {
  try {
    const response = await getMetrics();
    const { commands, orders, generatedAt } = response.data;

    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <TopNav current="dashboard" />

        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Dashboard
            </h2>
            <p className="mt-2 text-zinc-400">
              Visão geral do estado operacional do ecossistema Warpion.
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Última atualização: {new Date(generatedAt).toLocaleString()}
            </p>
          </div>

          <div className="grid gap-8">
            <SectionCard
              title="Commands"
              description="Estado atual de processamento dos shop commands."
            >
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <MetricCard
                  title="Pending"
                  value={commands.pending}
                  description="Aguardam processamento"
                  accent="yellow"
                />
                <MetricCard
                  title="Published"
                  value={commands.published}
                  description="Publicados no pipeline"
                  accent="blue"
                />
                <MetricCard
                  title="Processing"
                  value={commands.processing}
                  description="Em execução neste momento"
                  accent="zinc"
                />
                <MetricCard
                  title="Delivered"
                  value={commands.delivered}
                  description="Executados com sucesso"
                  accent="green"
                />
                <MetricCard
                  title="Failed"
                  value={commands.failed}
                  description="Falharam e requerem atenção"
                  accent="red"
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Orders"
              description="Estado de pagamento e entrega das orders."
            >
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <MetricCard
                  title="Pending Payment"
                  value={orders.pendingPayment}
                  description="Ainda sem pagamento"
                  accent="yellow"
                />
                <MetricCard
                  title="Paid"
                  value={orders.paid}
                  description="Pagamento confirmado"
                  accent="blue"
                />
                <MetricCard
                  title="Failed Payment"
                  value={orders.failedPayment}
                  description="Pagamento falhado"
                  accent="red"
                />
                <MetricCard
                  title="Delivered"
                  value={orders.delivered}
                  description="Entrega concluída"
                  accent="green"
                />
                <MetricCard
                  title="Processing / Partial"
                  value={orders.processing + orders.partial}
                  description="Ainda a decorrer ou parcial"
                  accent="zinc"
                />
              </div>
            </SectionCard>

            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard
                title="Resumo rápido"
                description="Leitura operacional rápida do sistema."
              >
                <div className="space-y-3 text-sm text-zinc-300">
                  <p>
                    Total de commands monitorizados:{' '}
                    <span className="font-semibold text-white">
                      {commands.pending +
                        commands.published +
                        commands.processing +
                        commands.delivered +
                        commands.failed}
                    </span>
                  </p>
                  <p>
                    Commands com atenção necessária:{' '}
                    <span className="font-semibold text-red-300">
                      {commands.failed + commands.processing}
                    </span>
                  </p>
                  <p>
                    Orders em circuito ativo:{' '}
                    <span className="font-semibold text-white">
                      {orders.paid + orders.processing + orders.partial}
                    </span>
                  </p>
                </div>
              </SectionCard>

              <SectionCard
                title="Estado da ligação"
                description="Conectividade entre Website e Warpion-API."
              >
                <div className="space-y-3 text-sm text-zinc-300">
                  <p className="font-medium text-green-400">
                    Ligação ao Warpion-API estabelecida com sucesso.
                  </p>
                  <p>
                    Fonte de dados: <span className="text-white">/api/internal/shop/metrics</span>
                  </p>
                  <p>
                    Atualização gerada em:{' '}
                    <span className="text-white">
                      {new Date(generatedAt).toLocaleString()}
                    </span>
                  </p>
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido ao ligar à API.';

    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <TopNav current="dashboard" />

        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl border border-red-900 bg-red-950/40 p-6">
            <h1 className="text-3xl font-bold text-red-300">Warpion Website</h1>
            <p className="mt-4 text-red-200">Falha ao ligar ao Warpion-API.</p>
            <p className="mt-2 text-sm text-red-300/90">{message}</p>
          </div>
        </div>
      </main>
    );
  }
}