import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import goldLogo from '../icons/ChatGPT Image Nov 5, 2025, 12_41_38 PM.png'
import ecomLogo from '../icons/mkart-Photoroom.png'
// Assume these icons are imported from an icon library
import {
  ChevronDownIcon,
  HorizontaLDots,
} from "../icons";
import {
  LayoutDashboard,
  Users,
  Package,
  UserCheck,
  FileText,
  Warehouse,
  ShoppingCart,
  RotateCcw,
  Image,
  Settings,
  Truck,
  Receipt,
  BarChart2,
  Lock,
  CreditCard,
  Clock,
  ArrowDownCircle,
  Briefcase,
  FlagTriangleRight,
  BadgePercent,
  Store,
  ShieldCheck,
  Coins,
} from 'lucide-react'
import { useSidebar } from "../context/SidebarContext";
import { useDashboard, DashboardType } from "../context/DashboardContext";
import { getProfile } from "../api/profile";
import { 
  isEcommerceAuthenticated, 
  canAccessEcommerce, 
  canAccessGold,
  isSuperAdmin,
  isVendor,
} from "../utils/ecommerceAuth";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const ECOMMERCE_ROLE_ID_KEY = "ecommerce_role_id";

const ECOMMERCE_ALWAYS_ALLOWED_PATHS = ["/ecommerce/vendors/requests"];

const ECOMMERCE_ROLE_ALLOWED_PATHS: Record<number, string[]> = {
  3: [
    "/ecommerce/users/all",
  ],
  4: [
    "/ecommerce/products/all",
    "/ecommerce/products/add",
    "/ecommerce/products/categories",
    "/ecommerce/inventory",
    "/ecommerce/reports/products",
  ],
  5: [
    "/ecommerce/banners/all",
  ],
  6: [
    "/ecommerce/kyc/all",
  ],
  7: [
    "/ecommerce/basicinfo/business-settings",
  ],
  8: [
    "/ecommerce/orders/all",
    "/ecommerce/reports/orders",
  ],
  9: [
    "/ecommerce/vendors/all",
    "/ecommerce/vendors/requests",
  ],
  10: [
    "/ecommerce/orders/all",
    "/ecommerce/delivery-charges",
  ],
};

const ECOMMERCE_RESTRICTED_ROLE_IDS = new Set(
  Object.keys(ECOMMERCE_ROLE_ALLOWED_PATHS).map(Number)
);

const filterEcommerceSectionsByRole = (
  sections: { title: string; items: NavItem[] }[],
  roleId: number | null
) => {
  const rolePaths = roleId ? ECOMMERCE_ROLE_ALLOWED_PATHS[roleId] ?? [] : [];
  const allowedPaths = new Set([...rolePaths, ...ECOMMERCE_ALWAYS_ALLOWED_PATHS]);

  return sections
    .map((section) => {
      if (section.title === "DASHBOARD") {
        return {
          ...section,
          items: section.items.filter((item) => item.name !== "Dashboard Overview"),
        };
      }

      const filteredItems = section.items
        .map((item) => {
          if (item.path) {
            return allowedPaths.has(item.path) ? item : null;
          }

          if (item.subItems) {
            const filteredSubItems = item.subItems.filter((subItem) =>
              allowedPaths.has(subItem.path)
            );

            if (filteredSubItems.length > 0) {
              return {
                ...item,
                subItems: filteredSubItems,
              };
            }
          }

          return null;
        })
        .filter((item): item is NavItem => item !== null);

      return {
        ...section,
        items: filteredItems,
      };
    })
    .filter((section) => section.items.length > 0);
};

