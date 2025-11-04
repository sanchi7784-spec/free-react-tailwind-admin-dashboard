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
  { id: 1649, initials: "ED", name: "EarlDeen1314", email: "longliveeldeen@gmail.com", account: "DGB412543553790", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Active", avatarColor: "#1e3a5f" },
  { id: 1648, initials: "AQ", name: "AbdulQadeer6790", email: "darshal333@gmail.com", account: "DGB712570605822", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Active", avatarColor: "#6b7d4f" },
  { id: 1647, initials: "BD", name: "BiancaDaniel 44...", email: "adeil61769@gmail.com", account: "DGB498848017574", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Active", avatarColor: "#dc5656" },
  { id: 1646, initials: "KN", name: "kebbabNaser edd...", email: "weekhunter1@gmail.com", account: "DGB336292028066", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Active", avatarColor: "#6b5d99" },
  { id: 1645, initials: "SM", name: "SaeedMalik6537", email: "nailamalik102@gmail.com", account: "DGB645002067583", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Active", avatarColor: "#3b5366" },
  { id: 1644, initials: "DD", name: "dyhdhdhddjhdhdh...", email: "watan@gmail.com", account: "DGB200968755412", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Active", avatarColor: "#dc5656" },
  { id: 1643, initials: "NW", name: "NicklausWandera...", email: "123asnawiir@gmail.com", account: "DGB293853434368", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Active", avatarColor: "#2b7a8b" },
  { id: 1642, initials: "SA", name: "SaeedaliAli2834", email: "saeedmalik8093@gmail.com", account: "DGB930715192861", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Active", avatarColor: "#d14d72" },
  { id: 1641, initials: "MX", name: "MrX8307", email: "mrbasicbhai@gmail.com", account: "DGB383712079158", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Active", avatarColor: "#2b7a8b" },
  // Closed customers
  { id: 1650, initials: "TH", name: "tjhenry3176", email: "naijarep02@gmail.com", account: "DGB963731366632", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Closed", avatarColor: "#d14d72" },
  { id: 1651, initials: "JJ", name: "jdjdzjssj4553", email: "yussufh253@gmail.com", account: "DGB416603473013", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Closed", avatarColor: "#2b7a8b" },
  { id: 1652, initials: "MM", name: "mrme4672", email: "test1@gmail.com", account: "DGB147069997412", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Closed", avatarColor: "#1e3a5f" },
  { id: 1653, initials: "NN", name: "neranera1753", email: "initoto3@gmail.com", account: "DGB793952524361", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Closed", avatarColor: "#6b7d4f" },
  { id: 1654, initials: "AK", name: "Anuragkandwal45...", email: "anuragkandwal59@gmai...", account: "DGB331090970116", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Closed", avatarColor: "#dc5656" },
  { id: 1655, initials: "SD", name: "sddddd5847", email: "cvbcv@gmail.com", account: "DGB689894212648", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Closed", avatarColor: "#6b5d99" },
  { id: 1656, initials: "HZ", name: "herozero2953", email: "gg@gg.com", account: "DGB821069057058", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Closed", avatarColor: "#3b5366" },
  { id: 1657, initials: "TM", name: "TanzilMia3579", email: "tanzil@gmail.com", account: "DGB527777156700", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Closed", avatarColor: "#d14d72" },
  // Disabled/Deactivated customers
  { id: 1658, initials: "VN", name: "Vindoug6", email: "088nyerere@gmail.com", account: "DGB900502510245361 3", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Deactivated", avatarColor: "#d14d72" },
  { id: 1659, initials: "11", name: "1111111", email: "11111@11111.com", account: "DGB389173755177599", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Deactivated", avatarColor: "#2b7a8b" },
  { id: 1660, initials: "AA", name: "aaaaaaaa", email: "111111@111.cc", account: "DGB453901430627443 0", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Deactivated", avatarColor: "#1e3a5f" },
  { id: 1661, initials: "GC", name: "Fhjvc", email: "111111@mail.ru", account: "DGB259620362776522 4", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Deactivated", avatarColor: "#6b7d4f" },
  { id: 1662, initials: "11", name: "123312333", email: "12341234@gmail.com", account: "DGB723473060304502 5", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Deactivated", avatarColor: "#dc5656" },
  { id: 1663, initials: "MD", name: "markadarling", email: "125435hip@gmail.com", account: "DGB461371392863916 7", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Deactivated", avatarColor: "#6b5d99" },
  { id: 1664, initials: "00", name: "00000", email: "22kre@bk.ru", account: "DGB402580485668646 9", balance: "$293", payback: "$168", emailStatus: "Unverified", kyc: "Unverified", status: "Deactivated", avatarColor: "#3b5366" },
  { id: 1665, initials: "EE", name: "fgf41414144145", email: "4141414144@gmail.com", account: "DGB460592381952513 9", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Deactivated", avatarColor: "#d14d72" },
  { id: 1666, initials: "AC", name: "aolcom", email: "44921a@airmailbox.we...", account: "DGB901133179101945", balance: "$8", payback: "$8", emailStatus: "Unverified", kyc: "Unverified", status: "Deactivated", avatarColor: "#2b7a8b" },
];

export default customers;
