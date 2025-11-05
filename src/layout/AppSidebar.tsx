import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

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
import { useSidebar } from "../context/SidebarContext";
import logoFinal from "../icons/logofinal.png";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};
const sidebarSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Dashboard",
    items: [
      {
        name: "Dashboard Overview",
        icon: <GridIcon />,
        subItems: [{ name: "Ecommerce", path: "/" }],
      },
    ],
  },
  {
    title: "Customer Management",
    items: [
      { name: "Customers", icon: <GroupIcon />, 
        
           subItems: [
          { name: "All Customers", path: "/customers/allcustomers" },
          { name: "Active Customers", path: "/customers/activecustomers" },
           { name: "Closed Customers", path: "/customers/closedcustomers" },
            { name: "Disabled Customers", path: "/customers/disabledcustomers" },
                   { name: "Add New Customers", path: "/customers/addnew" },
                          { name: "Notifications", path: "/customers/notifications" },
                                 { name: "Send Email to All", path: "/customers/sendemail" },
        ],
      },
      {
        name: "KYC Management",
        icon: <ListIcon />,
        subItems: [
          { name: "Pending KYC", path: "/kyc/pending" },
          { name: "Approved KYC", path: "/kyc/approved" },
           { name: "Rejected KYC", path: "/kyc/rejected" },
            { name: "All KYC Logs", path: "/kyc/all" },
        ],
      },
    ],
  },
  {
    title: "Access Management",
    items: [
      { name: "System Access", icon: <LockIcon />, subItems: [{ name: "Manage Roles", path: "/access/roles" }, { name: "Manage Staff", path: "/access/permissions" }] },
    ],
  },
  {
    title: "Manage Bank Branches",
    items: [{ name: "Manage Branches", icon: <BoxIconLine />, path: "/branches" ,
   subItems: [
          { name: "All Branch", path: "/branches/all" },
          { name: "Branch Staff", path: "/branches/staff" },
        ],

    }],
  },
  {
    title: "Transactions",
    items: [
      { name: "Transactions", icon: <FileIcon />, path: "/transactions" },
      { name: "Wallets", icon: <DollarLineIcon />, path: "/wallets" },
      { name: "Virtual Cards", icon: <BoxIcon />, path: "/virtual-cards" },
      {
        name: "Profits",
        icon: <DollarLineIcon />,
        subItems: [
          { name: "User Paybacks", path: "/profits/paybacks" },
          { name: "Bank Profits", path: "/profits/bankprofit" },
        ],
      },
      {
        name: "Fund Transfer",
        icon: <PaperPlaneIcon />,
        subItems: [
          { name: "Pending Transfer", path: "/fund-transfer/Pending" },
          { name: "Rejected Transfer", path: "/fund-transfer/Rejected" },
           { name: "All Transfer", path: "/fund-transfer/all-transfer" },
            { name: "Own Bank Transfer", path: "/fund-transfer/ownbanktransfer" },
              { name: "Other Bank Transfer", path: "/fund-transfer/otherbanktransfer" },
                { name: "Wire Transfer", path: "/fund-transfer/wire-transfer" },
                  { name: "Others Bank", path: "/fund-transfer/othersbank" },
        ],
      },
      // --- GOLD HISTORY DROPDOWN ---
      {
        name: "Gold History",
        icon: <TimeIcon />,
        subItems: [
          { name: "Buy", path: "/gold/buy" },
          { name: "Sell", path: "/gold/sell" },
          { name: "Redeem", path: "/gold/redeem", new: true }, // badge example
          { name: "Gift", path: "/gold/gift" },
        ],
      },
      // --- END GOLD HISTORY ---
      { name: "DPS", icon: <BoxCubeIcon />, subItems: [{ name: "DPS List", path: "/dps" }] },
      { name: "FDR", icon: <BoxCubeIcon />, subItems: [{ name: "FDR List", path: "/fdr" }] },
      { name: "Loan", icon: <AlertIcon />, 
        subItems: [
          { name: "Request Loan", path: "/loan/requestloan" },
{ name: "Approved Loan", path: "/loan/approveloan" },
{ name: "Payable Installments", path: "/loan/payableinstallments  " },
{ name: "Completed Loan", path: "/loan/completedloan" },
{ name: "Rejected Loan", path: "/loan/rejectedloan" },
{ name: "All Loan", path: "/loan/all-loan" },
{ name: "Loan Plans", path: "/loan/loan-plans" }

        ] },
        
    ],
  },
  {
    title: "Bill Management",
    items: [
      {
        name: "Bill Management",
        icon: <DocsIcon />,
        subItems: [
          { name: "Import Services", path: "/bill/import-services" },
          { name: "Convert Rate", path: "/bill/convert-rate" },
          { name: "Bill Services list", path: "/bill/billservices-list" },
        ],
      },
      {
        name: "Bill History",
        icon: <DownloadIcon />,
        subItems: [
          { name: "Pending Bill", path: "/bill/history/bendingbills" },
          { name: "Complete Bill", path: "/bill/history/complete-bill" },
               { name: "Returned Bill", path: "/bill/history/returned-bill" },
                    { name: "All Bill", path: "/bill/history/all-bill" },
        ],
      },
    ],
  },
  {
    title: "Essentials",
    items: [
      {
        name: "Automatic Gateways",
        icon: <PlugInIcon />,
        subItems: [
          { name: "Gateway List", path: "/gateways" },
          // { name: "Add Gateway", path: "/gateways/add" },
        ],
      },
      {
        name: "Deposits",
        icon: <DownloadIcon />,
        subItems: [
          { name: "Automatic Methods", path: "/deposits/automatic-methods" },
          { name: "Manual Methods", path: "/deposits/manual-methods" },
             { name: "Pending Manual Deposits", path: "/deposits/pendin-manual-deposits" },
                { name: "Deposit History", path: "/deposits/deposit-history" },
        ],
      },
      {
        name: "Withdraw",
        icon: <ArrowDownIcon />,
        subItems: [
          { name: "Automatic Methods", path: "/withdraw/automatic-methods" },
          { name: "Manual Methods", path: "/withdraw/manualmethods" },
           { name: "Pending Withdraws", path: "/withdraw/pending-withdraws" },
           { name: "Withdraw Schedule", path: "/withdraw/withdraw-Schedule" },
           { name: "Withdraw History", path: "/withdraw/withdraw-history" },
        ],
      },
      { name: "Referral", icon: <MailIcon />, subItems: [{ name: "Referral Settings", path: "/referral/settings" },{ name: "Referral Reports", path: "/referral/reports" }] },
      { name: "Portfolios", icon: <PageIcon />, subItems: [{ name: "All Portfolios", path: "/portfolios" }, { name: "Create Portfolio", path: "/portfolios/new" }] },
      {
        name: "Manage Reward Point",
        icon: <ShootingStarIcon />,
        subItems: [
          { name: "Reward Earnings", path: "/rewards/rewardsearnings" },
          { name: "Reward Redeems", path: "/rewards/rewardredeems" },
        ],
      },
    ],
  },
  {
    title: "Site Settings",
    items: [
      {
        name: "Settings",
        icon: <BoxIcon />,
        subItems: [
          { name: "Site Settings", path: "/settings/sitesetting" },
          { name: "Email Settings", path: "/settings/email-setting" },
          { name: "SEO Meta Settings", path: "/settings/seo-meta-settings" },
           { name: "Language Settings", path: "/settings/language-settings" },
           { name: "Page Settings", path: "/settings/page-settings" },
           { name: "Plugin Settings", path: "/settings/plugin-settings" },
           { name: "Billing Service Settings", path: "/settings/billing-service-settings" },
           { name: "Card Provider", path: "/settings/Card Provider" },
           { name: "SMS Settings", path: "/settings/sms-settings" },
           { name: "Push Notification", path: "/settings/push-notification" },
           { name: "Notification Tune", path: "/settings/notification-tune" },
        ],
      },
    ],
  },
  {
    title: "App Settings",
    items: [
      {
        name: "App Settings",
        icon: <BoxIconLine />,
        subItems: [
          { name: "Onboarding Screen", path: "/app-settings/mobile-onboarding" },
          // { name: "Integrations", path: "/app-settings/integrations" },
        ],
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

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
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
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
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`blood-sidebar fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 text-white h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
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
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img src={logoFinal} alt="Logo" width={150} height={40} className=" ml-10" />
            </>
          ) : (
            <img src={logoFinal} alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
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
  );
};

export default AppSidebar;
