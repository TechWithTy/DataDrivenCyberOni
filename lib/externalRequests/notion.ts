import { Client } from '@notionhq/client';
import { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";

const notionApiKey = process.env.NOTION_KEY;
const notion = new Client({ auth: notionApiKey });

const marketing_crm_contacts_database_id = process.env.NOTION_DATABASE_ID!;


export type NewRecordType = Record<string,
    { type: 'rich_text', rich_text: { text: { content: string }, type: 'text' }[] } |
    { type: 'email', email: string }
>

export interface CreatePageParams {
    email: string,
    name: string,
    company?: string,
    employess?: string,
    requirements?: string[],
    timeline?: string,
    budget?: string,
    phone?: string,
    referral?: string,
    challenges?: string,
    message?: string,
    refToken?: string


}
export async function addToMarketingCrm(record: CreatePageParams) {
    const headers = {
        "Notion-Version": "2021-08-16",
        Authorization: `Bearer ${notionApiKey}`,
        "Content-Type": "application/json",
    };
    const config = {
        headers,
    };
    const properties = {
        "Email Address": { email: record.email },
        "Name": { title: [{ text: { content: record.name } }] },
        "Phone": record.phone ? { phone_number: record.phone } : undefined,
        "Message": record.message ? { rich_text: [{ text: { content: record.message } }] } : undefined,
        "Company": record.company ? { rich_text: [{ text: { content: record.company } }] } : undefined,
        "Referral": record.referral ? { rich_text: [{ text: { content: record.referral } }] } : undefined,
        "Time Line": record.timeline ? { rich_text: [{ text: { content: record.timeline } }] } : undefined,
        "Current Challenges": record.challenges ? { rich_text: [{ text: { content: record.challenges } }] } : undefined,
        "Number of Employees": record.employess ? { number: Number(record.employess) } : undefined,
        "Requirements": record.requirements ? { multi_select: record.requirements?.map(requirement => ({ name: requirement })) } : undefined,
        "ReferralToken": record.refToken ? { rich_text: [{ text: { content: record.refToken } }] } : undefined
    }
    const response = await notion.pages.create({
        parent: {
            database_id: marketing_crm_contacts_database_id as string,
        },
        properties,
    } as CreatePageParameters)
    // console.log("repsonse", respJson);
    return response.object;
}



export async function getDatabase({
    databaseId,
}: {
    databaseId: string;
}): Promise<any> {


    const response = await notion.databases.retrieve({ database_id: databaseId })
    return response
}
