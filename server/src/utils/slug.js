import slugify from "slug";

export const generateSlug = (text) => {
  return slugify(text, { lower: true, strict: true });
};

export const isValidSlug = (slug) => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};
