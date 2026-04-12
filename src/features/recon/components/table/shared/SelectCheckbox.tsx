import { cn } from '@/lib/utils';

export type CheckboxState = 'none' | 'some' | 'all';
export type CheckboxTint  = 'blue' | 'violet';

interface Props {
  state:    CheckboxState;
  tint?:    CheckboxTint;   // default 'violet'
  visible?: boolean;         // if false, opacity-0 (hover to reveal); default true
}

const TINTS = {
  blue:   { bg: 'bg-blue-500',   border: 'border-blue-500',   partialBg: 'bg-blue-200',   partialBorder: 'border-blue-300',   dot: 'bg-blue-500'   },
  violet: { bg: 'bg-violet-500', border: 'border-violet-500', partialBg: 'bg-violet-200', partialBorder: 'border-violet-300', dot: 'bg-violet-500' },
} as const;

export function SelectCheckbox({ state, tint = 'violet', visible = true }: Props) {
  const t = TINTS[tint];
  return (
    <div className={cn(
      'w-3.5 h-3.5 rounded flex items-center justify-center border transition-all',
      state === 'all'  ? `${t.bg} ${t.border} opacity-100` :
      state === 'some' ? `${t.partialBg} ${t.partialBorder} opacity-100` :
                         `border-neutral-300 bg-white ${visible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} hover:border-neutral-400`,
    )}>
      {state === 'all' && (
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
          <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {state === 'some' && <div className={cn('w-1.5 h-0.5 rounded-full', t.dot)} />}
    </div>
  );
}
