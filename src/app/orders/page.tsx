"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";


type DealCard = {
  id: string;
  title: string;
  stageId: string;
  stageName: string;
  dateCreate: string;
  amount: number;
  currency: string;
};

export default function OrdersPage() {
  const [deals, setDeals] = useState<DealCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [repeatBusyId, setRepeatBusyId] = useState<string | null>(null);

  const loadDeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to load orders');
      setDeals(data.deals || []);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Network error';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const stageBadgeColor = (stageId: string) => {

    if (stageId.includes('WON')) return 'bg-green-500';
    if (stageId.includes('LOSE')) return 'bg-red-500';
    if (stageId.includes('PREPARATION')) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const money = (value: number, currency: string) =>
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: currency || 'KZT', minimumFractionDigits: 0 }).format(value || 0);

  const onRepeat = async (dealId: string) => {
    setRepeatBusyId(dealId);
    try {
      const res = await fetch(`/api/orders/${dealId}/repeat`, { method: 'POST' });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Repeat failed');
      const newDealId = data.newDealId as string;


      const payRes = await fetch(`/api/deals/${newDealId}/pay`, { method: 'POST' });
      const payData = await payRes.json();
      if (!payData.success) throw new Error(payData.message || 'Payment start failed');

    
      await loadDeals();
      alert('Заказ повторен');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Ошибка';
      alert(message);
    } finally {
      setRepeatBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <Header />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <h1 className="text-3xl sm:text-[56px] font-bold mb-6 sm:mb-10 mt-2 text-black">Заказы</h1>

        {loading && <div className="text-gray-600">Загрузка...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {deals.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-[8px] border border-[#e5e7eb] p-6 sm:p-7 transition hover:shadow-md min-h-[210px] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`h-2 w-2 rounded-full inline-block ${stageBadgeColor(order.stageId)}`}></span>
                    <span className="text-[#222] text-[16px] font-normal">{order.stageName || 'Статус'}</span>
                  </div>
                  <div className="text-2xl sm:text-[28px] font-semibold mb-1 text-black">{order.title}</div>
                  <div className="text-[#6b7280] text-[16px] mb-6">{new Date(order.dateCreate).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[#111] font-semibold">{money(order.amount, order.currency)}</div>
                  <button
                    className="border border-blue-500 text-blue-600 py-2 px-4 rounded-md font-medium hover:bg-blue-50 transition text-[16px] disabled:opacity-50"
                    onClick={() => onRepeat(order.id)}
                    disabled={!!repeatBusyId}
                  >
                    {repeatBusyId === order.id ? 'Повтор...' : 'Повторить заказ'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
