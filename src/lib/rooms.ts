export type RoomCategory = {
  id: string;
  name: string;
};

export type Room = {
  id: string;
  name: string; // display name/number
  categoryId: string;
};

export const ROOM_CATEGORIES: RoomCategory[] = [
  { id: "deluxe-suite", name: "Deluxe Suite" },
  { id: "suite-balcony", name: "Suite Balcony" },
  { id: "president-suite", name: "President Suite" },
  { id: "dummy-room", name: "Dummy Room" },
];

export const ROOMS: Room[] = [
  // Deluxe Suite
  { id: "deluxe-201", name: "201", categoryId: "deluxe-suite" },
  { id: "deluxe-401", name: "401", categoryId: "deluxe-suite" },

  // Suite Balcony
  { id: "balcony-202", name: "202", categoryId: "suite-balcony" },
  // Note: user requested "402" again; keep unique id while displaying "402"
  { id: "balcony-402", name: "402", categoryId: "suite-balcony" },

  // President Suite
  { id: "president-301", name: "301", categoryId: "president-suite" },

  // Dummy Room
  { id: "dummy-1", name: "Dummy 1", categoryId: "dummy-room" },
  { id: "dummy-2", name: "Dummy 2", categoryId: "dummy-room" },
  { id: "dummy-3", name: "Dummy 3", categoryId: "dummy-room" },
];

export function categoryNameById(id: string) {
  return ROOM_CATEGORIES.find((c) => c.id === id)?.name ?? id;
}

