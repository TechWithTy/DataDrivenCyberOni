import {
  Product,
  ProductCartItem,
  ServiceCartItem,
  ServiceCart,
  PrismaClient,
  ServiceCartStatus,
} from "@prisma/client";
import {
  DisplayServiceCartDTO,
  ProductCartItemDTO,
  UpdateServiceCartItemDTO,
} from "./DTOs";
import { CreateServiceCartItemDTO } from "./DTOs";
import { RemoveServiceCartItem } from "./DTOs";
import { HttpError } from "@/lib/utils";

export const getServiceCart = async (userId: string, prisma: PrismaClient) => {
  try {
    // Retrieve the user's service cart and its items
    const serviceCart = await prisma.serviceCart.findFirst({
      where: {
        user: {
          id: userId,
        },
        status: { in: ["EMPTY", "PENDING"] }, // You may customize this based on your requirements
      },
      include: {
        discounts: true,
        items: {
          include: {
            service: {
              include: {
                image: true,
              },
            },

            addons: {
              include: {
                CaseStudies: true,
              },
            },
          },
        },
      },
    });

    if (serviceCart) return serviceCart as DisplayServiceCartDTO;
    else
      return (await prisma.serviceCart.create({
        data: {
          userId,
          status: "EMPTY", // Initial status for a new cart
        },
        include: {
          discounts: true,

          items: {
            include: {
              service: {
                include: {
                  image: true,
                },
              },
              addons: {
                include: {
                  CaseStudies: {
                    include: {
                        service: {
                            include: {
                                image: true
                            }
                        },
                        addons: {
                            include: {
                                CaseStudies: {
                                    include: {
                                        images: true
                                    }
                                }
                                // CaseStudies: true
                            }
                        }
                    },
                  },
                  // CaseStudies: true
                },
              },
            },
          },
        },
      })) as DisplayServiceCartDTO;
  } catch (error) {
    console.error("Error retrieving service cart:", error);
    throw error;
  }
};

export async function create(
  cartItem: ProductCartItemDTO,
  prisma: PrismaClient,
) {
  const cartItems = prisma.productCartItem;
  let createdcartItem = await cartItems.create({ data: cartItem });
  return createdcartItem;
}

export const addServiceCartItem = async (
  input: CreateServiceCartItemDTO,
  prisma: PrismaClient,
) => {
  const { userId, serviceId, addons } = input;

  // Check if a service cart exists for the user
  let serviceCart = await prisma.serviceCart.findFirst({
    where: {
      userId,
      status: { in: ["EMPTY", "PENDING"] }, // You may customize this based on your requirements
    },
  });

  // If no service cart exists, create a new one
  if (!serviceCart) {
    serviceCart = await prisma.serviceCart.create({
      data: {
        userId,
        status: "PENDING", // Initial status for a new cart
      },
    });
  }

  // Add service cart item
  const createdServiceCartItem = await prisma.serviceCartItem.create({
    data: {
      service: {
        connect: {
          id: serviceId,
        },
      },
      addons: { connect: input.addons }, // Assuming addons is a JSON field in your schema
      ServiceCart: {
        connect: {
          id: serviceCart.id,
        },
      },
    },
    include: {
      addons: true,
    },
  });

  return createdServiceCartItem;
};

export const removeServiceCartItem = async (
  input: RemoveServiceCartItem,
  prisma: PrismaClient,
) => {
  const { cartItemId } = input;

  // Remove service cart item
  const removedServiceCartItem = await prisma.serviceCartItem.delete({
    where: {
      id: cartItemId,
    },
    include: {
      addons: true,
    },
  });

  return removedServiceCartItem;
};

async function update(
  cartItemId: string,
  cartItem: ProductCartItemDTO,
  prisma: PrismaClient,
) {
  const cartItems = prisma.productCartItem;
  const item = await cartItems.update({
    where: { id: cartItemId },
    data: cartItem,
  });

  return item;
}

export async function applyServiceDiscount(
  userId: string,
  discounts: string[],
  prisma: PrismaClient,
) {
  const carts = prisma.serviceCart;
  const cart = await carts.findFirst({
    where: {
      user: {
        id: userId,
      },
      status: { in: ["EMPTY", "PENDING"] },
    },
  });

  if (!cart) throw HttpError(403, "Cart not available");
  const updated = await carts.update({
    where: {
      id: cart.id,
    },
    data: {
      discounts: { set: discounts.map((discount) => ({ name: discount })) },
    },
  });

  return updated;
}

async function remove(cartItemId: string, prisma: PrismaClient) {
  const cartItems = prisma.serviceCartItem;
  const existingcartItem = await cartItems.findUnique({
    where: { id: cartItemId },
  });
  if (existingcartItem) {
    await cartItems.delete({ where: { id: cartItemId } });
  }
}
export async function getServiceCartItem(
  cartItemId: string,
  prisma: PrismaClient,
) {
  const cartItems = prisma.serviceCartItem;
  const existingcartItem = await cartItems.findUnique({
    where: { id: cartItemId },
  });
  if (existingcartItem) return existingcartItem;
}

export async function updateServiceCartItem(
  cartItem: UpdateServiceCartItemDTO,
  prisma: PrismaClient,
) {
  const cartItems = prisma.serviceCartItem;
  if (cartItem.addons.length > 0) {
    const existingcartItem = await cartItems.update({
      where: { id: cartItem.cartItemId },
      data: {
        addons: { set: cartItem.addons },
      },
      include: {
        addons: true,
      },
    });
    if (existingcartItem) return existingcartItem;
  } else {
    console.log("removing Item");
    return await removeServiceCartItem(
      { cartItemId: cartItem.cartItemId },
      prisma,
    );
  }
}

export async function updateServiceCartStatus(
  cartId: string,
  status: ServiceCartStatus,
  prisma: PrismaClient,
) {
  const cartItems = prisma.serviceCart;
  const existingcartItem = await cartItems.update({
    where: { id: cartId },
    data: {
      status: status,
    },
  });
  if (existingcartItem) return existingcartItem;
}

export async function getServiceOrder(
  orderId: string,
  userId: string,
  prisma: PrismaClient,
) {
  const cartItems = prisma.serviceCart;
  const existingcartItem = await cartItems.findUnique({
    where: {
      id: orderId,
      user: {
        id: userId,
      },
      status: "PAID",
    },
    include: {
      items: {
        include: {
          service: true,
          addons: true,
        },
      },
    },
  });

  if (existingcartItem) return existingcartItem;
}
