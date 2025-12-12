import { ChevronDown, ChevronUp, Eye } from "lucide-react";
import { useState } from "react";

type SortOrder = "asc" | "desc";

interface Loan {
  plan: string;
  user: string;
  loanId: string;
  amount: string;
  installment: string;
  nextInstallment: string;
  interval?: string;
  totalInstallments?: string;
  perInstallment?: string;
  givenInstallment?: string | number;
  paidAmount?: string;
  payableAmount?: string;
  bankProfit?: string;
  gender?: string;
  nidCardUrl?: string;
  idNumber?: string;
  about?: string;
  requestedAt: string;
  status: "Reviewing" | "Cancelled";
}

const loans: Loan[] = [
  {
    plan: "Education Loan",
    user: "rapjuaa",
    loanId: "L70586003",
    amount: "$500",
    installment: "$50",
    nextInstallment: "-",
    interval: "30 Days",
    totalInstallments: "12 Times",
    perInstallment: "$45.83",
    givenInstallment: 0,
    paidAmount: "$0",
    payableAmount: "$550",
    bankProfit: "$50",
    gender: "Male",
    nidCardUrl: "#",
    idNumber: "9183746464646463",
    about: "صباح الفل يا",
    requestedAt: "27 Nov 2025 11:05 PM",
    status: "Reviewing",
  },
  {
    plan: "Education Loan",
    user: "demouser",
    loanId: "L17915723",
    amount: "$200",
    installment: "$20",
    nextInstallment: "-",
    interval: "30 Days",
    totalInstallments: "10 Times",
    perInstallment: "$20",
    givenInstallment: 0,
    paidAmount: "$0",
    payableAmount: "$220",
    bankProfit: "$20",
    gender: "Male",
    nidCardUrl: "#",
    idNumber: "9183746464",
    about: "",
    requestedAt: "25 Nov 2025 07:22 AM",
    status: "Reviewing",
  },
  {
    plan: "Education Loan",
    user: "demouser",
    loanId: "L33859909",
    amount: "$100",
    installment: "$10",
    nextInstallment: "-",
    interval: "30 Days",
    totalInstallments: "10 Times",
    perInstallment: "$10",
    givenInstallment: 0,
    paidAmount: "$0",
    payableAmount: "$110",
    bankProfit: "$10",
    gender: "Male",
    nidCardUrl: "#",
    idNumber: "",
    about: "",
    requestedAt: "24 Nov 2025 07:24 AM",
    status: "Cancelled",
  },
  {
    plan: "Education Loan",
    user: "demouser",
    loanId: "L97417684",
    amount: "$100",
    installment: "$10",
    nextInstallment: "-",
    interval: "30 Days",
    totalInstallments: "12 Times",
    perInstallment: "$10",
    givenInstallment: 0,
    paidAmount: "$0",
    payableAmount: "$110",
    bankProfit: "$10",
    gender: "Male",
    nidCardUrl: "#",
    idNumber: "",
    about: "",
    requestedAt: "22 Oct 2025 05:41 AM",
    status: "Cancelled",
  },
];

