type PageHeaderProps = {
  title: string;
  description?: string;
  meta?: string;
};

export function PageHeader({ title, description, meta }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
      {description ? (
        <p className="mt-2 text-zinc-400">{description}</p>
      ) : null}
      {meta ? <p className="mt-2 text-sm text-zinc-500">{meta}</p> : null}
    </div>
  );
}