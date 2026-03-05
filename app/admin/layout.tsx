import BottomNav from "@/components/BottomNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-wrapper">
      {/* Main content — padded bottom so nav never overlaps content */}
      <main style={{ flex: 1, paddingBottom: "5rem" }}>{children}</main>
      <BottomNav role="ADMIN" />
    </div>
  );
}
