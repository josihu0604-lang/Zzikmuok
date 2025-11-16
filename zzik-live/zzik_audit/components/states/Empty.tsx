export default function Empty({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center px-8">
      <h3 className="text-base font-semibold mb-2 text-[color:var(--text-primary)]">
        {title}
      </h3>
      <p className="text-sm text-[color:var(--text-tertiary)] mb-4">
        {description}
      </p>
      {action}
    </div>
  );
}
