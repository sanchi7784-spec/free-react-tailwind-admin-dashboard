import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import type { ReactNode } from "react";
import { isAuthenticated } from "./utils/auth";
import { isEcommerceAuthenticated } from "./utils/ecommerceAuth";
import { DashboardProvider } from "./context/DashboardContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import PendingKYC from "./pages/KYC/pendingkyc";
import RejectedKYC from "./pages/KYC/rejectedkyc";
import ApprovedKYC from "./pages/KYC/approvedkyc";
import AllKYCLogs from "./pages/KYC/allkyc";
import FormElements from "./pages/Customers/AllCustomers";
import ActiveCustomers from "./pages/Customers/ActiveCustomers";
import ClosedCustomers from "./pages/Customers/ClosedCustomers";
import DisabledCustomers from "./pages/Customers/DisabledCustomers";
import AddNewCustomer from "./pages/Customers/AddNewCustomer";
import Notifications from "./pages/Customers/Notifications";
import SendEmailToAll from "./pages/Customers/SendEmailToAll";
import EditCustomer from "./pages/Customers/EditCustomer";
import GoldBuy from "./pages/Gold/GoldBuy";
import GoldSell from "./pages/Gold/GoldSell";
import GoldRedeem from "./pages/Gold/GoldRedeem";
import GoldGift from "./pages/Gold/GoldGift";
import GoldCategory from "./pages/Gold/GoldCategory";
import GoldChargeLimit from "./pages/Gold/GoldChargeLimit";
import ChargeChangeHistory from "./pages/Gold/ChargeChangeHistory";
import GoldRedeemUnits from "./pages/Gold/GoldRedeemUnits";
import ManageRoles from "./pages/Access/ManageRoles";
import AddNewRole from "./pages/Access/AddNewRole";
import EditRole from "./pages/Access/EditRole";
import ManageStaff from "./pages/Access/ManageStaff";
import AllBranch from "./pages/Branch/AllBranch";
import AddNewBranch from "./pages/Branch/AddNewBranch";
import EditBranch from "./pages/Branch/EditBranch";
import AllBranchStaff from "./pages/Staff/AllBranchStaff";
import AddNewBranchStaff from "./pages/Staff/AddNewBranchStaff";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import DynamicDashboard from "./pages/Dashboard/DynamicDashboard";
import Home from "./pages/Dashboard/Home";
import BBPSDashboard from "./pages/Dashboard/BBPSDashboard";
import GoldDashboard from "./pages/Dashboard/GoldDashboard";
import AllTransactions from "./pages/Transactions/AllTransactions";
import AllWallets from "./pages/Wallet/AllWallets";
import VirtualCards from "./pages/Wallet/VirtualCards";
import UserPaybacks from "./pages/Transactions/UserPaybacks";
import BankProfits from "./pages/Transactions/BankProfits";
import PendingTransfer from "./pages/FundTransfer/pendingtransfer";
import RejectedTransfers from "./pages/FundTransfer/RejectedTransfers";
import AllTransfers from "./pages/FundTransfer/alltransfers";
import OwnBankTransfer from "./pages/FundTransfer/OwnBankTransfer";
import OtherBankTransfer from "./pages/FundTransfer/OtherBankTransfer";
import WireTransfer from "./pages/FundTransfer/WireTransfer";
import WireTransferSettings from "./pages/FundTransfer/WireTransferSettings";
import OthersBank from "./pages/FundTransfer/OthersBank";
import Requestloan from "./pages/Loan/Requestloan";
import LoanDetails from "./pages/Loan/LoanDetails";
import ImportServices from "./pages/Bill/ImportServices";
import BillServicesList from "./pages/Bill/BillServicesList";
import ApprovedLoan from "./pages/Loan/ApprovedLoan";
import PayableLoan from "./pages/Loan/payableamount";
import CompletedLoan from "./pages/Loan/CompletedLoan";
import Rejectedloan from "./pages/Loan/rejectedloan";
import AllLoans from "./pages/Loan/all-loan";
import LoanPlans from "./pages/Loan/loanplans";
import AddLoanPlan from "./pages/Loan/createloanplan";
import ConvertRate from "./pages/Bill/convertrate";
import PendingBills from "./pages/Billhistory/pendingbills";
import Completedbills from "./pages/Billhistory/Completedbills";
import ReturnedBills from "./pages/Billhistory/ReturnedBills";
import AllBills from "./pages/Billhistory/Allbills";
import AutomaticGateway from "./pages/AutomaticGateway/gatewaylist";
import Pendingwithdraw from "./pages/Withdraw/Pendingwithdraw";
import AutomaticWithdraw from "./pages/Withdraw/Automatic-withdraw";
import WithdrawHistory from "./pages/Withdraw/withdrawhistory";
import Allportfolio from "./pages/Portfolio/Allportfolio";
import CreatePortfolios from "./pages/Portfolio/CreatePortfolios";
import Uiforstafftochangeprofile from "./pages/Portfolio/Uiforstafftochangeprofile";
import Manualmethod from "./pages/Withdraw/Manualmethod";
import WithdrawalMethodForm from "./pages/Withdraw/Withdrawalmethodform";
import WithdrawSchedule from "./pages/Withdraw/WithdrawSchedule";

