import type { ExamResult, ExamSummary, GapAlert, Message, StudyRecommendation, StudyResource } from '../types';

export const TOTAL_EXAM_QUESTIONS = 5;
export const QUESTION_HEADER = /^Question (\d+) of (\d+)\n?/i;
export const COMPLETION_MARKER = 'Exam complete:';

function normalizeTopicLabel(topicLabel: string) {
  return topicLabel.trim().toLowerCase();
}

function buildGenericResources(topicLabel: string, topicFocus: string): StudyResource[] {
  const encodedFocus = encodeURIComponent(`${topicLabel} ${topicFocus}`.trim());

  return [
    {
      type: 'docs',
      title: `${topicLabel} official documentation`,
      url: 'https://developer.mozilla.org/',
      description: `Use the docs search to review ${topicFocus || topicLabel} with accurate definitions and examples.`,
    },
    {
      type: 'article',
      title: `Targeted reading for ${topicFocus || topicLabel}`,
      url: `https://www.google.com/search?q=${encodedFocus}`,
      description: 'Read two concise explanations from different sources and compare the examples.',
    },
    {
      type: 'practice',
      title: `Practice exercises for ${topicFocus || topicLabel}`,
      url: `https://www.google.com/search?q=${encodeURIComponent(`${topicFocus || topicLabel} practice exercises`)}`,
      description: 'Solve at least three short exercises and explain each solution in your own words.',
    },
  ];
}

function buildJavascriptResources(topicFocus: string): StudyResource[] {
  const focus = topicFocus.toLowerCase();

  if (focus.includes('callback')) {
    return [
      {
        type: 'docs',
        title: 'MDN JavaScript Guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions',
        description: 'Review function declarations, expressions, and callback usage patterns.',
      },
      {
        type: 'book',
        title: 'Eloquent JavaScript - Functions',
        url: 'https://eloquentjavascript.net/03_functions.html',
        description: 'Read the chapter and rewrite the examples using your own naming and comments.',
      },
      {
        type: 'practice',
        title: 'JavaScript callbacks practice',
        url: 'https://javascript.info/callbacks',
        description: 'Practice async callback flows and identify where callback nesting appears.',
      },
    ];
  }

  if (focus.includes('promise')) {
    return [
      {
        type: 'docs',
        title: 'MDN Using promises',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises',
        description: 'Study chaining, error handling, and the difference between sync and async code.',
      },
      {
        type: 'article',
        title: 'javascript.info Promises',
        url: 'https://javascript.info/promise-basics',
        description: 'Work through the basic promise lifecycle and common mistakes.',
      },
      {
        type: 'practice',
        title: 'Convert callbacks to promises',
        url: 'https://javascript.info/promise-chaining',
        description: 'Take one callback-based example and refactor it to a promise chain.',
      },
    ];
  }

  if (focus.includes('dom')) {
    return [
      {
        type: 'docs',
        title: 'MDN DOM introduction',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction',
        description: 'Review how the browser represents HTML as a tree and how scripts modify it.',
      },
      {
        type: 'article',
        title: 'javascript.info DOM navigation',
        url: 'https://javascript.info/dom-navigation',
        description: 'Practice selecting, traversing, and updating DOM nodes safely.',
      },
      {
        type: 'practice',
        title: 'DOM manipulation mini project',
        url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting',
        description: 'Build a small interactive page that updates elements from user actions.',
      },
    ];
  }

  return [
    {
      type: 'book',
      title: 'You Don\'t Know JS Yet',
      url: 'https://github.com/getify/You-Dont-Know-JS',
      description: 'Read the chapter that matches this weak area and summarize it in your own words.',
    },
    {
      type: 'docs',
      title: 'MDN JavaScript Guide',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      description: 'Use it as the canonical reference for syntax, concepts, and examples.',
    },
    {
      type: 'practice',
      title: 'javascript.info exercises',
      url: 'https://javascript.info/',
      description: 'Study the concept and then solve a short exercise immediately after reading.',
    },
  ];
}

function buildHtmlCssResources(topicFocus: string): StudyResource[] {
  return [
    {
      type: 'docs',
      title: 'MDN HTML and CSS guides',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content',
      description: `Review the core concepts related to ${topicFocus || 'semantic structure and styling'}.`,
    },
    {
      type: 'book',
      title: 'HTML and CSS: Design and Build Websites',
      url: 'https://www.htmlandcssbook.com/',
      description: 'Use the relevant chapter for a more visual explanation and examples.',
    },
    {
      type: 'practice',
      title: 'Frontend Mentor practice',
      url: 'https://www.frontendmentor.io/challenges',
      description: 'Apply the concept in a small layout or responsive component.',
    },
  ];
}

function buildSpringResources(topicFocus: string): StudyResource[] {
  return [
    {
      type: 'docs',
      title: 'Spring Boot Reference',
      url: 'https://docs.spring.io/spring-boot/documentation.html',
      description: `Read the section connected to ${topicFocus || 'the weak backend concept'} and compare it with your answer.`,
    },
    {
      type: 'article',
      title: 'Spring Guides',
      url: 'https://spring.io/guides',
      description: 'Pick one guide that matches this topic and implement it in a small sample project.',
    },
    {
      type: 'practice',
      title: 'Baeldung Spring Boot articles',
      url: 'https://www.baeldung.com/spring-boot',
      description: 'Use one article for theory and then reproduce the code locally.',
    },
  ];
}

