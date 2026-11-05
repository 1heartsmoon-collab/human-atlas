import type {Atlas, Concept} from '../anatomy';

// "FMA:13405", "fma 13405", "ＦＭＡ１３４０５" and "13405" all compact to comparable forms.
export const compactId = (s: string) => s.normalize('NFKC').toLowerCase().replace(/[\s:_\-.]/g, '');

export function searchAtlas(atlas: Atlas, query: string): Concept[] {
  const text = query.normalize('NFKC').toLowerCase().trim().replace(/\s+/g, ' ');
  if (!text) return [];
  const id = compactId(text);
  const digitsOnly = /^\d+$/.test(id);
  const partConcepts = /^fj\d/.test(id)
    ? new Set(atlas.parts.filter(p => compactId(p.id).startsWith(id)).map(p => p.conceptId))
    : null;

  const score = (c: Concept) => {
    const cid = compactId(c.id), name = c.name.toLowerCase();
    if (cid === id || (digitsOnly && cid.replace(/\D/g, '') === id)) return 0;
    if (partConcepts?.has(c.id)) return 1;
    if (name === text) return 2;
    if (name.startsWith(text)) return 3;
    if (name.includes(text)) return 4;
    if (id.length >= 4 && cid.includes(id)) return 5;
    return -1;
  };

  return atlas.concepts
    .map(c => ({c, s: score(c)}))
    .filter(r => r.s >= 0)
    .sort((a, b) => a.s - b.s || a.c.name.length - b.c.name.length)
    .slice(0, 60)
    .map(r => r.c);
}
