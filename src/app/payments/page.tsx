'use client';


import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { BitrixDeal } from '@/lib/bitrix';


export default function PaymentsPage() {
  const [deals, setDeals] = useState<BitrixDeal[]>([]);
    const [filter] = useState({
    search: '',
    status: 'all',
    sortBy: 'date'
  });
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals');
      const data = await response.json();
      
      if (data.success) {
        setDeals(data.deals);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    }
  };

  const handlePayment = async (dealId: string) => {
    try {
      const response = await fetch(`/api/deals/${dealId}/pay`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: 'Оплата прошла успешно!' });
        fetchDeals();
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Ошибка обработки платежа' });
      }
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Ошибка обработки платежа' });
      console.error('Error processing payment:', error);
    } finally {
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  
  
  const filteredDeals = deals.filter((deal) => {
    const searchMatch =
      deal.ID.toString().includes(filter.search) ||
      deal.TITLE.toLowerCase().includes(filter.search.toLowerCase());
    const statusMatch = filter.status === 'all' || deal.STAGE_ID === filter.status;
    return searchMatch && statusMatch;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (filter.sortBy === 'date') {
      return new Date(b.DATE_CREATE).getTime() - new Date(a.DATE_CREATE).getTime();
    } else if (filter.sortBy === 'amount') {
      return Number(b.OPPORTUNITY) - Number(a.OPPORTUNITY);
    } else if (filter.sortBy === 'status') {
      return a.STAGE_ID.localeCompare(b.STAGE_ID);
    }
    return 0;
  });


  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
  }

  function formatAmount(amount: string | number) {
    
    return `${Number(amount).toLocaleString('ru-RU')} ₸`;
  }

  
  
  const paidStages = new Set(['PREPARATION', 'PREPAYMENT_INVOICE', 'EXECUTING', 'FINAL_INVOICE', 'WON']);
  function isPaid(stageId: string) {
    return paidStages.has(stageId);
  }

  function canPay(stageId: string) {
    return !isPaid(stageId) && stageId !== 'LOSE';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-0 px-0">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mt-0 mb-8">Платежи</h1>
        </div>

        {/* Хабарлама */}
        {statusMessage && (
          <div
            className={`mb-4 px-4 py-3 rounded text-center font-medium ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Список сделок */}
        <div className="bg-gray-50 overflow-hidden hidden md:block">
          <div className="overflow-x-auto ">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-base font-medium text-blue-600">Номер счета</th>
                  <th className="px-6 py-3 text-left text-base font-medium text-blue-600">Дата</th>
                  <th className="px-6 py-3 text-left text-base font-medium text-blue-600">Сумма</th>
                  <th className="px-6 py-3 text-left text-base font-medium text-blue-600">Статус</th>
                  <th className="px-6 py-3 text-left text-base font-medium text-blue-600">Действие</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {sortedDeals.map((deal) => (
                  <tr key={deal.ID} className="border-b border-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-base font-normal text-black">{deal.ID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-normal text-black">{formatDate(deal.DATE_CREATE)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-normal text-black">{formatAmount(deal.OPPORTUNITY)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-normal">
                      {isPaid(deal.STAGE_ID) ? (
                        <span className="text-blue-400">Оплачено</span>
                      ) : (
                        <span className="text-gray-500">Не оплачено</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-normal">
                      {canPay(deal.STAGE_ID) ? (
                        <button
                          onClick={() => handlePayment(deal.ID)}
                          className="bg-black text-white px-5 py-1.5 rounded transition-colors hover:bg-gray-800"
                        >
                          Оплатить
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedDeals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Сделки не найдены</p>
            </div>
          )}
        </div>

        {/* Mobile list */}
        <div className="md:hidden space-y-3">
          {sortedDeals.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Сделки не найдены</p>
            </div>
          )}

          {sortedDeals.map((deal) => (
            <div key={deal.ID} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500">Номер счета</div>
                <div className="text-base font-medium text-black">{deal.ID}</div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500">Дата</div>
                <div className="text-base text-black">{formatDate(deal.DATE_CREATE)}</div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500">Сумма</div>
                <div className="text-base text-black">{formatAmount(deal.OPPORTUNITY)}</div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">Статус</div>
                <div className="text-base">
                  {isPaid(deal.STAGE_ID) ? (
                    <span className="text-blue-500">Оплачено</span>
                  ) : (
                    <span className="text-gray-500">Не оплачено</span>
                  )}
                </div>
              </div>
              {canPay(deal.STAGE_ID) && (
                <button
                  onClick={() => handlePayment(deal.ID)}
                  className="w-full bg-black text-white py-2 rounded-md active:opacity-90"
                >
                  Оплатить
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
