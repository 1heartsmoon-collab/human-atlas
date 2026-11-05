import {useMemo, useState} from 'react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Spinner} from '@/components/ui/spinner';
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group';
import {cn} from '@/lib/utils';
import AnatomyScene from '../scene';
import {DEFAULT_VISIBLE, SYSTEMS, type Atlas, type Concept, type SceneState, type SystemId} from '../anatomy';
import {CanvasToolbar} from './canvas-toolbar';
import {DetailPanel} from './detail-panel';
import {StructurePanel} from './structure-panel';
import {buildGapRegister, matchGaps} from './gap-register';
import {searchAtlas} from './search';
import {strings, type Lang} from './i18n';

const INITIAL: SceneState = {explode: 0, visible: DEFAULT_VISIBLE, selected: [], hidden: [], isolate: false, view: 'three-quarter', rotate: false, reset: 0};
type MobilePane = 'structures' | 'detail' | null;

interface Props {atlas: Atlas | null; loadError: string; onClassic: () => void; onLab: () => void}

export default function KhronosAtlas({atlas, loadError, onClassic, onLab}: Props) {
  const [lang, setLang] = useState<Lang>('ja');
  const [state, setState] = useState<SceneState>(INITIAL);
  const [concept, setConcept] = useState<Concept | null>(null);
  const [query, setQuery] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [mobilePane, setMobilePane] = useState<MobilePane>(null);
  const t = strings(lang);

  const parts = useMemo(() => new Map(atlas?.parts.map(p => [p.id, p])), [atlas]);
  const concepts = useMemo(() => new Map(atlas?.concepts.map(c => [c.id, c])), [atlas]);
  const counts = useMemo(() => Object.fromEntries(SYSTEMS.map(s => [s.id, atlas?.parts.filter(p => p.system === s.id).length ?? 0])), [atlas]);
  const gaps = useMemo(() => (atlas ? buildGapRegister(atlas) : []), [atlas]);
  const results = useMemo(() => (atlas ? searchAtlas(atlas, query) : []), [atlas, query]);
  const matchedGaps = useMemo(() => matchGaps(gaps, query), [gaps, query]);

  const hidden = state.hidden ?? [];
  const visibleCount = atlas?.parts.filter(p => !hidden.includes(p.id) && (state.isolate ? state.selected.includes(p.id) : state.visible.includes(p.system) || state.selected.includes(p.id))).length ?? 0;

  const choose = (c: Concept) => {
    const elements = c.elements.filter(id => parts.has(id));
    setConcept(c);
    setState(s => ({...s, selected: elements, isolate: false, rotate: false, hidden: (s.hidden ?? []).filter(id => !elements.includes(id))}));
    setMobilePane('detail');
  };
  const choosePart = (id: string) => {
    const part = parts.get(id);
    if (!part) return;
    setConcept(concepts.get(part.conceptId) ?? {id: part.conceptId, name: part.name, elements: [id]});
    setState(s => ({...s, selected: [id], isolate: false, rotate: false}));
    setMobilePane('detail');
  };
  const clear = () => {setConcept(null); setState(s => ({...s, selected: [], isolate: false}));};
  const toggleSystem = (id: SystemId) => setState(s => ({...s, isolate: false, visible: s.visible.includes(id) ? s.visible.filter(x => x !== id) : [...s.visible, id]}));
  const toggleMesh = (id: string) => setState(s => {const h = s.hidden ?? []; return {...s, hidden: h.includes(id) ? h.filter(x => x !== id) : [...h, id]};});
  const toggleIsolate = () => setState(s => ({...s, isolate: s.selected.length > 0 && !s.isolate, rotate: false}));
  const reset = () => {setConcept(null); setQuery(''); setMobilePane(null); setState(s => ({...INITIAL, reset: s.reset + 1}));};

  const ready = progress >= 100;
  const failure = loadError || error;

  return (
    <div className="khronos flex h-dvh flex-col bg-background text-foreground">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <h1 className="truncate text-base font-semibold tracking-tight">Khronos Anatomy Atlas</h1>
          <Badge variant="outline" className="hidden sm:inline-flex">W2A · {t.review}</Badge>
        </div>
        <ToggleGroup value={[lang]} onValueChange={v => v[0] && setLang(v[0] as Lang)} aria-label="Language" variant="outline" size="sm">
          <ToggleGroupItem value="ja" className="px-2.5 text-xs">日本語</ToggleGroupItem>
          <ToggleGroupItem value="en" className="px-2.5 text-xs">EN</ToggleGroupItem>
          <ToggleGroupItem value="both" className="px-2.5 text-xs">併記</ToggleGroupItem>
        </ToggleGroup>
        <nav aria-label="Other views" className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" onClick={onClassic}>{t.classic}</Button>
          <Button variant="ghost" size="sm" onClick={onLab} disabled={!atlas}>{t.lab}</Button>
        </nav>
      </header>

      <div className="k-body relative min-h-0 flex-1">
        <aside aria-label={t.structures} className={cn('k-pane k-left flex flex-col border-border bg-card', mobilePane === 'structures' && 'is-open')}>
          {atlas && (
            <StructurePanel atlas={atlas} lang={lang} query={query} onQuery={setQuery} results={results} matchedGaps={matchedGaps}
              gaps={gaps} visible={state.visible} counts={counts} selectedConceptId={concept?.id} onToggleSystem={toggleSystem} onChoose={choose} />
          )}
        </aside>

        <main className="k-canvas relative min-h-0 overflow-hidden">
          {atlas && (
            <AnatomyScene variant="atlas" atlas={atlas} state={state} onSelect={choosePart}
              onProgress={n => {setProgress(n); if (n === 100) setError('');}} onError={setError} />
          )}
          <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1">
            <p className="k-id rounded-md bg-card px-2.5 py-1 text-xs text-muted-foreground" aria-live="polite">
              {ready ? t.visibleCount(visibleCount, atlas?.parts.length ?? 0) : `${t.loading} · ${progress}%`}
            </p>
          </div>
          {progress === 0 && !failure && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
              <Spinner />{t.loading} · {progress}%
            </div>
          )}
          {failure && <p role="alert" className="absolute inset-x-4 top-14 rounded-md bg-card p-3 text-sm text-destructive">{failure}</p>}
          <div className="k-toolbar-wrap absolute inset-x-0 bottom-3 flex justify-center px-3">
            <CanvasToolbar lang={lang} view={state.view} rotate={state.rotate} isolate={state.isolate} canIsolate={state.selected.length > 0}
              hiddenCount={hidden.length} onView={view => setState(s => ({...s, view}))}
              onRotate={() => setState(s => ({...s, rotate: !s.rotate}))} onIsolate={toggleIsolate}
              onShowAll={() => setState(s => ({...s, hidden: []}))} onReset={reset} />
          </div>
        </main>

        <aside aria-label={t.detail} className={cn('k-pane k-right flex flex-col border-border bg-card', mobilePane === 'detail' && 'is-open')}>
          {atlas && (
            <DetailPanel atlas={atlas} lang={lang} concept={concept} parts={parts} state={state}
              onToggleMesh={toggleMesh} onIsolate={toggleIsolate} onClear={clear} />
          )}
        </aside>
      </div>

      <nav aria-label="Panels" className="k-mobile-nav grid shrink-0 grid-cols-3 border-t border-border bg-card">
        {([['structures', t.structures], ['detail', t.detail]] as const).map(([pane, label]) => (
          <button key={pane} type="button" aria-pressed={mobilePane === pane} onClick={() => setMobilePane(p => (p === pane ? null : pane))}
            className="k-nav-btn h-12 text-sm">{label}</button>
        ))}
        <button type="button" onClick={onClassic} className="k-nav-btn h-12 text-sm">{t.classic}</button>
      </nav>
    </div>
  );
}
