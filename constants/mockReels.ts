/**
 * Sample reels for “comprehensible input” style learning:
 * short clips + target language line + optional translation.
 * Replace URIs with your CDN or uploaded assets.
 */

export type ReelItemData = {
  id: string;
  /** ISO language tag for the clip */
  language: string;
  languageLabel: string;
  title: string;
  /** Short hook shown at the top */
  topic: string;
  /** What’s being said (target language) */
  transcript: string;
  /** Helper line in the learner’s language */
  translation: string;
  /** Progressive difficulty 1–3 */
  level: 1 | 2 | 3;
  videoUri: string;
};

/** Free HTTPS samples (replace in production). */
export const MOCK_REELS: ReelItemData[] = [
  {
    id: '1',
    language: 'es',
    languageLabel: 'Spanish',
    title: 'Café mañanero',
    topic: 'Daily life',
    transcript: '¿Te apetece un café con leche o prefieres solo?',
    translation: 'Do you feel like a coffee with milk, or do you prefer it black?',
    level: 1,
    videoUri:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: '2',
    language: 'es',
    languageLabel: 'Spanish',
    title: 'En el mercado',
    topic: 'Food & shopping',
    transcript: 'Estas fresas están muy dulces, son de temporada.',
    translation: 'These strawberries are very sweet; they’re in season.',
    level: 2,
    videoUri:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  {
    id: '3',
    language: 'es',
    languageLabel: 'Spanish',
    title: 'Metro',
    topic: 'Travel',
    transcript: 'El próximo tren sale en dos minutos, por favor apartaos del borde.',
    translation: 'The next train leaves in two minutes—please stand back from the edge.',
    level: 2,
    videoUri:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
  {
    id: '4',
    language: 'es',
    languageLabel: 'Spanish',
    title: 'Amigos',
    topic: 'Conversation',
    transcript: 'Cuando vuelvas de tu viaje, cenamos juntos y me cuentas todo.',
    translation: 'When you get back from your trip, we’ll have dinner and you tell me everything.',
    level: 3,
    videoUri:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  },
];
