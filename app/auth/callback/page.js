export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import AuthCallbackClient from './_AuthCallbackClient';

export default function Page() {
  return <AuthCallbackClient />;
}