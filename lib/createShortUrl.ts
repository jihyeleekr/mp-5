"use server";

import { getCollection, URLS_COLLECTION } from '@/db';
import getAlias from '@/lib/getAlias';
import { UrlProps } from '@/types';

export default async function createShortUrl(
    url:string,
    alias:string,
): Promise<UrlProps> {
    const props = {
        url: url,
        alias: alias,
    }

    const checkUrl = await getAlias(alias);
    if (!checkUrl) {
        throw new Error("This alias already exists");
    }

    const aliasCollection = await getCollection(URLS_COLLECTION);
    const res = await aliasCollection.insertOne({...props});

    if (!res.acknowledged){
        throw new Error("Data insert Error");
    }

    return {...props};
}
