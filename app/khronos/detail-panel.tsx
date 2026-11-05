import {EyeIcon, EyeOffIcon, MousePointerClickIcon, NetworkIcon, XIcon} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from '@/components/ui/empty';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {SYSTEMS, explanation, type Atlas, type Concept, type Part, type SceneState} from '../anatomy';
import {strings, systemLabel, termDisplay, type Lang} from './i18n';

interface Props {
  atlas: Atlas;
  lang: Lang;
  concept: Concept | null;
  parts: Map<string, Part>;
  state: SceneState;
  onToggleMesh: (id: string) => void;
  onIsolate: () => void;
  onClear: () => void;
}

export function DetailPanel({atlas, lang, concept, parts, state, onToggleMesh, onIsolate, onClear}: Props) {
  const t = strings(lang);
  if (!concept) {
    return (
      <Empty className="flex-1">
        <EmptyHeader>
          <EmptyMedia variant="icon"><MousePointerClickIcon /></EmptyMedia>
          <EmptyTitle className="text-sm">{t.empty}</EmptyTitle>
          <EmptyDescription className="text-xs leading-relaxed">{t.emptyBody}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const meshes = concept.elements.map(id => parts.get(id)).filter((p): p is Part => !!p);
  const first = meshes[0];
  const system = SYSTEMS.find(s => s.id === first?.system);
  const term = termDisplay(concept.name, concept.id, lang);
  const hidden = new Set(state.hidden ?? []);
  const hiddenHere = meshes.filter(m => hidden.has(m.id)).length;
  const othersVisible = state.visible.length > 0 && !state.isolate;
  const description = first ? explanation(concept.name, first.system) : '';

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex flex-col gap-3 border-b border-border p-4">
        <div className="flex items-start gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-xs text-muted-foreground">{system ? systemLabel(system.id, system.name, lang) : ''}</p>
            <h2 className="text-lg font-semibold leading-snug text-pretty">{term.primary}</h2>
            {term.secondary && <p className="text-sm text-muted-foreground">{term.secondary}</p>}
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClear} aria-label={t.clear}><XIcon /></Button>
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary">{t.included}</Badge>
          {term.jaStatus === 'unreviewed' && lang !== 'en' && <Badge variant="outline">{t.jaUnreviewed}</Badge>}
        </div>
        <Button onClick={onIsolate} variant={state.isolate ? 'secondary' : 'default'}>
          {state.isolate ? t.isolateOff : t.isolate}
        </Button>
      </header>

      <Tabs defaultValue="detail" className="flex min-h-0 flex-1 flex-col gap-0">
        <TabsList variant="line" className="w-full justify-start border-b border-border px-2">
          <TabsTrigger value="detail">{t.detail}</TabsTrigger>
          <TabsTrigger value="meshes">{t.meshTab} · {meshes.length}</TabsTrigger>
          <TabsTrigger value="relations">{t.relations}</TabsTrigger>
        </TabsList>

        <TabsContent value="detail" className="min-h-0 flex-1 overflow-y-auto">
          <dl className="flex flex-col gap-4 p-4 text-sm">
            <Field label={t.visibility}>
              <p>{state.isolate ? t.isolated : hiddenHere === meshes.length ? t.hiddenByUser : t.visible}</p>
              {hiddenHere > 0 && hiddenHere < meshes.length && <p className="text-muted-foreground">{t.hiddenCount(hiddenHere)}</p>}
              {othersVisible && hiddenHere < meshes.length && <p className="text-xs leading-relaxed text-muted-foreground">{t.occlusion}</p>}
            </Field>
            <Separator />
            <Field label={t.ids}>
              <p className="k-id">FMA concept · {concept.id}</p>
              <p className="k-id">FJ mesh · {meshes.slice(0, 3).map(m => m.id).join(', ')}{meshes.length > 3 ? ` +${meshes.length - 3}` : ''}</p>
              {lang !== 'en' && <p className="text-xs text-muted-foreground">EN · {concept.name}</p>}
            </Field>
            <Separator />
            <Field label={t.source}>
              <p className="text-xs leading-relaxed text-muted-foreground">{atlas.source ?? 'BodyParts3D'} · {atlas.version}</p>
            </Field>
            {description && (
              <>
                <Separator />
                <Field label={t.description}>
                  <p className="leading-relaxed text-muted-foreground" lang="en">{description}</p>
                </Field>
              </>
            )}
          </dl>
        </TabsContent>

        <TabsContent value="meshes" className="min-h-0 flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-1 p-2">
            {meshes.map(m => {
              const off = hidden.has(m.id);
              return (
                <li key={m.id} className="k-row flex items-center gap-2 rounded-md px-3 py-2">
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="k-id text-sm">{m.id}</span>
                    <span className="truncate text-xs text-muted-foreground">{m.name}</span>
                  </span>
                  <Button variant="ghost" size="icon-sm" onClick={() => onToggleMesh(m.id)} aria-pressed={!off}
                    aria-label={`${m.id} ${off ? 'show' : 'hide'}`}>
                    {off ? <EyeOffIcon /> : <EyeIcon />}
                  </Button>
                </li>
              );
            })}
          </ul>
          <p className="px-4 pb-4 text-xs leading-relaxed text-muted-foreground">{t.opacityPending}</p>
        </TabsContent>

        <TabsContent value="relations" className="min-h-0 flex-1 overflow-y-auto">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><NetworkIcon /></EmptyMedia>
              <EmptyTitle className="text-sm">{t.relationsEmpty}</EmptyTitle>
              <EmptyDescription className="text-xs leading-relaxed">{t.relationsBody}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-semibold tracking-wide text-muted-foreground">{label}</dt>
      <dd className="m-0 flex flex-col gap-1">{children}</dd>
    </div>
  );
}
