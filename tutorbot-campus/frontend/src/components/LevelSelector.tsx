import type { Level } from '../types';

type Props = {
  selected: Level;
  onSelect: (level: Level) => void;
};

const LEVELS: { value: Level; label: string; description: string }[] = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'Just getting started',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'Some experience',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Ready for challenges',
  },
];

export default function LevelSelector({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-3">
      {LEVELS.map((level) => (
        <button
          key={level.value}
          onClick={() => onSelect(level.value)}
          className={`flex-1 px-4 py-3 rounded-xl border text-center transition-all cursor-pointer ${
            selected === level.value
              ? 'border-brand-green bg-brand-green-light'
              : 'border-black/10 bg-white hover:bg-surface-secondary'
          }`}
        >
          <div className="text-sm font-medium text-txt">{level.label}</div>
          <div className="text-xs text-txt-muted mt-0.5">
            {level.description}
          </div>
        </button>
      ))}
    </div>
  );
}
