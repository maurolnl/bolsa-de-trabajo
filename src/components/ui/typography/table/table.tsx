import { DetailedHTMLProps, HTMLAttributes } from "react";

interface Props extends React.HTMLAttributes<HTMLTableElement> {}

export const Table = (props: Props) => {
  return (
    <table className="w-full" {...props}>
      {props.children}
    </table>
  );
};

export interface THeadProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  > {}

Table.THead = (props: THeadProps) => {
  return <thead {...props}>{props.children}</thead>;
};

interface THeadRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

Table.HeadRow = (props: THeadRowProps) => {
  return (
    <tr className="m-0 border-t p-0 even:bg-muted" {...props}>
      {props.children}
    </tr>
  );
};

interface THeadCellProps extends React.HTMLAttributes<HTMLTableCellElement> {}

Table.HeadCell = (props: THeadCellProps) => {
  return (
    <th
      className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {props.children}
    </th>
  );
};

export interface TBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

Table.TBody = (props: TBodyProps) => {
  return <tbody {...props}>{props.children}</tbody>;
};

interface TBodyRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

Table.BodyRow = (props: TBodyRowProps) => {
  return (
    <tr className="m-0 border-t p-0 even:bg-muted" {...props}>
      {props.children}
    </tr>
  );
};

interface TBodyCellProps extends React.HTMLAttributes<HTMLTableCellElement> {}

Table.BodyCell = (props: TBodyCellProps) => {
  return (
    <td
      className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {props.children}
    </td>
  );
};