// Ecommerce Sidebar Sections
const ecommerceSidebarSections: { title: string; items: NavItem[] }[] = [
  {
    title: "DASHBOARD",
    items: [
      {
        name: "Dashboard Overview",
        icon: <LayoutDashboard size={20} />,
        subItems: [
          { name: "Ecommerce", path: "/ecom" },
          { name: "BBPS", path: "/bbps" },
          { name: "Gold", path: "/" }
        ],
      },
    ],
  },
  {
    title: "ECOMMERCE",
    items: [
      { 
        name: "Users", 
        icon: <Users size={20} />, 
        subItems: [
          { name: "All Users", path: "/ecommerce/users/all" },
          // { name: "Active Users", path: "/ecommerce/users/active" },
          // { name: "Banned Users", path: "/ecommerce/users/banned" },
        ],
      },
      { 
        name: "Products", 
        icon: <Package size={20} />, 
        subItems: [
          { name: "All Products", path: "/ecommerce/products/all" },
          { name: "Add Product", path: "/ecommerce/products/add" },
          { name: "Categories", path: "/ecommerce/products/categories" },
        ],
      },
      { 
        name: "Staff & Vendors", 
        icon: <Store size={20} />, 
        subItems: [
          { name: "All Vendors & Staff", path: "/ecommerce/vendors/all" },
          // { name: "Add Vendor", path: "/ecommerce/vendors/add" },
          { name: "Staff & Vendor Kyc", path: "/ecommerce/vendors/requests" },
          // { name: "Vendor Product List", path: "/ecommerce/vendors/products" },
        ],
      },

       { 
        name: "All KYC", 
        icon: <ShieldCheck size={20} />, 
        subItems: [
          { name: "All KYC", path: "/ecommerce/kyc/all" },
          // { name: "Add Vendor", path: "/ecommerce/vendors/add" },
          // { name: "Vendor Kyc", path: "/ecommerce/vendors/requests" },
        ],
      },
      {
        name: "Inventory",
        icon: <Warehouse size={20} />,
        path: "/ecommerce/inventory",
      },
      { 
        name: "Orders", 
        icon: <ShoppingCart size={20} />, 
        subItems: [
          { name: "All Orders", path: "/ecommerce/orders/all" },
          // { name: "Pending Orders", path: "/ecommerce/orders/pending" },
          // { name: "Completed Orders", path: "/ecommerce/orders/completed" },
          // { name: "Cancelled Orders", path: "/ecommerce/orders/cancelled" },
        ],
      },
      {
        name: "Payments",
        icon: <CreditCard size={20} />,
        path: "/ecommerce/payments",
      },
      {
        name: "Refund Requests",
        icon: <RotateCcw size={20} />,
        path: "/ecommerce/refunds",
      },
      { 
        name: "Ads Banner", 
        icon: <Image size={20} />, 
        subItems: [
          { name: "Add Banners", path: "/ecommerce/banners/all" },
          // { name: "Add Category", path: "/ecommerce/category/add" },
        ],
      },
      { 
        name: "Business Settings",
        icon: <Settings size={20} />,
        path: "/ecommerce/basicinfo/business-settings"
      },
      { 
        name: "Delivery Charges",
        icon: <Truck size={20} />,
        path: "/ecommerce/delivery-charges"
      },
      { 
        name: "VAT & Tax",
        icon: <BadgePercent size={20} />,
        path: "/ecommerce/vat-tax"
      },
       { 
        name: "Reports", 
        icon: <BarChart2 size={20} />, 
        subItems: [
          { name: "Products Reports", path: "/ecommerce/reports/products" },
          { name: "Order Reports", path: "/ecommerce/reports/orders" },
          // { name: "Admin Tax Reports", path: "/ecommerce/reports/admin-tax" },
          // { name: "Vendor Vat Reports", path: "/ecommerce/reports/vendor-vat" },
          // { name: "Add Category", path: "/ecommerce/category/add" },
        ],
      },
    ],
  },
  // {
  //   title: "Profile Settings",
  //   items: [
  //     { name: "Profile", icon: <DocsIcon />, path: "/profile" },
  //     // { name: "Revenue Report", icon: <DollarLineIcon />, path: "/ecommerce/reports/revenue" },
  //   ],
  // },
];

// BBPS Sidebar Sections
const bbpsSidebarSections: { title: string; items: NavItem[] }[] = [
  {
    title: "DASHBOARD",
    items: [
      {
        name: "Dashboard Overview",
        icon: <LayoutDashboard size={20} />,
        subItems: [
          { name: "Ecommerce", path: "/ecom" },
          { name: "BBPS", path: "/bbps" },
          { name: "Gold", path: "/" }
        ],
      },
    ],
  },
  {
    title: "CUSTOMER MANAGEMENT",
    items: [
      { name: "Customers", icon: <Users size={20} />, 
        subItems: [
          { name: "All Customers", path: "/customers/allcustomers" },
        ],
      },
      {
        name: "KYC Management",
        icon: <FileText size={20} />,
        subItems: [
          { name: "All KYC Logs", path: "/kyc/all" },
        ],
      },
    ],
  },
  {
    title: "ACCESS MANAGEMENT",
    items: [
      { name: "System Access", icon: <Lock size={20} />, 
        subItems: [
          { name: "Upload Staff KYC", path: "/access/roles" }, 
          { name: "Manage Staff", path: "/access/permissions" }
        ] 
      },
    ],
  },
  {
    title: "TRANSACTIONS",
    items: [
      { name: "Bank Accounts", icon: <CreditCard size={20} />, path: "/Transactions" },
    ],
  },
];

