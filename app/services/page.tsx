import ReviewCarousel from "@/components/ReviewCarousel";
import ServiceCard from "@/components/services/ServiceCard";
import { DisplayServiceDTO, getAll, read } from "@/crud/service";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import Image from "next/image";
import FloatingImageSection from "@/components/shared/floating-long";
export let metadata: Metadata = {
    title: "",
    description: "",
    openGraph: {},
    category: 'blog'
};
async function Services() {
    const service = await read("432e1392-4823-4cc5-8886-d116d11a3e91", prisma) as DisplayServiceDTO
    const services = await getAll(1, 10, prisma);
    metadata.title = service.title as string
    metadata.description = service.previewContent
    metadata.openGraph = {
        type: 'website',
        title: service.title,
        description: service.previewContent,
        images: [service.image?.src as string],
    }
    return (
      <div className="">
        <div className="flex flex-wrap">
          {services.records.map((service, index) => (
            <div key={index} className="p-5 lg:w-1/4">
              <ServiceCard
                id={service.id}
                image={
                  service.image || {
                    src: "https://picsum.photos/200/300?random=1",
                    id: "random",
                    name: "random",
                  }
                }
                previewContent={service.previewContent}
                title={service.title}
              />
            </div>
          ))}
        </div>

        <section className="py-5">
          {service?.ServiceDescription?.map((section, index) => (
            <FloatingImageSection key={index} section={section} />
          ))}
        </section>

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
                image: "/prof1.png",
                name: "Charlie rose",
                position: "Ceo",
              },
              {
                content:
                  "Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut voluptate aute id deserunt nisi.",
                image: "/prof2.png",
                name: "Charlie rose",
                position: "Ceo",
              },
            ]}
          />
        </section>
      </div>
    );
}

export default Services;