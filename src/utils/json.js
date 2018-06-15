export const jsonParse = jsonLike => {
  return typeof jsonLike === 'string' &&
    (jsonLike.charAt(0) === '{' || jsonLike.charAt(0) === '[')
    ? JSON.parse(jsonLike)
    : jsonLike;
};
