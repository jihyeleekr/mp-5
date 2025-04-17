import { NextRequest } from 'next/server';
import createShortUrl from '@/lib/createShortUrl';

export async function POST(req: NextRequest) {
    try {
        const { url, alias } = await req.json();

        if (!url || !alias) {
            return new Response(JSON.stringify({ error: 'Missing URL or alias' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const result = await createShortUrl(url, alias);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch  {
        return new Response(JSON.stringify( 'Internal error' ), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
