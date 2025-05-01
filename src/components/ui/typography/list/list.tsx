interface Props extends React.HTMLAttributes<HTMLUListElement> {}
export const TypographyUList = (props: Props) => {
  return (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props}>
      {props.children}
    </ul>
  );
};
