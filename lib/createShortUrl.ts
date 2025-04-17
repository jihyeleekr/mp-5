"use server";

import getCollection, { ALIAS_COLLECTION } from "@/db";
import { AliasProps } from "@/types";
import getAlias from "./getAlias";

export default async function createShortUrl(
    url: string,
    alias: string,
): Promise<AliasProps> {
    const p = {
        url: url,
        alias: alias,
    };
    console.log("MONGO_URI:", process.env.MONGO_URI);

    const checkAlias = await getAlias(alias);
    if (checkAlias){
        throw new Error ("Invalid alias: This alias already exists");
    }

    const aliasCollection = await getCollection(ALIAS_COLLECTION);
    const res = await aliasCollection.insertOne({ ...p });

    if (!res.acknowledged) {
        throw new Error("DB insert failed");
    }

    return {...p} ;
}