'use client';

import SubjectDetailPage from '@/components/sections/SubjectDetailPage';
import { useLanguageStore } from '@/store/languageStore';

export default function LanguagesPhysicsPage() {
  const { t } = useLanguageStore();
  return <SubjectDetailPage subjectName={t.sections.physics} trackName="Language Schools" trackSlug="languages" gameType="physics" doctorName={t.doctors.drLoaie} />;
}