export default function AllLoans() {
  const [sort, setSort] = useState<{ key: string; order: SortOrder }>({
    key: "",
    order: "asc",
  });

  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openLoanModal = (loan: Loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  const closeLoanModal = () => {
    setSelectedLoan(null);
    setIsModalOpen(false);
  };

  const handleSort = (key: string) => {
    setSort((prev) => ({
      key,
      order: prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (sort.key !== col) return <ChevronDown size={14} className="text-gray-400" />;
    return sort.order === "asc" ? (
      <ChevronUp size={14} className="text-gray-700" />
    ) : (
      <ChevronDown size={14} className="text-gray-700" />
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">All Loan</h1>

      {/* Top Section */}
      <div className="bg-white border rounded-lg p-4 flex items-center justify-between dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <input
            className="border rounded-md px-4 py-2 w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500"
            placeholder="SEARCH..."
          />
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md">
            SEARCH
          </button>
        </div>

        <select className="border px-3 py-2 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option>15</option>
          <option>30</option>
          <option>50</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-5 border rounded-lg overflow-hidden dark:border-gray-700">
        <table className="w-full text-left dark:text-gray-200">
          <thead>
            <tr className="bg-purple-50 text-gray-700 text-sm dark:bg-gray-700 dark:text-gray-200">
              {[
                "PLAN",
                "USER",
                "LOAN ID",
                "AMOUNT",
                "INSTALLMENT AMOUNT",
                "NEXT INSTALLMENT",
                "REQUESTED AT",
                "STATUS",
                "ACTION",
              ].map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-4 py-3 cursor-pointer select-none font-semibold"
                >
                  <div className="flex items-center gap-1">
                    {col}
                    <SortIcon col={col} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loans.map((loan, i) => (
              <tr key={i} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                <td className="px-4 py-4">{loan.plan}</td>

                <td className="px-4 py-4 text-purple-700 font-semibold cursor-pointer dark:text-purple-300">
                  {loan.user}
                </td>

                <td className="px-4 py-4">{loan.loanId}</td>
                <td className="px-4 py-4">{loan.amount}</td>
                <td className="px-4 py-4">{loan.installment}</td>
                <td className="px-4 py-4">{loan.nextInstallment}</td>

                <td className="px-4 py-4">{loan.requestedAt}</td>

                <td className="px-4 py-4 dark:text-gray-200">
                  <span
                    className={`px-4 py-1 rounded-full text-white text-sm ${
                      loan.status === "Reviewing"
                        ? "bg-yellow-500"
                        : "bg-pink-500"
                    }`}
                  >
                    {loan.status}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <button
                    onClick={() => openLoanModal(loan)}
                    className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600"
                    aria-label={`View loan ${loan.loanId}`}
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loan Details Modal */}
      {isModalOpen && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={closeLoanModal}></div>
          <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Loan Details</h3>
              <button
                onClick={closeLoanModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
                aria-label="Close loan details"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Left: Plan Information */}
              <div className="rounded border dark:border-gray-700 bg-white p-4 dark:bg-gray-900">
                <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Plan Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedLoan.plan}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Interval</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedLoan.interval ?? '-'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Installment</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedLoan.totalInstallments ?? '-'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Loan Amount</span>
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">{selectedLoan.amount}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Per Installment</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedLoan.perInstallment ?? selectedLoan.installment}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Given Installment</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedLoan.givenInstallment ?? '-'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Paid Amount</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedLoan.paidAmount ?? '-'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Payable Amount</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedLoan.payableAmount ?? '-'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                    <span className={`px-3 py-1 rounded-full text-white text-sm ${selectedLoan.status === 'Reviewing' ? 'bg-yellow-500' : 'bg-pink-500'}`}>{selectedLoan.status}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Bank Profit</span>
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">{selectedLoan.bankProfit ?? '-'}</span>
                  </div>
                </div>
              </div>

              {/* Right: Loan Request Information */}
              <div className="rounded border dark:border-gray-700 bg-white p-4 dark:bg-gray-900">
                <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Loan Request Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Gender</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedLoan.gender ?? '-'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">NID Card</span>
                    {selectedLoan.nidCardUrl ? (
                      <a href={selectedLoan.nidCardUrl} target="_blank" rel="noreferrer" className="text-sm text-primary-500 hover:underline dark:text-purple-400">Click here to view</a>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">ID Number</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedLoan.idNumber ?? '-'}</span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Write about yourself</p>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{selectedLoan.about ?? '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  Approve
                </button>

                <button className="flex items-center gap-2 rounded bg-pink-500 px-4 py-2 text-white hover:bg-pink-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  Reject
                </button>
              </div>

              <div>
                <button
                  onClick={closeLoanModal}
                  className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
