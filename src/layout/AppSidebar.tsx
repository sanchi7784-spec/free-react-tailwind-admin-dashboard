import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import logo from '../icons/ChatGPT Image Nov 5, 2025, 12_41_38 PM.png'
// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  GridIcon,
  ChevronDownIcon,
  HorizontaLDots,
  ListIcon,
  BoxIconLine,
  GroupIcon,
  LockIcon,
  FileIcon,
  DollarLineIcon,
  BoxIcon,
  PaperPlaneIcon,
  AlertIcon,
  DocsIcon,
  DownloadIcon,
  PlugInIcon,
  ArrowDownIcon,
  PageIcon,
  ShootingStarIcon,
  MailIcon,
  TimeIcon,
} from "../icons";
import { FlagTriangleRight,Users } from 'lucide-react'
import { useSidebar } from "../context/SidebarContext";
import { useDashboard, DashboardType } from "../context/DashboardContext";
import { 
  isEcommerceAuthenticated, 
  canAccessEcommerce, 
  canAccessGold,
  isSuperAdmin 
} from "../utils/ecommerceAuth";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// Ecommerce Sidebar Sections
const ecommerceSidebarSections: { title: string; items: NavItem[] }[] = [
  {
    title: "DASHBOARD",
    items: [
      {
        name: "Dashboard Overview",
        icon: <GridIcon />,
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
        icon: <GroupIcon />, 
        subItems: [
          { name: "All Users", path: "/ecommerce/users/all" },
          // { name: "Active Users", path: "/ecommerce/users/active" },
          // { name: "Banned Users", path: "/ecommerce/users/banned" },
        ],
      },
      { 
        name: "Products", 
        icon: <BoxIcon />, 
        subItems: [
          { name: "All Products", path: "/ecommerce/products/all" },
          { name: "Add Product", path: "/ecommerce/products/add" },
          { name: "Categories", path: "/ecommerce/products/categories" },
        ],
      },
      { 
        name: "Staff & Vendors", 
        icon: <GroupIcon />, 
        subItems: [
          { name: "All Vendors & Staff", path: "/ecommerce/vendors/all" },
          // { name: "Add Vendor", path: "/ecommerce/vendors/add" },
          { name: "Staff & Vendor Kyc", path: "/ecommerce/vendors/requests" },
          // { name: "Vendor Product List", path: "/ecommerce/vendors/products" },
        ],
      },

       { 
        name: "All KYC", 
        icon: <DocsIcon />, 
        subItems: [
          { name: "All KYC", path: "/ecommerce/kyc/all" },
          // { name: "Add Vendor", path: "/ecommerce/vendors/add" },
          // { name: "Vendor Kyc", path: "/ecommerce/vendors/requests" },
        ],
      },
      { 
        name: "Orders", 
        icon: <ShootingStarIcon />, 
        subItems: [
          { name: "All Orders", path: "/ecommerce/orders/all" },
          // { name: "Pending Orders", path: "/ecommerce/orders/pending" },
          // { name: "Completed Orders", path: "/ecommerce/orders/completed" },
          // { name: "Cancelled Orders", path: "/ecommerce/orders/cancelled" },
        ],
      },
      {
        name: "Refund Requests",
        icon: <AlertIcon />,
        path: "/ecommerce/refunds",
      },
      { 
        name: "Ads Banner", 
        icon: <ListIcon />, 
        subItems: [
          { name: "Add Banners", path: "/ecommerce/banners/all" },
          // { name: "Add Category", path: "/ecommerce/category/add" },
        ],
      },
      { 
        name: "Business Settings",
        icon: <BoxCubeIcon />,
        path: "/ecommerce/basicinfo/business-settings"
      },
      { 
        name: "Delivery Charges",
        icon: <DollarLineIcon />,
        path: "/ecommerce/delivery-charges"
      },
      { 
        name: "VAT & Tax",
        icon: <DollarLineIcon />,
        path: "/ecommerce/vat-tax"
      },
       { 
        name: "Reports", 
        icon: <FlagTriangleRight />, 
        subItems: [
          { name: "Products Reports", path: "/ecommerce/reports/products" },
          { name: "Order Reports", path: "/ecommerce/reports/orders" },
          { name: "Admin Tax Reports", path: "/ecommerce/reports/admin-tax" },
          { name: "Vendor Vat Reports", path: "/ecommerce/reports/vendor-vat" },
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
        icon: <GridIcon />,
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
      { name: "Customers", icon: <GroupIcon />, 
        subItems: [
          { name: "All Customers", path: "/customers/allcustomers" },
        ],
      },
      {
        name: "KYC Management",
        icon: <ListIcon />,
        subItems: [
          { name: "All KYC Logs", path: "/kyc/all" },
        ],
      },
    ],
  },
  {
    title: "ACCESS MANAGEMENT",
    items: [
      { name: "System Access", icon: <LockIcon />, 
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
      { name: "Bank Accounts", icon: <FileIcon />, path: "/Transactions" },
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
        icon: <GridIcon />,
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
      { name: "Customers", icon: <GroupIcon />, 
        subItems: [
          { name: "All Customers", path: "/customers/allcustomers" },
        ],
      },
      {
        name: "KYC Management",
        icon: <ListIcon />,
        subItems: [
          { name: "All KYC Logs", path: "/kyc/all" },
        ],
      },
    ],
  },
  {
    title: "ACCESS MANAGEMENT",
    items: [
      { name: "System Access", icon: <LockIcon />, 
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
      { name: "Bank Accounts", icon: <FileIcon />, path: "/Transactions" },
      {
        name: "Gold History",
        icon: <TimeIcon />,
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
        icon: <ArrowDownIcon />,
        subItems: [
           { name: "Withdraw History", path: "/withdraw/withdraw-history" },
        ],
      },
      { name: "Portfolios", icon: <PageIcon />, 
        subItems: [
          { name: "All Portfolios", path: "/portfolio/all" }, 
          { name: "Create Portfolio", path: "/portfolio/allprofileupdates" },
          { name: "Staff Profile", path: "/portfolio/uiforstaffdetails" }
        ] 
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
  const { dashboardType, setDashboardType } = useDashboard();
  const location = useLocation();
  const navigate = useNavigate();

  // Select sidebar sections based on user domain
  // Super Admin (0): Can see all sections
  // MPay User (1): Can only see Gold/BBPS sections
  // Ecom User (2): Can only see Ecommerce sections
  let sidebarSections: { title: string; items: NavItem[] }[] = [];
  
  if (isSuperAdmin()) {
    // Super admin sees sections based on current dashboard type
    sidebarSections = 
      dashboardType === 'ecommerce' ? ecommerceSidebarSections :
      dashboardType === 'bbps' ? bbpsSidebarSections :
      goldSidebarSections;
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

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: string;
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
                  // Check if this is a dashboard overview item
                  const isDashboardItem = sectionKey === '0' && index === 0;
                  
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
