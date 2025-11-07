import { useState } from "react";
import { Link } from "react-router";

interface Role {
  id: string;
  number: number;
  name: string;
  isEditable: boolean;
}

const rolesData: Role[] = [
  {
    id: "1",
    number: 1,
    name: "Super Admin",
    isEditable: false,
  },
  {
    id: "2",
    number: 2,
    name: "Tester",
    isEditable: true,
  },
];

const ManageRoles = () => {
  const [roles] = useState<Role[]>(rolesData);

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Manage Roles
          </h1>
          <Link
            to="/access/roles/add"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            ADD NEW ROLE
          </Link>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-100 dark:bg-indigo-900/30">
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                    NAME
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {roles.map((role, index) => (
                  <tr
                    key={role.id}
                    className={`${
                      index % 2 === 0
                        ? "bg-white dark:bg-slate-800"
                        : "bg-gray-50 dark:bg-slate-700"
                    } hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors`}
                  >
                    <td className="px-6 py-5">
                      <span className="text-base font-medium text-gray-900 dark:text-white">
                        {role.number}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-base font-medium text-gray-900 dark:text-white">
                        {role.name}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {role.isEditable ? (
                        <Link
                          to={`/access/roles/edit/${role.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit Permission
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded-lg cursor-not-allowed opacity-90 shadow-sm"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          Not Editable
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {roles.map((role) => (
              <div
                key={role.id}
                className="border-b border-gray-200 dark:border-slate-600 p-4 hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors"
              >
                {/* Role Info */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                    <span className="text-base font-bold text-gray-900 dark:text-white">
                      {role.number}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {role.name}
                    </h3>
                  </div>
                </div>

                {/* Action Button */}
                <div>
                  {role.isEditable ? (
                    <Link
                      to={`/access/roles/edit/${role.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit Permission
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500 text-white text-sm font-medium rounded-lg cursor-not-allowed opacity-90 shadow-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      Not Editable
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageRoles;
