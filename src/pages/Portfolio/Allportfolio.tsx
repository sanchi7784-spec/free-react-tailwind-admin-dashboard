import { Webhook, Workflow, Landmark, AlarmClockCheckIcon, Calendar, Eye } from 'lucide-react'
import React, { useState, useEffect } from "react";
import { fetchPortfolio, Portfolio } from "../../api/portfolio";

const Allportfolio = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Portfolio | null>(null);
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [livePrice, setLivePrice] = useState<number>(11436.3941);

    const handleOpenModal = (rowData: any) => {
        setSelectedRow(rowData);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchPortfolio({ livePrice })
            .then((res) => {
                if (!mounted) return;
                setPortfolios(res.portfolios);
                setLoading(false);
            })
            .catch((err) => {
                if (!mounted) return;
                setError(err.detail || String(err));
                setLoading(false);
            });
        return () => { mounted = false };
    }, [livePrice]);

    return (
        <div>
            <h1 className='text-3xl dark:text-white font-extrabold'>All Portfolio</h1>

            {/* Live Price Input */}
            <div className='mt-6 flex items-center gap-4'>
                <label className='dark:text-white font-medium'>Live Gold Price:</label>
                <input 
                    type='number' 
                    value={livePrice} 
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || val === null) {
                            setLivePrice(0);
                        } else {
                            const parsed = parseFloat(val);
                            if (!isNaN(parsed)) {
                                setLivePrice(parsed);
                            }
                        }
                    }}
                    className='border dark:border-gray-600 rounded-lg px-4 py-2 w-48 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500'
                    step='0.01'
                    min='0.01'
                />
                <span className='text-sm text-gray-500 dark:text-gray-400'>(Change to refresh data)</span>
            </div>

            {/* Top Buttons */}
            {/* <div className='h-20 bg-gray-200 mt-10 pt-2 dark:bg-gray-800 flex'>
                <button className='bg-sky-700 flex p-5 rounded-xl ml-3 dark:text-white h-15 text-white'><Webhook />Pending Withdraw</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Workflow />Automatic Method</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Landmark />Manual Method</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><AlarmClockCheckIcon />Withdraw Schedule</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Calendar />Withdraw History</button>
            </div> */}

            {/* TABLE */}
            <div className='overflow-x-auto'>
                <table className='w-full border-collapse mt-20'>
                    <thead className='bg-purple-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200'>
                        <tr>
                            <th className='py-5 px-4 text-left'>User ID</th>
                            <th className='py-5 px-4 text-left'>User Name</th>
                            <th className='py-5 px-4 text-left'>User Email</th>
                            <th className='py-5 px-4 text-left'>Invested Amount</th>
                            <th className='py-5 px-4 text-left'>Returns (₹)</th>
                            <th className='py-5 px-4 text-left'>Returns (%)</th>
                            <th className='py-5 px-4 text-left'>Return Flag</th>
                            <th className='py-5 px-4 text-left'>Total Gold (grams)</th>
                            <th className='py-5 px-4 text-left'>Current Value</th>
                            <th className='py-5 px-4 text-left'>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr><td colSpan={10} className='py-5 px-4 dark:text-white'>Loading...</td></tr>
                        ) : error ? (
                            <tr><td colSpan={10} className='py-5 px-4 text-red-600 dark:text-red-400'>Error: {error}</td></tr>
                        ) : (
                            portfolios.map((item, index) => (
                            <tr key={index} className='border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'>
                                <td className='py-5 px-4 dark:text-white'>{item.user_id}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.user_name}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.user_email}</td>
                                <td className='py-5 px-4 dark:text-white'>₹{item.invested_amount}</td>
                                <td className='py-5 px-4 dark:text-white'>₹{item.returns_currency}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.returns_percentage}%</td>
                                <td className='py-5 px-4 dark:text-white'>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        item.return_flag === 'Positive' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                        item.return_flag === 'Negative' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                    }`}>
                                        {item.return_flag}
                                    </span>
                                </td>
                                <td className='py-5 px-4 dark:text-white'>{item.total_gold_grams}g</td>
                                <td className='py-5 px-4 dark:text-white'>₹{item.current_value}</td>

                                {/* EYE ICON — OPENS MODAL */}
                                <td className='py-5 px-4 text-purple-600 dark:text-purple-400 cursor-pointer'>
                                    <Eye onClick={() => handleOpenModal(item)} />
                                </td>
                            </tr>
                        ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
        {isModalOpen && (
    <div className="fixed inset-0 bg-blue bg-opacity-40 dark:bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 w-[550px] rounded-lg shadow-lg p-6 relative">

            {/* Close Button */}
            <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
            >
                ×
            </button>

            {/* Modal Title */}
            <h2 className="text-xl font-bold mb-6 dark:text-white">
                Portfolio Details
            </h2>

            {/* User INFO */}
            <div className="border dark:border-gray-600 rounded-lg divide-y dark:divide-gray-600">
                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>User ID:</span>
                    <span className="font-semibold dark:text-white">{selectedRow?.user_id}</span>
                </div>

                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>User Name:</span>
                    <span className="font-semibold dark:text-white">{selectedRow?.user_name}</span>
                </div>

                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>User Email:</span>
                    <span className="font-semibold dark:text-white">{selectedRow?.user_email}</span>
                </div>
            </div>

            {/* Investment Details */}
            <div className="border dark:border-gray-600 rounded-lg divide-y dark:divide-gray-600 mt-4">
                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>Invested Amount:</span>
                    <span className="font-semibold dark:text-white">₹{selectedRow?.invested_amount}</span>
                </div>

                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>Returns (Currency):</span>
                    <span className="font-semibold dark:text-white">₹{selectedRow?.returns_currency}</span>
                </div>

                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>Returns (Percentage):</span>
                    <span className="font-semibold dark:text-white">{selectedRow?.returns_percentage}%</span>
                </div>

                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>Return Flag:</span>
                    <span className="font-semibold dark:text-white">{selectedRow?.return_flag}</span>
                </div>

                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>Total Gold:</span>
                    <span className="font-semibold dark:text-white">{selectedRow?.total_gold_grams} grams</span>
                </div>

                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>Current Value:</span>
                    <span className="font-semibold dark:text-white">₹{selectedRow?.current_value}</span>
                </div>
            </div>

            {/* Close Button */}
            <div className="flex gap-3 mt-6">
                <button 
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)}

        </div>
    );
};

export default Allportfolio;
