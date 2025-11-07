import React from 'react';
import { Link } from 'react-router';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import PageMeta from '../../components/common/PageMeta';

const GoldDashboard: React.FC = () => {
  // Deposit & Withdraw Chart Data
  const depositWithdrawOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [
        '24-Oct-2025',
        '25-Oct-2025',
        '26-Oct-2025',
        '27-Oct-2025',
        '28-Oct-2025',
        '29-Oct-2025',
        '30-Oct-2025',
        '31-Oct-2025',
        '01-Nov-2025',
        '02-Nov-2025',
        '03-Nov-2025',
        '04-Nov-2025',
        '05-Nov-2025',
        '06-Nov-2025',
        '07-Nov-2025',
      ],
    },
    yaxis: {
      title: {
        text: 'USD',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return '$ ' + val + ' USD';
        },
      },
    },
    colors: ['#00e396', '#d92027'],
    legend: {
      position: 'bottom',
    },
  };

  const depositWithdrawSeries = [
    {
      name: 'Deposited',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: 'Withdrawn',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ];

  // Transactions Chart Data
  const transactionsOptions: ApexOptions = {
    chart: {
      type: 'area',
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 4,
    },
    xaxis: {
      categories: [
        '24-Oct-2025',
        '25-Oct-2025',
        '26-Oct-2025',
        '27-Oct-2025',
        '28-Oct-2025',
        '29-Oct-2025',
        '30-Oct-2025',
        '31-Oct-2025',
        '01-Nov-2025',
        '02-Nov-2025',
        '03-Nov-2025',
        '04-Nov-2025',
        '05-Nov-2025',
        '06-Nov-2025',
        '07-Nov-2025',
      ],
    },
    yaxis: {
      title: {
        text: 'Transactions',
      },
    },
    tooltip: {
      shared: true,
    },
    colors: ['#00e396', '#d92027'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    legend: {
      position: 'bottom',
    },
  };

  const transactionsSeries = [
    {
      name: 'Plus Transactions',
      data: [0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: 'Minus Transactions',
      data: [0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 12],
    },
  ];

  // Browser Pie Chart
  const browserOptions: ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Chrome', 'Firefox', 'Safari', 'Edge'],
    colors: ['#ff6384', '#36a2eb', '#ff9f40', '#9966ff'],
    legend: {
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + '%';
      },
    },
  };

  const browserSeries = [45, 25, 20, 10];

  // OS Pie Chart
  const osOptions: ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Windows', 'Android', 'iOS', 'MacOS', 'Linux'],
    colors: ['#ffcd56', '#ff9f40', '#36a2eb', '#9966ff', '#4bc0c0'],
    legend: {
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + '%';
      },
    },
  };

  const osSeries = [40, 30, 15, 10, 5];

  // Country Pie Chart
  const countryOptions: ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['USA', 'India'],
    colors: ['#ff6384', '#36a2eb'],
    legend: {
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + '%';
      },
    },
  };

  const countrySeries = [95, 5];

  return (
    <>
      <PageMeta 
        title="Gold Dashboard | Admin Dashboard" 
        description="Gold trading and management dashboard with deposits, withdrawals, and redemption tracking"
      />
      
      <div className="px-3 sm:px-0">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h6 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h6>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button className="flex items-center gap-2 rounded border border-primary-500 bg-white px-4 py-2 text-sm font-medium text-primary-500 transition hover:bg-primary-50 dark:bg-gray-800 dark:hover:bg-gray-700">
              <i className="las la-server"></i>
              Cron Setup
            </button>
          </div>
        </div>

        {/* User Metrics Row */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Users */}
          <Link to="/users">
            <div className="group relative overflow-hidden rounded-lg border border-primary-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/20">
                    <i className="las la-users text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">1203</h3>
                  </div>
                </div>
                <i className="las la-chevron-right text-gray-400 transition group-hover:translate-x-1"></i>
              </div>
            </div>
          </Link>

          {/* Active Users */}
          <Link to="/users/active">
            <div className="group relative overflow-hidden rounded-lg border border-green-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20">
                    <i className="las la-user-check text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">1192</h3>
                  </div>
                </div>
                <i className="las la-chevron-right text-gray-400 transition group-hover:translate-x-1"></i>
              </div>
            </div>
          </Link>

          {/* Email Unverified Users */}
          <Link to="/users/email-unverified">
            <div className="group relative overflow-hidden rounded-lg border border-red-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20">
                    <i className="lar la-envelope text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email Unverified Users</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">11</h3>
                  </div>
                </div>
                <i className="las la-chevron-right text-gray-400 transition group-hover:translate-x-1"></i>
              </div>
            </div>
          </Link>

          {/* Mobile Unverified Users */}
          <Link to="/users/mobile-unverified">
            <div className="group relative overflow-hidden rounded-lg border border-yellow-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20">
                    <i className="las la-comment-slash text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Mobile Unverified Users</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">0</h3>
                  </div>
                </div>
                <i className="las la-chevron-right text-gray-400 transition group-hover:translate-x-1"></i>
              </div>
            </div>
          </Link>
        </div>

        {/* Deposits and Withdrawals Row */}
        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Deposits Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h5 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Deposits</h5>
            <div className="space-y-3">
              {/* Total Deposited */}
              <Link to="/deposit/all">
                <div className="group flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 transition hover:shadow-md dark:border-green-800 dark:bg-green-900/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20">
                      <i className="las la-hand-holding-usd text-xl"></i>
                    </div>
                    <div>
                      <h6 className="font-semibold text-gray-900 dark:text-white">$157,581.83 USD</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Deposited</p>
                    </div>
                  </div>
                  <i className="las la-angle-right text-gray-400 transition group-hover:translate-x-1"></i>
                </div>
              </Link>

              {/* Pending Deposits */}
              <Link to="/deposit/pending">
                <div className="group flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-4 transition hover:shadow-md dark:border-yellow-800 dark:bg-yellow-900/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20">
                      <i className="las la-spinner text-xl"></i>
                    </div>
                    <div>
                      <h6 className="font-semibold text-gray-900 dark:text-white">48</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pending Deposits</p>
                    </div>
                  </div>
                  <i className="las la-angle-right text-gray-400 transition group-hover:translate-x-1"></i>
                </div>
              </Link>

              {/* Rejected Deposits */}
              <Link to="/deposit/rejected">
                <div className="group flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 transition hover:shadow-md dark:border-red-800 dark:bg-red-900/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20">
                      <i className="las la-ban text-xl"></i>
                    </div>
                    <div>
                      <h6 className="font-semibold text-gray-900 dark:text-white">1</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Rejected Deposits</p>
                    </div>
                  </div>
                  <i className="las la-angle-right text-gray-400 transition group-hover:translate-x-1"></i>
                </div>
              </Link>

              {/* Deposited Charge */}
              <Link to="/deposit/all">
                <div className="group flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 p-4 transition hover:shadow-md dark:border-primary-800 dark:bg-primary-900/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/20">
                      <i className="las la-percentage text-xl"></i>
                    </div>
                    <div>
                      <h6 className="font-semibold text-gray-900 dark:text-white">$1,750.82 USD</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Deposited Charge</p>
                    </div>
                  </div>
                  <i className="las la-angle-right text-gray-400 transition group-hover:translate-x-1"></i>
                </div>
              </Link>
            </div>
          </div>

          {/* Withdrawals Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h5 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Withdrawals</h5>
            <div className="space-y-3">
              {/* Total Withdrawn */}
              <Link to="/withdraw/all">
                <div className="group flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 transition hover:shadow-md dark:border-green-800 dark:bg-green-900/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20">
                      <i className="lar la-credit-card text-xl"></i>
                    </div>
                    <div>
                      <h6 className="font-semibold text-gray-900 dark:text-white">$602.00 USD</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Withdrawn</p>
                    </div>
                  </div>
                  <i className="las la-angle-right text-gray-400 transition group-hover:translate-x-1"></i>
                </div>
              </Link>

              {/* Pending Withdrawals */}
              <Link to="/withdraw/pending">
                <div className="group flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-4 transition hover:shadow-md dark:border-yellow-800 dark:bg-yellow-900/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20">
                      <i className="las la-spinner text-xl"></i>
                    </div>
                    <div>
                      <h6 className="font-semibold text-gray-900 dark:text-white">10</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pending Withdrawals</p>
                    </div>
                  </div>
                  <i className="las la-angle-right text-gray-400 transition group-hover:translate-x-1"></i>
                </div>
              </Link>

              {/* Rejected Withdrawals */}
              <Link to="/withdraw/rejected">
                <div className="group flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 transition hover:shadow-md dark:border-red-800 dark:bg-red-900/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20">
                      <i className="las la-times-circle text-xl"></i>
                    </div>
                    <div>
                      <h6 className="font-semibold text-gray-900 dark:text-white">2</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Rejected Withdrawals</p>
                    </div>
                  </div>
                  <i className="las la-angle-right text-gray-400 transition group-hover:translate-x-1"></i>
                </div>
              </Link>

              {/* Withdrawal Charge */}
              <Link to="/withdraw/all">
                <div className="group flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 p-4 transition hover:shadow-md dark:border-primary-800 dark:bg-primary-900/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/20">
                      <i className="las la-percent text-xl"></i>
                    </div>
                    <div>
                      <h6 className="font-semibold text-gray-900 dark:text-white">$15.75 USD</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Withdrawal Charge</p>
                    </div>
                  </div>
                  <i className="las la-angle-right text-gray-400 transition group-hover:translate-x-1"></i>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Redeem Status Cards */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Processing Redeem */}
          <Link to="/gold-history/redeem?status=1">
            <div className="group rounded-lg border-2 border-yellow-300 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-yellow-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20">
                    <i className="las la-spinner text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Processing Redeem</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">49</h3>
                  </div>
                </div>
                <i className="las la-chevron-right text-gray-400 transition group-hover:translate-x-1"></i>
              </div>
            </div>
          </Link>

          {/* Delivered Redeem */}
          <Link to="/gold-history/redeem?status=3">
            <div className="group rounded-lg border-2 border-green-300 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-green-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20">
                    <i className="las la-check-circle text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Delivered Redeem</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">7</h3>
                  </div>
                </div>
                <i className="las la-chevron-right text-gray-400 transition group-hover:translate-x-1"></i>
              </div>
            </div>
          </Link>

          {/* Cancelled Redeem */}
          <Link to="/gold-history/redeem?status=4">
            <div className="group rounded-lg border-2 border-red-300 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-red-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20">
                    <i className="las la-times-circle text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cancelled Redeem</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">3</h3>
                  </div>
                </div>
                <i className="las la-chevron-right text-gray-400 transition group-hover:translate-x-1"></i>
              </div>
            </div>
          </Link>

          {/* Total Redeem */}
          <Link to="/gold-history/redeem">
            <div className="group rounded-lg border-2 border-primary-300 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-primary-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/20">
                    <i className="las la-exchange-alt text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Redeem</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">69</h3>
                  </div>
                </div>
                <i className="las la-chevron-right text-gray-400 transition group-hover:translate-x-1"></i>
              </div>
            </div>
          </Link>
        </div>

        {/* Transaction Type Cards */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Buy */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500 text-white">
                <i className="las la-shopping-cart text-2xl"></i>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Buy</p>
            </div>
            <div className="flex items-end justify-between">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">$170,207.61 USD</h4>
              <Link to="/gold-history/buy" className="flex items-center gap-1 text-sm text-primary-500 hover:underline">
                <span>View All</span>
                <i className="las la-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* Sell */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500 text-white">
                <i className="las la-store text-2xl"></i>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sell</p>
            </div>
            <div className="flex items-end justify-between">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">$51,054.69 USD</h4>
              <Link to="/gold-history/sell" className="flex items-center gap-1 text-sm text-primary-500 hover:underline">
                <span>View All</span>
                <i className="las la-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* Redeem */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500 text-white">
                <i className="las la-exchange-alt text-2xl"></i>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Redeem</p>
            </div>
            <div className="flex items-end justify-between">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">$57,229.26 USD</h4>
              <Link to="/gold-history/redeem" className="flex items-center gap-1 text-sm text-primary-500 hover:underline">
                <span>View All</span>
                <i className="las la-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* Gift */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500 text-white">
                <i className="las la-gift text-2xl"></i>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gift</p>
            </div>
            <div className="flex items-end justify-between">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">$1,601.00 USD</h4>
              <Link to="/gold-history/gift" className="flex items-center gap-1 text-sm text-primary-500 hover:underline">
                <span>View All</span>
                <i className="las la-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Charge Cards */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Buy Charge */}
          <Link to="/gold-history/buy">
            <div className="group flex items-center justify-between rounded-lg bg-yellow-600 p-6 shadow-md transition hover:shadow-lg">
              <div>
                <p className="text-sm text-white/90">Buy Charge</p>
                <h3 className="text-2xl font-bold text-white">$1,987.24 USD</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-white">
                <i className="las la-hand-holding-usd text-2xl"></i>
              </div>
            </div>
          </Link>

          {/* Sell Charge */}
          <Link to="/gold-history/sell">
            <div className="group flex items-center justify-between rounded-lg bg-gradient-to-r from-red-500 to-red-600 p-6 shadow-md transition hover:shadow-lg">
              <div>
                <p className="text-sm text-white/90">Sell Charge</p>
                <h3 className="text-2xl font-bold text-white">$1,855.31 USD</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-white">
                <i className="las la-hand-holding-usd text-2xl"></i>
              </div>
            </div>
          </Link>

          {/* Redeem Charge */}
          <Link to="/gold-history/redeem">
            <div className="group flex items-center justify-between rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 p-6 shadow-md transition hover:shadow-lg">
              <div>
                <p className="text-sm text-white/90">Redeem Charge</p>
                <h3 className="text-2xl font-bold text-white">$1,385.83 USD</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-white">
                <i className="las la-hand-holding-usd text-2xl"></i>
              </div>
            </div>
          </Link>

          {/* Gift Charge */}
          <Link to="/gold-history/gift">
            <div className="group flex items-center justify-between rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-6 shadow-md transition hover:shadow-lg">
              <div>
                <p className="text-sm text-white/90">Gift Charge</p>
                <h3 className="text-2xl font-bold text-white">$81.02 USD</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-white">
                <i className="las la-hand-holding-usd text-2xl"></i>
              </div>
            </div>
          </Link>
        </div>

        {/* Charts Row */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Deposit & Withdraw Report Chart */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Deposit & Withdraw Report</h5>
              <div className="flex cursor-pointer items-center gap-2 rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 dark:border-gray-600 dark:text-gray-400">
                <i className="las la-calendar"></i>
                <span>October 24, 2025 - November 7, 2025</span>
                <i className="las la-caret-down"></i>
              </div>
            </div>
            <div className="h-96">
              <ReactApexChart
                options={depositWithdrawOptions}
                series={depositWithdrawSeries}
                type="bar"
                height="100%"
              />
            </div>
          </div>

          {/* Transactions Report Chart */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Transactions Report</h5>
              <div className="flex cursor-pointer items-center gap-2 rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 dark:border-gray-600 dark:text-gray-400">
                <i className="las la-calendar"></i>
                <span>October 24, 2025 - November 7, 2025</span>
                <i className="las la-caret-down"></i>
              </div>
            </div>
            <div className="h-96">
              <ReactApexChart
                options={transactionsOptions}
                series={transactionsSeries}
                type="area"
                height="100%"
              />
            </div>
          </div>
        </div>

        {/* Donut Charts Row */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Login By Browser */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h5 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Login By Browser (Last 30 days)</h5>
            <div className="h-72">
              <ReactApexChart
                options={browserOptions}
                series={browserSeries}
                type="donut"
                height="100%"
              />
            </div>
          </div>

          {/* Login By OS */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h5 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Login By OS (Last 30 days)</h5>
            <div className="h-72">
              <ReactApexChart
                options={osOptions}
                series={osSeries}
                type="donut"
                height="100%"
              />
            </div>
          </div>

          {/* Login By Country */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h5 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Login By Country (Last 30 days)</h5>
            <div className="h-72">
              <ReactApexChart
                options={countryOptions}
                series={countrySeries}
                type="donut"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GoldDashboard;
