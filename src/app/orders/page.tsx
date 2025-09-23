"use client";

import { useState } from "react";
import Header from "@/components/Header";


// Order типі
type Order = {
	id: number;
	status: string;
	details: string;
	date: string;
};

// Мок тапсырыстар деректері (12 тапсырыс)
const orders: Order[] = Array.from({ length: 12 }, (_, i) => ({
	id: i + 1,
	status: "Статус",
	details: `Детали услуги ${i + 1}`,
	date: "Дата заказа",
}));

export default function OrdersPage() {
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

	return (
			<div className="min-h-screen bg-[#f4f6f8]">
				<Header />
			<div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-6 sm:py-10">
				<h1 className="text-3xl sm:text-[56px] font-bold mb-6 sm:mb-10 mt-2 text-black">Заказы</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
					{orders.map((order) => (
						<div
							key={order.id}
							className="bg-white rounded-[8px] border border-[#e5e7eb] p-6 sm:p-7 cursor-pointer transition hover:shadow-md min-h-[210px] flex flex-col justify-between"
							onClick={() => setSelectedOrder(order)}
						>
							<div>
								<div className="flex items-center gap-2 mb-2">
									<span className="h-2 w-2 rounded-full bg-blue-500 inline-block"></span>
									<span className="text-[#222] text-[16px] font-normal">Статус</span>
								</div>
								<div className="text-2xl sm:text-[28px] font-semibold mb-1 text-black">{order.details}</div>
								<div className="text-[#6b7280] text-[16px] mb-6">Дата заказа</div>
							</div>
							<button
								className="w-full border border-blue-500 text-blue-600 py-2 rounded-md font-medium hover:bg-blue-50 transition text-[16px]"
								onClick={e => { e.stopPropagation(); /* Повторить заказ логика */ }}
							>
								Повторить заказ
							</button>
						</div>
					))}
				</div>

				{/* Модал толық ақпарат үшін */}
				{selectedOrder && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
						<div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
							<button
								className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
								onClick={() => setSelectedOrder(null)}
								aria-label="Закрыть"
							>
								×
							</button>
							<h2 className="text-2xl font-bold mb-4">Детали заказа</h2>
							<div className="mb-2"><b>Статус:</b> {selectedOrder.status}</div>
							<div className="mb-2"><b>Детали:</b> {selectedOrder.details}</div>
							<div className="mb-6"><b>Дата заказа:</b> {selectedOrder.date}</div>
							<button
								className="w-full border border-blue-500 text-blue-600 py-2 rounded-md font-medium hover:bg-blue-50 transition"
								onClick={() => {/* Повторить заказ логика */}}
							>
								Повторить заказ
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
