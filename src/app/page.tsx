import { BookingTimelineDemo } from "@/components/BookingTimelineDemo";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[#FAFAFB]">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8">
        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight text-zinc-900">
              Hotel Booking Timeline
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Hover a booking pill to see quick info.
            </p>
          </div>
        </div>

        <BookingTimelineDemo />
      </main>
    </div>
  );
}
