import { NextResponse } from "next/server";
import jsdom from "jsdom";
import { getRecent } from "@/crud/blog";
const { JSDOM } = jsdom;

export const dynamic = "auto";
export const revalidate = 1800;

import prisma from "@/lib/prisma";
import { seoUrl } from "@/lib/utils";
let window = new JSDOM().window;

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL;
  if (!baseUrl) {
    throw new Error("NEXTAUTH_URL is not defined in environment variables");
  }

  const encodeUrl = (url: string) => {
    return (url).replace(/'/g, "%27");
  }

  const xmlContent = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">        
        <channel>
            <title>Latest Cyberoni Blogs</title>
            <link>${baseUrl}/blogs/recent</link>
            <atom:link href="${baseUrl}/blogs/rss/latest/feed.xml" rel="self" type="application/rss+xml" />
            <description>Latest Cyberoni Blogs related to web development and AI</description>
        </channel>   
  </rss>`;

  const blogs = await getRecent(1, prisma);

  let parser = new window.DOMParser();
  let xmlDoc = parser.parseFromString(xmlContent, "text/xml");
  let channel = xmlDoc.getElementsByTagName("channel")[0];
  blogs.recent.forEach((blog) => {
    const item = xmlDoc.createElement("item");
    const title = xmlDoc.createElement("title");
    const link = xmlDoc.createElement("link");
    const description = xmlDoc.createElement("description");
    const guid = xmlDoc.createElement("guid");
    const blogUrl = `${baseUrl}/blogs/post/${seoUrl(blog.title, blog.id)}`;

    title.innerHTML = blog.title;
    link.innerHTML = encodeUrl(blogUrl)
    description.innerHTML = blog.description;
    guid.innerHTML = blogUrl

    item.appendChild(title);
    item.appendChild(link);
    item.appendChild(description);
    item.appendChild(guid)

    channel.appendChild(item);
  });

  return new NextResponse(
    new window.XMLSerializer().serializeToString(xmlDoc.documentElement),
    { headers: { "Content-Type": "text/xml" } },
  );
}
