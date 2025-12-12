import { Webhook, Workflow, Landmark, AlarmClockCheckIcon, Calendar, Eye } from 'lucide-react'
import React, { useState, useEffect } from "react";
import { fetchWithdrawals, Withdrawal } from "../../api/withdrawals";

const WithdrawHistory = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Withdrawal | null>(null);
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
        fetchWithdrawals()
            .then((res) => {
                if (!mounted) return;
                setWithdrawals(res.withdrawals);
                setLoading(false);
            })
            .catch((err) => {
                if (!mounted) return;
                setError(err.detail || String(err));
                setLoading(false);
            });
        return () => { mounted = false };
    }, []);

    return (
        <div>
            <h1 className='text-3xl dark:text-white font-extrabold'>Withdraw History</h1>

            {/* Top Buttons */}
            <div className='h-20 bg-gray-200 mt-10 pt-2 dark:bg-gray-800 flex'>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Webhook />Pending Withdraw</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Workflow />Automatic Method</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Landmark />Manual Method</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><AlarmClockCheckIcon />Withdraw Schedule</button>
                <button className='bg-sky-700 flex p-5 rounded-xl ml-3 dark:text-white h-15 text-white'><Calendar />Withdraw History</button>
            </div>

            {/* TABLE */}
            <div className='overflow-x-auto'>
                <table className='w-full border-collapse mt-20'>
                    <thead className='bg-purple-50 text-gray-700'>
                        <tr>
                            <th className='py-5 px-4 text-left'>Withdraw ID</th>
                            <th className='py-5 px-4 text-left'>User Name</th>
                            <th className='py-5 px-4 text-left'>User Email</th>
                            <th className='py-5 px-4 text-left'>Bank Name</th>
                            <th className='py-5 px-4 text-left'>Branch Name</th>
                            <th className='py-5 px-4 text-left'>Account Type</th>
                            <th className='py-5 px-4 text-left'>Account Holder</th>
                            <th className='py-5 px-4 text-left'>Account Number</th>
                            <th className='py-5 px-4 text-left'>IFSC Code</th>
                            <th className='py-5 px-4 text-left'>Amount</th>
                            <th className='py-5 px-4 text-left'>Status</th>
                            <th className='py-5 px-4 text-left'>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr><td colSpan={12} className='py-5 px-4'>Loading...</td></tr>
                        ) : error ? (
                            <tr><td colSpan={12} className='py-5 px-4 text-red-600'>Error: {error}</td></tr>
                        ) : (
                            withdrawals.map((item, index) => (
                            <tr key={index} className='border-t hover:bg-gray-50'>
                                <td className='py-5 px-4 dark:text-white'>{item.withdraw_id}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.user_name}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.user_email}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.bank_name}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.branch_name}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.account_type}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.account_holder_name}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.account_number}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.ifsc_code}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.amount}</td>
                                <td className='py-5 px-4 dark:text-white'>
                                    <span className={`px-2 py-1 rounded ${item.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {item.status}
                                    </span>
                                </td>

                                {/* EYE ICON — OPENS MODAL */}
                                <td className='py-5 px-4 text-purple-600 cursor-pointer'>
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white w-[550px] rounded-lg shadow-lg p-6 relative">

            {/* Close Button */}
            <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
                ×
            </button>

            {/* Modal Title */}
            <h2 className="text-xl font-bold mb-6">
                Withdraw Approval Action
            </h2>

            {/* INFO BOXES */}
            <div className="border rounded-lg divide-y">
                <div className="p-3 flex justify-between">
                    <span>Withdraw ID:</span>
                    <span className="font-semibold">{selectedRow?.withdraw_id}</span>
                </div>

                <div className="p-3 flex justify-between">
                    <span>User Name:</span>
                    <span className="font-semibold">{selectedRow?.user_name}</span>
                </div>

                <div className="p-3 flex justify-between">
                    <span>User Email:</span>
                    <span className="font-semibold">{selectedRow?.user_email}</span>
                </div>

                <div className="p-3 flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">{selectedRow?.amount}</span>
                </div>

                <div className="p-3 flex justify-between">
                    <span>Status:</span>
                    <span className="font-semibold">{selectedRow?.status}</span>
                </div>
            </div>

            {/* Bank Details */}
            <div className="border rounded-lg divide-y mt-4">
                <div className="p-3 flex justify-between">
                    <span>Bank Name:</span>
                    <span className="font-semibold">{selectedRow?.bank_name}</span>
                </div>

                <div className="p-3 flex justify-between">
                    <span>Branch Name:</span>
                    <span className="font-semibold">{selectedRow?.branch_name}</span>
                </div>

                <div className="p-3 flex justify-between">
                    <span>Account Type:</span>
                    <span className="font-semibold">{selectedRow?.account_type}</span>
                </div>

                <div className="p-3 flex justify-between">
                    <span>Account Holder:</span>
                    <span className="font-semibold">{selectedRow?.account_holder_name}</span>
                </div>

                <div className="p-3 flex justify-between">
                    <span>Account Number:</span>
                    <span className="font-semibold">{selectedRow?.account_number}</span>
                </div>

                <div className="p-3 flex justify-between">
                    <span>IFSC Code:</span>
                    <span className="font-semibold">{selectedRow?.ifsc_code}</span>
                </div>
            </div>

            {/* Details Message */}
            <label className="block mt-6 mb-2 text-gray-700 font-medium">
                Details Message (Optional)
            </label>

            <textarea
                className="w-full border rounded-lg p-3 h-28 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Details Message"
            ></textarea>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium">
                    ✓ Approve
                </button>

                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium">
                    ✕ Reject
                </button>
            </div>
        </div>
    </div>
)}

        </div>
    );
};

export default WithdrawHistory;
