'use client';

import SubjectDetailPage from '@/components/sections/SubjectDetailPage';
import { useLanguageStore } from '@/store/languageStore';

export default function ArabicMathPage() {
  const { t } = useLanguageStore();
  return <SubjectDetailPage subjectName={t.sections.math} trackName="Arabic" trackSlug="arabic" doctorName={t.doctors.drRahma} />;
}