import type {Atlas} from '../anatomy';
import {diagnose} from '../fidelity-data';

export type GapStatus = 'NOT_FOUND_IN_FIXED_MANIFEST' | 'NOT_IN_HUMAN_ATLAS' | 'NOT_MODELED';

export interface AssetGap {
  key: string;
  en: string;
  group: string;
  status: GapStatus;
  evidence: string;
  policy: string;
}

const FASCIA: AssetGap[] = ['anterior', 'middle', 'posterior'].map(layer => ({
  key: `thoracolumbar-fascia-${layer}`,
  en: `thoracolumbar fascia, ${layer} layer`,
  group: 'Fascia',
  status: 'NOT_IN_HUMAN_ATLAS',
  evidence: 'CONFIRMED_DATA_ANCHORS: inHumanAtlasFixedManifest=false. Exists in Z-Anatomy, commercial rights UNKNOWN.',
  policy: 'Not displayed. Z-Anatomy assets are not used until rights are confirmed.',
}));

const MICRO: AssetGap = {
  key: 'muscle-fiber-direction',
  en: 'muscle fibre direction / fascicles',
  group: 'Microstructure',
  status: 'NOT_MODELED',
  evidence: 'No fibre or fascicle geometry exists in the fixed manifest.',
  policy: 'Not displayed. No synthetic fibre overlay is generated.',
};

// Built live from the same fixed-manifest audit used by the W1 FACE screen, so the register cannot drift from the data.
export function buildGapRegister(atlas: Atlas): AssetGap[] {
  const face = diagnose(atlas).face
    .filter(r => r.status === 'NOT_FOUND_IN_FIXED_MANIFEST')
    .map<AssetGap>(r => ({
      key: `face-${r.name}`,
      en: r.name,
      group: 'Face',
      status: 'NOT_FOUND_IN_FIXED_MANIFEST',
      evidence: 'W1 name match against the fixed manifest returned 0 concepts. Name-match audit, not exhaustive.',
      policy: 'Not displayed. No substitute mesh.',
    }));
  const fasciaInAtlas = atlas.concepts.some(c => c.name.toLowerCase().includes('thoracolumbar fascia'));
  return [...face, ...(fasciaInAtlas ? [] : FASCIA), MICRO];
}

export function matchGaps(gaps: AssetGap[], query: string) {
  const q = query.normalize('NFKC').toLowerCase().trim();
  if (q.length < 3) return [];
  return gaps.filter(g => g.en.includes(q) || q.includes(g.en));
}
