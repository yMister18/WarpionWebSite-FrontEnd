import { OrdersTable } from '@/components/dashboard/orders-table';
import { PageHeader } from '@/components/dashboard/page-header';
import { SectionCard } from '@/components/dashboard/section-card';
import { TopNav } from '@/components/dashboard/top-nav';
import { getOrders } from '@/lib/warpion-api';

export default async function OrdersPage() {
  try {
    const response = await getOrders();
    const { orders, count } = response.data;

    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <TopNav current="orders" />

        <div className="mx-auto max-w-7xl px-6 py-10">
          <PageHeader
            title="Orders"
            description="Visão operacional das orders, com estado de pagamento e entrega."
            meta={`${count} order(s) encontradas`}
          />

          <SectionCard
            title="Lista de orders"
            description="Pesquisa, filtros e requeue operacional."
          >
            <OrdersTable orders={orders} />
          </SectionCard>
        </div>
      </main>
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao carregar orders.';

    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <TopNav current="orders" />

        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl border border-red-900 bg-red-950/40 p-6">
            <h1 className="text-3xl font-bold text-red-300">Orders</h1>
            <p className="mt-4 text-red-200">Falha ao carregar orders.</p>
            <p className="mt-2 text-sm text-red-300/90">{message}</p>
          </div>
        </div>
      </main>
    );
  }
}