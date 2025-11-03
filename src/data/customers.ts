export type Customer = {
  id: number;
  initials: string;
  name: string;
  email: string;
  account: string;
  balance: string;
  payback: string;
  emailStatus: string;
  kyc: string;
  status: string;
  avatarColor?: string;
};

export const customers: Customer[] = [
  { id: 1649, initials: "ED", name: "EarlDeen1314", email: "longliveeldeen@gmail.com", account: "DGB412543553790", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Active", avatarColor: "#ff6b81" },
  { id: 1648, initials: "AQ", name: "AbdulQadeer6790", email: "darshal333@gmail.com", account: "DGB712570605822", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Active", avatarColor: "#17a2b8" },
  { id: 1647, initials: "BD", name: "BiancaDaniel 44...", email: "adeil61769@gmail.com", account: "DGB498848017574", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Active", avatarColor: "#0f4c75" },
  { id: 1646, initials: "KN", name: "kebbabNaser edd...", email: "weekhunter1@gmail.com", account: "DGB336292028066", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Active", avatarColor: "#6b8e23" },
  { id: 1645, initials: "SM", name: "SaeedMalik6537", email: "nailamalik102@gmail.com", account: "DGB645002067583", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Active", avatarColor: "#ff8a65" },
];

export default customers;
