import React from 'react'
import BlogListLoader from "../loading"
import { getEssential, getFeatured, getPopular, getRecent, getSimilar } from "@/crud/blog";
import { get } from "http";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { seoUrl } from "@/lib/utils";
import { DisplayBlogDTO } from "@/crud/DTOs";
import GridBlogCard from "@/components/blogs/GridBlogCard";
import { IdealBankElement } from "@stripe/react-stripe-js";
import Pagination from "@/components/Pagination";
import CopyButton from "@/components/CopyButton";
import { Rss } from "lucide-react";

async function BlogList({ params, searchParams }: { params: { list: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
    let { id } = searchParams
    let page = searchParams.page && Number(searchParams.page) !== 0 ? Number(searchParams.page) : 1;
    const data = await getData(params.list, page, id as string);

    return (
        <div className="px-5 lg:px-16">
            <div className="container mx-auto ">
                <div className="mx-10 text-3xl my-5 capitalize">
                    {params.list}
                    {params.list=='new' && <CopyButton icon={<Rss />} text={`${process.env.NEXTAUTH_URL}/blogs/rss/latest/feed.xml`} />}
                </div>
                <div className="mx-10 w-1/2">
                    {listData[params.list]}
                </div>
            </div>
            <div className="w-full ">
                <div className="container mx-auto ">
                    <div className="conatiner mx-10 my-10 flex flex-wrap">
                        {data.list.map((blog, index) => {
                            return (
                                <div key={index} className={`w-full lg:w-1/2 p-5  lg:h-[25em] h-fit`}>
                                    <GridBlogCard blog={blog} />
                                </div>
                            )
                        })}
                    </div>

                    <Pagination currentPage={page} pathname={`/blogs/${params.list}`} totalPages={data.totalPages > 5 ? 5 : data.totalPages} query={searchParams} />

                </div>
            </div>
        </div>
    )
}

async function getData(list: string, page: number, id?: string) {
    if (list == 'new') {
        const { recent, totalPages } = await getRecent(page, prisma)
        return { list: recent as DisplayBlogDTO[], totalPages }
    }

    if (list === 'popular') {
        const { popular, totalPages } = await getPopular(page, prisma)
        return { list: popular as DisplayBlogDTO[], totalPages }

    }

    if (list === 'essential') {
        const { essential, totalPages } = await getEssential(page, prisma)
        return { list: essential as DisplayBlogDTO[], totalPages }
    }

    if (list === 'similar') {
        if (!id) redirect('/404')
        const { similar, totalPages } = (await getSimilar(id!, page, prisma))!
        return { list: similar as DisplayBlogDTO[], totalPages }
    }

    else redirect('/blogs')



}

const listData: { [key: string]: string } = {
    new: 'Our latest web design tips, tricks, insights, and resources, hot off the presses.',
    essential: 'essential description',
    popular: 'Popular description',
    similar: 'Blogs you might like'
}


export default BlogList