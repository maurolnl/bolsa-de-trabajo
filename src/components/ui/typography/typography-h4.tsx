interface Props extends React.HTMLAttributes<HTMLHeadingElement> {}
export function TypographyH4(props: Props) {
  return (
    <h2 className="scroll-m-20 text-xl font-semibold tracking-tight" {...props}>
      {props.children}
    </h2>
  );
}
