'use client';

import SubjectDetailPage from '@/components/sections/SubjectDetailPage';
import { useLanguageStore } from '@/store/languageStore';

export default function LanguagesMathPage() {
  const { t } = useLanguageStore();
  return <SubjectDetailPage subjectName={t.sections.math} trackName="Language Schools" trackSlug="languages" doctorName={t.doctors.drRahma} />;
}