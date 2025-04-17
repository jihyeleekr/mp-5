"use server";

import getCollection, {URLS_COLLECTION } from '@/db';
import getAlias from '@/lib/getAlias';
import { UrlProps } from '@/types';

export default async function createShortUrl(
   props: UrlProps
): Promise<string> {
    const {url, alias } = props;

    if (!url || !alias) {
        return "url or alias is missing";
    }

    try{
        const res = await fetch(url);
        if (res.status < 200 ||res.status >=500){
            console.log("invalid url response", res.status);
            return "invalid url";
        }
    } catch {
        return "invalid url response";
    }

    const aliasCheck = await getAlias(alias);
    if (aliasCheck) {
        return "alias already exists";
    }

    const urlsCollection = await getCollection(URLS_COLLECTION);
    const res = await urlsCollection.insertOne({alias, url});

    return res.acknowledged ? "" : "something went wrong";
}

