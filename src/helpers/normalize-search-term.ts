export const normalizeSearchTerm = (term: string): string => {
  return term
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
};
