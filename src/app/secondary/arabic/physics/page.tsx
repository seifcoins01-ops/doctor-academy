'use client';

import SubjectDetailPage from '@/components/sections/SubjectDetailPage';
import { useLanguageStore } from '@/store/languageStore';

export default function ArabicPhysicsPage() {
  const { t } = useLanguageStore();
  return <SubjectDetailPage subjectName={t.sections.physics} trackName="Arabic" trackSlug="arabic" gameType="physics" doctorName={t.doctors.drLoaie} />;
}