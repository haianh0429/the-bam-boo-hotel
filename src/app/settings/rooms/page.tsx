import { ROOM_CATEGORIES, ROOMS } from "@/lib/rooms";
import { DoorClosed, Layers3 } from "lucide-react";

export default function RoomsSettingsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFB]">
      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight text-zinc-900">
              Cài đặt phòng
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Danh sách loại phòng và phòng theo cấu hình hiện tại.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {ROOM_CATEGORIES.map((cat) => {
            const catRooms = ROOMS.filter((r) => r.categoryId === cat.id);
            return (
              <div key={cat.id} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Layers3 className="h-4 w-4 text-zinc-500" strokeWidth={1.5} />
                  <div className="text-sm font-semibold text-zinc-900">
                    {cat.name}
                  </div>
                  <div className="text-xs text-zinc-400">({catRooms.length})</div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {catRooms.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between rounded-xl border bg-white px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-2 text-zinc-700">
                        <DoorClosed className="h-4 w-4 text-zinc-500" strokeWidth={1.5} />
                        <span className="font-medium">{r.name}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">{r.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

