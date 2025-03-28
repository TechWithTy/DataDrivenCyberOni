import { addClick } from "@/crud/referral";
import { ReferralType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { sleep } from "@/lib/utils";
import { redirect } from "next/navigation";
import isMobile from "is-mobile";

export default async function Referral({ params }: { params: { prefix: string } }) {
    const updated = await addClick(params.prefix, ReferralType.REDIRECT, prisma);

    try {
        await sleep(2000)
        const res = await fetch(updated.link);
    } catch (error) {
        console.log("redirect error: ", error);
        redirect(updated.fallback);
    }

    if(isMobile() && updated.mobileRedirect){
        redirect(`${updated.mobileRedirect}?${new URLSearchParams(updated.utmProps as Record<string, string>).toString()}`);
    } 
    redirect(`${updated.link}?${new URLSearchParams(updated.utmProps as Record<string, string>).toString()}`)
}