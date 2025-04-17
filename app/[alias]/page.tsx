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

        const result = await createShortUrl(url, alias); // this throws if alias exists or db fails

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        const message =
            err instanceof Error ? err.message : 'Internal server error';
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
