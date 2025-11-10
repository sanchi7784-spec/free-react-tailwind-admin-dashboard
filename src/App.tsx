import { BrowserRouter as Router, Routes, Route } from "react-router";
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
export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/dashboard-overview/bbps" element={<BBPSDashboard />} />
            <Route path="/dashboard-overview/Gold" element={<GoldDashboard />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
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
            <Route path="/gold/redeemunits" element={<GoldRedeemUnits />} />

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
  {/* <Route path="/loan/approved-loan" element={<ApprovedLoan/>} /> */}

            {/* Profits*/}
        <Route path="/profits/paybacks" element={<UserPaybacks />} />
   <Route path="/profits/bankprofit" element={<BankProfits />} />


  {/* Bill Management */}
        <Route path="/bill/import-services" element={<ImportServices />} />
        <Route path="/bill/billservices-list" element={<BillServicesList />} />
        
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

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
