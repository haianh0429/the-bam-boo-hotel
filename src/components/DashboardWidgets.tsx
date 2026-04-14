"use client";

import {
  BarChart3,
  Banknote,
  Bell,
  BedDouble,
  ClipboardList,
  CreditCard,
  DoorClosed,
  FileText,
  FolderKanban,
  House,
  LifeBuoy,
  ListChecks,
  Mail,
  NotebookText,
  PackageCheck,
  Receipt,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users2,
} from "lucide-react";
import { ReactNode, useMemo } from "react";

export function TopBar() {
  return (
    <div className="sticky top-0 z-30 bg-[#111111] text-white">
      <div className="mx-auto flex h-12 w-full max-w-7xl items-center gap-4 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-white/10">
            <span className="text-[10px] font-bold tracking-widest">BH</span>
          </div>
          <div className="hidden text-sm font-semibold tracking-tight sm:block">
            THE BAMBOO HOTEL
          </div>
        </div>

        <div className="flex flex-1 items-center">
          <div className="flex w-full max-w-xl items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white/80">
            <Search className="h-4 w-4" strokeWidth={1.5} />
            <input
              className="w-full bg-transparent outline-none placeholder:text-white/40"
              placeholder="Tìm kiếm trong THE BAMBOO HOTEL"
            />
          </div>
        </div>

        <div className="hidden text-xs text-white/70 md:block">
          {new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>

        <div className="ml-2 hidden items-center gap-2 md:flex">
          <TopIcon icon={<Bell className="h-4 w-4" strokeWidth={1.5} />} />
          <TopIcon icon={<Mail className="h-4 w-4" strokeWidth={1.5} />} />
          <TopIcon icon={<LifeBuoy className="h-4 w-4" strokeWidth={1.5} />} />
          <TopIcon icon={<Settings className="h-4 w-4" strokeWidth={1.5} />} />
          <div className="mx-1 h-5 w-px bg-white/15" />
          <div className="flex items-center gap-2 rounded-md bg-white/10 px-2 py-1 text-xs text-white/80">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="max-w-32 truncate">Lễ tân</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopIcon(props: { icon: ReactNode }) {
  return (
    <button
      type="button"
      className="rounded-md bg-white/10 p-2 text-white/85 hover:bg-white/15"
      aria-label="topbar action"
    >
      {props.icon}
    </button>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-[280px] shrink-0 bg-white lg:block">
      <div className="border-b border-[#F1F1F1] px-5 py-4">
        <div className="text-sm font-semibold tracking-tight text-zinc-900">
          The Bamboo Hotel
        </div>
        <div className="mt-1 text-xs text-zinc-500">Chọn dịch vụ</div>
        <div className="mt-2 flex items-center justify-between border bg-white px-3 py-2 text-sm text-zinc-700">
          <div>Lưu trú</div>
          <div className="text-xs text-zinc-400">▾</div>
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="text-xs font-medium text-zinc-500">Tác vụ</div>
        <div className="mt-3 grid gap-2">
          <SideItem icon={<ClipboardList className="h-4 w-4" strokeWidth={1.5} />}>
            Bỏ lỡ <Badge>2</Badge>
          </SideItem>
        </div>

        <div className="mt-6 text-xs font-medium text-zinc-500">Điều hướng</div>
        <div className="mt-3 grid gap-1">
          <SideItem icon={<House className="h-4 w-4" strokeWidth={1.5} />}>
            Tổng quan
          </SideItem>
          <SideItem icon={<BedDouble className="h-4 w-4" strokeWidth={1.5} />}>
            Đặt phòng
          </SideItem>
          <SideItem icon={<DoorClosed className="h-4 w-4" strokeWidth={1.5} />}>
            Phòng
          </SideItem>
          <SideItem icon={<Users2 className="h-4 w-4" strokeWidth={1.5} />}>
            Khách hàng
          </SideItem>
          <SideItem icon={<CreditCard className="h-4 w-4" strokeWidth={1.5} />}>
            Tài chính
          </SideItem>
          <SideItem icon={<BarChart3 className="h-4 w-4" strokeWidth={1.5} />}>
            Báo cáo
          </SideItem>
          <SideItem icon={<ShoppingCart className="h-4 w-4" strokeWidth={1.5} />}>
            Đơn hàng
          </SideItem>
          <SideItem icon={<ShieldCheck className="h-4 w-4" strokeWidth={1.5} />}>
            Kiểm tra phòng
          </SideItem>
        </div>
      </div>
    </aside>
  );
}

function SideItem(props: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border border-[#F1F1F1] bg-white px-3 py-2 text-sm text-zinc-700">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-zinc-500">{props.icon}</span>
        <span className="truncate">{props.children}</span>
      </div>
    </div>
  );
}

function Badge(props: { children: ReactNode }) {
  return (
    <span className="ml-2 inline-flex items-center rounded-full border bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
      {props.children}
    </span>
  );
}

export function WidgetCard(props: {
  title: string;
  subtitle?: string;
  headerLinks?: ReactNode;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col border border-[#F1F1F1] bg-white">
      <div className="flex items-start justify-between gap-4 px-4 pt-4">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold tracking-tight text-zinc-900">
            {props.title}
          </div>
          {props.subtitle ? (
            <div className="mt-0.5 text-[11px] text-zinc-500">
              {props.subtitle}
            </div>
          ) : null}
          {props.headerLinks ? (
            <div className="mt-2">{props.headerLinks}</div>
          ) : null}
        </div>
        {props.right ? <div className="shrink-0">{props.right}</div> : null}
      </div>
      <div className="flex-1 px-4 pb-4 pt-3">{props.children}</div>
    </div>
  );
}

export function SectionLinkList(props: {
  items: Array<{ label: string; icon: ReactNode }>;
}) {
  return (
    <div className="grid gap-1 text-[13px]">
      {props.items.map((it) => (
        <div
          key={it.label}
          className="flex items-center justify-between border border-[#F1F1F1] bg-white px-3 py-2"
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-zinc-500">{it.icon}</span>
            <span className="truncate text-zinc-700">{it.label}</span>
          </div>
          <span className="text-xs text-zinc-400">›</span>
        </div>
      ))}
    </div>
  );
}

export function HeaderLinksInline(props: {
  items: Array<{ label: string }>;
}) {
  return (
    <div className="flex flex-col gap-1 text-[12px] text-zinc-600">
      {props.items.map((it) => (
        <div
          key={it.label}
          className="flex items-center justify-between border border-[#F1F1F1] bg-white px-3 py-2"
        >
          <span className="truncate">{it.label}</span>
          <span className="text-xs text-zinc-400">›</span>
        </div>
      ))}
    </div>
  );
}

export function FinanceList() {
  return (
    <SectionLinkList
      items={[
        {
          label: "Sổ cái",
          icon: <FolderKanban className="h-4 w-4" strokeWidth={1.5} />,
        },
        {
          label: "Báo cáo thanh toán",
          icon: <CreditCard className="h-4 w-4" strokeWidth={1.5} />,
        },
        {
          label: "Báo cáo doanh thu",
          icon: <Banknote className="h-4 w-4" strokeWidth={1.5} />,
        },
        {
          label: "Hóa đơn & chứng từ",
          icon: <Receipt className="h-4 w-4" strokeWidth={1.5} />,
        },
        {
          label: "Thu ngân",
          icon: <CreditCard className="h-4 w-4" strokeWidth={1.5} />,
        },
      ]}
    />
  );
}

export function ReportsList() {
  return (
    <SectionLinkList
      items={[
        {
          label: "Báo cáo quản trị",
          icon: <BarChart3 className="h-4 w-4" strokeWidth={1.5} />,
        },
        {
          label: "Nhật ký đặt phòng",
          icon: <FileText className="h-4 w-4" strokeWidth={1.5} />,
        },
        {
          label: "Báo cáo hoạt động",
          icon: <BarChart3 className="h-4 w-4" strokeWidth={1.5} />,
        },
        {
          label: "Thời gian xử lý tác vụ",
          icon: <FileText className="h-4 w-4" strokeWidth={1.5} />,
        },
      ]}
    />
  );
}

export function ReservationsLinks() {
  return (
    <SectionLinkList
      items={[
        {
          label: "Tổng quan đặt phòng",
          icon: <NotebookText className="h-4 w-4" strokeWidth={1.5} />,
        },
        {
          label: "Báo cáo đặt phòng",
          icon: <FileText className="h-4 w-4" strokeWidth={1.5} />,
        },
      ]}
    />
  );
}

export function OrdersLinks() {
  return (
    <SectionLinkList
      items={[
        {
          label: "Không có việc cần làm",
          icon: <ListChecks className="h-4 w-4" strokeWidth={1.5} />,
        },
        {
          label: "Trạng thái đơn",
          icon: <PackageCheck className="h-4 w-4" strokeWidth={1.5} />,
        },
      ]}
    />
  );
}

export function SpacesLinks() {
  return (
    <SectionLinkList
      items={[
        {
          label: "Trạng thái phòng",
          icon: <DoorClosed className="h-4 w-4" strokeWidth={1.5} />,
        },
      ]}
    />
  );
}

export function SocialWidget() {
  return (
    <div className="border bg-white">
      <div className="flex items-start justify-between gap-4 px-4 pt-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-zinc-900">Xã hội</div>
          <div className="mt-1 text-xs text-zinc-500">
            So sánh điểm kênh OTA
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <TrendingUp className="h-4 w-4" strokeWidth={1.5} />
        </div>
      </div>

      <div className="px-4 pb-4 pt-3">
        <div className="grid grid-cols-3 gap-2 text-[11px] text-zinc-500">
          <div />
          <div className="text-right">Bạn</div>
          <div className="text-right">TB đối thủ</div>
        </div>

        <div className="mt-2 grid gap-1 text-sm">
          {[
            { k: "Tripadvisor", you: "49 / 675", comp: "—" },
            { k: "Rating", you: "90%", comp: "—" },
            { k: "Booking.com", you: "8.9", comp: "9.2" },
            { k: "TrustYou", you: "91%", comp: "93%" },
          ].map((r) => (
            <div
              key={r.k}
              className="grid grid-cols-3 items-center gap-2 border bg-white px-3 py-2"
            >
              <div className="truncate text-zinc-700">{r.k}</div>
              <div className="text-right font-semibold text-zinc-900">
                {r.you}
              </div>
              <div className="text-right font-semibold text-zinc-700">
                {r.comp}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
          <Sparkles className="h-4 w-4" strokeWidth={1.5} />
          <span>Gợi ý: đồng bộ đánh giá để theo dõi theo ngày.</span>
        </div>
      </div>
    </div>
  );
}

export function RingStat(props: {
  label: string;
  main: number;
  sub: number;
  color: string;
}) {
  const total = Math.max(1, props.main + props.sub);
  const pct = (props.main / total) * 100;
  return (
    <div className="flex items-center gap-4">
      <Donut
        main={props.main}
        sub={props.sub}
        percent={pct}
        color={props.color}
      />
      <div className="min-w-0">
        <div className="text-sm font-medium text-zinc-900">{props.label}</div>
        <div className="mt-1 text-xs text-zinc-500">
          <span className="font-semibold text-zinc-900">{props.main}</span>{" "}
          còn lại
          <span className="mx-2 text-zinc-300">•</span>
          <span className="font-semibold text-zinc-900">{props.sub}</span> không đến
        </div>
      </div>
    </div>
  );
}

export function SpacesRing(props: {
  clean: number;
  inspected: number;
  dirty: number;
  outOfService: number;
}) {
  const total = Math.max(
    1,
    props.clean + props.inspected + props.dirty + props.outOfService
  );
  const segments = [
    { v: props.clean, c: "#22C55E", label: "Sạch" },
    { v: props.inspected, c: "#FBBF24", label: "Đã kiểm tra" },
    { v: props.dirty, c: "#F59E0B", label: "Bẩn" },
    { v: props.outOfService, c: "#A1A1AA", label: "Ngưng dịch vụ" },
  ];
  return (
    <div className="flex items-center gap-5">
      <div className="shrink-0">
        <MultiRing segments={segments} total={total} />
      </div>
      <div className="grid gap-1.5 text-[12px] text-zinc-600">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: s.c }}
            />
            <span className="w-28 text-zinc-600">{s.label}</span>
            <span className="ml-auto font-semibold tabular-nums text-zinc-900">
              {s.v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Ring(props: { percent: number; color: string }) {
  const size = 56;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (props.percent / 100) * c;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#F1F1F1"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={props.color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function Donut(props: {
  main: number;
  sub: number;
  percent: number;
  color: string;
}) {
  const size = 60;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (props.percent / 100) * c;
  return (
    <div className="relative h-[60px] w-[60px] shrink-0">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#F1F1F1"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={props.color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <div className="text-sm font-semibold text-zinc-900">{props.main}</div>
        <div className="text-[11px] text-zinc-400">{props.sub}</div>
      </div>
    </div>
  );
}

function MultiRing(props: {
  segments: Array<{ v: number; c: string; label: string }>;
  total: number;
}) {
  const size = 56;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const arcs = useMemo(() => {
    let offset = 0;
    return props.segments.map((s) => {
      const len = (s.v / props.total) * c;
      const out = { ...s, len, offset };
      offset += len;
      return out;
    });
  }, [props.segments, props.total]);

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#F1F1F1"
        strokeWidth={stroke}
        fill="none"
      />
      {arcs.map((a) =>
        a.len <= 0 ? null : (
          <circle
            key={a.label}
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={a.c}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${a.len} ${c - a.len}`}
            strokeDashoffset={-a.offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )
      )}
    </svg>
  );
}

export function MiniOccupancyChart() {
  // Mews-like: bars + subtle line overlay
  const days = ["T3", "T4", "T5", "T6", "T7", "CN", "T2"];
  const rooms = [62, 58, 75, 68, 82, 78, 60];
  const beds = [48, 44, 58, 52, 64, 61, 47];
  const max = Math.max(...rooms, ...beds);
  const w = 360;
  const h = 86;
  const padX = 12;
  const padY = 10;
  const step = (w - padX * 2) / (days.length - 1);
  const toY = (v: number) => padY + (1 - v / max) * (h - padY * 2);
  const line = beds
    .map((v, i) => `${padX + step * i},${toY(v)}`)
    .join(" ");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-zinc-500">Công suất</div>
        <div className="text-xs text-zinc-500">7 ngày</div>
      </div>
      <div className="relative mt-3">
        <div className="grid grid-cols-7 items-end gap-2">
          {rooms.map((v, i) => (
            <div key={days[i]} className="flex flex-col items-center gap-2">
              <div className="w-full" style={{ height: 54 }}>
                <div
                  className="w-full bg-zinc-900/10"
                  style={{ height: 54 }}
                >
                  <div
                    className="w-full bg-zinc-900/55"
                    style={{ height: `${Math.round((v / max) * 54)}px` }}
                  />
                </div>
              </div>
              <div className="text-[10px] text-zinc-500">{days[i]}</div>
            </div>
          ))}
        </div>

        <svg
          className="pointer-events-none absolute left-0 top-0"
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
        >
          <polyline
            points={line}
            fill="none"
            stroke="rgba(24,24,27,0.55)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {beds.map((v, i) => (
            <circle
              key={i}
              cx={padX + step * i}
              cy={toY(v)}
              r="2.5"
              fill="white"
              stroke="rgba(24,24,27,0.55)"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-zinc-600">
        <div className="flex items-center justify-between border bg-white px-3 py-2">
          <span>Đến</span>
          <span className="font-semibold text-zinc-900">21</span>
        </div>
        <div className="flex items-center justify-between border bg-white px-3 py-2">
          <span>Đi</span>
          <span className="font-semibold text-zinc-900">14</span>
        </div>
        <div className="flex items-center justify-between border bg-white px-3 py-2">
          <span>Ở</span>
          <span className="font-semibold text-zinc-900">15</span>
        </div>
        <div className="flex items-center justify-between border bg-white px-3 py-2">
          <span>Khách</span>
          <span className="font-semibold text-zinc-900">62</span>
        </div>
      </div>
    </div>
  );
}

export function PercentDonut(props: { a: number; b: number; label: string }) {
  const total = Math.max(1, props.a + props.b);
  const pctA = Math.round((props.a / total) * 100);
  const pctB = 100 - pctA;
  const size = 64;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dashA = (pctA / 100) * c;
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 shrink-0">
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="#111111"
            strokeWidth={stroke}
            fill="none"
            opacity={0.85}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="#3B82F6"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dashA} ${c - dashA}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <div className="text-sm font-semibold text-zinc-900">{pctA}%</div>
          <div className="text-[11px] text-zinc-400">{pctB}%</div>
        </div>
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-zinc-900">{props.label}</div>
        <div className="mt-1 text-xs text-zinc-500">
          <span className="font-semibold text-zinc-900">{pctA}%</span> hoàn tất
          <span className="mx-2 text-zinc-300">•</span>
          <span className="font-semibold text-zinc-900">{pctB}%</span> chưa xong
        </div>
      </div>
    </div>
  );
}
