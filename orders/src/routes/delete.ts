import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../models/order";
import {
  requireAuth,
  NotAuthorizedError,
  NotFoundError,
} from "@dross-tickets/common";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await Order.findById(id).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    order.save();

    // publish an order:cancelled event
    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
