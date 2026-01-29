import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import PageMeta from '../../components/common/PageMeta';
import { getDashboardOverview, DashboardOverviewData, getAppVersion, updateAppVersion } from '../../api/dashboard';
import { canAccessGold, isEcommerceAuthenticated } from '../../utils/ecommerceAuth';

const GoldDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState('');
  const [newVersion, setNewVersion] = useState('');
  const [versionUpdating, setVersionUpdating] = useState(false);
  const [versionLoading, setVersionLoading] = useState(true);
  const [versionMessage, setVersionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDashboardOverview();
        setDashboardData(response.data);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.detail || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    const fetchAppVersion = async () => {
      try {
        setVersionLoading(true);
        const response = await getAppVersion();
        setCurrentVersion(response.app_version);
        setLastUpdated(response.updated_at);
      } catch (err: any) {
        console.error('Failed to fetch app version:', err);
        setVersionMessage({ type: 'error', text: err.detail || 'Failed to load app version' });
      } finally {
        setVersionLoading(false);
      }
    };

    fetchDashboardData();
    fetchAppVersion();
  }, []);

  const formatRs = (val: number | string) => {
    const n = Number(val) || 0;
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
      }).format(n) + ' INR';
    } catch (e) {
      return '₹' + n.toFixed(2) + ' INR';
    }
  };

  const handleVersionUpdate = async () => {
    if (!newVersion.trim()) {
      setVersionMessage({ type: 'error', text: 'Please enter a version number' });
      return;
    }

    // Validate version format (basic check)
    const versionRegex = /^\d+\.\d+\.\d+$/;
    if (!versionRegex.test(newVersion.trim())) {
      setVersionMessage({ type: 'error', text: 'Invalid version format. Use format: X.Y.Z (e.g., 1.0.0)' });
      return;
    }

    try {
      setVersionUpdating(true);
      setVersionMessage(null);
      
      const response = await updateAppVersion(newVersion.trim());
      
      setCurrentVersion(response.app_version);
      setLastUpdated(response.updated_at);
      setNewVersion('');
      setVersionMessage({ type: 'success', text: 'App version updated successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setVersionMessage(null), 3000);
    } catch (err: any) {
      console.error('Failed to update version:', err);
      setVersionMessage({ type: 'error', text: err.detail || 'Failed to update version' });
    } finally {
      setVersionUpdating(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageMeta 
          title="Gold Dashboard | Admin Dashboard" 
          description="Gold trading and management dashboard with deposits, withdrawals, and redemption tracking"
        />
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <i className="las la-spinner la-spin text-4xl text-primary-500"></i>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageMeta 
          title="Gold Dashboard | Admin Dashboard" 
          description="Gold trading and management dashboard with deposits, withdrawals, and redemption tracking"
        />
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <i className="las la-exclamation-circle text-4xl text-red-500"></i>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 rounded-lg bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta 
        title="Gold Dashboard | Admin Dashboard" 
        description="Gold trading and management dashboard with deposits, withdrawals, and redemption tracking"
      />
      
      <div className="px-2 sm:px-4 md:px-0">
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <h6 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h6>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {/* <button className="flex items-center gap-2 rounded border border-primary-500 bg-white px-4 py-2 text-sm font-medium text-primary-500 transition hover:bg-primary-50 dark:bg-gray-800 dark:hover:bg-gray-700">
              <i className="las la-server"></i>
              Cron Setup
            </button> */}
          </div>
        </div>

        {/* App Version Management Card */}
        <div className="mb-4 sm:mb-6 rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-start sm:items-center gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20">
              <i className="las la-code-branch text-xl sm:text-2xl"></i>
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">App Version Management</h5>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Update the application version</p>
            </div>
          </div>

          {versionLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="text-center">
                <i className="las la-spinner la-spin text-3xl text-indigo-500"></i>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading version info...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
              {/* Current Version Display */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4 dark:border-gray-700 dark:bg-gray-900/50">
                <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Current Version</p>
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-md bg-indigo-100 px-2 py-1 sm:px-3 sm:py-1.5 text-base sm:text-lg font-bold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                    v{currentVersion}
                  </span>
                  <i className="las la-check-circle text-lg sm:text-xl text-green-500"></i>
                </div>
                {lastUpdated && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last updated: {new Date(lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Version Update Form */}
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <label htmlFor="newVersion" className="mb-1 sm:mb-2 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Version
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      id="newVersion"
                      type="text"
                      value={newVersion}
                      onChange={(e) => setNewVersion(e.target.value)}
                      placeholder="e.g., 1.0.1"
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                      disabled={versionUpdating}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !versionUpdating && newVersion.trim()) {
                          handleVersionUpdate();
                        }
                      }}
                    />
                    <button
                      onClick={handleVersionUpdate}
                      disabled={versionUpdating || !newVersion.trim()}
                      className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 sm:py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600 min-h-[44px] sm:min-h-0"
                    >
                      {versionUpdating ? (
                        <>
                          <i className="las la-spinner la-spin"></i>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <i className="las la-sync"></i>
                          <span>Update</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Format: X.Y.Z (e.g., 1.0.0)
                  </p>
                </div>

                {/* Status Message */}
                {versionMessage && (
                  <div
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm ${
                      versionMessage.type === 'success'
                        ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}
                  >
                    <i className={`las ${versionMessage.type === 'success' ? 'la-check-circle' : 'la-exclamation-circle'} text-lg`}></i>
                    <span>{versionMessage.text}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Metrics Row */}
        <div className="mb-3 sm:mb-4 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Total Users */}
          <Link to="/customers/allcustomers">
            <div className="group relative overflow-hidden rounded-lg border border-primary-200 bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800 min-h-[100px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/20">
                    <i className="las la-users text-xl sm:text-2xl"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{dashboardData?.total_users || 0}</h3>
                  </div>
                </div>
                <i className="las la-chevron-right text-gray-400 transition group-hover:translate-x-1 flex-shrink-0"></i>
              </div>
            </div>
          </Link>

          {/* Total Amount Invested */}
          <Link to="/portfolio/all">
            <div className="group relative overflow-hidden rounded-lg border border-green-200 bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800 min-h-[100px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20">
                    <i className="las la-hand-holding-usd text-xl sm:text-2xl"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Amount Invested</p>
                    <h3 className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{formatRs(dashboardData?.total_amount_invested || 0)}</h3>
                  </div>
                </div>
                <i className="las la-chevron-right text-gray-400 transition group-hover:translate-x-1 flex-shrink-0"></i>
              </div>
            </div>
          </Link>

          {/* Total Withdrawals */}
          <Link to="/withdraw/withdraw-history">
            <div className="group relative overflow-hidden rounded-lg border border-blue-200 bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800 min-h-[100px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20">
                    <i className="las la-money-bill-wave text-xl sm:text-2xl"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Withdrawals</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{dashboardData?.total_withdrawals || 0}</h3>
                  </div>
                </div>
                <i className="las la-chevron-right text-gray-400 transition group-hover:translate-x-1 flex-shrink-0"></i>
              </div>
            </div>
          </Link>
        </div>

        {/* Withdrawals Details */}
        <div className="mb-3 sm:mb-4 rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h5 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Withdrawal Status</h5>
          <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-3">
            {/* Successful Withdrawals */}
            <Link to="/withdraw/withdraw-history">
              <div className="group flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3 sm:p-4 transition hover:shadow-md dark:border-green-800 dark:bg-green-900/10 min-h-[80px]">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20">
                    <i className="las la-check-circle text-lg sm:text-xl"></i>
                  </div>
                  <div className="min-w-0">
                    <h6 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">{dashboardData?.successful_withdrawals || 0}</h6>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Successful</p>
                  </div>
                </div>
                <i className="las la-angle-right text-gray-400 transition group-hover:translate-x-1 flex-shrink-0"></i>
              </div>
            </Link>

            {/* Pending Withdrawals */}
            <Link to="/withdraw/withdraw-history">
              <div className="group flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-3 sm:p-4 transition hover:shadow-md dark:border-yellow-800 dark:bg-yellow-900/10 min-h-[80px]">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20">
                    <i className="las la-spinner text-lg sm:text-xl"></i>
                  </div>
                  <div className="min-w-0">
                    <h6 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">{dashboardData?.pending_withdrawals || 0}</h6>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  </div>
                </div>
                <i className="las la-angle-right text-gray-400 transition group-hover:translate-x-1 flex-shrink-0"></i>
              </div>
            </Link>

            {/* Failed Withdrawals */}
            <Link to="/withdraw/withdraw-history">
              <div className="group flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4 transition hover:shadow-md dark:border-red-800 dark:bg-red-900/10 min-h-[80px]">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20">
                    <i className="las la-times-circle text-lg sm:text-xl"></i>
                  </div>
                  <div className="min-w-0">
                    <h6 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">{dashboardData?.failed_withdrawals || 0}</h6>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Failed</p>
                  </div>
                </div>
                <i className="las la-angle-right text-gray-400 transition group-hover:translate-x-1 flex-shrink-0"></i>
              </div>
            </Link>
          </div>
        </div>

        {/* KYC Status Cards */}
        <div className="mb-3 sm:mb-4 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total KYC */}
          <Link to="/kyc/all">
            <div className="group rounded-lg border-2 border-primary-300 bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-md dark:border-primary-700 dark:bg-gray-800 min-h-[100px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/20">
                    <i className="las la-id-card text-xl sm:text-2xl"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total KYC</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{dashboardData?.total_kyc || 0}</h3>
                  </div>
                </div>
                <i className="las la-chevron-right text-gray-400 transition group-hover:translate-x-1 flex-shrink-0"></i>
              </div>
            </div>
          </Link>

          {/* Pending KYC */}
          <Link to="/kyc/all">
            <div className="group rounded-lg border-2 border-yellow-300 bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-md dark:border-yellow-700 dark:bg-gray-800 min-h-[100px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20">
                    <i className="las la-spinner text-xl sm:text-2xl"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pending KYC</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{dashboardData?.pending_kyc || 0}</h3>
                  </div>
                </div>
                <i className="las la-chevron-right text-gray-400 transition group-hover:translate-x-1 flex-shrink-0"></i>
              </div>
            </div>
          </Link>

          {/* Approved KYC */}
          <Link to="/kyc/all">
            <div className="group rounded-lg border-2 border-green-300 bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-md dark:border-green-700 dark:bg-gray-800 min-h-[100px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20">
                    <i className="las la-check-circle text-xl sm:text-2xl"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Approved KYC</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{dashboardData?.approved_kyc || 0}</h3>
                  </div>
                </div>
                <i className="las la-chevron-right text-gray-400 transition group-hover:translate-x-1 flex-shrink-0"></i>
              </div>
            </div>
          </Link>

          {/* Rejected KYC */}
          <Link to="/kyc/all">
            <div className="group rounded-lg border-2 border-red-300 bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-md dark:border-red-700 dark:bg-gray-800 min-h-[100px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20">
                    <i className="las la-times-circle text-xl sm:text-2xl"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Rejected KYC</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{dashboardData?.rejected_kyc || 0}</h3>
                  </div>
                </div>
                <i className="las la-chevron-right text-gray-400 transition group-hover:translate-x-1 flex-shrink-0"></i>
              </div>
            </div>
          </Link>
        </div>

        {/* Gold Trading Cards */}
        <div className="mb-3 sm:mb-4 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
          {/* Total Purchased Gold */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-3 sm:mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500 text-white">
                <i className="las la-shopping-cart text-xl sm:text-2xl"></i>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Purchased Gold</p>
            </div>
            <div className="flex items-end justify-between gap-2">
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">{dashboardData?.total_purchased_gold || '0'} g</h4>
              <Link to="/gold/redeem" className="flex items-center gap-1 text-xs sm:text-sm text-primary-500 hover:underline flex-shrink-0">
                <span className="hidden sm:inline">View All</span>
                <span className="sm:hidden">View</span>
                <i className="las la-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* Total Sold Gold */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-3 sm:mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg bg-red-500 text-white">
                <i className="las la-store text-xl sm:text-2xl"></i>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Sold Gold</p>
            </div>
            <div className="flex items-end justify-between gap-2">
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">{dashboardData?.total_selled_gold || '0'} g</h4>
              <Link to="/gold/redeem" className="flex items-center gap-1 text-xs sm:text-sm text-primary-500 hover:underline flex-shrink-0">
                <span className="hidden sm:inline">View All</span>
                <span className="sm:hidden">View</span>
                <i className="las la-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* Charge Change History */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-3 sm:mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-500 text-white">
                <i className="las la-history text-xl sm:text-2xl"></i>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Charge Change History</p>
            </div>
            <div className="flex items-end justify-between gap-2">
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">History</h4>
              <Link to="/gold/charge-history" className="flex items-center gap-1 text-xs sm:text-sm text-primary-500 hover:underline flex-shrink-0">
                <span className="hidden sm:inline">View All</span>
                <span className="sm:hidden">View</span>
                <i className="las la-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GoldDashboard;
