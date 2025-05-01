interface Props extends React.HTMLAttributes<HTMLParagraphElement> {}
export function TypographyLead(props: Props) {
  return (
    <p className="text-xl text-muted-foreground" {...props}>
      {props.children}
    </p>
  );
}
