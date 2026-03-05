import BottomNav from "@/components/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-wrapper">
      <main style={{ flex: 1, paddingBottom: "5rem" }}>{children}</main>
      <BottomNav role="REFERRER" />
    </div>
  );
}
