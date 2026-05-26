interface DashboardCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
}
export default function DashboardCard({
    title,
    value,
    icon,
}: DashboardCardProps) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold tracking-[0.3em] text-slate-500 uppercase">
                        {title}
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold text-slate-900">
                        {value}
                    </h3>
                </div>

                {icon && (
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
