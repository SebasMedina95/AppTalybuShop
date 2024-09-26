import { OrderStatus } from '@prisma/client';

export const OrderStatusList = [
    OrderStatus.PENDIENTE,
    OrderStatus.ENTREGADA,
    OrderStatus.SOLICITADA,
    OrderStatus.CANCELADA,
]
