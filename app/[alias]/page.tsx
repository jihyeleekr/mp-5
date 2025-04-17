import getAlias from "@/lib/getAlias";
import {redirect, permanentRedirect} from "next/navigation";

export default async function RedirectPage({params,} : {params: Promise<{alias: string}>}) {
    const {alias} = await params;

    console.log("alias:", alias);

    const url = await getAlias(alias);

    if (url){
        return permanentRedirect(url);
    }
    return redirect("/")
}