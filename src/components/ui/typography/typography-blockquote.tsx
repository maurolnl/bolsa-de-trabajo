interface Props extends React.HTMLAttributes<HTMLQuoteElement> {}
export function TypographyBlockquote(props: Props) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic" {...props}>
      {props.children}
    </blockquote>
  );
}
