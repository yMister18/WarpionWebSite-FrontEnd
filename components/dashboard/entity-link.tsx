import Link from 'next/link';

type EntityLinkProps = {
  href: string;
  label: string;
  sublabel?: string | null;
};

export function EntityLink({ href, label, sublabel }: EntityLinkProps) {
  return (
    <div>
      <Link
        href={href}
        className="font-medium text-white underline-offset-4 transition hover:text-blue-300 hover:underline"
      >
        {label}
      </Link>
      {sublabel ? (
        <div className="mt-1 text-xs text-zinc-500">{sublabel}</div>
      ) : null}
    </div>
  );
}