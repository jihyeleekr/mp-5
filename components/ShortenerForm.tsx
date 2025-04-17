import createShortUrl from '@/lib/createShortUrl';
import { UrlProps } from '@/types';

export async function POST(req: Request): Promise<Response> {
    try {
        const { url, alias }: UrlProps = await req.json();

        if (!url || !alias) {
            return new Response(JSON.stringify({ error: 'Missing URL or alias' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const error = await createShortUrl(url, alias);

        if (error) {
            return new Response(JSON.stringify({ error }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ alias, url }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal server error';
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
