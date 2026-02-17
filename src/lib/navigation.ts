/**
 * Navigation configuration for the session section.
 */
export const navigation = [
  {
    label: "Manage Subscriptions",
    path: "/session/subscriptions",
    activeCheck: ["/session/subscriptions"],
  },
  {
    label: "Orders",
    path: "/session/orders",
    activeCheck: ["/session/orders"],
  },
  {
    label: "Payment Methods",
    path: "/session/payment-methods",
  },
  {
    label: "Profile, Wallets & Credits",
    path: "/session/profile",
  },
];

export type NavigationItem = (typeof navigation)[number];
