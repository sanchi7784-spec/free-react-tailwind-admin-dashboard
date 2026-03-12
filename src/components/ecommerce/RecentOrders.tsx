import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { fetchOrders, Order } from "../../api/orders";

const ORDER_STATUS_MAP: Record<number, { label: string; color: "success" | "warning" | "error" | "info" | "primary" | "light" | "dark" }> = {
  0: { label: "Pending", color: "warning" },
  1: { label: "Completed", color: "success" },
  2: { label: "Processing", color: "info" },
  3: { label: "On the Way", color: "primary" },
  4: { label: "Cancelled", color: "error" },
};

const PAYMENT_STATUS_MAP: Record<number, { label: string; color: "success" | "warning" | "error" | "info" | "primary" | "light" | "dark" }> = {
  0: { label: "Pending", color: "warning" },
  1: { label: "Paid", color: "success" },
  2: { label: "Failed", color: "error" },
  3: { label: "Refunded", color: "info" },
  4: { label: "Partial", color: "dark" },
};

const PAYMENT_METHOD_MAP: Record<number, string> = {
  1: "Online",
  2: "COD",
};

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders()
      .then((res) => setOrders(res.data.slice(0, 5)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Orders
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/ecommerce/orders/all"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            See All
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-error-50 px-4 py-3 text-sm text-error-600 dark:bg-error-500/15 dark:text-error-500">
          {error}
        </div>
      )}

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Order ID
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Customer
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Date
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Items
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Total
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Payment
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Order Status
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Payment Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <TableRow>
                <TableCell className="py-8 text-center text-gray-400 text-theme-sm" colSpan={8}>
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 && !error ? (
              <TableRow>
                <TableCell className="py-8 text-center text-gray-400 text-theme-sm" colSpan={8}>
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const orderStatus = ORDER_STATUS_MAP[order.order_status] ?? { label: `Status ${order.order_status}`, color: "light" as const };
                const paymentStatus = PAYMENT_STATUS_MAP[order.payment_status] ?? { label: `Status ${order.payment_status}`, color: "light" as const };
                const paymentMethod = PAYMENT_METHOD_MAP[order.payment_method] ?? `Method ${order.payment_method}`;
                const firstItem = order.items[0];

                return (
                  <TableRow key={order.order_id}>
                    <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90 whitespace-nowrap font-medium">
                      #{order.order_id}
                    </TableCell>
                    <TableCell className="py-3 whitespace-nowrap">
                      <p className="text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                        {order.user_name}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {order.phone}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">
                      {new Date(order.order_date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="py-3 whitespace-nowrap">
                      {firstItem && (
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 dark:border-gray-700">
                            <img
                              src={firstItem.product_image}
                              alt={firstItem.product_name}
                              className="h-9 w-9 object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-gray-800 text-theme-sm dark:text-white/90 max-w-[140px] truncate">
                              {firstItem.product_name}
                            </p>
                            {order.items.length > 1 && (
                              <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                                +{order.items.length - 1} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90 whitespace-nowrap font-medium">
                      ₹{order.total_amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">
                      {paymentMethod}
                    </TableCell>
                    <TableCell className="py-3 whitespace-nowrap">
                      <Badge size="sm" color={orderStatus.color}>
                        {orderStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 whitespace-nowrap">
                      <Badge size="sm" color={paymentStatus.color}>
                        {paymentStatus.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
