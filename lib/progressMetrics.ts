import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'lingua_progress_metrics_v1';

export type ProgressSnapshot = {
  drillsCompleted: number;
  drillsCorrect: number;
  savedPhraseCount: number;
  streakDays: number;
  lastActiveDate: string | null;
  /** 0–100 demo fluency index */
  fluencyIndex: number;
};

const defaultSnap: ProgressSnapshot = {
  drillsCompleted: 0,
  drillsCorrect: 0,
  savedPhraseCount: 0,
  streakDays: 0,
  lastActiveDate: null,
  fluencyIndex: 12,
};

async function read(): Promise<ProgressSnapshot> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { ...defaultSnap };
    const p = JSON.parse(raw) as Partial<ProgressSnapshot>;
    return { ...defaultSnap, ...p };
  } catch {
    return { ...defaultSnap };
  }
}

async function write(s: ProgressSnapshot): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(s));
}

export async function loadProgressSnapshot(): Promise<ProgressSnapshot> {
  return read();
}

export async function recordDrillResult(correct: boolean): Promise<ProgressSnapshot> {
  const s = await read();
  const next: ProgressSnapshot = {
    ...s,
    drillsCompleted: s.drillsCompleted + 1,
    drillsCorrect: s.drillsCorrect + (correct ? 1 : 0),
    fluencyIndex: Math.min(100, s.fluencyIndex + (correct ? 2 : 0)),
  };
  await write(next);
  return next;
}

export async function syncSavedPhraseCount(count: number): Promise<ProgressSnapshot> {
  const s = await read();
  const next: ProgressSnapshot = {
    ...s,
    savedPhraseCount: count,
    fluencyIndex: Math.min(100, s.fluencyIndex + Math.min(5, Math.floor(count / 10))),
  };
  await write(next);
  return next;
}

/** Call once per day when user opens app / completes activity */
export async function touchStreak(): Promise<ProgressSnapshot> {
  const s = await read();
  const today = new Date().toISOString().slice(0, 10);
  let streak = s.streakDays;
  if (s.lastActiveDate === today) {
    return s;
  }
  if (s.lastActiveDate) {
    const prev = new Date(s.lastActiveDate + 'T12:00:00');
    const diff = (Date.now() - prev.getTime()) / 86400000;
    streak = diff <= 1.5 ? streak + 1 : 1;
  } else {
    streak = 1;
  }
  const next: ProgressSnapshot = {
    ...s,
    streakDays: streak,
    lastActiveDate: today,
    fluencyIndex: Math.min(100, s.fluencyIndex + 1),
  };
  await write(next);
  return next;
}

/** Mock 90-day series for chart (derived from fluency + noise) */
export function build90DaySeries(fluency: number): number[] {
  const out: number[] = [];
  const base = Math.max(5, fluency - 25);
  for (let i = 0; i < 90; i++) {
    const t = i / 89;
    const wave = Math.sin(i * 0.2) * 4;
    out.push(Math.min(100, Math.max(0, base + t * (fluency - base) + wave)));
  }
  return out;
}
