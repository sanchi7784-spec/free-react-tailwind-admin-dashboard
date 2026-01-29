import { Webhook, Workflow, Landmark, AlarmClockCheckIcon, Calendar, Eye } from 'lucide-react'
import React, { useState, useEffect } from "react";
import { fetchWithdrawals, Withdrawal } from "../../api/withdrawals";

const WithdrawHistory = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Withdrawal | null>(null);
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Filter states
    const [filterUserName, setFilterUserName] = useState<string>('');
    const [filterUserId, setFilterUserId] = useState<string>('');
    const [filterAccountNumber, setFilterAccountNumber] = useState<string>('');
    const [filterEmail, setFilterEmail] = useState<string>('');

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
                setError(err?.detail || err?.message || String(err));
                setLoading(false);
            });
        return () => { mounted = false };
    }, []);

    // Filter withdrawals based on search criteria
    const filteredWithdrawals = withdrawals.filter((item) => {
        const matchesUserName = filterUserName === '' || 
            item.user_name.toLowerCase().includes(filterUserName.toLowerCase());
        const matchesUserId = filterUserId === '' || 
            item.withdraw_id.toLowerCase().includes(filterUserId.toLowerCase());
        const matchesAccountNumber = filterAccountNumber === '' || 
            item.account_number.toLowerCase().includes(filterAccountNumber.toLowerCase());
        const matchesEmail = filterEmail === '' || 
            item.user_email.toLowerCase().includes(filterEmail.toLowerCase());
        
        return matchesUserName && matchesUserId && matchesAccountNumber && matchesEmail;
    });

    const handleClearFilters = () => {
        setFilterUserName('');
        setFilterUserId('');
        setFilterAccountNumber('');
        setFilterEmail('');
    };

    return (
        <div>
            <h1 className='text-3xl dark:text-white font-extrabold'>Withdraw History</h1>

            {/* Top Buttons */}
            {/* <div className='h-20 bg-gray-200 mt-10 pt-2 dark:bg-gray-800 flex'>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Webhook />Pending Withdraw</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Workflow />Automatic Method</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Landmark />Manual Method</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><AlarmClockCheckIcon />Withdraw Schedule</button>
                <button className='bg-sky-700 flex p-5 rounded-xl ml-3 dark:text-white h-15 text-white'><Calendar />Withdraw History</button>
            </div> */}

            {/* FILTERS SECTION */}
            <div className='mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                <h2 className='text-xl font-semibold mb-4 dark:text-white'>Search Filters</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    <div>
                        <label className='block text-sm font-medium mb-2 dark:text-gray-300'>User Name</label>
                        <input
                            type="text"
                            value={filterUserName}
                            onChange={(e) => setFilterUserName(e.target.value)}
                            placeholder="Search by user name..."
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                        />
                    </div>
                    
                    <div>
                        <label className='block text-sm font-medium mb-2 dark:text-gray-300'>Withdraw ID</label>
                        <input
                            type="text"
                            value={filterUserId}
                            onChange={(e) => setFilterUserId(e.target.value)}
                            placeholder="Search by withdraw ID..."
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                        />
                    </div>
                    
                    <div>
                        <label className='block text-sm font-medium mb-2 dark:text-gray-300'>Account Number</label>
                        <input
                            type="text"
                            value={filterAccountNumber}
                            onChange={(e) => setFilterAccountNumber(e.target.value)}
                            placeholder="Search by account number..."
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                        />
                    </div>
                    
                    <div>
                        <label className='block text-sm font-medium mb-2 dark:text-gray-300'>Email</label>
                        <input
                            type="text"
                            value={filterEmail}
                            onChange={(e) => setFilterEmail(e.target.value)}
                            placeholder="Search by email..."
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                        />
                    </div>
                </div>
                
                <div className='mt-4 flex gap-3'>
                    <button
                        onClick={handleClearFilters}
                        className='px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors'
                    >
                        Clear Filters
                    </button>
                    <div className='flex-1 flex items-center text-sm dark:text-gray-300'>
                        Showing {filteredWithdrawals.length} of {withdrawals.length} withdrawals
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className='overflow-x-auto'>
                <table className='w-full border-collapse mt-20'>
                    <thead className='bg-purple-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200'>
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
                            <tr><td colSpan={12} className='py-5 px-4 dark:text-white'>Loading...</td></tr>
                        ) : error ? (
                            <tr><td colSpan={12} className='py-5 px-4 text-red-600 dark:text-red-400'>Error: {error}</td></tr>
                        ) : filteredWithdrawals.length === 0 ? (
                            <tr><td colSpan={12} className='py-5 px-4 text-center dark:text-white'>No withdrawals found matching your search criteria.</td></tr>
                        ) : (
                            filteredWithdrawals.map((item, index) => (
                            <tr key={index} className='border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'>
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
                                    <span className={`px-2 py-1 rounded ${item.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                        {item.status}
                                    </span>
                                </td>

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
                Withdraw Approval Action
            </h2>

            {/* INFO BOXES */}
            <div className="border dark:border-gray-600 rounded-lg divide-y dark:divide-gray-600">
                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>Withdraw ID:</span>
                    <span className="font-semibold dark:text-white">{selectedRow?.withdraw_id}</span>
                </div>

                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>User Name:</span>
                    <span className="font-semibold dark:text-white">{selectedRow?.user_name}</span>
                </div>

                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>User Email:</span>
                    <span className="font-semibold dark:text-white">{selectedRow?.user_email}</span>
                </div>

                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>Amount:</span>
                    <span className="font-semibold dark:text-white">{selectedRow?.amount}</span>
                </div>

                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>Status:</span>
                    <span className="font-semibold dark:text-white">{selectedRow?.status}</span>
                </div>
            </div>

            {/* Bank Details */}
            <div className="border dark:border-gray-600 rounded-lg divide-y dark:divide-gray-600 mt-4">
                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>Bank Name:</span>
                    <span className="font-semibold dark:text-white">{selectedRow?.bank_name}</span>
                </div>

                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>Branch Name:</span>
                    <span className="font-semibold dark:text-white">{selectedRow?.branch_name}</span>
                </div>

                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>Account Type:</span>
                    <span className="font-semibold dark:text-white">{selectedRow?.account_type}</span>
                </div>

                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>Account Holder:</span>
                    <span className="font-semibold dark:text-white">{selectedRow?.account_holder_name}</span>
                </div>

                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>Account Number:</span>
                    <span className="font-semibold dark:text-white">{selectedRow?.account_number}</span>
                </div>

                <div className="p-3 flex justify-between dark:text-gray-300">
                    <span>IFSC Code:</span>
                    <span className="font-semibold dark:text-white">{selectedRow?.ifsc_code}</span>
                </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-center mt-6">
                <button 
                    onClick={handleCloseModal}
                    className="px-8 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
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

export default WithdrawHistory;
