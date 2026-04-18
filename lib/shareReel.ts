import { Platform, Share } from 'react-native';

import type { AppLocale } from '@/constants/appLocale';
import { getUiString } from '@/lib/uiStrings';
import type { ReelItemData } from '@/types/reel';

export async function shareReel(
  item: ReelItemData,
  locale: AppLocale = 'en',
): Promise<void> {
  const tagLine =
    item.hashtags && item.hashtags.length > 0 ? `\n${item.hashtags.join(' ')}` : '';
  const lead = getUiString(locale, 'share.lead');
  const message =
    item.shareMessage ??
    `${lead} ${item.title} (${item.languageLabel})\n${item.transcript}\n— ${item.translation}${tagLine}`;

  if (Platform.OS === 'web') {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
      return;
    }
    return;
  }

  try {
    await Share.share({ message, title: item.title });
  } catch {
    /* user dismissed */
  }
}
