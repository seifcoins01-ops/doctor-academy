import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - Doctor Academy',
  description: 'Doctor Academy Admin Dashboard',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}