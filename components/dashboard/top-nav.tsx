import Link from 'next/link';
import { LogoutButton } from '@/components/dashboard/logout-button';

type NavItemProps = {
  href: string;
  label: string;
  active?: boolean;
};

function NavItem({ href, label, active = false }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-sm transition ${
        active
          ? 'border-blue-800 bg-blue-950/40 text-blue-100'
          : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );
}

type TopNavProps = {
  current?: 'dashboard' | 'stuck-commands' | 'failed-commands' | 'orders';
};

export function TopNav({ current = 'dashboard' }: TopNavProps) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Warpion Website</h1>
          <p className="text-sm text-zinc-400">Painel administrativo</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <nav className="flex flex-wrap items-center gap-3">
            <NavItem
              href="/"
              label="Dashboard"
              active={current === 'dashboard'}
            />
            <NavItem
              href="/stuck-commands"
              label="Stuck Commands"
              active={current === 'stuck-commands'}
            />
            <NavItem
              href="/failed-commands"
              label="Failed Commands"
              active={current === 'failed-commands'}
            />
            <NavItem
              href="/orders"
              label="Orders"
              active={current === 'orders'}
            />
          </nav>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}