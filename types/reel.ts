/**
 * Reel catalog schema (local mock, remote JSON, or future CMS).
 */
export type ReelItemData = {
  id: string;
  language: string;
  languageLabel: string;
  title: string;
  /** English topic label (search / admin). */
  topic: string;
  /** Same topic in the reel’s target language (shown in UI when set). */
  topicLocal?: string;
  transcript: string;
  translation: string;
  level: 1 | 2 | 3;
  videoUri: string;
  /** Baseline engagement count (does not include the current user’s like). */
  likeCount: number;
  /** Optional hex for chips / like heart (Instagram-style accents). */
  accentColor?: string;
  /** Optional topic pill tint. */
  topicColor?: string;
  /** Hashtags in the reel’s language (and script) when possible. */
  hashtags?: string[];
  /** Overrides default share body when set. */
  shareMessage?: string;
  /** e.g. lingua_es — shown like @handle */
  authorHandle?: string;
  /** Mock comment count for rail */
  commentCount?: number;
};
