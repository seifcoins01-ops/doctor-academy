'use client';

import SubjectDetailPage from '@/components/sections/SubjectDetailPage';
import { useLanguageStore } from '@/store/languageStore';

export default function ArabicBiologyPage() {
  const { t } = useLanguageStore();
  return <SubjectDetailPage subjectName={t.sections.biology} trackName="Arabic" trackSlug="arabic" doctorName={t.doctors.drMohamed} />;
}