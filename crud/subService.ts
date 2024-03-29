import { PricingModel, PrismaClient, SubService } from "@prisma/client"
import { connectOrCreateObject } from "./tags";
import { CreateImageDTO, CreateTagDTO } from "./DTOs";
import { ImageSchema, TagSchema } from "./jsonSchemas";
export type CreateSubServiceDTO = {
    id?: string;
    title: string;
    pricingModel: PricingModel;
    discounts: Discount[];
    serviceDeliverables: string[];
    serviceUsageScore: number;
    description: string;
    department: string;
    estimated_hours_times_fifty_percent: number;
    estimated_hours_times_one_hundred_percent: number,
    overheadCost: number,
    complexity: number,
    skillLevel: string,
    image?: CreateImageDTO,
    tags?: CreateTagDTO[],
}

export type Discount = {
    name: string;
    value: string;
}

export async function create(newSubService: CreateSubServiceDTO, serviceId: string, prismaClient: PrismaClient) {
    const subServices = prismaClient.subService;
    const newRecord = await subServices.create({
        data: {
            title: newSubService.title,
            complexity: newSubService.complexity,
            department: newSubService.department,
            description: newSubService.description,
            estimated_hours_times_fifty_percent: newSubService.estimated_hours_times_fifty_percent,
            estimated_hours_times_one_hundred_percent: newSubService.estimated_hours_times_one_hundred_percent,
            overheadCost: newSubService.overheadCost,
            pricingModel: newSubService.pricingModel,
            serviceDeliverables: newSubService.serviceDeliverables,
            serviceUsageScore: newSubService.serviceUsageScore,
            skillLevel: newSubService.skillLevel,
            image: { create: newSubService.image },
            tags: { connectOrCreate: connectOrCreateObject(newSubService.tags || []) },
            service: { connect: { id: serviceId } }
        }
    })



    return newRecord;

}

export async function update(subServiceID: string, subService: CreateSubServiceDTO, serviceId: string, prismaClient: PrismaClient) {

    const subServices = prismaClient.subService;
    const newRecord = await subServices.update({
        where: { id: subServiceID },
        data: {
            title: subService.title,
            complexity: subService.complexity,
            department: subService.department,
            description: subService.description,
            estimated_hours_times_fifty_percent: subService.estimated_hours_times_fifty_percent,
            estimated_hours_times_one_hundred_percent: subService.estimated_hours_times_one_hundred_percent,
            overheadCost: subService.overheadCost,
            pricingModel: subService.pricingModel,
            serviceDeliverables: subService.serviceDeliverables,
            serviceUsageScore: subService.serviceUsageScore,
            skillLevel: subService.skillLevel,
            image: { update: subService.image },
            tags: { connectOrCreate: connectOrCreateObject(subService.tags || []) },
            service: { connect: { id: serviceId } }
        }
    })

    return newRecord;
}


