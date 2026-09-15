type Props = {
  title: string;
  description: string;
};

export const ContinuityPage = ({ title, description }: Props) => (
  <div className="flex min-h-[60vh] items-center justify-center px-4">
    <section className="max-w-lg space-y-3 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Próximamente
      </p>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </section>
  </div>
);
