"use server";

export default async function checkURL(url: string): Promise<boolean> {
    const pattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;

    try {
        new URL(url);
        return pattern.test(url);
    } catch {
        return false;
    }
}