function buildResources(topicLabel: string, topicFocus: string): StudyResource[] {
  const normalized = normalizeTopicLabel(topicLabel);

  if (normalized.includes('javascript')) {
    return buildJavascriptResources(topicFocus);
  }

  if (normalized.includes('html') || normalized.includes('css')) {
    return buildHtmlCssResources(topicFocus);
  }

  if (normalized.includes('spring boot')) {
    return buildSpringResources(topicFocus);
  }

  return buildGenericResources(topicLabel, topicFocus);
}

function buildStudyPlan(topicLabel: string, topicFocus: string, priority: StudyRecommendation['priority']) {
  const urgency = priority === 'high'
    ? 'Start with this topic before taking the next exam attempt.'
    : priority === 'medium'
      ? 'Review this topic after the highest-priority gap.'
      : 'Use this as reinforcement once the major gaps are covered.';

  return `${urgency} Read one resource, take notes about ${topicFocus || topicLabel}, and finish with one short practice exercise.`;
}

function enrichRecommendation(topicLabel: string, recommendation: StudyRecommendation): StudyRecommendation {
  const topicFocus = recommendation.title || topicLabel;
  return {
    ...recommendation,
    studyPlan: recommendation.studyPlan || buildStudyPlan(topicLabel, topicFocus, recommendation.priority),
    resources: recommendation.resources?.length ? recommendation.resources : buildResources(topicLabel, topicFocus),
  };
}

export function hydrateStudyRecommendations(
  topicLabel: string,
  recommendations: StudyRecommendation[],
  results: ExamResult[],
  latestGap: GapAlert | null
) {
  if (recommendations.length === 0) {
    return buildStudyRecommendations(topicLabel, results, latestGap);
  }

  return recommendations.map((recommendation) => enrichRecommendation(topicLabel, recommendation));
}

function getTopicFocus(question: string) {
  const normalized = question
    .replace(/^Question \d+ for [^:]+:\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  const [head] = normalized.split(/[?.!]/);
  return (head || normalized).trim();
}

export function parseExamResults(messages: Message[]): ExamResult[] {
  const results: ExamResult[] = [];

  for (let index = 0; index < messages.length; index += 1) {
    const message = messages[index];
    if (message.role !== 'assistant' || message.isError) {
      continue;
    }

    const content = message.content || '';
    const match = content.match(QUESTION_HEADER);
    if (!match || content.startsWith(COMPLETION_MARKER)) {
      continue;
    }

    const userAnswer = messages[index + 1];
    const feedback = messages[index + 2];

    if (!userAnswer || userAnswer.role !== 'user' || !feedback || feedback.role !== 'assistant') {
      continue;
    }

    const question = content.replace(QUESTION_HEADER, '').trim();
    results.push({
      questionNumber: Number(match[1]),
      question,
      answer: userAnswer.content,
      feedback: feedback.content,
      score: feedback.score,
      topicFocus: getTopicFocus(question),
    });
  }

  return results;
}

export function buildExamSummary(
  topicLabel: string,
  scores: number[],
  latestGap: GapAlert | null,
  totalQuestions = TOTAL_EXAM_QUESTIONS
): ExamSummary {
  const answeredQuestions = scores.length;
  const averageScore = answeredQuestions > 0
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / answeredQuestions)
    : 0;

  const performanceLabel = averageScore >= 80
    ? 'Strong performance'
    : averageScore >= 60
      ? 'Solid base with room to improve'
      : 'Needs reinforcement';

  const recommendedFocus = latestGap?.message || `Review the core concepts of ${topicLabel} and retry the mini-exam.`;

  return {
    answeredQuestions,
    totalQuestions,
    averageScore,
    performanceLabel,
    recommendedFocus,
  };
}

export function buildStudyRecommendations(
  topicLabel: string,
  results: ExamResult[],
  latestGap: GapAlert | null
): StudyRecommendation[] {
  const weakResults = [...results]
    .sort((left, right) => (left.score || 0) - (right.score || 0))
    .slice(0, 3);

  const recommendations = weakResults.map((result, index) => ({
    title: result.topicFocus || `Review ${topicLabel}`,
    reason: result.feedback || `Strengthen this area before the next attempt in ${topicLabel}.`,
    priority: (index === 0 ? 'high' : index === 1 ? 'medium' : 'low') as StudyRecommendation['priority'],
    studyPlan: buildStudyPlan(topicLabel, result.topicFocus || topicLabel, index === 0 ? 'high' : index === 1 ? 'medium' : 'low'),
    resources: buildResources(topicLabel, result.topicFocus || topicLabel),
  }));

  if (latestGap?.message) {
    const alreadyCovered = recommendations.some(
      (recommendation) => recommendation.reason === latestGap.message
    );

    if (!alreadyCovered) {
      recommendations.unshift({
        title: `Close the ${topicLabel} gap`,
        reason: latestGap.message,
        priority: 'high',
        studyPlan: buildStudyPlan(topicLabel, topicLabel, 'high'),
        resources: buildResources(topicLabel, topicLabel),
      });
    }
  }

  return recommendations.slice(0, 3).map((recommendation) => enrichRecommendation(topicLabel, recommendation));
}

export function buildExamSnapshot(topicLabel: string, messages: Message[], latestGap: GapAlert | null) {
  const examResults = parseExamResults(messages);
  const scores = examResults
    .map((result) => result.score)
    .filter((score): score is number => typeof score === 'number');

  return {
    examResults,
    examSummary: buildExamSummary(topicLabel, scores, latestGap),
    recommendedTopics: buildStudyRecommendations(topicLabel, examResults, latestGap),
  };
}