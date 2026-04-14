"use client";

import {
  HotelBookingTimeline,
  TimelineBooking,
  TimelineRoom,
} from "@/components/HotelBookingTimeline";
import { categoryNameById, ROOMS } from "@/lib/rooms";
import { useMemo, useState } from "react";

export function BookingTimelineDemo() {
  const startDate = useMemo(() => toYmd(new Date()), []);

  const rooms: TimelineRoom[] = useMemo(() => {
    return ROOMS.map((r, idx) => ({
      id: r.id,
      name: r.name,
      category: categoryNameById(r.categoryId),
      status: idx % 4 === 0 ? "dirty" : idx % 3 === 0 ? "inspected" : "clean",
    }));
  }, []);

  const [bookings, setBookings] = useState<TimelineBooking[]>(() => [
    {
      id: "b1",
      roomId: "deluxe-201",
      guestName: "Nguyen Minh Anh",
      paymentStatus: "paid",
      notes: "Late arrival (after 9pm).",
      startDate: addDays(startDate, 1),
      endDate: addDays(startDate, 4),
      status: "confirmed",
    },
    {
      id: "b2",
      roomId: "balcony-202",
      guestName: "Tran Quang Huy",
      paymentStatus: "due",
      notes: "Needs invoice.",
      startDate: addDays(startDate, 0),
      endDate: addDays(startDate, 2),
      status: "confirmed",
    },
    {
      id: "b3",
      roomId: "president-301",
      guestName: "Linh Pham",
      paymentStatus: "partial",
      notes: "High floor preferred.",
      startDate: addDays(startDate, 5),
      endDate: addDays(startDate, 9),
      status: "confirmed",
    },
    {
      id: "b4",
      roomId: "dummy-2",
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
