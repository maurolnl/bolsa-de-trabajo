interface Props extends React.HTMLAttributes<HTMLElement> {}
export function TypographyInlineCode(props: Props) {
  return (
    <code
      className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
      {...props}
    >
      {props.children}
    </code>
  );
}
