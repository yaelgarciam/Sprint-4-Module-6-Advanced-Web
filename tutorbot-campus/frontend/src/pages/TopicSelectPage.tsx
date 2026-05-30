import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopicGrid from '../components/TopicGrid';
import LevelSelector from '../components/LevelSelector';
import { fetchTopics, ApiError } from '../api/tutorbot';
import type { Level, Topic } from '../types';

type Props = {
  selectedTopic: string;
  selectedLevel: Level;
  onSelectTopic: (topic: Topic) => void;
  onSelectLevel: (level: Level) => void;
  onStartSession: (topic: Topic) => Promise<void>;
};

export default function TopicSelectPage({
  selectedTopic,
  selectedLevel,
  onSelectTopic,
  onSelectLevel,
  onStartSession,
}: Props) {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [topicError, setTopicError] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadTopics = async () => {
      setIsLoadingTopics(true);
      setTopicError('');

      try {
        const items = await fetchTopics();
        if (!cancelled) {
          setTopics(items);
        }
      } catch (error) {
        if (!cancelled) {
          setTopicError(
            error instanceof Error
              ? error.message
              : 'Unable to load topics right now.'
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingTopics(false);
        }
      }
    };

    void loadTopics();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedTopicData = useMemo(
    () => topics.find((topic) => topic.id === selectedTopic),
    [topics, selectedTopic]
  );

  const handleStart = async () => {
    if (!selectedTopicData) return;

    setIsStarting(true);
    setTopicError('');

    try {
      await onStartSession(selectedTopicData);
      navigate('/chat');
    } catch (error) {
      if (error instanceof ApiError && error.status === 422) {
        setTopicError(
          'This topic is not available for your current learning path.'
        );
      } else {
        setTopicError(
          error instanceof Error
            ? error.message
            : 'Unable to start a tutoring session.'
        );
      }
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-screen pt-[52px] bg-surface">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-2 font-mono text-[11px] text-txt-subtle tracking-wider">
          STEP 1
        </div>
        <h1 className="font-serif font-semibold text-4xl text-txt mb-2">
          Choose a <em className="text-brand-green italic">Topic</em>
        </h1>
        <p className="text-base font-light text-txt-muted mb-8 max-w-md leading-relaxed">
          Pick what you want to learn today. TutorBot will adapt to your level
          and guide you through exercises.
        </p>

        <TopicGrid
          topics={topics}
          selected={selectedTopic}
          onSelect={(topicId) => {
            const topic = topics.find((item) => item.id === topicId);
            if (topic) {
              setTopicError('');
              onSelectTopic(topic);
            }
          }}
          loading={isLoadingTopics}
          error={topicError}
        />

        <div className="mt-10 mb-2 font-mono text-[11px] text-txt-subtle tracking-wider">
          STEP 2
        </div>
        <h2 className="font-serif font-semibold text-2xl text-txt mb-4">
          Select your <em className="text-brand-green italic">Level</em>
        </h2>

        <LevelSelector selected={selectedLevel} onSelect={onSelectLevel} />

        <div className="mt-10 flex justify-end">
          <button
            onClick={handleStart}
            disabled={!selectedTopicData || isStarting}
            className="px-6 py-2.5 rounded-lg bg-brand-green text-[#C0DD97] font-medium text-sm hover:bg-brand-green-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isStarting ? 'Starting…' : 'Start Session →'}
          </button>
        </div>
      </div>
    </div>
  );
}
