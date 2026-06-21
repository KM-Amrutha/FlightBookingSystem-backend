export const FLIGHT_AMENITIES = {
  WIFI: "wifi",
  USB_CHARGING: "usb_charging",
  POWER_OUTLET: "power_outlet",
  MEALS_INCLUDED: "meals_included",
  ENTERTAINMENT: "entertainment",
  PRIORITY_BOARDING: "priority_boarding",
  LOUNGE_ACCESS: "lounge_access",
} as const;

export type FlightAmenity = typeof FLIGHT_AMENITIES[keyof typeof FLIGHT_AMENITIES];

export const AMENITY_LABELS: Record<FlightAmenity, string> = {
  wifi: "Wi-Fi",
  usb_charging: "USB Charging",
  power_outlet: "Power Outlet",
  meals_included: "Meals Included",
  entertainment: "In-flight Entertainment",
  priority_boarding: "Priority Boarding",
  lounge_access: "Lounge Access",
};

export const AMENITY_ICONS: Record<FlightAmenity, string> = {
  wifi: "📶",
  usb_charging: "🔌",
  power_outlet: "⚡",
  meals_included: "🍽️",
  entertainment: "🎬",
  priority_boarding: "⭐",
  lounge_access: "🛋️",
};