"use server";
import {getCollection, URLS_COLLECTION } from "@/db";

export default async function getAlias(alias: string): Promise<string | null> {

    if (!alias) {
        return null;
    }

    const collection = await getCollection(URLS_COLLECTION);
    const data = await collection.findOne({ alias });

    if (!data) {
        return null;
    }


    return data.url;
}
