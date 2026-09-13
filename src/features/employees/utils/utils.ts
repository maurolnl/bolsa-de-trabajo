export const toNumber = (value: string | undefined) => {
  if (!value) return null;
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? null : numberValue;
};
