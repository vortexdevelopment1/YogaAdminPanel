// Badge component for displaying categorized statuses with theme-specific styling

interface BadgeProps {
  label: string;
}

export default function Badge({ label }: BadgeProps) {
  let colorClasses = "bg-[#E8E1D6] text-[#2B2B2B]";

  if (
    label === "Paid" ||
    label === "Active" ||
    label === "Available" ||
    label === "Present" ||
    label === "Read" ||
    label === "Ready" ||
    label === "Upcoming Renewal" ||
    label === "Seat Free"
  ) {
    colorClasses = "bg-[#E3F0E5] text-[#2F6B3D]";
  } else if (
    label === "Pending" ||
    label === "Upcoming" ||
    label === "Filling Fast" ||
    label === "Delivered" ||
    label === "Partial Refund" ||
    label === "Soon" ||
    label === "Waiting" ||
    label === "Used Up"
  ) {
    colorClasses = "bg-[#FBF0D9] text-[#8A6414]";
  } else if (
    label === "Failed" ||
    label === "Expired" ||
    label === "Full" ||
    label === "Absent" ||
    label === "Live" ||
    label === "Critical"
  ) {
    colorClasses = "bg-[#F8E1DE] text-[#A3382B]";
  } else if (
    label === "Sent" ||
    label === "Completed" ||
    label === "Refunded"
  ) {
    colorClasses = "bg-[#E8EEF5] text-[#3A5A80]";
  } else if (
    label === "Not Created" ||
    label === "Cancelled" ||
    label === "Inactive"
  ) {
    colorClasses = "bg-[#EFEAE0] text-[#7A7A72]";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${colorClasses}`}
    >
      {label}
    </span>
  );
}
