import { NextRequest, NextResponse } from "next/server"
import jsdom from 'jsdom'
import { getBlogsByCategory, getRecent } from "@/crud/blog"
const { JSDOM } = jsdom
export const dynamic = 'auto'
export const revalidate = 1800
import prisma from "@/lib/prisma"
import { seoUrl } from "@/lib/utils"
let window = new JSDOM().window
export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
  const baseUrl = process.env.NEXTAUTH_URL;

    const encodeUrl = (url: string) =>{
        return (url).replace(/'/g, "%27");
      }
    const name = params.name.split("-").slice(0, -1).join(" ");
    const id = params.name.split("-").slice(-1)[0];
    const xmlContent = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0"  xmlns:atom="http://www.w3.org/2005/Atom">        
        <channel>
            <title>Latest ${name} Blogs</title>
            <link>${baseUrl}/blogs/category/${params.name}</link>
            <atom:link href="${baseUrl}/blogs/rss/category/${params.name}/feed.xml" rel="self" type="application/rss+xml" />
            <description>Latest ${name} By Cyberoni </description>
        </channel>   
  </rss>`;
    const blogs = await getBlogsByCategory(id,1, prisma)

    let parser = new window.DOMParser();
    let xmlDoc = parser.parseFromString(xmlContent, "text/xml");
    let channel = xmlDoc.getElementsByTagName("channel")[0];

    blogs.list.forEach(blog => {
        const item  = xmlDoc.createElement("item");
        const title = xmlDoc.createElement("title");
        const link = xmlDoc.createElement("link");
        const description = xmlDoc.createElement("description");
        const guid = xmlDoc.createElement("guid");
        title.innerHTML = blog.title
        let blogUrl = `${baseUrl}/blogs/post/${seoUrl(blog.title, blog.id)}`
        link.innerHTML = encodeUrl(blogUrl)
        description.innerHTML = blog.description
        guid.innerHTML = blogUrl
        item.appendChild(title)
        item.appendChild(link)
        item.appendChild(description)
        item.appendChild(guid)
        channel.appendChild(item)
        
    });
    return new NextResponse(new window.XMLSerializer().serializeToString(xmlDoc.documentElement), { headers: { "Content-Type": "text/xml" } });
}

