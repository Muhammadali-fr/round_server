// src/utils/slugify.ts

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove special characters
    .replace(/[\s_-]+/g, '-')   // replace spaces and underscores with -
    .replace(/^-+|-+$/g, '');   // trim dashes from start and end
}
