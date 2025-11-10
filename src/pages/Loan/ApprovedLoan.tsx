import React, { useMemo, useState } from 'react';
import PageMeta from '../../components/common/PageMeta';
import { Link } from 'react-router';

type Approved = {
	id: number;
	plan: string;
	user: string;
	loanId: string;
	amount: number;
	installmentAmount: number;
	nextInstallment: string;
	requestedAt: string;
	status: 'Approved' | 'Pending' | 'Rejected';
};

const sampleData: Approved[] = [];

const ApprovedLoan: React.FC = () => {
	const [search, setSearch] = useState('');
	const [perPage, setPerPage] = useState('15');

	const filtered = useMemo(() => {
		if (!search) return sampleData;
		const q = search.toLowerCase();
		return sampleData.filter((s) => [s.plan, s.user, s.loanId].some((v) => v.toLowerCase().includes(q)));
	}, [search]);

	return (
		<div className="p-6">
			<PageMeta title="Approved Loan | Admin" description="Approved loans list" />

			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Approved Loan</h1>
			</div>

			<div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
				{/* toolbar */}
				<div className="p-4 border-b dark:border-gray-800">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-2">
								<input
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder="SEARCH..."
									className="appearance-none outline-none px-3 py-2 text-sm w-56 placeholder-gray-400"
								/>
								<button type="button" className="ml-2 inline-flex items-center gap-2 rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white">🔍 SEARCH</button>
							</div>
						</div>

						<div className="flex items-center gap-3 justify-end">
							<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2">
								<select value={perPage} onChange={(e) => setPerPage(e.target.value)} className="text-sm bg-transparent outline-none">
									<option value="15">15</option>
									<option value="30">30</option>
									<option value="45">45</option>
									<option value="60">60</option>
								</select>
							</div>
						</div>
					</div>
				</div>

				{/* table */}
				<div className="overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead className="bg-purple-50">
							<tr>
								<th className="px-6 py-4 text-left text-xs uppercase text-gray-600">Plan</th>
								<th className="px-6 py-4 text-left text-xs uppercase text-gray-600">User</th>
								<th className="px-6 py-4 text-left text-xs uppercase text-gray-600">Loan ID</th>
								<th className="px-6 py-4 text-left text-xs uppercase text-gray-600">Amount</th>
								<th className="px-6 py-4 text-left text-xs uppercase text-gray-600">Installment Amount</th>
								<th className="px-6 py-4 text-left text-xs uppercase text-gray-600">Next Installment</th>
								<th className="px-6 py-4 text-left text-xs uppercase text-gray-600">Requested At</th>
								<th className="px-6 py-4 text-left text-xs uppercase text-gray-600">Status</th>
								<th className="px-6 py-4 text-left text-xs uppercase text-gray-600">Action</th>
							</tr>
						</thead>
						<tbody>
							{filtered.length === 0 ? (
								<tr>
									<td colSpan={9} className="px-6 py-12 text-center text-gray-500">No Data Found!</td>
								</tr>
							) : (
								filtered.map((row) => (
									<tr key={row.id} className="border-t hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800">
										<td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{row.plan}</td>
										<td className="px-6 py-4">{row.user}</td>
										<td className="px-6 py-4">{row.loanId}</td>
										<td className="px-6 py-4">{row.amount}</td>
										<td className="px-6 py-4">{row.installmentAmount}</td>
										<td className="px-6 py-4">{row.nextInstallment}</td>
										<td className="px-6 py-4">{row.requestedAt}</td>
										<td className="px-6 py-4">
											<span className={`inline-block px-3 py-1 rounded-full text-white text-xs ${row.status === 'Approved' ? 'bg-emerald-500' : 'bg-gray-400'}`}>{row.status}</span>
										</td>
										<td className="px-6 py-4">
											<Link to={`/loan/details/${row.id}`} className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-3 py-1 text-sm text-white">View</Link>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* footer / pagination */}
				<div className="p-4 border-t flex items-center justify-between">
					<div className="text-sm text-gray-600">Showing {filtered.length} entries</div>
					<div>
						<nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
							<button className="px-3 py-2 bg-white border border-gray-200 text-sm">Prev</button>
							<button className="px-3 py-2 bg-purple-600 text-white border border-purple-600 text-sm">1</button>
							<button className="px-3 py-2 bg-white border border-gray-200 text-sm">Next</button>
						</nav>
					</div>
				</div>
			</div>

			{/* Mobile cards */}
			<div className="lg:hidden mt-4">
				<div className="space-y-4">
					{filtered.length === 0 ? (
						<div className="p-4 text-center text-gray-500">No Data Found!</div>
					) : (
						filtered.map((row) => (
							<div key={row.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
								<div className="flex items-center justify-between">
									<div>
										<div className="font-semibold text-gray-900 dark:text-gray-100">{row.plan}</div>
										<div className="text-xs text-gray-500">{row.user} • {row.loanId}</div>
									</div>
									<div className="text-sm font-medium text-gray-900 dark:text-gray-100">{row.amount}</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default ApprovedLoan;