// Gold Sidebar Sections (Original)
const goldSidebarSections: { title: string; items: NavItem[] }[] = [
  {
    title: "DASHBOARD",
    items: [
      {
        name: "Dashboard Overview",
        icon: <LayoutDashboard size={20} />,
        subItems: [
          { name: "Ecommerce", path: "/ecom" },
          { name: "BBPS", path: "/bbps" },
          { name: "Gold", path: "/" }
        ],
      },
    ],
  },
  {
    title: "CUSTOMER MANAGEMENT",
    items: [
      { name: "Customers", icon: <Users size={20} />, 
        subItems: [
          { name: "All Customers", path: "/customers/allcustomers" },
        ],
      },
      {
        name: "KYC Management",
        icon: <FileText size={20} />,
        subItems: [
          { name: "All KYC Logs", path: "/kyc/all" },
        ],
      },
    ],
  },
  {
    title: "ACCESS MANAGEMENT",
    items: [
      { name: "System Access", icon: <Lock size={20} />, 
        subItems: [
          { name: "Upload Staff KYC", path: "/access/roles" }, 
          { name: "Manage Staff", path: "/access/permissions" }
        ] 
      },
    ],
  },
  {
    title: "TRANSACTIONS",
    items: [
      { name: "Bank Accounts", icon: <CreditCard size={20} />, path: "/Transactions" },
      {
        name: "Gold History",
        icon: <Clock size={20} />,
        subItems: [
          { name: "Gold Transactions", path: "/gold/redeem", new: true },
          { name: "Charge Limit", path: "/gold/chargelimit" },
          { name: "Charge Change History", path: "/gold/charge-history" },
          { name: "Wallet Transactions", path: "/gold/redeemunits" },
        ],
      },
    ],
  },
  {
    title: "ESSENTIALS",
    items: [
      {
        name: "Withdraw",
        icon: <ArrowDownCircle size={20} />,
        subItems: [
           { name: "Withdraw History", path: "/withdraw/withdraw-history" },
        ],
      },
      { name: "Portfolios", icon: <Briefcase size={20} />, 
        subItems: [
          { name: "All Portfolios", path: "/portfolio/all" }, 
          { name: "Create Portfolio", path: "/portfolio/allprofileupdates" },
          { name: "Staff Profile", path: "/portfolio/uiforstaffdetails" }
        ] 
      },
    ],
  },
];

