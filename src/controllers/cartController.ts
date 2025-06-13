import { Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Product } from "../generated/prisma";
import { prismaClient } from "..";
import { UnauthorizedException } from "../exceptions/unauthorized";

export const addItemToCart = async (req: Request, res: Response) => {
  const validatedData = CreateCartSchema.parse(req.body);

  const product: Product = await prismaClient.product.findFirstOrThrow({
    where: {
      id: validatedData.productId,
    },
  });

  if (!product) {
    throw new NotFoundException(
      "Product Not Found",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }

  const existingCartItem = await prismaClient.cartItem.findFirst({
    where: {
      userId: req.user!.id,
      productId: validatedData.productId,
    },
  });

  let cartItem;

  if (existingCartItem) {
    cartItem = await prismaClient.cartItem.update({
      where: { id: existingCartItem.id },
      data: {
        quantity: existingCartItem.quantity + validatedData.quantity,
      },
    });
  } else {
    cartItem = await prismaClient.cartItem.create({
      data: {
        userId: req.user!.id,
        productId: product.id,
        quantity: validatedData.quantity,
      },
    });
  }
  res.json({ cartItem });
};

export const deleteItemToCart = async (req: Request, res: Response) => {
  const cartItemId = Number(req.params.id);

  const cartItem = await prismaClient.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!cartItem) {
    throw new NotFoundException(
      "Cart item not found",
      ErrorCode.CART_ITEM_NOT_FOUND
    );
  }

  if (cartItem.userId !== req.user?.id) {
    throw new UnauthorizedException(
      "You are not authorized to delete this item",
      ErrorCode.UNAUTHORIZED
    );
  }

  await prismaClient.cartItem.delete({
    where: {
      id: cartItemId,
    },
  });
  res.json({ message: "CartItem Deleted" });
};

export const changeQuantity = async (req: Request, res: Response) => {
  const cartItemId = Number(req.params.id);

  const cartItem = await prismaClient.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!cartItem) {
    throw new NotFoundException(
      "Cart item not found",
      ErrorCode.CART_ITEM_NOT_FOUND
    );
  }

  if (cartItem.userId !== req.user?.id) {
    throw new UnauthorizedException(
      "You are not authorized to delete this item",
      ErrorCode.UNAUTHORIZED
    );
  }
  const validatedData = ChangeQuantitySchema.parse(req.body);
  const updatedCart = await prismaClient.cartItem.update({
    where: {
      id: cartItemId,
    },
    data: {
      quantity: validatedData.quantity,
    },
  });
  res.json(updatedCart);
};

export const getCart = async (req: Request, res: Response) => {
  const cart = await prismaClient.cartItem.findMany({
    where: {
      userId: req.user!.id,
    },
    include: {
      product: true,
    },
  });
  res.json(cart);
};
