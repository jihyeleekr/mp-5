export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import getAlias from '@/lib/getAlias';

export default async function RedirectPage({ params }: { params: { alias: string } }) {
    const url = await getAlias(params.alias);

    if (!url) {
        redirect('/');
    }

    redirect(url);
}