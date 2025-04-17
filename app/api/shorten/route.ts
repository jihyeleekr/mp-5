import { getCollection, URLS_COLLECTION } from '@/db';
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

        if (!/^[a-zA-Z0-9-_]+$/.test(alias)) {
            return new Response(JSON.stringify({ error: 'Invalid alias format' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const collection = await getCollection(URLS_COLLECTION);
        const exists = await collection.findOne({ alias });

        if (exists) {
            return new Response(JSON.stringify({ error: 'Alias already exists' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await collection.insertOne({ alias, url });

        return new Response(JSON.stringify({ alias, url }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal error';
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });

    }
}
