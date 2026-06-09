import Link from "next/link";
import { Icon } from "@/components/icon";
import { cn } from "@/components/ui";

export function Pagination({
  page,
  total,
  pageSize,
  hrefFor,
}: {
  page: number;
  total: number;
  pageSize: number;
  hrefFor: (page: number) => string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  return (
    <div className="flex items-center justify-between gap-4 pt-1 text-sm text-slate-500">
      <span>
        Showing {start}–{end} of {total}
      </span>
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <PageButton href={hrefFor(page - 1)} disabled={page <= 1} icon="chevron_left" />
          <span className="text-slate-600">
            {page} / {totalPages}
          </span>
          <PageButton
            href={hrefFor(page + 1)}
            disabled={page >= totalPages}
            icon="chevron_right"
          />
        </div>
      )}
    </div>
  );
}

function PageButton({
  href,
  disabled,
  icon,
}: {
  href: string;
  disabled: boolean;
  icon: string;
}) {
  const cls =
    "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white";
  if (disabled) {
    return (
      <span className={cn(cls, "cursor-not-allowed text-slate-300")}>
        <Icon name={icon} className="text-[18px]" />
      </span>
    );
  }
  return (
    <Link href={href} className={cn(cls, "text-slate-600 hover:bg-slate-50")}>
      <Icon name={icon} className="text-[18px]" />
    </Link>
  );
}