// Ecommerce Pages
import EcomAllUsers from "./pages/Ecommerce/Users/AllUsers";
import EcomActiveUsers from "./pages/Ecommerce/Users/ActiveUsers";
import EcomBannedUsers from "./pages/Ecommerce/Users/BannedUsers";
import EcomAllProducts from "./pages/Ecommerce/Products/AllProducts";
import EcomAddProduct from "./pages/Ecommerce/Products/AddProduct";
import EcomProductCategories from "./pages/Ecommerce/Products/Categories";
import EcomAllVendors from "./pages/Ecommerce/Vendors/AllVendors";
import EcomAddVendor from "./pages/Ecommerce/Vendors/AddVendor";
import EcomVendorRequests from "./pages/Ecommerce/Vendors/VendorRequests";
import EcomVendorProducts from "./pages/Ecommerce/Vendors/VendorProducts";
import EcomAllOrders from "./pages/Ecommerce/Orders/AllOrders";
import EcomRefundRequests from "./pages/Ecommerce/Refunds/RefundRequests";
import EcomPendingOrders from "./pages/Ecommerce/Orders/PendingOrders";
import EcomCompletedOrders from "./pages/Ecommerce/Orders/CompletedOrders";
import EcomCancelledOrders from "./pages/Ecommerce/Orders/CancelledOrders";
import EcomAllCategories from "./pages/Ecommerce/Category/AllCategories";
import EcomAddCategory from "./pages/Ecommerce/Category/AddCategory";
import EcomSalesReport from "./pages/Ecommerce/Reports/SalesReport";
import EcomRevenueReport from "./pages/Ecommerce/Reports/RevenueReport";
import ProductsReport from "./pages/Ecommerce/Reports/ProductsReport";
import OrdersReport from "./pages/Ecommerce/Reports/OrdersReport";
import AdminTaxReport from "./pages/Ecommerce/Reports/AdminTaxReport";
import VendorVatReport from "./pages/Ecommerce/Reports/VendorVatReport";
import EcommerceLogin from "./pages/Ecommerce/EcommerceLogin";
import EcomAllKYC from "./pages/Ecommerce/KYC/AllKYC";
import BusinessSettings from "./pages/Ecommerce/BasicInfo/BusinessSettings";
import DeliveryCharges from "./pages/Ecommerce/DeliveryCharges/DeliveryCharges";
import VatTax from "./pages/Ecommerce/VatTax";

