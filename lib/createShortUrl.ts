"use server";

import { getCollection, URLS_COLLECTION } from '@/db';
import getAlias from '@/lib/getAlias';
import { UrlProps } from '@/types';

export default async function createShortUrl(
    url: string,
    alias: string,
): Promise<UrlProps> {
    const props = {
        url,
        alias,
    };

    const existing = await getAlias(alias);
    if (existing) {
        throw new Error("This alias already exists");
    }

    const aliasCollection = await getCollection(URLS_COLLECTION);
    const res = await aliasCollection.insertOne(props);

    if (!res.acknowledged) {
        throw new Error("Failed to save to database");
    }

    return props;
}

