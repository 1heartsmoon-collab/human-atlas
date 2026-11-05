import {SearchIcon, CircleSlashIcon} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Switch} from '@/components/ui/switch';
import {Empty, EmptyDescription, EmptyHeader, EmptyTitle} from '@/components/ui/empty';
import {InputGroup, InputGroupAddon, InputGroupInput} from '@/components/ui/input-group';
import {SYSTEMS, type Atlas, type Concept, type SystemId} from '../anatomy';
import {strings, systemLabel, termDisplay, type Lang} from './i18n';
import type {AssetGap} from './gap-register';

interface Props {
  atlas: Atlas;
  lang: Lang;
  query: string;
  onQuery: (q: string) => void;
  results: Concept[];
  matchedGaps: AssetGap[];
  gaps: AssetGap[];
  visible: SystemId[];
  counts: Record<string, number>;
  selectedConceptId?: string;
  onToggleSystem: (id: SystemId) => void;
  onChoose: (c: Concept) => void;
}

export function StructurePanel({atlas, lang, query, onQuery, results, matchedGaps, gaps, visible, counts, selectedConceptId, onToggleSystem, onChoose}: Props) {
  const t = strings(lang);
  const systemOf = (c: Concept) => atlas.parts.find(p => p.id === c.elements[0])?.system;
  const searching = query.trim().length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-col gap-2 border-b border-border p-4">
        <label htmlFor="k-search" className="text-xs font-semibold tracking-wide text-muted-foreground">{t.search}</label>
        <InputGroup>
          <InputGroupAddon><SearchIcon aria-hidden /></InputGroupAddon>
          <InputGroupInput id="k-search" value={query} onChange={e => onQuery(e.target.value)} placeholder="psoas, FMA:13405, FJ1541" autoComplete="off" spellCheck={false} />
        </InputGroup>
        <p className="text-xs leading-relaxed text-muted-foreground">{t.searchHint}</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {searching ? (
          <section aria-label={t.results} className="flex flex-col gap-1 p-2">
            <p className="px-2 py-1 text-xs text-muted-foreground" aria-live="polite">{t.results} · {results.length}</p>
            {results.map(c => {
              const term = termDisplay(c.name, c.id, lang), system = SYSTEMS.find(s => s.id === systemOf(c));
              const active = c.id === selectedConceptId;
              return (
                <button key={c.id} type="button" onClick={() => onChoose(c)} aria-current={active || undefined}
                  className="k-row flex flex-col items-start gap-1 rounded-md px-3 py-2 text-left">
                  <span className="flex w-full items-center gap-2">
                    <span aria-hidden className="size-2 shrink-0 rounded-full" style={{background: system?.color}} />
                    <span className="truncate text-sm">{term.primary}</span>
                  </span>
                  <span className="k-id pl-4 text-xs text-muted-foreground">{c.id} · {t.meshCount(c.elements.length)}</span>
                </button>
              );
            })}
            {matchedGaps.map(g => <GapRow key={g.key} gap={g} />)}
            {results.length === 0 && matchedGaps.length === 0 && (
              <Empty className="py-8">
                <EmptyHeader>
                  <EmptyTitle className="text-sm">{t.noResults}</EmptyTitle>
                  <EmptyDescription className="text-xs">{t.noResultsBody}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </section>
        ) : (
          <>
            <section aria-labelledby="k-systems" className="flex flex-col gap-1 p-2">
              <h2 id="k-systems" className="px-2 py-1 text-xs font-semibold tracking-wide text-muted-foreground">{t.systems}</h2>
              {SYSTEMS.filter(s => counts[s.id] > 0).map(s => (
                <label key={s.id} className="k-row flex items-center gap-3 rounded-md px-3 py-2">
                  <span aria-hidden className="size-2 shrink-0 rounded-full" style={{background: s.color}} />
                  <span className="flex-1 truncate text-sm">{systemLabel(s.id, s.name, lang)}</span>
                  <span className="k-id text-xs text-muted-foreground">{counts[s.id]}</span>
                  <Switch checked={visible.includes(s.id)} onCheckedChange={() => onToggleSystem(s.id)} aria-label={systemLabel(s.id, s.name, lang)} />
                </label>
              ))}
            </section>
            <section aria-labelledby="k-gaps" className="flex flex-col gap-1 border-t border-border p-2">
              <h2 id="k-gaps" className="px-2 pt-2 text-xs font-semibold tracking-wide text-muted-foreground">{t.gaps} · {gaps.length}</h2>
              <p className="px-2 pb-1 text-xs leading-relaxed text-muted-foreground">{t.gapsNote}</p>
              {gaps.map(g => <GapRow key={g.key} gap={g} />)}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function GapRow({gap}: {gap: AssetGap}) {
  return (
    <div className="flex flex-col gap-1 rounded-md px-3 py-2 opacity-80">
      <span className="flex items-center gap-2">
        <CircleSlashIcon aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate text-sm capitalize">{gap.en}</span>
      </span>
      <span className="flex flex-wrap items-center gap-1 pl-5">
        <Badge variant="outline" className="k-id">{gap.status}</Badge>
        <span className="text-xs text-muted-foreground">{gap.group}</span>
      </span>
    </div>
  );
}
