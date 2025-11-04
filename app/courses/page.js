export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import CoursesClient from './_CoursesClient';

export default function Page() {
  return <CoursesClient />;
}