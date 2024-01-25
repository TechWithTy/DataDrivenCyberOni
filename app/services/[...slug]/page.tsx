import ReviewCarousel from "@/components/ReviewCarousel";
import ServiceCard from "@/components/services/ServiceCard";
import { DisplayServiceDTO, getAll, read } from "@/crud/service";
import prisma from "@/lib/prisma";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import FloatingImageSection from "@/components/shared/floating-long";
import Faqs from "@/components/Faqs";
import PayLater from "@/components/shared/Paylater";
import { Image as CaseImage, Image as ServiceImage, SubService } from "@prisma/client";
import Link from "next/link";
import EmailLetter from "@/components/home/EmailLetter";
import SubServiceCarousel from "@/components/services/SubServiceCarousel";
import { LandPlot, Medal, Route, ScanText, Target, TestTubes } from "lucide-react";
import AccordionItem from "@/components/services/AccordianItem";
import ServiceFeatures from "@/components/services/ServiceFeatures";
import { redirect } from "next/navigation";
import { extractUUID, seoUrl } from "@/lib/utils";
type ServiceProps = {
  params: { slug: string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}




export async function generateMetadata({ params, searchParams }: ServiceProps, parent: ResolvingMetadata): Promise<Metadata> {
  // read route params
  const [id, seoTitle] = params.slug
  const service = await read(id, prisma);

  // optionally access and extend (rather than replace) parent metadata
  let metadata: Metadata = {};
  metadata.title = service?.title as string
  metadata.description = service?.previewContent
  metadata.openGraph = {
    type: 'article',
    title: service?.title,
    description: service?.previewContent,
    images: [service?.image ? service.image.src : ""]
  }
  metadata.twitter = {
    title: service?.title,
    images: [service?.image ? service.image.src : ""],
    description: service?.previewContent,

  }
  metadata.category = service?.tags.join(" ")
  metadata.keywords = service?.tags?.map(tag => tag.name)
  if (params.slug[1]) {
    metadata.alternates = {
        canonical: `${process.env.HOST}/services/${id}`
    }
}
  return metadata
}
async function Services({ params }: ServiceProps) {
  const [id, seoTitle] = params.slug
  const service = await read(id, prisma) as DisplayServiceDTO
  const services = await getAll(1, 10, prisma);

  if (!service) redirect('/404');
  //console.log(service);
  return (
    <div className="">
      <div className="flex flex-wrap">
        {services.records.slice(0, 4).map((service, index) => (
          <div key={index} className="p-5 lg:w-1/4 flex-1">
            <ServiceCard
              id={service.id}
              image={service.image as ServiceImage}
              previewContent={service.previewContent}
              title={service.title}
            />
          </div>
        ))}
      </div>

      <section id="description" className="py-5  font-nunito container mx-auto">
        <div className="text-center text-6xl font-bold">{service.title}</div>
        {service.ServiceDescription?.map((section, index) => (
          <FloatingImageSection key={index} section={section} />
        ))}
      </section>

      <section className="my-5 font-nunito"></section>

      <section className="my-5 font-nunito">
        <div className="text-center font-nunito text-4xl font-semibold">
          Feedback from our clients
        </div>
        <div className="text-center text-lg font-light">
          Our WORK speaks louder than our WORD. Find out how we helped clients
          overcome challenges and succeed.
        </div>
        <ReviewCarousel
          reviews={[
            {
              content:
                "Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut voluptate aute id deserunt nisi.",
              image: "/images/prof1.png",
              name: "Charlie rose",
              position: "Ceo",
            },
            {
              content:
                "Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut voluptate aute id deserunt nisi.",
              image: "/images/prof2.png",
              name: "Charlie rose",
              position: "Ceo",
            },
          ]}
        />
      </section>

      {service.SubServices && service.SubServices.length > 0 && (
        <section className="my-5 font-nunito">
          <SubServiceCarousel
            subservices={service.SubServices as SubService[]}
          />
        </section>
      )}
      {service.CaseStudies && service.CaseStudies.length > 0 ? (
        <section className="my-5 font-nunito">
          <div className="text-center text-4xl font-bold">Portfolio</div>

          {service.CaseStudies?.map((caseStudy, index) => (
            <div
              key={index}
              className="container mx-auto my-5 flex flex-wrap gap-2 lg:gap-5"
            >
              <Link
                href={`/casestudy/${caseStudy.id}/${seoUrl(caseStudy.title)}`}
                className="relative w-1/2 flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-2xl lg:w-[170px]"
              >
                <Image
                  className="aspect-square object-fill"
                  height={170}
                  width={170}
                  alt="case image"
                  src={
                    caseStudy.images
                      ? (caseStudy.images as CaseImage[])[0].src
                      : "https://picsum.photos/200"
                  }
                />
                <div className="absolute bottom-0 line-clamp-1 w-full bg-gradient-to-t from-black to-black/0 py-5  text-center text-white">
                  {caseStudy.title}
                </div>
              </Link>
            </div>
          ))}
        </section>
      ) : (
        <></>
      )}
      <section className="my-5 font-nunito">
        <div className="text-center text-4xl font-bold">
          Frequently Asked Questions
        </div>

        <Faqs faqs={faqs} />
      </section>
      <section className="container mx-auto my-10 px-10">
        <EmailLetter></EmailLetter>
      </section>
      <section className="flex items-center justify-center">
        <PayLater value={service.valueBrought as string[]} />
      </section>
    </div>
  );
}

const faqs = [
  {
    question: 'What is React ?',
    answer: 'React is a JavaScript library for building user interfaces.',
  },
  {
    question: 'How to install React ?',
    answer: 'You can install React using npm or yarn.',
  },
  // Add more FAQs as needed
];

const serviceFeatures = [
  {
    title: "Attention to Details",
    content: "Lorem ipsum",
    icon: <Route />
  },
  {
    title: "A Plan for Success",
    content: "You want results. We have found that the best way to get them is with up front research – of your company, competitors, target market and customer psychographics. Only after we fully understand you and your customers, do we recommend a plan of attack.",
    icon: <LandPlot />
  },
  {
    title: "Experts Only",
    content: "Lorem ipsum",
    icon: <TestTubes />
  },
  {
    title: "Meeting Deadlines",
    content: "Lorem ipsum",
    icon: <Target />
  },
  {
    title: "Award-Winning",
    content: "Lorem ipsum",
    icon: <Medal />
  },

]
export default Services;