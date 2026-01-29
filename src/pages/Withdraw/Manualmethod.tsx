import { FC } from "react";
import { Link } from 'react-router';
import { Settings } from "lucide-react";
 import stripeImg from "./../../images/flutterwave.png";
import flutterImg from "./../../images/yWAeLybCbehpjXbT4PaK.jpg";
import { Webhook } from 'lucide-react'
import { Workflow } from "lucide-react";
import { Landmark } from "lucide-react";
import { AlarmClockCheckIcon } from "lucide-react";
import { Calendar } from "lucide-react";
interface PaymentMethod {
  id: number;
  name: string;
  currency: string;
  minDeposit: number;
  icon: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 1,
    name: "Stripe",
    currency: "USD",
    minDeposit: 50,
    icon: stripeImg,
  },
  {
    id: 2,
    name: "Flutterwave",
    currency: "USD",
    minDeposit: 10,
    icon: flutterImg,
  },
];

const AutoDepositMethod: FC = () => {
  return (
    <div className="w-full p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Auto Deposit Method</h1>

        <button className="bg-primary text-white px-4 py-2 rounded-lg flex gap-2 items-center">
          <span className="text-xl">+</span> ADD NEW
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-3 border-b pb-3 mb-6 w-full">
       <div className='h-20 bg-gray-200 mt-10 pt-2 dark:bg-gray-800 flex w-full'>
                <button className=' flex p-5 rounded-xl ml-3 dark:text-white h-15 text-blue'><Webhook />Pending Withdraw</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Workflow />Automatic Method</button>
                <button className='bg-sky-700 flex p-5 rounded-xl ml-3 dark:text-white h-15 text-white'><Landmark />Manual Method</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><AlarmClockCheckIcon />Withdraw Schedule</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Calendar />Withdraw History</button>
            </div>
      </div>

      {/* SECTION TITLE */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Setup Payment Methods</h2>
        <p className="text-gray-500 text-sm">
          All the <strong>Deposit Payment Methods</strong> setup for user
        </p>
      </div>

      {/* PAYMENT CARDS */}
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="flex items-center justify-between border rounded-xl p-5 shadow-sm bg-white"
          >
            <div className="flex items-center gap-4">
              <img src={method.icon} alt={method.name} className="w-25" />

              <div>
                <h3 className="font-semibold text-lg">
                  {method.name}-{method.currency}
                </h3>
                <p className="text-gray-600 text-sm">
                  Minimum Deposit: {method.minDeposit} USD
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Status Chip */}
              <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm">
                Activated
              </span>

              {/* Settings Button (navigates to withdraw method form) */}
              <Link to="/withdraw/withdraw-method-form" className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 inline-flex items-center">
                <Settings size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutoDepositMethod;
