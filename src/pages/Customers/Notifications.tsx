import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Notification {
  id: string;
  message: string;
  time: string;
  userId: string;
  avatarColor: string;
}

export default function Notifications() {
  const navigate = useNavigate();

  const notifications: Notification[] = [
    {
      id: "1",
      message: "New account registered.",
      time: "14 hours ago",
      userId: "1",
      avatarColor: "bg-cyan-100 dark:bg-cyan-900/30",
    },
    {
      id: "2",
      message: "New account registered.",
      time: "18 hours ago",
      userId: "2",
      avatarColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      id: "3",
      message: "New account registered.",
      time: "20 hours ago",
      userId: "3",
      avatarColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      id: "4",
      message: "New account registered.",
      time: "1 day ago",
      userId: "4",
      avatarColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      id: "5",
      message: "New account registered.",
      time: "1 day ago",
      userId: "5",
      avatarColor: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      id: "6",
      message: "New account registered.",
      time: "1 day ago",
      userId: "6",
      avatarColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      id: "7",
      message: "New account registered.",
      time: "1 day ago",
      userId: "7",
      avatarColor: "bg-gray-600 dark:bg-gray-500",
    },
    {
      id: "8",
      message: "New account registered.",
      time: "2 days ago",
      userId: "8",
      avatarColor: "bg-indigo-500 dark:bg-indigo-600",
    },
    {
      id: "9",
      message: "New account registered.",
      time: "2 days ago",
      userId: "9",
      avatarColor: "bg-blue-500 dark:bg-blue-600",
    },
  ];

  const handleExplore = (userId: string) => {
    navigate(`/customers/edit/${userId}`);
  };

  const handleMarkAllRead = () => {
    console.log("Marking all notifications as read");
    // TODO: Implement mark all as read functionality
  };

  return (
    <>
      <PageMeta title="All Notifications - Admin" description="View all customer notifications" />
      <PageBreadcrumb pageTitle="All Notifications" />

      <div className="w-full max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            All Notifications
          </h1>
          <button
            onClick={handleMarkAllRead}
            className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white px-6 py-2.5 rounded inline-flex items-center gap-2 font-medium transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            MARK ALL READ
          </button>
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full ${notification.avatarColor} flex items-center justify-center`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-600 dark:text-gray-300"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {notification.time}
                    </p>
                  </div>

                  {/* Explore Button */}
                  <button
                    onClick={() => handleExplore(notification.userId)}
                    className="w-full sm:w-auto flex-shrink-0 bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2.5 rounded inline-flex items-center justify-center gap-2 font-medium transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State (if no notifications) */}
        {notifications.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto text-gray-400 dark:text-gray-600 mb-4"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No notifications
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              You're all caught up! No new notifications at this time.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
