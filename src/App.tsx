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
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

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

            {/* Gold */}
            <Route path="/gold/buy" element={<GoldBuy />} />
            <Route path="/gold/sell" element={<GoldSell />} />
            <Route path="/gold/redeem" element={<GoldRedeem />} />
            <Route path="/gold/gift" element={<GoldGift />} />

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
