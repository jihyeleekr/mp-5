import {redirect} from "next/navigation";
import getAlias from "@/lib/getAlias";

export default async function AliasPage({
                                            params,
                                        }: {
    params: Promise<{ alias: string }>;
}) {
    const { alias } = await params;
    console.log(alias);
    if (!alias) {
        return redirect("/");
    }

    const url = await getAlias(alias);
    if (url === null) {
        return redirect("/");
    }

    return redirect(url);
}