type Props = {
  title: string;
  description: string;
  action?: JSX.Element;
};

export const ContinuityPage = ({ title, description, action }: Props) => (
  <div className="flex min-h-[60vh] items-center justify-center px-4">
    <section className="max-w-lg space-y-3 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Próximamente
      </p>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      {action ? <div className="flex justify-center pt-2">{action}</div> : null}
    </section>
  </div>
);
