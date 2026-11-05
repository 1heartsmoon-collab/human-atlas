import {EyeIcon, FocusIcon, RefreshCcwIcon, Rotate3dIcon} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group';
import type {View} from '../anatomy';
import {strings, type Lang} from './i18n';

const VIEWS: View[] = ['three-quarter', 'front', 'side', 'back'];

interface Props {
  lang: Lang;
  view: View;
  rotate: boolean;
  isolate: boolean;
  canIsolate: boolean;
  hiddenCount: number;
  onView: (v: View) => void;
  onRotate: () => void;
  onIsolate: () => void;
  onShowAll: () => void;
  onReset: () => void;
}

export function CanvasToolbar({lang, view, rotate, isolate, canIsolate, hiddenCount, onView, onRotate, onIsolate, onShowAll, onReset}: Props) {
  const t = strings(lang);
  return (
    <div role="toolbar" aria-label="3D view" className="k-toolbar flex items-center gap-1 rounded-lg border border-border bg-card p-1">
      <ToggleGroup value={[view]} onValueChange={v => v[0] && onView(v[0] as View)} aria-label="Camera">
        {VIEWS.map(v => <ToggleGroupItem key={v} value={v} size="sm" className="px-2.5 text-xs">{t.views[v]}</ToggleGroupItem>)}
      </ToggleGroup>
      <span aria-hidden className="mx-1 h-5 w-px bg-border" />
      <Button variant={rotate ? 'secondary' : 'ghost'} size="icon-sm" aria-pressed={rotate} aria-label={t.rotate} title={t.rotate} onClick={onRotate}><Rotate3dIcon /></Button>
      <Button variant={isolate ? 'secondary' : 'ghost'} size="icon-sm" aria-pressed={isolate} aria-label={isolate ? t.isolateOff : t.isolate} title={isolate ? t.isolateOff : t.isolate} disabled={!canIsolate} onClick={onIsolate}><FocusIcon /></Button>
      {hiddenCount > 0 && (
        <Button variant="ghost" size="sm" onClick={onShowAll} aria-label={t.showAll} title={t.showAll}>
          <EyeIcon data-icon="inline-start" />{hiddenCount}
        </Button>
      )}
      <Button variant="ghost" size="icon-sm" aria-label={t.reset} title={t.reset} onClick={onReset}><RefreshCcwIcon /></Button>
    </div>
  );
}
