import { DisplayBlogDTO, read } from "@/crud/blog";
import React, { ReactEventHandler, Suspense, useRef } from 'react'
import parse from 'html-react-parser';
import Image from "next/image";
import prisma from "@/lib/prisma";
import Link from "next/link";
import CommentForm from "@/components/blogs/CommentForm";
import BlogContainer from "@/components/blogs/BlogContainer";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import BlogContent from "@/components/blogs/BlogContent";
export const dynamic = 'force-dynamic';
export let metadata: Metadata = {
    title: "Blog Post",
    description: "",
    openGraph: {},
    category: 'blog',
    keywords: ['blog']
};
async function BlogPost({ params }: { params: { id: string } }) {
    const blog = await getData(params.id);
    metadata.title = blog.title as string
    metadata.description = blog.description
    metadata.openGraph = {
        type: 'article',
        title: blog.title,
        description: blog.description,
        images: [blog.images.length > 0 ? blog.images[0].src : ""]
    }
    metadata.category = blog.tags.join(" ")
    metadata.keywords = blog.tags?.map(tag => tag.name)


    return (
        <div className="realtive w-full dark:text-white h-full pb-10">
            <div className="w-full ">
                <div className="w-full bg-white dark:bg-gray-900 py-5">
                    <div className="container mx-auto whitespace-pre-line break-words">
                        <div className="m-4  text-4xl lg:text-4xl font-bold">{blog.title}</div>
                        <div className="flex flex-wrap container gap-1 m-4">
                            {blog.tags.map((tag, index) => (<span key={index} className="p-1 px-2">#{tag.name}</span>))}
                        </div>
                        <div className="m-4 font-bold">{blog.description}</div>
                        <div className="m-4">by. {blog.author.firstName} {blog.author.lastName} </div>
                    </div>
                </div>
                <div className="relative mx-auto flex flex-col  items-center lg:py-10  lg:px-10 px-1 py-5 min-h-screen container">
                    <div className="max-w-full flex justify-center items-center">{blog.images[0] ? <Image priority={true} className="object-contain m-2 w-full h-[40vh] rounded-lg" src={blog.images[0].src} alt="Blog_image" width={500} height={300}></Image> : <></>}</div>
                    {<BlogContent content={blog.content} />}
                    <BlogContainer blog={blog} />

                </div>


                <div className="w-full flex flex-col items-center justify-center gap-5">
                    <Link href={`/blogs/author/${blog.author.id}?page=1`} >
                        <div className="w-20 h-20 rounded-full overflow-hidden">
                            {blog.author.image ? <Image src={blog.author.image.src} alt="image" height={50} width={50} />
                                :
                                <div className="w-full h-full bg-orange-500 flex items-center justify-center text-center text-3xl">{blog.author.firstName ? blog.author.firstName[0] : 'A'}</div>
                            }
                        </div>
                    </Link>
                    <div className="text-3xl">
                        {blog.author.firstName}
                    </div>
                </div>
                <CommentForm id={params.id} comments={blog.Comments} />
            </div>
        </div>

    )
}


async function getData(id: string) {
    const blog = await read(id, prisma)
    if (blog) return blog as DisplayBlogDTO
    else redirect('/404')

}

export default BlogPost