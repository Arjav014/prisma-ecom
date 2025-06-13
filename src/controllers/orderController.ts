import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ChangeStatusSchema } from "../schema/orders";

export const createOrder = async (req: Request, res: Response) => {
  return await prismaClient.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId: req.user!.id,
      },
      include: {
        product: true,
      },
    });

    if (cartItems.length == 0) {
      return res.json({ message: "Cart is empty" });
    }

    const price = cartItems.reduce((prev, curr) => {
      return prev + curr.quantity * Number(curr.product.price);
    }, 0);

    const defaultShippingAddressId = req.user?.defaultShippingAddress;
    if (defaultShippingAddressId == null) {
      return res
        .status(400)
        .json({ message: "Default shipping address is not set." });
    }

    const address = await tx.address.findFirst({
      where: {
        id: defaultShippingAddressId,
      },
    });
    if (address == null) {
      return res
        .status(400)
        .json({ message: "Default shipping address does not exist" });
    }

    const order = await tx.order.create({
      data: {
        userId: req.user!.id,
        netAmount: price,
        address: address?.formattedAddress,
        products: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
            };
          }),
        },
      },
    });

    await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        userId: req.user!.id,
      },
    });
    return res.json(order);
  });
};

export const listOrders = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user!.id,
    },
  });
  res.json(orders);
};

export const cancelOrder = async (req: Request, res: Response) => {
  return await prismaClient.$transaction(async (tx) => {
    const order = await tx.order.findFirstOrThrow({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!order) {
      throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
    }

    if (order.userId !== req.user!.id) {
      throw new UnauthorizedException(
        "You are not authorized to access this resource.",
        ErrorCode.UNAUTHORIZED
      );
    }

    const updatedOrder = await tx.order.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        status: "CANCELLED",
      },
    });

    await tx.orderEvent.create({
      data: {
        orderId: order.id,
        status: "CANCELLED",
      },
    });

    res.json(updatedOrder);
  });
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: Number(req.params.id),
      },
      include: {
        products: true,
        events: true,
      },
    });
    res.json(order);
  } catch (error) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};

export const listAllOrders = async (req: Request, res: Response) => {
  let whereClause = {};
  const status = req.query.status;
  if (status) {
    whereClause = {
      status,
    };
  }
  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: Number(req.query.skip) || 0,
    take: 5,
  });
  res.json(orders);
};

export const changeStatus = async (req: Request, res: Response) => {
  return await prismaClient.$transaction(async (tx) => {
    const validatedData = ChangeStatusSchema.parse(req.body);
    const order = await tx.order.findFirstOrThrow({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!order) {
      throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
    }

    const updatedOrder = await tx.order.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        status: validatedData.status,
      },
    });

    await tx.orderEvent.create({
      data: {
        orderId: order.id,
        status: validatedData.status,
      },
    });

    res.json(updatedOrder);
  });
};

export const listUserOrders = async (req: Request, res: Response) => {
  let whereClause: any = {
    userId: Number(req.params.id),
  };
  const status = req.query.status;
  if (status) {
    whereClause = {
      ...whereClause,
      status,
    };
  }
  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: Number(req.query.skip) || 0,
    take: 5,
  });
  res.json(orders);
};
