'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { BitrixDeal } from '@/lib/bitrix';

export default function PaymentsPage() {
  const [deals, setDeals] = useState<BitrixDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    search: '',
    status: 'all',
    sortBy: 'date'
  });

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
        // Обновляем список сделок
        fetchDeals();
      } else {
        alert('Ошибка обработки платежа');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Ошибка обработки платежа');
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
        return 'Оплачена';
      case 'LOSE':
        return 'Отменена';
      default:
        return 'Неизвестно';
    }
  };

  const getStatusColor = (stageId: string) => {
    switch (stageId) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'PREPARATION':
      case 'EXECUTING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PREPAYMENT_INVOICE':
        return 'bg-red-100 text-red-800';
      case 'FINAL_INVOICE':
        return 'bg-purple-100 text-purple-800';
      case 'WON':
        return 'bg-green-100 text-green-800';
      case 'LOSE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canPay = (stageId: string) => {
    return !['WON', 'LOSE'].includes(stageId);
  };

  const isPaid = (stageId: string) => {
    return stageId === 'WON';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: string, currency: string) => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency === 'RUB' ? 'RUB' : 'USD',
      minimumFractionDigits: 0
    }).format(numAmount);
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.TITLE.toLowerCase().includes(filter.search.toLowerCase()) ||
                         deal.ID.includes(filter.search);
    
    const matchesStatus = filter.status === 'all' || 
                         (filter.status === 'paid' && isPaid(deal.STAGE_ID)) ||
                         (filter.status === 'unpaid' && !isPaid(deal.STAGE_ID));
    
    return matchesSearch && matchesStatus;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (filter.sortBy) {
      case 'date':
        return new Date(b.DATE_CREATE).getTime() - new Date(a.DATE_CREATE).getTime();
      case 'amount':
        return parseFloat(b.OPPORTUNITY) - parseFloat(a.OPPORTUNITY);
      case 'status':
        return a.STAGE_ID.localeCompare(b.STAGE_ID);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Загрузка платежей...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
  <Header />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Платежи</h1>
          <p className="text-gray-600">Управление сделками и платежами</p>
        </div>

        {/* Фильтры */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Поиск
              </label>
              <input
                type="text"
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Номер счета или название"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <select
                value={filter.status}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Все</option>
                <option value="paid">Оплачены</option>
                <option value="unpaid">Не оплачены</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сортировка
              </label>
              <select
                value={filter.sortBy}
                onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">По дате</option>
                <option value="amount">По сумме</option>
                <option value="status">По статусу</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={fetchDeals}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Обновить
              </button>
            </div>
          </div>
        </div>

        {/* Список сделок */}
        <div className="bg-white rounded-lg shadow overflow-hidden hidden md:block">
          <div className="overflow-x-auto ">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Номер счета
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Название
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сумма
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedDeals.map((deal) => (
                  <tr key={deal.ID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{deal.ID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deal.TITLE}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(deal.DATE_CREATE)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatAmount(deal.OPPORTUNITY, deal.CURRENCY_ID)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(deal.STAGE_ID)}`}>
                        {getStatusText(deal.STAGE_ID)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {canPay(deal.STAGE_ID) ? (
                        <button
                          onClick={() => handlePayment(deal.ID)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors"
                        >
                          Оплатить
                        </button>
                      ) : deal.STAGE_ID === 'WON' ? (
                        <span className="text-green-600">Оплачено</span>
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

        {/* Мобильная версия списка сделок */}
        <div className="md:hidden space-y-4">
          {sortedDeals.map((deal) => (
            <div key={deal.ID} className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div className="font-medium text-gray-900">Счет #{deal.ID}</div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(deal.STAGE_ID)}`}>
                  {getStatusText(deal.STAGE_ID)}
                </span>
              </div>
              <p className="text-sm text-gray-800 mb-3">{deal.TITLE}</p>
              <div className="text-sm text-gray-500 mb-1">Дата: {formatDate(deal.DATE_CREATE)}</div>
              <div className="text-sm font-medium text-gray-900 mb-4">
                Сумма: {formatAmount(deal.OPPORTUNITY, deal.CURRENCY_ID)}
              </div>
              
              {canPay(deal.STAGE_ID) ? (
                <button
                  onClick={() => handlePayment(deal.ID)}
                  className="w-full text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-md transition-colors text-sm font-medium"
                >
                  Оплатить
                </button>
              ) : deal.STAGE_ID === 'WON' ? (
                <div className="w-full text-center text-green-600 bg-green-100 px-3 py-2 rounded-md text-sm font-medium">
                  Оплачено
                </div>
              ) : null}
            </div>
          ))}

          {sortedDeals.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">Сделки не найдены</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
