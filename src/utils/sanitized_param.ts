const getSanitizedParam = (param: string) => {
  const sanitizedParam = param.replace(":", "");
  if (sanitizedParam === "") throw new Error("Invalid param");
  return sanitizedParam;
};

export default getSanitizedParam;
