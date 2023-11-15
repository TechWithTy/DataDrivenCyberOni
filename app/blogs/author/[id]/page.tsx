import React from 'react'
import prisma from "@/lib/prisma"
import { getAuthor, getPopular, getRecent } from "@/crud/blog"
import Image from "next/image"
import Pagination from "@/components/Pagination"
import AuthorCard from "@/components/blogs/AuthorCard"
import { Image as UserImage } from "@prisma/client"
import { redirect } from "next/navigation"
import Link from "next/link"
async function BlogAuthor({ params: { id }, searchParams }: { params: { id: string, page: number }, searchParams: { page: number } }) {
  const { page } = searchParams
  const author = await getAuthor(id, page, prisma);
  const recent = await getRecent(prisma);
  const popular = await getPopular(prisma);

  if (!author?.id) redirect('/404')
  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-4 grid-rows-[repeat(8, minmax(0, 1fr))]">
      <div className="p-5 h-fit row-span-1 lg:col-span-3">
        <AuthorCard author={{
          firstName: author?.firstName as string,
          image: author?.image as UserImage,
          id: author?.id as string,
          lastName: author?.lastName as string
        }} />

      </div>
      <div className="row-span-6 flex flex-col gap-10 p-5">
        <div className="dark:bg-zinc-900 rounded-md shadow-md">
          <div className="p-2 text-center">Recent</div>
          {recent.slice(0, 4).map((blog, index) => {
            return <div key={index} className="p-4">
              <Link href={`/blogs/post/${blog.id}`} className="p-2 my-1" >
                <p className="p-4">{blog.title}</p>
              </Link>
              <div className="line-clamp-2">{blog.description}</div>

            </div>
          })}
        </div>
        <div className="dark:bg-zinc-900 rounded-md shadow-md">
          <div className="p-2 text-center">Popular</div>

          {popular.slice(0, 4).map((blog, index) => {
            return <div key={index} className="p-4 flex justify-center items-center">
              <Image className="p-1 rounded-md aspect-square w-1/3" alt="blog-image" src={blog.images[0]? blog.images[0].src: 'https://picsum.photos/200'} width={50} height={50}></Image>
              <div className="w-2/3">
                <Link href={`/blogs/post/${blog.id}`} className="p-2 my-1" >
                  <p>{blog.title}</p>
                </Link>
                <div className="  line-clamp-2 ">{blog.description}</div>
              </div>

            </div>
          })}
        </div>

      </div>
      <div className=" w-full lg:col-span-3">
        {
          author?.blogs.map((blog, index) => {
            return <div key={index} className={`w-full  p-5  lg:h-[500px]`}>
              <div className="overflow-hidden h-full shadow-lg   dark:bg-gray-700 rounded-lg">
                <div className=" bg-gray-400 h-2/3">
                  <Image
                    className="w-full h-full object-cover"
                    src={blog.images[0] ? blog.images[0].src : 'https://placehold.co/600x400'}
                    alt={blog.title}
                    height={200}
                    width={200} />
                </div>
                <div className="px-6 py-1">
                  <div className="mb-2">by {author.firstName} </div>
                  <div className="mb-2 font-bold text-2xl">{blog.title}</div>
                  <div className="">{blog.subTitle}</div>
                </div>
              </div>
            </div>
          })
        }
        <Pagination currentPage={1} totalPages={10} pathname={`/blogs/author/${id}`} />

      </div>
    </div>
  )
}

export default BlogAuthor