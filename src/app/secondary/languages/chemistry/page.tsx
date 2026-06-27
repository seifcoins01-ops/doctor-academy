'use client';

import SubjectDetailPage from '@/components/sections/SubjectDetailPage';
import { useLanguageStore } from '@/store/languageStore';

export default function LanguagesChemistryPage() {
  const { t } = useLanguageStore();
  return <SubjectDetailPage subjectName={t.sections.chemistry} trackName="Language Schools" trackSlug="languages" gameType="chemistry" doctorName={t.doctors.drLoaie} />;
}