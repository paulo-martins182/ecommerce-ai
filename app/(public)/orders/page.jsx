"use client";
import PageTitle from "@/components/PageTitle";
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { orderDummyData } from "@/assets/assets";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export default function Orders() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data.orders);
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        fetchOrders();
      } else {
        router.push("/");
      }
    }
  }, [isLoaded, user]);

  if (!isLoaded || isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-[70vh] mx-6">
      {orders.length > 0 ? (
        <div className="my-20 max-w-7xl mx-auto">
          <PageTitle
            heading="My Orders"
            text={`Showing total ${orders.length} orders`}
            linkText={"Go to home"}
          />

          <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
            <thead>
              <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                <th className="text-left">Product</th>
                <th className="text-center">Total Price</th>
                <th className="text-left">Address</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderItem order={order} key={order.id} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
          <h1 className="text-2xl sm:text-4xl font-semibold">
            You have no orders
          </h1>
        </div>
      )}
    </div>
  );
}
