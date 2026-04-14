"use client";

import * as HoverCard from "@radix-ui/react-hover-card";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Check, Clock3, CreditCard, StickyNote, User } from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";

type RoomStatus = "clean" | "dirty" | "inspected";
type PaymentStatus = "paid" | "due" | "partial";

export type TimelineRoom = {
  id: string;
  name: string;
  category: string;
  status: RoomStatus;
};

export type TimelineBooking = {
  id: string;
  roomId: string;
  guestName: string;
  paymentStatus: PaymentStatus;
  notes?: string;
  startDate: string; // YYYY-MM-DD (check-in)
  endDate: string; // YYYY-MM-DD (check-out, exclusive)
  status: "confirmed";
};

export function HotelBookingTimeline(props: {
  startDate: string; // YYYY-MM-DD
  days: number;
  rooms: TimelineRoom[];
  bookings: TimelineBooking[];
  onMoveBooking?: (args: {
    bookingId: string;
    toRoomId: string;
    dayDelta: number;
  }) => void;
}) {
  const { startDate, days, rooms, bookings, onMoveBooking } = props;

  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 680px)");
    const apply = () => setCompact(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  const colW = compact ? 38 : 44;
  const rowH = compact ? 40 : 44;
  const leftW = calcLeftW(rooms, compact);
  const border = "#F1F1F1";
  const iconStroke = 1.5;

  const dates = buildDateRange(startDate, days);
  const groupedRooms = groupByCategory(rooms);
  const bookingsByRoom = groupBy(bookings, (b) => b.roomId);

  const bookingsById = useMemo(() => {
    const m: Record<string, TimelineBooking> = {};
    for (const b of bookings) m[b.id] = b;
    return m;
  }, [bookings]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  function onDragStart(e: DragStartEvent) {
    const id = String(e.active.id);
    setDraggingId(id);
    setIsDragging(true);
  }

  function onDragEnd(e: DragEndEvent) {
    const id = String(e.active.id);
    const active = e.active.data.current as
      | { type: "booking"; bookingId: string; roomId: string }
      | undefined;
    const over = e.over?.data.current as
      | { type: "room-row"; roomId: string }
      | undefined;

    const dayDelta = Math.round((e.delta?.x ?? 0) / colW);
    const toRoomId =
      over?.type === "room-row"
        ? over.roomId
        : active?.type === "booking"
          ? active.roomId
          : undefined;

    if (onMoveBooking && active?.type === "booking" && toRoomId) {
      onMoveBooking({
        bookingId: active.bookingId,
        toRoomId,
        dayDelta,
      });
    }

    setDraggingId(null);
    setIsDragging(false);
  }

  return (
    <div className="w-full">
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <div className="text-sm font-medium text-zinc-900">
              Booking timeline
            </div>
            <div className="text-xs text-zinc-500">
              Flat, minimal grid inspired by Mews PMS
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <LegendDot color="#22C55E" label="Clean / Ready" />
            <LegendDot color="#F59E0B" label="Dirty / Inspected" />
            <LegendDot color="#3B82F6" label="Confirmed" />
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={() => {
            setDraggingId(null);
            setIsDragging(false);
          }}
        >
          <div className="overflow-auto rounded-b-2xl bg-[#FCFCFD]">
            <div
              className="relative min-w-max"
              style={{
                width: leftW + dates.length * colW,
              }}
            >
              <TodayLine
                now={now}
                rangeStartYmd={startDate}
                colW={colW}
                leftW={leftW}
                days={dates.length}
              />
              {/* Header */}
              <div
                className="sticky top-0 z-20"
                style={{
                  background: "rgba(255,255,255,0.96)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `${leftW}px repeat(${dates.length}, ${colW}px)`,
                  }}
                >
                  <div
                    className="sticky left-0 z-30 flex items-center border-b bg-white/95 px-4 py-3 text-xs font-medium text-zinc-600"
                    style={{ borderColor: border }}
                  >
                    Rooms
                  </div>
                  {dates.map((d) => (
                    <div
                      key={d.key}
                      className="flex flex-col items-center justify-center border-b border-l bg-white/95 py-2 text-[10px] leading-4 text-zinc-500"
                      style={{ borderColor: border }}
                      title={d.longLabel}
                    >
                      <div className="font-medium text-zinc-700">{d.day}</div>
                      <div>{d.dow}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="pb-6">
                {Object.entries(groupedRooms).map(([category, categoryRooms]) => (
                  <div key={category}>
                    <div
                      className="sticky top-[44px] z-10 grid"
                      style={{
                        gridTemplateColumns: `${leftW}px repeat(${dates.length}, ${colW}px)`,
                        background: "rgba(252,252,253,0.96)",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      <div
                        className="sticky left-0 z-20 flex items-center gap-2 border-b bg-[#FCFCFD] px-4 py-2 text-xs font-medium text-zinc-700"
                        style={{ borderColor: border }}
                      >
                        <span className="truncate">{category}</span>
                        <span className="text-[10px] font-normal text-zinc-400">
                          ({categoryRooms.length})
                        </span>
                      </div>
                      {dates.map((d) => (
                        <div
                          key={d.key}
                          className="border-b border-l bg-[#FCFCFD]"
                          style={{ borderColor: border }}
                        />
                      ))}
                    </div>

                    {categoryRooms.map((room) => {
                      const roomBookings = bookingsByRoom[room.id] ?? [];
                      return (
                        <RoomRowDroppable
                          key={room.id}
                          roomId={room.id}
                          leftW={leftW}
                          datesCount={dates.length}
                          colW={colW}
                          rowH={rowH}
                          border={border}
                          roomLabel={
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className="inline-block h-2 w-2 shrink-0 rounded-full"
                                  style={{
                                    background: roomStatusColor(room.status),
                                  }}
                                  title={roomStatusLabel(room.status)}
                                />
                                <div className="truncate text-sm font-medium text-zinc-900">
                                  {room.name}
                                </div>
                              </div>
                              <div className="mt-0.5 text-xs text-zinc-500">
                                {roomStatusLabel(room.status)}
                              </div>
                            </div>
                          }
                        >
                          {/* Booking bars */}
                          {roomBookings.map((b) => {
                            const startIdx = clamp(
                              dateIndex(dates, b.startDate),
                              0,
                              dates.length
                            );
                            const endIdx = clamp(
                              dateIndex(dates, b.endDate),
                              0,
                              dates.length
                            );
                            const span = Math.max(0, endIdx - startIdx);
                            if (span <= 0) return null;

                            const left = startIdx * colW + 6;
                            const width = span * colW - 12;

                            return (
                              <BookingPill
                                key={b.id}
                                booking={b}
                                roomId={room.id}
                                left={left}
                                width={width}
                                border={border}
                                iconStroke={iconStroke}
                                isDragging={isDragging}
                                draggingId={draggingId}
                              />
                            );
                          })}
                        </RoomRowDroppable>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DragOverlay>
            {draggingId && bookingsById[draggingId] ? (
              <div
                className="rounded-full border px-3 text-xs font-medium text-[#1E3A8A] shadow-[0_6px_24px_rgba(0,0,0,0.10)]"
                style={{
                  height: 20,
                  background: "rgba(59,130,246,0.16)",
                  borderColor: "rgba(59,130,246,0.28)",
                }}
              >
                <div className="flex h-full items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
                  <BookingPillIcon
                    paymentStatus={bookingsById[draggingId].paymentStatus}
                    width={120}
                    strokeWidth={iconStroke}
                  />
                  <span className="truncate">
                    {bookingsById[draggingId].guestName}
                  </span>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

function RoomRowDroppable(props: {
  roomId: string;
  leftW: number;
  datesCount: number;
  colW: number;
  rowH: number;
  border: string;
  roomLabel: ReactNode;
  children: ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id: `room:${props.roomId}`,
    data: { type: "room-row", roomId: props.roomId } as const,
  });

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `${props.leftW}px repeat(${props.datesCount}, ${props.colW}px)`,
      }}
    >
      <div
        className="sticky left-0 z-10 flex items-center justify-between gap-3 border-b bg-white px-4"
        style={{ borderColor: props.border, height: props.rowH }}
      >
        {props.roomLabel}
      </div>

      <div
        ref={setNodeRef}
        className="relative"
        style={{
          gridColumn: `2 / span ${props.datesCount}`,
          height: props.rowH,
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${props.datesCount}, ${props.colW}px)`,
            height: props.rowH,
          }}
        >
          {Array.from({ length: props.datesCount }).map((_, idx) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              className="border-b border-l bg-white"
              style={{ borderColor: props.border }}
            />
          ))}
        </div>
        {props.children}
      </div>
    </div>
  );
}

function BookingPill(props: {
  booking: TimelineBooking;
  roomId: string;
  left: number;
  width: number;
  border: string;
  iconStroke: number;
  isDragging: boolean;
  draggingId: string | null;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: props.booking.id,
      data: {
        type: "booking",
        bookingId: props.booking.id,
        roomId: props.roomId,
      } as const,
    });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  const pill = (
    <motion.div
      ref={setNodeRef}
      layout
      transition={{ type: "spring", stiffness: 520, damping: 40, mass: 0.7 }}
      className={[
        "absolute top-1/2 -translate-y-1/2 rounded-full border px-3 text-xs font-medium text-[#1E3A8A]",
        "shadow-[0_1px_0_rgba(0,0,0,0.03)]",
        "cursor-grab active:cursor-grabbing",
        isDragging ? "opacity-70" : "opacity-100",
      ].join(" ")}
      style={{
        left: props.left,
        width: props.width,
        height: 20,
        background: "rgba(59,130,246,0.14)",
        borderColor: "rgba(59,130,246,0.25)",
        ...style,
      }}
      {...listeners}
      {...attributes}
      title={`${props.booking.guestName} (${props.booking.startDate} → ${props.booking.endDate})`}
    >
      <div className="flex h-full items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
        <BookingPillIcon
          paymentStatus={props.booking.paymentStatus}
          width={props.width}
          strokeWidth={props.iconStroke}
        />
        <span className="truncate">{props.booking.guestName}</span>
      </div>
    </motion.div>
  );

  // Disable popover while dragging (globally) or for the item being dragged.
  if (props.isDragging || isDragging) return pill;

  return (
    <HoverCard.Root openDelay={150} closeDelay={100}>
      <HoverCard.Trigger asChild>{pill}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          side="top"
          align="start"
          sideOffset={8}
          className="z-50 w-72 rounded-xl border bg-white p-3 text-sm shadow-lg"
          style={{ borderColor: props.border }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-zinc-500" strokeWidth={props.iconStroke} />
                <div className="truncate font-medium text-zinc-900">
                  {props.booking.guestName}
                </div>
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                {props.booking.startDate} → {props.booking.endDate}
              </div>
            </div>
            <div
              className="rounded-full px-2 py-1 text-[10px] font-medium"
              style={{
                background: "rgba(59,130,246,0.10)",
                color: "#1D4ED8",
              }}
            >
              Confirmed
            </div>
          </div>

          <div className="mt-3 grid gap-2 text-xs text-zinc-700">
            <div className="flex items-center gap-2">
              <CreditCard
                className="h-4 w-4 text-zinc-500"
                strokeWidth={props.iconStroke}
              />
              <div className="min-w-0">
                <span className="text-zinc-500">Payment:</span>{" "}
                <span className="font-medium">
                  {formatPaymentStatus(props.booking.paymentStatus)}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <StickyNote
                className="mt-0.5 h-4 w-4 text-zinc-500"
                strokeWidth={props.iconStroke}
              />
              <div className="min-w-0">
                <span className="text-zinc-500">Notes:</span>{" "}
                <span className="font-medium">
                  {props.booking.notes?.trim() ? props.booking.notes : "—"}
                </span>
              </div>
            </div>
          </div>

          <HoverCard.Arrow className="fill-white" width={12} height={6} />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

function LegendDot(props: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ background: props.color }}
      />
      <span className="hidden sm:inline">{props.label}</span>
    </div>
  );
}

function buildDateRange(startDate: string, days: number) {
  const start = parseYmd(startDate);
  const out: Array<{
    key: string;
    day: string;
    dow: string;
    longLabel: string;
    ymd: string;
  }> = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const ymd = toYmd(d);
    out.push({
      key: ymd,
      ymd,
      day: String(d.getDate()).padStart(2, "0"),
      dow: d.toLocaleDateString(undefined, { weekday: "short" }),
      longLabel: d.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    });
  }
  return out;
}

function dateIndex(dates: Array<{ ymd: string }>, ymd: string) {
  return dates.findIndex((d) => d.ymd === ymd);
}

function parseYmd(ymd: string) {
  const [y, m, d] = ymd.split("-").map((x) => Number(x));
  return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
}

function toYmd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatPaymentStatus(s: PaymentStatus) {
  if (s === "paid") return "Paid";
  if (s === "partial") return "Partially paid";
  return "Due";
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function groupBy<T>(items: T[], key: (item: T) => string) {
  const out: Record<string, T[]> = {};
  for (const item of items) {
    const k = key(item);
    (out[k] ??= []).push(item);
  }
  return out;
}

function groupByCategory(rooms: TimelineRoom[]) {
  const out: Record<string, TimelineRoom[]> = {};
  for (const r of rooms) (out[r.category] ??= []).push(r);
  for (const k of Object.keys(out)) {
    out[k].sort((a, b) => a.name.localeCompare(b.name));
  }
  return out;
}

function BookingPillIcon(props: {
  paymentStatus: PaymentStatus;
  width: number;
  strokeWidth: number;
}) {
  // Only show when there's enough space (keep slender look).
  if (props.width < 120) return null;

  if (props.paymentStatus === "paid") {
    return (
      <Check
        className="h-3.5 w-3.5 text-[#1D4ED8]/80"
        strokeWidth={props.strokeWidth}
      />
    );
  }

  if (props.paymentStatus === "due") {
    return (
      <Clock3
        className="h-3.5 w-3.5 text-[#1D4ED8]/70"
        strokeWidth={props.strokeWidth}
      />
    );
  }

  return null;
}

function TodayLine(props: {
  now: Date;
  rangeStartYmd: string;
  leftW: number;
  colW: number;
  days: number;
}) {
  const start = parseYmd(props.rangeStartYmd);
  const msPerDay = 86_400_000;
  const diffMs = props.now.getTime() - start.getTime();
  const diffDays = diffMs / msPerDay;

  if (diffDays < 0 || diffDays > props.days) return null;

  const x = props.leftW + diffDays * props.colW;
  return (
    <div className="pointer-events-none absolute top-0 bottom-0 z-30" style={{ left: x }}>
      <div
        className="h-full"
        style={{
          width: 1,
          background: "#EF4444",
          boxShadow: "0 0 0 1px rgba(239,68,68,0.06)",
        }}
      />
    </div>
  );
}

function roomStatusColor(s: RoomStatus) {
  if (s === "clean") return "#22C55E";
  if (s === "inspected") return "#FBBF24";
  return "#F59E0B";
}

function roomStatusLabel(s: RoomStatus) {
  if (s === "clean") return "Clean";
  if (s === "inspected") return "Inspected";
  return "Dirty";
}

function calcLeftW(rooms: TimelineRoom[], compact: boolean) {
  // Heuristic width based on longest room name.
  const maxLen = rooms.reduce((m, r) => Math.max(m, r.name.length), 5);
  const pxPerChar = compact ? 8.4 : 9.2;
  const base = compact ? 84 : 110; // padding + dot + breathing room
  const raw = Math.round(base + maxLen * pxPerChar);
  const min = compact ? 132 : 170;
  const max = compact ? 200 : 240;
  return clamp(raw, min, max);
}
