'use client';

import SubjectDetailPage from '@/components/sections/SubjectDetailPage';
import { useLanguageStore } from '@/store/languageStore';

export default function LanguagesBiologyPage() {
  const { t } = useLanguageStore();
  return <SubjectDetailPage subjectName={t.sections.biology} trackName="Language Schools" trackSlug="languages" doctorName={t.doctors.drMohamed} />;
}