import { Suspense } from 'react';

import TutorLabClient from '@/components/tutor/TutorLabClient';

export const metadata = {
  title: 'Maya tutor (HeyGen + Claude)',
};

export default function TutorLabPage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Language tutor (Maya)</h1>
      <p style={{ color: '#64748b', marginBottom: 24, lineHeight: 1.5 }}>
        HeyGen LiveAvatar + Claude in <code>/api/tutor/respond</code>. Pass{' '}
        <code>?ui=de&amp;study=Spanish</code> from Lingua so explanations follow the app language
        and practice stays in your study language. Voice session uses HeyGen{' '}
        <code>createStartAvatar.language</code> aligned with <code>ui</code>.
      </p>
      <Suspense fallback={<p style={{ color: '#64748b' }}>Loading tutor…</p>}>
        <TutorLabClient />
      </Suspense>
    </main>
  );
}
