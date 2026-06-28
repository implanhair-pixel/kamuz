import type { LearningPath } from '@/types';

export const learningPaths: LearningPath[] = [
  {
    id: 'path_everyday',
    titleKey: 'path_everyday_title',
    descKey: 'path_everyday_desc',
    level: 'beginner',
    lessonIds: ['les_greetings', 'les_numbers', 'les_family_basics'],
    color: 'amber',
    icon: 'Sparkles',
  },
  {
    id: 'path_travel',
    titleKey: 'path_travel_title',
    descKey: 'path_travel_desc',
    level: 'intermediate',
    lessonIds: ['les_travel_essentials', 'les_directions'],
    color: 'cyan',
    icon: 'Compass',
  },
  {
    id: 'path_business',
    titleKey: 'path_business_title',
    descKey: 'path_business_desc',
    level: 'advanced',
    lessonIds: ['les_formal_phrases', 'les_meeting_vocab'],
    color: 'rose',
    icon: 'Briefcase',
  },
];

export const pathById = new Map(learningPaths.map((p) => [p.id, p]));
