import { useState } from 'react';
import type { QuizBlock } from '../types';

type Props = {
  quiz: QuizBlock;
  onAnswer?: (
    quiz: QuizBlock,
    selectedIndex: number
  ) => Promise<{ correct: boolean; feedback?: string } | void>;
};

export default function QuizCard({ quiz, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = async (index: number) => {
    if (answered || isSubmitting) return;
    setSelected(index);
    setIsSubmitting(true);

    try {
      const result = await onAnswer?.(quiz, index);
      setFeedback(result?.feedback || quiz.explanation);
    } catch {
      setFeedback('TutorBot could not grade this answer right now.');
    } finally {
      setAnswered(true);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-black/10 p-3 max-w-md">
      <div className="text-[11px] font-mono font-medium text-txt-subtle uppercase tracking-wider mb-2">
        Quiz
      </div>
      <div className="text-sm font-medium text-txt mb-3">{quiz.question}</div>
      <div className="flex flex-col gap-1.5">
        {quiz.options.map((opt, i) => {
          let classes =
            'px-3 py-2 rounded-lg border text-[13px] cursor-pointer transition-all ';

          if (!answered) {
            classes +=
              selected === i
                ? 'border-brand-green bg-brand-green-light'
                : 'border-black/10 bg-white hover:bg-surface-secondary';
          } else if (i === quiz.correct) {
            classes +=
              'border-brand-green bg-brand-green-light text-brand-green-dark';
          } else if (i === selected) {
            classes += 'border-red-300 bg-red-50 text-red-700';
          } else {
            classes += 'border-black/10 bg-white opacity-50';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={classes}
              disabled={answered || isSubmitting}
            >
              {opt}
              {answered && i === quiz.correct && ' ✓'}
              {answered && i === selected && i !== quiz.correct && ' ✗'}
            </button>
          );
        })}
      </div>
      {isSubmitting && (
        <div className="mt-3 text-xs text-txt-muted">Submitting answer…</div>
      )}
      {answered && (feedback || quiz.explanation) && (
        <div className="mt-3 text-xs text-txt-muted bg-surface-secondary rounded-lg p-2.5 leading-relaxed">
          {feedback || quiz.explanation}
        </div>
      )}
    </div>
  );
}
