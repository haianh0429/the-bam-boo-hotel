"use client";

import {
  HotelBookingTimeline,
  TimelineBooking,
  TimelineRoom,
} from "@/components/HotelBookingTimeline";
import { useMemo, useState } from "react";

export function BookingTimelineDemo() {
  const startDate = useMemo(() => toYmd(new Date()), []);

  const rooms: TimelineRoom[] = [
    { id: "d101", name: "D101", category: "Deluxe", status: "clean" },
    { id: "d102", name: "D102", category: "Deluxe", status: "inspected" },
    { id: "d103", name: "D103", category: "Deluxe", status: "clean" },
    { id: "s201", name: "S201", category: "Standard", status: "clean" },
    { id: "s202", name: "S202", category: "Standard", status: "dirty" },
    { id: "s203", name: "S203", category: "Standard", status: "clean" },
  ];

  const [bookings, setBookings] = useState<TimelineBooking[]>(() => [
    {
      id: "b1",
      roomId: "d101",
      guestName: "Nguyen Minh Anh",
      paymentStatus: "paid",
      notes: "Late arrival (after 9pm).",
      startDate: addDays(startDate, 1),
      endDate: addDays(startDate, 4),
      status: "confirmed",
    },
    {
      id: "b2",
      roomId: "d102",
      guestName: "Tran Quang Huy",
      paymentStatus: "due",
      notes: "Needs invoice.",
      startDate: addDays(startDate, 0),
      endDate: addDays(startDate, 2),
      status: "confirmed",
    },
    {
      id: "b3",
      roomId: "s201",
      guestName: "Linh Pham",
      paymentStatus: "partial",
      notes: "High floor preferred.",
      startDate: addDays(startDate, 5),
      endDate: addDays(startDate, 9),
      status: "confirmed",
    },
    {
      id: "b4",
      roomId: "s203",
      guestName: "David Kim",
      paymentStatus: "paid",
      notes: "",
      startDate: addDays(startDate, 2),
      endDate: addDays(startDate, 3),
      status: "confirmed",
    },
  ]);

  return (
    <HotelBookingTimeline
      startDate={startDate}
      days={14}
      rooms={rooms}
      bookings={bookings}
      onMoveBooking={({ bookingId, toRoomId, dayDelta }) => {
        if (!dayDelta && !toRoomId) return;
        setBookings((prev) =>
          prev.map((b) => {
            if (b.id !== bookingId) return b;
            const nextStart = addDays(b.startDate, dayDelta);
            const nextEnd = addDays(b.endDate, dayDelta);
            return {
              ...b,
              roomId: toRoomId,
              startDate: nextStart,
              endDate: nextEnd,
            };
          })
        );
      }}
    />
  );
}

function toYmd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(ymd: string, days: number) {
  const [y, m, d] = ymd.split("-").map((x) => Number(x));
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
  dt.setDate(dt.getDate() + days);
  return toYmd(dt);
}