// Vendor Sidebar Sections (restricted ecommerce view)
const vendorSidebarSections: { title: string; items: NavItem[] }[] = [
  {
    title: "DASHBOARD",
    items: [
      {
        name: "Dashboard Overview",
        icon: <LayoutDashboard size={20} />,
        subItems: [
          { name: "Ecommerce", path: "/ecom" },
        ],
      },
    ],
  },
  {
    title: "ECOMMERCE",
    items: [
      {
        name: "Products",
        icon: <Package size={20} />,
        subItems: [
          { name: "All Products", path: "/ecommerce/products/all" },
          { name: "Add Product", path: "/ecommerce/products/add" },
          { name: "Categories", path: "/ecommerce/products/categories" },
        ],
      },
      {
        name: "Inventory",
        icon: <Warehouse size={20} />,
        path: "/ecommerce/inventory",
      },
      {
        name: "Staff & Vendors",
        icon: <Store size={20} />,
        subItems: [
          { name: "Staff & Vendor Kyc", path: "/ecommerce/vendors/requests" },
        ],
      },
      {
        name: "Orders",
        icon: <ShoppingCart size={20} />,
        subItems: [
          { name: "All Orders", path: "/ecommerce/orders/all" },
        ],
      },
      {
        name: "Payments",
        icon: <CreditCard size={20} />,
        path: "/ecommerce/payments",
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
  const { dashboardType, setDashboardType } = useDashboard();
  const [roleId, setRoleId] = useState<number | null>(() => {
    const storedRole = localStorage.getItem(ECOMMERCE_ROLE_ID_KEY);
    if (!storedRole) return null;
    const parsed = Number(storedRole);
    return Number.isNaN(parsed) ? null : parsed;
  });

  // Logo: ecom users always see mkart logo; gold/BBPS users always see gold logo;
  // super admin sees logo based on the currently active dashboard type.
  const logo =
    (!canAccessGold() && canAccessEcommerce()) ||
    (isSuperAdmin() && dashboardType === 'ecommerce')
      ? ecomLogo
      : goldLogo;
  const location = useLocation();
  const navigate = useNavigate();

  // Select sidebar sections based on user domain
  // Super Admin (0): Can see all sections
  // MPay User (1): Can only see Gold/BBPS sections
  // Ecom User (2): Can only see Ecommerce sections
  // Vendor (3): Can only see restricted Ecommerce sections
  let sidebarSections: { title: string; items: NavItem[] }[] = [];
  
  if (isSuperAdmin()) {
    // Super admin sees sections based on current dashboard type
    sidebarSections = 
      dashboardType === 'ecommerce' ? ecommerceSidebarSections :
      dashboardType === 'bbps' ? bbpsSidebarSections :
      goldSidebarSections;
  } else if (isVendor()) {
    // Vendor (domain 3) - restricted ecommerce sections only
    sidebarSections = vendorSidebarSections;
  } else if (canAccessEcommerce() && !canAccessGold()) {
    // Ecom user (domain 2) - only ecommerce sections
    sidebarSections = ecommerceSidebarSections;
  } else if (canAccessGold() && !canAccessEcommerce()) {
    // MPay user (domain 1) - only gold/BBPS sections based on dashboard type
    sidebarSections = 
      dashboardType === 'bbps' ? bbpsSidebarSections :
      goldSidebarSections;
  }

  // Filter dashboard overview based on user domain
  sidebarSections = sidebarSections.map(section => {
    if (section.title === "DASHBOARD") {
      return {
        ...section,
        items: section.items.map(item => {
          if (item.name === "Dashboard Overview" && item.subItems) {
            // Filter dashboard options based on domain access
            const filteredSubItems = item.subItems.filter(subItem => {
              if (subItem.path === '/ecom') {
                return canAccessEcommerce();
              }
              if (subItem.path === '/bbps' || subItem.path === '/') {
                return canAccessGold();
              }
              return true;
            });
            return { ...item, subItems: filteredSubItems };
          }
          return item;
        })
      };
    }
    return section;
  });

  const isRestrictedEcommerceUser =
    !isSuperAdmin() &&
    !isVendor() &&
    canAccessEcommerce() &&
    !canAccessGold();

  const shouldApplyEcommerceRoleFilter =
    isRestrictedEcommerceUser &&
    roleId !== null &&
    ECOMMERCE_RESTRICTED_ROLE_IDS.has(roleId);

  if (shouldApplyEcommerceRoleFilter) {
    sidebarSections = filterEcommerceSectionsByRole(sidebarSections, roleId);
  }

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: string;
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!isRestrictedEcommerceUser) return;

    let isMounted = true;

    const loadRoleId = async () => {
      try {
        const profile = await getProfile();
        const nextRoleId = profile?.data?.role_id ?? null;
        if (!isMounted) return;
        setRoleId(nextRoleId);

        if (nextRoleId !== null && nextRoleId !== undefined) {
          localStorage.setItem(ECOMMERCE_ROLE_ID_KEY, String(nextRoleId));
        }
      } catch {
        if (!isMounted) return;
        const storedRole = localStorage.getItem(ECOMMERCE_ROLE_ID_KEY);
        if (!storedRole) {
          setRoleId(null);
        }
      }
    };

    loadRoleId();

    return () => {
      isMounted = false;
    };
  }, [isRestrictedEcommerceUser]);

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    sidebarSections.forEach((section, sIndex) => {
      section.items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: `${sIndex}`, index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, sectionKey: string) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === sectionKey &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: sectionKey, index };
    });
  };

  const handleDashboardClick = (path: string) => {
    // Determine which dashboard type based on path
    let type: DashboardType = 'gold';
    if (path === '/ecom') type = 'ecommerce';
    else if (path === '/bbps') type = 'bbps';
    else if (path === '/') type = 'gold';
    
    // Validate access based on domain
    if (type === 'ecommerce' && !canAccessEcommerce()) {
      console.warn('User does not have access to ecommerce dashboard');
      return;
    }
    
    if ((type === 'gold' || type === 'bbps') && !canAccessGold()) {
      console.warn('User does not have access to gold/BBPS dashboard');
      return;
    }
    
    setDashboardType(type);
    navigate('/dashboard');
    if (isMobileOpen) toggleMobileSidebar();
  };

  const renderMenuItems = (items: NavItem[], sectionKey: string) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, sectionKey)}
              className={`menu-item group ${
                openSubmenu?.type === sectionKey && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === sectionKey && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === sectionKey &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
            ) : (
            nav.path && (
              <Link
                to={nav.path}
                onClick={() => {
                  if (isMobileOpen) toggleMobileSidebar();
                }}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${sectionKey}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === sectionKey && openSubmenu?.index === index
                    ? `${subMenuHeight[`${sectionKey}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => {
                  const isDashboardItem = nav.name === "Dashboard Overview";
                  
                  return (
                    <li key={subItem.name}>
                        {isDashboardItem ? (
                        <button
                          onClick={() => handleDashboardClick(subItem.path)}
                          className={`menu-dropdown-item w-full text-left ${
                            location.pathname === '/dashboard' && 
                            ((subItem.path === '/ecom' && dashboardType === 'ecommerce') ||
                             (subItem.path === '/bbps' && dashboardType === 'bbps') ||
                             (subItem.path === '/' && dashboardType === 'gold'))
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${
                                  location.pathname === '/dashboard' && 
                                  ((subItem.path === '/ecom' && dashboardType === 'ecommerce') ||
                                   (subItem.path === '/bbps' && dashboardType === 'bbps') ||
                                   (subItem.path === '/' && dashboardType === 'gold'))
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${
                                  location.pathname === '/dashboard' && 
                                  ((subItem.path === '/ecom' && dashboardType === 'ecommerce') ||
                                   (subItem.path === '/bbps' && dashboardType === 'bbps') ||
                                   (subItem.path === '/' && dashboardType === 'gold'))
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                pro
                              </span>
                            )}
                          </span>
                        </button>
                        ) : (
                        <Link
                          to={subItem.path}
                          onClick={() => {
                            if (isMobileOpen) toggleMobileSidebar();
                          }}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                pro
                              </span>
                            )}
                          </span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
    <aside
      className={`blood-sidebar fixed top-16 lg:top-0 bottom-0 left-0 px-5 text-white transition-all duration-300 ease-in-out z-50 border-r border-gray-200 flex flex-col
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="sidebar"
      data-theme="blood"
    >
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden absolute top-4 right-4 text-white bg-transparent p-2"
        aria-label="Close sidebar"
      >
        ✕
      </button>
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        {isExpanded || isHovered || isMobileOpen ? (
          <img src={logo} alt="Logo" width={150} height={40} className=" ml-10" />
        ) : (
          <img src={logo} alt="Logo" width={32} height={32} />
        )}
      </div>
      <div
        className="flex flex-col flex-1 min-h-0 overflow-y-auto duration-300 ease-linear no-scrollbar"
        style={{ WebkitOverflowScrolling: "touch", overscrollBehavior: "contain", overscrollBehaviorY: "contain" }}
      >
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {sidebarSections.map((section, sIndex) => (
              <div key={section.title}>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    section.title
                  ) : (
                    <HorizontaLDots />
                  )}
                </h2>
                {renderMenuItems(section.items, `${sIndex}`)}
              </div>
            ))}
          </div>
        </nav>
  {/* Sidebar widget removed per user request */}
      </div>
    </aside>
      {isMobileOpen && (
        <div
          onClick={toggleMobileSidebar}
          className="fixed inset-0 bg-blue bg-opacity-40 lg:hidden z-40"
          aria-hidden
        />
      )}
    </>
  );
};

export default AppSidebar;
