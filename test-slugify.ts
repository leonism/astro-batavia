function slugifyTag(tag: string) {
  return tag
    .toLowerCase()
    .normalize('NFD') // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove Latin diacritic marks
    .normalize('NFC') // Re-combine other marks (like Japanese dakuten)
    .replace(/[^\p{L}\p{N}]+/gu, '-') // Replace non-alphanumeric (Unicode-aware) with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, '') // Remove trailing hyphens
    .trim();
}
console.log("Slug:", slugifyTag("テクノロジー"));
