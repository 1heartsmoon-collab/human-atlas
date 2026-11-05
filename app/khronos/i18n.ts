import type {SystemId} from '../anatomy';

export type Lang = 'ja' | 'en' | 'both';

// Reviewed Japanese anatomical terms, keyed by FMA concept id.
// Intentionally empty: no reviewed terminology source has been supplied (DR-008 / W2A).
// Do not add machine or ad-hoc translations here; unreviewed concepts fall back to the English source name.
export const CONFIRMED_JA_TERMS: Record<string, {ja: string; source: string}> = {};

export interface TermDisplay {primary: string; secondary?: string; jaStatus: 'confirmed' | 'unreviewed'}

const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function termDisplay(name: string, conceptId: string | undefined, lang: Lang): TermDisplay {
  const confirmed = conceptId ? CONFIRMED_JA_TERMS[conceptId] : undefined;
  const en = sentence(name);
  if (!confirmed) return {primary: en, jaStatus: 'unreviewed'};
  if (lang === 'en') return {primary: en, jaStatus: 'confirmed'};
  if (lang === 'ja') return {primary: confirmed.ja, jaStatus: 'confirmed'};
  return {primary: confirmed.ja, secondary: en, jaStatus: 'confirmed'};
}

// UI grouping labels for the app's own system filters (not per-structure anatomical terms).
const SYSTEM_JA: Record<SystemId, string> = {
  skeletal: '骨格', muscular: '筋', arterial: '動脈', venous: '静脈', nervous: '神経',
  digestive: '消化器', respiratory: '呼吸器', urinary: '泌尿器', reproductive: '生殖器',
  lymphatic: 'リンパ', endocrine: '内分泌', integumentary: '外皮', connective: '結合組織',
  sensory: '感覚器', cardiac: '心臓',
};

export function systemLabel(id: SystemId, en: string, lang: Lang) {
  if (lang === 'en') return en;
  if (lang === 'ja') return SYSTEM_JA[id];
  return `${SYSTEM_JA[id]} · ${en}`;
}

const JA = {
  review: '設計審査用プレビュー',
  search: '構造を検索',
  searchHint: '名称・FMA ID・FJ ID で検索（例: psoas / FMA:13405 / FJ1541）',
  systems: '表示系統',
  gaps: '未収録・未検証の構造',
  gapsNote: '固定Human Atlas manifestとの照合結果です。補完モデルは表示しません。',
  results: '検索結果',
  noResults: '固定manifestに該当なし',
  noResultsBody: '名称・ID表記を変えて再検索してください。未収録の可能性があります。',
  meshes: 'メッシュ',
  detail: '詳細',
  relations: '関係',
  meshTab: 'メッシュ',
  empty: '構造を選択',
  emptyBody: '3Dビューをタップするか、左の検索から構造を選択してください。',
  isolate: '分離表示',
  isolateOff: '分離を解除',
  rotate: '自動回転',
  reset: 'リセット',
  showAll: '非表示メッシュを再表示',
  clear: '選択解除',
  classic: '旧UI',
  lab: 'W1 Lab',
  loading: '実メッシュを読み込み中',
  views: {'three-quarter': '斜位', front: '正面', side: '側面', back: '背面'},
  included: '固定manifest収録',
  jaUnreviewed: '和名未確認',
  ids: '識別子',
  source: 'ソース',
  visibility: '表示状態',
  visible: '表示中',
  hiddenByUser: 'ユーザー操作で非表示',
  occlusion: '他の構造で遮られる可能性があります。分離表示で確認できます。',
  isolated: '分離表示中（他の構造は非表示）',
  relationsEmpty: '関係データ未接続',
  relationsBody: '起始・停止・神経支配・血管支配は、根拠付きデータ（RelationEvidence）が接続されるまで表示しません。',
  opacityPending: '透明度：バッチ描画を維持するため本フェーズでは未実装',
  description: '説明（英語・未レビュー）',
  meshCount: (n: number) => `${n} メッシュ`,
  visibleCount: (n: number, total: number) => `表示 ${n} / ${total} メッシュ`,
  hiddenCount: (n: number) => `${n} 件を非表示`,
  structures: '構造',
  display: '表示',
};

type Strings = typeof JA;

const EN: Strings = {
  review: 'Design review preview',
  search: 'Search structures',
  searchHint: 'Name, FMA ID or FJ ID (e.g. psoas / FMA:13405 / FJ1541)',
  systems: 'Systems',
  gaps: 'Not included / unverified',
  gapsNote: 'Checked against the fixed Human Atlas manifest. No substitute models are shown.',
  results: 'Results',
  noResults: 'No match in the fixed manifest',
  noResultsBody: 'Try another name or ID format. The structure may not be included.',
  meshes: 'Meshes',
  detail: 'Detail',
  relations: 'Relations',
  meshTab: 'Meshes',
  empty: 'Select a structure',
  emptyBody: 'Tap the 3D view or search on the left to select a structure.',
  isolate: 'Isolate',
  isolateOff: 'Exit isolate',
  rotate: 'Auto-rotate',
  reset: 'Reset',
  showAll: 'Show hidden meshes',
  clear: 'Clear selection',
  classic: 'Classic UI',
  lab: 'W1 Lab',
  loading: 'Loading real meshes',
  views: {'three-quarter': '3/4', front: 'Front', side: 'Side', back: 'Back'},
  included: 'In fixed manifest',
  jaUnreviewed: 'JA term unreviewed',
  ids: 'Identifiers',
  source: 'Source',
  visibility: 'Visibility',
  visible: 'Visible',
  hiddenByUser: 'Hidden by user',
  occlusion: 'May be occluded by other structures. Use Isolate to check.',
  isolated: 'Isolated (other structures hidden)',
  relationsEmpty: 'Relations not connected',
  relationsBody: 'Origin, insertion, innervation and blood supply stay hidden until evidence-backed RelationEvidence data is connected.',
  opacityPending: 'Opacity: not implemented this phase to keep batched rendering',
  description: 'Description (English, unreviewed)',
  meshCount: (n: number) => `${n} mesh${n === 1 ? '' : 'es'}`,
  visibleCount: (n: number, total: number) => `${n} / ${total} meshes visible`,
  hiddenCount: (n: number) => `${n} hidden`,
  structures: 'Structures',
  display: 'Display',
};

export const strings = (lang: Lang): Strings => (lang === 'en' ? EN : JA);
