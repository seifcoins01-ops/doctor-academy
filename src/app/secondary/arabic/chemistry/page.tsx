'use client';

import SubjectDetailPage from '@/components/sections/SubjectDetailPage';
import { useLanguageStore } from '@/store/languageStore';

export default function ArabicChemistryPage() {
  const { t } = useLanguageStore();
  return <SubjectDetailPage subjectName={t.sections.chemistry} trackName="Arabic" trackSlug="arabic" gameType="chemistry" doctorName={t.doctors.drLoaie} />;
}