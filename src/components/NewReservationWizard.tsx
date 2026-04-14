"use client";

import { ROOM_CATEGORIES, ROOMS, RoomCategory } from "@/lib/rooms";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  DoorClosed,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type StepId = "date" | "availability" | "summary";

type SelectedCategory = {
  categoryId: string;
  qty: number;
};

type AssignedRoom = {
  categoryId: string;
  roomId: string;
};

export function NewReservationWizard(props: {
  open: boolean;
  onClose: () => void;
  hotelName?: string;
}) {
  const hotelName = props.hotelName ?? "THE BAMBOO HOTEL";

  const [step, setStep] = useState<StepId>("date");
  const [checkIn, setCheckIn] = useState<string | null>(null); // YYYY-MM-DD
  const [checkOut, setCheckOut] = useState<string | null>(null); // YYYY-MM-DD
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const a = parseYmd(checkIn);
    const b = parseYmd(checkOut);
    const diff = Math.round((b.getTime() - a.getTime()) / 86_400_000);
    return Math.max(0, diff);
  }, [checkIn, checkOut]);

  const [selected, setSelected] = useState<Record<string, SelectedCategory>>({});
  const [showAssign, setShowAssign] = useState(false);
  const [assigned, setAssigned] = useState<AssignedRoom[]>([]);

  const [guestName, setGuestName] = useState("");
  const [source, setSource] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [booker, setBooker] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bookingNumber] = useState(() => random8Digits());

  const today = useMemo(() => new Date(), []);
  const [monthOffset, setMonthOffset] = useState(0);

  const rangeReady = Boolean(checkIn && checkOut && nights > 0);
  const availability = useMemo(() => {
    if (!rangeReady || !checkIn || !checkOut) return [];
    const byCat = ROOM_CATEGORIES.map((c) => {
      const total = ROOMS.filter((r) => r.categoryId === c.id).length;
      // TODO: replace with real availability from DB/reservations.
      // For now, assume no existing bookings -> all available.
      const available = total;
      return { category: c, total, available };
    }).filter((x) => x.available > 0);
    return byCat;
  }, [rangeReady, checkIn, checkOut]);

  const assignedByCategory = useMemo(() => {
    const out: Record<string, number> = {};
    for (const a of assigned) out[a.categoryId] = (out[a.categoryId] ?? 0) + 1;
    return out;
  }, [assigned]);

  function resetAll() {
    setStep("date");
    setCheckIn(null);
    setCheckOut(null);
    setSelected({});
    setAssigned([]);
    setShowAssign(false);
    setGuestName("");
    setSource("");
    setCompanyName("");
    setBooker("");
    setGuestCount(1);
    setPhone("");
    setEmail("");
    setMonthOffset(0);
  }

  function close() {
    props.onClose();
    resetAll();
  }

  if (!props.open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={close}
        aria-label="Đóng"
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl overflow-auto bg-white shadow-2xl">
        <div className="border-b border-[#F1F1F1] px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-semibold tracking-tight text-zinc-900">
                New Reservation
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                {hotelName}
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              className="rounded-md border border-[#F1F1F1] bg-white p-2 text-zinc-700 hover:bg-zinc-50"
              aria-label="Đóng"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs">
            <StepPill active={step === "date"} done={rangeReady}>
              1 - Ngày
            </StepPill>
            <div className="h-px flex-1 bg-[#F1F1F1]" />
            <StepPill
              active={step === "availability"}
              done={Object.keys(selected).length > 0}
              disabled={!rangeReady}
              onClick={() => rangeReady && setStep("availability")}
            >
              2 - Phòng trống
            </StepPill>
            <div className="h-px flex-1 bg-[#F1F1F1]" />
            <StepPill
              active={step === "summary"}
              done={false}
              disabled={!rangeReady || Object.keys(selected).length === 0}
              onClick={() =>
                rangeReady &&
                Object.keys(selected).length > 0 &&
                setStep("summary")
              }
            >
              3 - Tổng kết
            </StepPill>
          </div>
        </div>

        <div className="px-5 py-5">
          {step === "date" ? (
            <div className="grid gap-4">
              <div className="text-sm font-semibold text-zinc-900">Ngày</div>
              <div className="grid gap-3 rounded-xl border border-[#F1F1F1] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    className="rounded-md border border-[#F1F1F1] bg-white p-2 text-zinc-700 hover:bg-zinc-50"
                    onClick={() => setMonthOffset((m) => m - 1)}
                    aria-label="Tháng trước"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                    <CalendarDays className="h-4 w-4 text-zinc-500" strokeWidth={1.5} />
                    <span>Chọn ngày check-in / check-out</span>
                  </div>
                  <button
                    type="button"
                    className="rounded-md border border-[#F1F1F1] bg-white p-2 text-zinc-700 hover:bg-zinc-50"
                    onClick={() => setMonthOffset((m) => m + 1)}
                    aria-label="Tháng sau"
                  >
                    <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="grid gap-4">
                  <MonthGrid
                    base={addMonths(startOfMonth(today), monthOffset)}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onPick={(ymd) => {
                      // picking logic
                      if (!checkIn || (checkIn && checkOut)) {
                        setCheckIn(ymd);
                        setCheckOut(null);
                        return;
                      }
                      if (checkIn && !checkOut) {
                        if (parseYmd(ymd) <= parseYmd(checkIn)) {
                          setCheckIn(ymd);
                          setCheckOut(null);
                        } else {
                          setCheckOut(ymd);
                        }
                      }
                    }}
                  />
                  <MonthGrid
                    base={addMonths(startOfMonth(today), monthOffset + 1)}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onPick={(ymd) => {
                      if (!checkIn || (checkIn && checkOut)) {
                        setCheckIn(ymd);
                        setCheckOut(null);
                        return;
                      }
                      if (checkIn && !checkOut) {
                        if (parseYmd(ymd) <= parseYmd(checkIn)) {
                          setCheckIn(ymd);
                          setCheckOut(null);
                        } else {
                          setCheckOut(ymd);
                        }
                      }
                    }}
                  />
                  <MonthGrid
                    base={addMonths(startOfMonth(today), monthOffset + 2)}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onPick={(ymd) => {
                      if (!checkIn || (checkIn && checkOut)) {
                        setCheckIn(ymd);
                        setCheckOut(null);
                        return;
                      }
                      if (checkIn && !checkOut) {
                        if (parseYmd(ymd) <= parseYmd(checkIn)) {
                          setCheckIn(ymd);
                          setCheckOut(null);
                        } else {
                          setCheckOut(ymd);
                        }
                      }
                    }}
                  />
                </div>

                <div className="mt-1 grid gap-2 text-sm text-zinc-700">
                  <div className="flex items-center justify-between rounded-lg border border-[#F1F1F1] bg-white px-3 py-2">
                    <span className="text-zinc-500">Check-in</span>
                    <span className="font-medium">{checkIn ?? "—"}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-[#F1F1F1] bg-white px-3 py-2">
                    <span className="text-zinc-500">Check-out</span>
                    <span className="font-medium">{checkOut ?? "—"}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-[#F1F1F1] bg-white px-3 py-2">
                    <span className="text-zinc-500">Nights</span>
                    <span className="font-medium">{nights || "—"}</span>
                  </div>
                </div>
              </div>

              {rangeReady ? (
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-[#F1F1F1] bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                    onClick={() => {
                      setSelected({});
                      setAssigned([]);
                      setStep("availability");
                    }}
                  >
                    Tiếp tục
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === "availability" ? (
            <div className="grid gap-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">
                    Availability
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    Chỉ hiển thị loại phòng còn trống trong khoảng ngày đã chọn.
                  </div>
                </div>
                <button
                  type="button"
                  className="text-xs font-medium text-zinc-600 underline underline-offset-4"
                  onClick={() => setStep("date")}
                >
                  Đổi ngày
                </button>
              </div>

              <div className="overflow-hidden rounded-xl border border-[#F1F1F1] bg-white">
                <div className="grid grid-cols-12 gap-2 border-b border-[#F1F1F1] bg-[#FCFCFD] px-4 py-2 text-[11px] font-medium text-zinc-500">
                  <div className="col-span-1">STT</div>
                  <div className="col-span-7">Loại phòng</div>
                  <div className="col-span-2 text-right">Available</div>
                  <div className="col-span-2 text-right">Chọn</div>
                </div>
                <div className="divide-y divide-[#F1F1F1]">
                  {availability.map((row, idx) => {
                    const sel = selected[row.category.id];
                    return (
                      <div
                        key={row.category.id}
                        className="grid grid-cols-12 items-center gap-2 px-4 py-3 text-sm"
                      >
                        <div className="col-span-1 text-zinc-500">{idx + 1}</div>
                        <div className="col-span-7 font-medium text-zinc-900">
                          {row.category.name}
                        </div>
                        <div className="col-span-2 text-right font-semibold text-zinc-900">
                          {row.available}
                        </div>
                        <div className="col-span-2 flex justify-end">
                          {sel ? (
                            <QtyStepper
                              value={sel.qty}
                              min={1}
                              max={row.available}
                              onChange={(v) =>
                                setSelected((prev) => ({
                                  ...prev,
                                  [row.category.id]: {
                                    categoryId: row.category.id,
                                    qty: v,
                                  },
                                }))
                              }
                              onRemove={() =>
                                setSelected((prev) => {
                                  const next = { ...prev };
                                  delete next[row.category.id];
                                  setAssigned((a) =>
                                    a.filter((x) => x.categoryId !== row.category.id)
                                  );
                                  return next;
                                })
                              }
                            />
                          ) : (
                            <button
                              type="button"
                              className="rounded-md border border-[#F1F1F1] bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                              onClick={() =>
                                setSelected((prev) => ({
                                  ...prev,
                                  [row.category.id]: {
                                    categoryId: row.category.id,
                                    qty: 1,
                                  },
                                }))
                              }
                            >
                              Select
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  className="rounded-md border border-[#F1F1F1] bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  onClick={() => setStep("date")}
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
                  disabled={Object.keys(selected).length === 0}
                  onClick={() => setStep("summary")}
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          ) : null}

          {step === "summary" ? (
            <div className="grid gap-4">
              <div className="rounded-xl border border-[#F1F1F1] bg-white p-4">
                <div className="text-sm font-semibold text-zinc-900">
                  {formatViLong(checkIn)} → {formatViLong(checkOut)}
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  Nights: <span className="font-semibold text-zinc-900">{nights}</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#F1F1F1] bg-white p-4">
                <div className="text-sm font-semibold text-zinc-900">
                  Thông tin đặt phòng
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <Field label="Tên khách" value={guestName} onChange={setGuestName} />
                  <Field label="Source" value={source} onChange={setSource} />
                  <Field label="Tên công ty" value={companyName} onChange={setCompanyName} />
                  <Field label="Booker (tuỳ chọn)" value={booker} onChange={setBooker} />
                  <NumberField
                    label="Số lượng khách"
                    value={guestCount}
                    onChange={setGuestCount}
                    min={1}
                    max={20}
                  />
                  <Field label="Điện thoại" value={phone} onChange={setPhone} />
                  <Field label="Email" value={email} onChange={setEmail} />
                  <ReadOnlyField label="Booking Number" value={bookingNumber} />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    className="rounded-md border border-[#F1F1F1] bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                    onClick={() => setStep("availability")}
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                    onClick={() => setShowAssign((v) => !v)}
                  >
                    Gán phòng
                  </button>
                </div>
              </div>

              {showAssign ? (
                <AssignRooms
                  selected={Object.values(selected)}
                  assigned={assigned}
                  onAssign={(a) => setAssigned((prev) => [...prev, a])}
                  onUnassign={(roomId) =>
                    setAssigned((prev) => prev.filter((x) => x.roomId !== roomId))
                  }
                  assignedByCategory={assignedByCategory}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StepPill(props: {
  children: React.ReactNode;
  active: boolean;
  done: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={props.onClick}
      className={[
        "rounded-full border px-3 py-1 text-xs font-medium",
        props.active
          ? "border-zinc-900 bg-zinc-900 text-white"
          : props.done
            ? "border-[#F1F1F1] bg-white text-zinc-700"
            : "border-[#F1F1F1] bg-white text-zinc-400",
        props.disabled ? "cursor-not-allowed opacity-60" : "hover:bg-zinc-50",
      ].join(" ")}
    >
      {props.children}
    </button>
  );
}

function QtyStepper(props: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        className="rounded-md border border-[#F1F1F1] bg-white p-2 text-zinc-700 hover:bg-zinc-50"
        onClick={() => {
          const next = props.value - 1;
          if (next < props.min) {
            props.onRemove();
          } else {
            props.onChange(next);
          }
        }}
        aria-label="Giảm"
      >
        <Minus className="h-4 w-4" strokeWidth={1.5} />
      </button>
      <div className="w-8 text-center text-sm font-semibold tabular-nums text-zinc-900">
        {props.value}
      </div>
      <button
        type="button"
        className="rounded-md border border-[#F1F1F1] bg-white p-2 text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
        disabled={props.value >= props.max}
        onClick={() => props.onChange(Math.min(props.max, props.value + 1))}
        aria-label="Tăng"
      >
        <Plus className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}

function AssignRooms(props: {
  selected: SelectedCategory[];
  assigned: AssignedRoom[];
  assignedByCategory: Record<string, number>;
  onAssign: (a: AssignedRoom) => void;
  onUnassign: (roomId: string) => void;
}) {
  return (
    <div className="rounded-xl border border-[#F1F1F1] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">Gán phòng</div>
          <div className="mt-1 text-xs text-zinc-500">
            Chọn phòng theo loại phòng và số lượng đã chọn.
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {props.selected.map((s) => {
          const cat = ROOM_CATEGORIES.find((c) => c.id === s.categoryId);
          if (!cat) return null;
          const assignedCount = props.assignedByCategory[s.categoryId] ?? 0;
          const remaining = Math.max(0, s.qty - assignedCount);

          const availableRooms = ROOMS.filter((r) => r.categoryId === s.categoryId).filter(
            (r) => !props.assigned.some((a) => a.roomId === r.id)
          );

          return (
            <div key={s.categoryId} className="rounded-lg border border-[#F1F1F1] p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-zinc-900">
                  {cat.name}
                </div>
                <div className="text-xs text-zinc-500">
                  Đã gán:{" "}
                  <span className="font-semibold text-zinc-900">
                    {assignedCount}/{s.qty}
                  </span>
                </div>
              </div>

              <div className="mt-3 grid gap-2">
                {props.assigned
                  .filter((a) => a.categoryId === s.categoryId)
                  .map((a) => {
                    const roomName = ROOMS.find((r) => r.id === a.roomId)?.name ?? a.roomId;
                    return (
                      <div
                        key={a.roomId}
                        className="flex items-center justify-between rounded-md border border-[#F1F1F1] bg-white px-3 py-2 text-sm"
                      >
                        <div className="flex items-center gap-2 text-zinc-700">
                          <DoorClosed className="h-4 w-4 text-zinc-500" strokeWidth={1.5} />
                          <span className="font-medium">{roomName}</span>
                        </div>
                        <button
                          type="button"
                          className="text-xs font-medium text-zinc-600 underline underline-offset-4"
                          onClick={() => props.onUnassign(a.roomId)}
                        >
                          Gỡ
                        </button>
                      </div>
                    );
                  })}

                {remaining > 0 ? (
                  <div className="flex items-center gap-2">
                    <select
                      className="flex-1 rounded-md border border-[#F1F1F1] bg-white px-3 py-2 text-sm text-zinc-700 outline-none"
                      defaultValue=""
                      onChange={(e) => {
                        const roomId = e.target.value;
                        if (!roomId) return;
                        props.onAssign({ categoryId: s.categoryId, roomId });
                        e.currentTarget.value = "";
                      }}
                    >
                      <option value="" disabled>
                        {cat.name} còn trống ({availableRooms.length})
                      </option>
                      {availableRooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                    <div className="text-xs text-zinc-500">
                      Cần gán thêm{" "}
                      <span className="font-semibold text-zinc-900">{remaining}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-emerald-700">
                    <Check className="h-4 w-4" strokeWidth={1.5} />
                    Đã gán đủ số phòng cho loại này.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="grid gap-1">
      <div className="text-xs font-medium text-zinc-600">{props.label}</div>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="rounded-md border border-[#F1F1F1] bg-white px-3 py-2 text-sm text-zinc-900 outline-none"
      />
    </label>
  );
}

function NumberField(props: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <label className="grid gap-1">
      <div className="text-xs font-medium text-zinc-600">{props.label}</div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-md border border-[#F1F1F1] bg-white p-2 text-zinc-700 hover:bg-zinc-50"
          onClick={() => props.onChange(Math.max(props.min, props.value - 1))}
          aria-label="Giảm"
        >
          <Minus className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <div className="w-12 text-center text-sm font-semibold tabular-nums text-zinc-900">
          {props.value}
        </div>
        <button
          type="button"
          className="rounded-md border border-[#F1F1F1] bg-white p-2 text-zinc-700 hover:bg-zinc-50"
          onClick={() => props.onChange(Math.min(props.max, props.value + 1))}
          aria-label="Tăng"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </label>
  );
}

function ReadOnlyField(props: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <div className="text-xs font-medium text-zinc-600">{props.label}</div>
      <div className="rounded-md border border-[#F1F1F1] bg-[#FCFCFD] px-3 py-2 text-sm font-semibold tabular-nums text-zinc-900">
        {props.value}
      </div>
    </div>
  );
}

function MonthGrid(props: {
  base: Date; // first day of month
  checkIn: string | null;
  checkOut: string | null;
  onPick: (ymd: string) => void;
}) {
  const monthLabel = props.base.toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });
  const days = buildMonthCells(props.base);

  return (
    <div className="rounded-lg border border-[#F1F1F1] bg-white p-3">
      <div className="text-xs font-semibold text-zinc-900">{monthLabel}</div>
      <div className="mt-2 grid grid-cols-7 gap-1 text-[10px] text-zinc-500">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((cell) => {
          if (!cell.ymd) return <div key={cell.key} />;
          const isIn = props.checkIn === cell.ymd;
          const isOut = props.checkOut === cell.ymd;
          const inRange =
            props.checkIn &&
            props.checkOut &&
            parseYmd(cell.ymd) > parseYmd(props.checkIn) &&
            parseYmd(cell.ymd) < parseYmd(props.checkOut);
          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => props.onPick(cell.ymd!)}
              className={[
                "h-9 rounded-md text-sm font-medium",
                isIn || isOut
                  ? "bg-zinc-900 text-white"
                  : inRange
                    ? "bg-zinc-900/10 text-zinc-900"
                    : "hover:bg-zinc-900/5 text-zinc-700",
              ].join(" ")}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function buildMonthCells(base: Date) {
  const y = base.getFullYear();
  const m = base.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);
  // Monday=1..Sunday=0 in JS, convert to Monday-first grid
  const offset = (first.getDay() + 6) % 7;
  const out: Array<{ key: string; ymd?: string; day?: number }> = [];
  for (let i = 0; i < offset; i++) out.push({ key: `pad-${i}` });
  for (let d = 1; d <= last.getDate(); d++) {
    const dt = new Date(y, m, d);
    const ymd = toYmd(dt);
    out.push({ key: ymd, ymd, day: d });
  }
  return out;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, months: number) {
  return new Date(d.getFullYear(), d.getMonth() + months, 1);
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

function random8Digits() {
  return String(Math.floor(10000000 + Math.random() * 90000000));
}

function formatViLong(ymd: string | null) {
  if (!ymd) return "—";
  const d = parseYmd(ymd);
  return d.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

