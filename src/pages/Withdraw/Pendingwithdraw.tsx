import { Webhook, Workflow, Landmark, AlarmClockCheckIcon, Calendar, Eye } from 'lucide-react'
import React, { useState } from "react";

const Pendingwithdraw = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const handleOpenModal = (rowData: any) => {
        setSelectedRow(rowData);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    const data = [
        { Date: "11-02-2022", User: "ChrisBrandon8046", Transactionid: "TRXBDQYAGGGHE", Amount: "-80.8 USD", Charge: "0.8 USD", Gateway: "Mbank-wid", Status: "Pending" },
        { Date: "11-02-2022", User: "ChrisBrandon8046", Transactionid: "TRXBDQYAGGGHE", Amount: "-80.8 USD", Charge: "0.8 USD", Gateway: "Mbank-wid", Status: "Pending" },
        { Date: "11-02-2022", User: "ChrisBrandon8046", Transactionid: "TRXBDQYAGGGHE", Amount: "-80.8 USD", Charge: "0.8 USD", Gateway: "Mbank-wid", Status: "Pending" },
        { Date: "11-02-2022", User: "ChrisBrandon8046", Transactionid: "TRXBDQYAGGGHE", Amount: "-80.8 USD", Charge: "0.8 USD", Gateway: "Mbank-wid", Status: "Pending" },
        { Date: "11-02-2022", User: "ChrisBrandon8046", Transactionid: "TRXBDQYAGGGHE", Amount: "-80.8 USD", Charge: "0.8 USD", Gateway: "Mbank-wid", Status: "Pending" },
    ];

    return (
        <div>
            <h1 className='text-3xl dark:text-white font-extrabold'>Pending Withdraw</h1>

            {/* Top Buttons */}
            <div className='h-20 bg-gray-200 mt-10 pt-2 dark:bg-gray-800 flex'>
                <button className='bg-sky-700 flex p-5 rounded-xl ml-3 dark:text-white h-15 text-white'><Webhook />Pending Withdraw</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Workflow />Automatic Method</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Landmark />Manual Method</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><AlarmClockCheckIcon />Withdraw Schedule</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Calendar />Withdraw History</button>
            </div>

            {/* TABLE */}
            <div className='overflow-x-auto'>
                <table className='w-full border-collapse mt-20'>
                    <thead className='bg-purple-50 text-gray-700'>
                        <tr>
                            <th className='py-5 px-4 text-left'>Date</th>
                            <th className='py-5 px-4 text-left'>User</th>
                            <th className='py-5 px-4 text-left'>Transaction ID</th>
                            <th className='py-5 px-4 text-left'>Amount</th>
                            <th className='py-5 px-4 text-left'>Charge</th>
                            <th className='py-5 px-4 text-left'>Gateway</th>
                            <th className='py-5 px-4 text-left'>Status</th>
                            <th className='py-5 px-4 text-left'>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} className='border-t hover:bg-gray-50'>
                                <td className='py-5 px-4 dark:text-white' >{item.Date}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.User}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.Transactionid}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.Amount}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.Charge}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.Gateway}</td>
                                <td className='py-5 px-4 dark:text-white'>{item.Status}</td>

                                {/* EYE ICON — OPENS MODAL */}
                                <td className='py-5 px-4 text-purple-600 cursor-pointer'>
                                    <Eye onClick={() => handleOpenModal(item)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
        {isModalOpen && (
    <div className="fixed inset-0 bg-blue bg-opacity-40 flex items-center justify-center z-50">
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
                    <span>Withdraw Amount:</span>
                    <span className="font-semibold">{selectedRow?.Amount}</span>
                </div>

                <div className="p-3 flex justify-between">
                    <span>Payable Amount:</span>
                    <span className="font-semibold">{selectedRow?.Amount}</span>
                </div>

                <div className="p-3 flex justify-between">
                    <span>Charge:</span>
                    <span className="font-semibold">{selectedRow?.Charge}</span>
                </div>
            </div>

            {/* Next Box */}
            <div className="border rounded-lg divide-y mt-4">
                <div className="p-3 flex justify-between">
                    <span>Acc name:</span>
                    <span className="font-semibold">Lynda Umutoni</span>
                </div>

                <div className="p-3">
                    <span>Upload Photo:</span>
                </div>

                <div className="p-3 flex justify-between">
                    <span>Write Something:</span>
                    <span className="font-semibold">Saving Account</span>
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

export default Pendingwithdraw;