export default function App() {
  // Route-level guard component
  function RequireAuth({ children }: { children: ReactNode }) {
    if (!isAuthenticated()) {
      return <Navigate to="/signin" replace />;
    }
    return children;
  }

  // Ecommerce authentication guard
  function RequireEcommerceAuth({ children }: { children: ReactNode }) {
    if (!isAuthenticated()) {
      return <Navigate to="/signin" replace />;
    }
    if (!isEcommerceAuthenticated()) {
      return <Navigate to="/ecommerce/login" replace />;
    }
    return children;
  }
  return (
    <>
      <Router>
        <DashboardProvider>
          <ScrollToTop />
          <Routes>
            {/* Dashboard Layout (protected) */}
            <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
              {/* Dynamic Dashboard Route */}
              <Route path="/dashboard" element={<DynamicDashboard />} />
              
              {/* Legacy routes for backward compatibility */}
              <Route index path="/ecom" element={<Home />} />
              <Route path="/bbps" element={<BBPSDashboard />} />
              <Route path="/" element={<GoldDashboard />} />

            {/* Others Page */}
            {/* Profile - Only for Gold/MPay users (domain 0 & 1) */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute requireGold>
                  <UserProfiles />
                </ProtectedRoute>
              } 
            />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Customers*/}
            <Route path="/customers/allcustomers" element={<FormElements />} />
            <Route path="/customers/activecustomers" element={<ActiveCustomers />} />
            <Route path="/customers/closedcustomers" element={<ClosedCustomers />} />
            <Route path="/customers/disabledcustomers" element={<DisabledCustomers />} />
            <Route path="/customers/addnew" element={<AddNewCustomer />} />
            <Route path="/customers/notifications" element={<Notifications />} />
            <Route path="/customers/sendemail" element={<SendEmailToAll />} />
            <Route path="/customers/edit/:id" element={<EditCustomer />} />

            {/* KYC */}
            <Route path="/kyc/pending" element={<PendingKYC />} />
            <Route path="/kyc/rejected" element={<RejectedKYC />} />
            <Route path="/kyc/approved" element={<ApprovedKYC />} />
            <Route path="/kyc/all" element={<AllKYCLogs />} />

            {/* Access Management */}
            <Route path="/access/roles" element={<ManageRoles />} />
            <Route path="/access/roles/add" element={<AddNewRole />} />
            <Route path="/access/roles/edit/:id" element={<EditRole />} />
            <Route path="/access/permissions" element={<ManageStaff />} />

            {/* Gold */}
            <Route path="/gold/buy" element={<GoldBuy />} />
            <Route path="/gold/sell" element={<GoldSell />} />
            <Route path="/gold/redeem" element={<GoldRedeem />} />
            <Route path="/gold/gift" element={<GoldGift />} />
            <Route path="/gold/category" element={<GoldCategory />} />
            <Route path="/gold/chargelimit" element={<GoldChargeLimit />} />
            <Route path="/gold/charge-history" element={<ChargeChangeHistory />} />
            <Route path="/gold/redeemunits" element={<GoldRedeemUnits />} />

            {/* Ecommerce Routes - Protected */}
            <Route path="/ecommerce/users/all" element={<RequireEcommerceAuth><EcomAllUsers /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/users/active" element={<RequireEcommerceAuth><EcomActiveUsers /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/users/banned" element={<RequireEcommerceAuth><EcomBannedUsers /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/products/all" element={<RequireEcommerceAuth><EcomAllProducts /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/products/add" element={<RequireEcommerceAuth><EcomAddProduct /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/products/categories" element={<RequireEcommerceAuth><EcomProductCategories /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/vendors/all" element={<RequireEcommerceAuth><EcomAllVendors /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/vendors/add" element={<RequireEcommerceAuth><EcomAddVendor /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/vendors/requests" element={<RequireEcommerceAuth><EcomVendorRequests /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/vendors/products" element={<RequireEcommerceAuth><EcomVendorProducts /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/orders/all" element={<RequireEcommerceAuth><EcomAllOrders /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/refunds" element={<RequireEcommerceAuth><EcomRefundRequests /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/orders/pending" element={<RequireEcommerceAuth><EcomPendingOrders /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/orders/completed" element={<RequireEcommerceAuth><EcomCompletedOrders /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/orders/cancelled" element={<RequireEcommerceAuth><EcomCancelledOrders /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/banners/all" element={<RequireEcommerceAuth><EcomAllCategories /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/category/add" element={<RequireEcommerceAuth><EcomAddCategory /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/kyc/all" element={<RequireEcommerceAuth><EcomAllKYC /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/reports/sales" element={<RequireEcommerceAuth><EcomSalesReport /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/reports/revenue" element={<RequireEcommerceAuth><EcomRevenueReport /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/reports/products" element={<RequireEcommerceAuth><ProductsReport /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/reports/orders" element={<RequireEcommerceAuth><OrdersReport /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/reports/admin-tax" element={<RequireEcommerceAuth><AdminTaxReport /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/reports/vendor-vat" element={<RequireEcommerceAuth><VendorVatReport /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/basicinfo/business-settings" element={<RequireEcommerceAuth><BusinessSettings /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/delivery-charges" element={<RequireEcommerceAuth><DeliveryCharges /></RequireEcommerceAuth>} />
            <Route path="/ecommerce/vat-tax" element={<RequireEcommerceAuth><VatTax /></RequireEcommerceAuth>} />

            {/* Transactions */}
            <Route path="/Transactions" element={<AllTransactions />} />

            {/* Wallet */}
            <Route path="/wallet/all" element={<AllWallets />} />
            <Route path="/wallet/virtual-cards" element={<VirtualCards />} />

            {/* Branch */}
            <Route path="/branch/all" element={<AllBranch />} />
            <Route path="/branch/add" element={<AddNewBranch />} />
            <Route path="/branch/edit/:id" element={<EditBranch />} />

            {/* Staff */}
            <Route path="/staff/all" element={<AllBranchStaff />} />
            <Route path="/staff/add" element={<AddNewBranchStaff />} />

{/* loan */}
 <Route path="/loan/requestloan" element={<Requestloan />} />
 <Route path="/loan/details/:id" element={<LoanDetails />} />
  <Route path="/loan/approved-loan" element={<ApprovedLoan />} />
   <Route path="/loan/payable-loan" element={<PayableLoan />} />
   <Route path="/loan/completed-loan" element={<CompletedLoan />} />
   <Route path="/loan/rejected-loan" element={<Rejectedloan />} />
      <Route path="/loan/all-loans" element={<AllLoans />} />
        <Route path="/loan/loan-plans" element={<LoanPlans />} />
         <Route path="/loan/add-loan-plan" element={<AddLoanPlan />} />
  {/* <Route path="/loan/approved-loan" element={<ApprovedLoan/>} /> */}

            {/* Profits*/}
        <Route path="/profits/paybacks" element={<UserPaybacks />} />
   <Route path="/profits/bankprofit" element={<BankProfits />} />


  {/* Bill Management */}
        <Route path="/bill/import-services" element={<ImportServices />} />
        <Route path="/bill/billservices-list" element={<BillServicesList />} />
        <Route path="/bill/convertrate" element={<ConvertRate />} />
{/* Gateway */}
     <Route path="/gateway/gatewaylist" element={<AutomaticGateway />} />
{/* Withdraw*/}

<Route path="/withdraw/pending" element={<Pendingwithdraw />} />
<Route path="/withdraw/automatic" element={<AutomaticWithdraw />} />
<Route path="/withdraw/manual" element={<Manualmethod />} />
            <Route path="/withdraw/withdraw-history" element={<WithdrawHistory />} />
             <Route path="/withdraw/withdraw-method-form" element={<WithdrawalMethodForm />} />
              <Route path="/withdraw/withdraw-schedule" element={<WithdrawSchedule />} />
{/* Portfolio */}
 <Route path="/portfolio/all" element={<Allportfolio />} />
  <Route path="/portfolio/allprofileupdates" element={<CreatePortfolios />} />
    <Route path="/portfolio/uiforstaffdetails" element={<Uiforstafftochangeprofile />} />
        {/*Bill History  */}
         <Route path="/bill/history/pendingbills" element={<PendingBills />} />
        <Route path="/bill/history/completed-bills" element={<Completedbills />} />
        <Route path="/bill/history/returned-bills" element={<ReturnedBills />} />
        <Route path="/bill/history/all-bills" element={<AllBills />} />
{/* Fund Transfer */}
 <Route path="/fund-transfer/Pending" element={<PendingTransfer />} />
 <Route path="/fund-transfer/Rejected" element={<RejectedTransfers />} />
 <Route path="/fund-transfer/all-transfer" element={<AllTransfers />} />
 <Route path="/fund-transfer/ownbanktransfer" element={<OwnBankTransfer />} />
 <Route path="/fund-transfer/otherbanktransfer" element={<OtherBankTransfer />} />
 <Route path="/fund-transfer/wire-transfer" element={<WireTransfer />} />
 <Route path="/fund-transfer/wire" element={<WireTransferSettings />} />
 <Route path="/fund-transfer/othersbank" element={<OthersBank />} />
            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>
          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/ecommerce/login" element={<EcommerceLogin />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </DashboardProvider>
      </Router>
    </>
  );
}