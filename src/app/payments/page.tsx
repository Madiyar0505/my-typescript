'// Платежи беті Bitrix24-тің "Сделки" (deals) арқылы жұмыс істейді.\n'
'// 1. Бұл бет /api/deals API-іне сұраныс жібереді.\n'
'// 2. /api/deals Bitrix24 API-інен барлық мәмілелерді (deals) алады.\n'
'// 3. Әр мәміле — бұл төлем жолы (номер счета, дата, сумма, статус, действие).\n'
'// 4. "Оплатить" басқанда /api/deals/[id]/pay Bitrix24-те статусын "Оплачено" (WON) деп жаңартады.\n'
'// Яғни, барлық төлемдер мен төлемді растау Bitrix24 API арқылы орындалады.\n'
'use client';


import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { BitrixDeal } from '@/lib/bitrix';
import dynamic from 'next/dynamic';

const MuiFilter = dynamic(() => import('@/components/MuiFilter'), { ssr: false });

export default function PaymentsPage() {
  const [deals, setDeals] = useState<BitrixDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
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
    } finally {
      setLoading(false);
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

  const getStatusText = (stageId: string) => {
    switch (stageId) {
      case 'NEW':
        return 'Новая';
      case 'PREPARATION':
        return 'В работе';
      case 'PREPAYMENT_INVOICE':
        return 'Ожидает оплаты';
      case 'EXECUTING':
        return 'Выполняется';
      case 'FINAL_INVOICE':
        return 'Счет выставлен';
      case 'WON':
        return 'Оплачено';
      case 'LOSE':
        return 'Отменена';
      default:
        return 'Неизвестно';
    }
  };

  // ...existing code for filteredDeals, sortedDeals, etc.

  // Place the return statement for the component here (not inside getStatusText)
// ...existing code...

  // Filtering and sorting logic
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

  // Helper functions
  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
  }

  function formatAmount(amount: string | number, _currency: string) {
    // Always show KZT
    return `${Number(amount).toLocaleString('ru-RU')} ₸`;
  }

  function getStatusColor(stageId: string) {
    switch (stageId) {
      case 'WON':
        return 'bg-green-100 text-green-800';
      case 'LOSE':
        return 'bg-red-100 text-red-800';
      case 'PREPAYMENT_INVOICE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function canPay(stageId: string) {
    return stageId !== 'WON' && stageId !== 'LOSE';
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
                    <td className="px-6 py-4 whitespace-nowrap text-base font-normal text-black">{formatAmount(deal.OPPORTUNITY, deal.CURRENCY_ID)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-normal">
                      {deal.STAGE_ID === 'WON' ? (
                        <span className="text-blue-400">Оплачено</span>
                      ) : (
                        <span className="text-gray-500">Не оплачено</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-normal">
                      {deal.STAGE_ID !== 'WON' ? (
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
      </main>
    </div>
  );
}
