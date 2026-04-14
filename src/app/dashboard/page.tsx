"use client";

import {
  FinanceList,
  HeaderLinksInline,
  HeaderTabs,
  LeftRail,
  MiniOccupancyChart,
  PercentDonut,
  ReportsList,
  RingStat,
  NavDrawer,
  SpacesRing,
  SocialWidget,
  TopBar,
  WidgetCard,
} from "@/components/DashboardWidgets";
import { NewReservationWizard } from "@/components/NewReservationWizard";
import { useState } from "react";

export default function DashboardPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [occupancyTab, setOccupancyTab] = useState<
    "occupancy" | "availability" | "rate" | "product"
  >("occupancy");
  return (
    <div className="min-h-screen bg-white">
      <TopBar
        onOpenNav={() => setNavOpen(true)}
        onNewReservation={() => setReservationOpen(true)}
      />
      <NavDrawer open={navOpen} onClose={() => setNavOpen(false)} />
      <NewReservationWizard
        open={reservationOpen}
        onClose={() => setReservationOpen(false)}
        hotelName="THE BAMBOO HOTEL"
      />
      <div className="mx-auto flex w-full max-w-7xl">
        <LeftRail />
        <main className="flex-1">
          <div className="grid grid-cols-1 border-l border-[#F1F1F1] md:grid-cols-12">
            {/* Top row: Reservations / Orders+Spaces / Customers */}
            <div className="border-b border-[#F1F1F1] md:col-span-8 md:border-r md:border-r-[#F1F1F1]">
              <div className="grid grid-cols-1 items-stretch md:grid-cols-12">
                <div className="border-b border-[#F1F1F1] md:col-span-6 md:border-b-0 md:border-r md:border-r-[#F1F1F1]">
                  <WidgetCard
                    title="Đặt phòng"
                    headerLinks={
                      <HeaderLinksInline
                        items={[
                          { label: "Tổng quan đặt phòng" },
                          { label: "Báo cáo đặt phòng" },
                        ]}
                      />
                    }
                  >
                    <div className="grid gap-5 pt-1">
                      <RingStat
                        label="Khách đến còn lại"
                        main={19}
                        sub={2}
                        color="#3B82F6"
                      />
                      <RingStat
                        label="Khách đi còn lại"
                        main={21}
                        sub={1}
                        color="#3B82F6"
                      />
                    </div>
                  </WidgetCard>
                </div>

                <div className="md:col-span-6">
                  <WidgetCard
                    title="Đơn hàng"
                    headerLinks={
                      <HeaderLinksInline items={[{ label: "Không có việc cần làm" }]} />
                    }
                    subtitle="Khu vực"
                  >
                    <div className="grid gap-4">
                      <div className="text-[12px] text-zinc-500">
                        Không có việc cần làm
                      </div>
                      <div className="border border-[#F1F1F1] bg-white px-3 py-2 text-[12px] text-zinc-600">
                        Trạng thái phòng
                        <span className="float-right text-xs text-zinc-400">›</span>
                      </div>
                      <SpacesRing
                        clean={25}
                        inspected={3}
                        dirty={12}
                        outOfService={3}
                      />
                    </div>
                  </WidgetCard>
                </div>
              </div>
            </div>

            <div className="border-b border-[#F1F1F1] md:col-span-4 md:border-b-0">
              <WidgetCard
                title="Khách hàng"
                headerLinks={
                  <HeaderLinksInline
                    items={[
                      { label: "Thống kê khách" },
                      { label: "Khách đang lưu trú" },
                      { label: "Hồ sơ khách" },
                    ]}
                  />
                }
              >
                <div className="grid gap-5 pt-1">
                  <PercentDonut label="Hồ sơ khách đến" a={75} b={25} />
                  <PercentDonut label="Hồ sơ khách đang ở" a={75} b={25} />
                </div>
              </WidgetCard>
            </div>

            {/* Bottom row: Occupancy / Finance+Reports / Social */}
            <div className="border-b border-[#F1F1F1] md:col-span-8 md:border-b-0 md:border-r md:border-r-[#F1F1F1]">
              <WidgetCard
                title="Công suất"
                headerLinks={
                  <HeaderTabs
                    tabs={[
                      { id: "occupancy", label: "Công suất" },
                      { id: "availability", label: "Tình trạng phòng" },
                      { id: "rate", label: "Quản lý giá" },
                      { id: "product", label: "Báo cáo sản phẩm" },
                    ]}
                    activeId={occupancyTab}
                    onChange={(id) =>
                      setOccupancyTab(
                        id as "occupancy" | "availability" | "rate" | "product"
                      )
                    }
                  />
                }
              >
                {occupancyTab === "occupancy" ? (
                  <MiniOccupancyChart />
                ) : (
                  <div className="border border-[#F1F1F1] bg-white px-3 py-2 text-[13px] text-zinc-600">
                    Nội dung tab “{tabLabel(occupancyTab)}” sẽ được bổ sung sau.
                  </div>
                )}
              </WidgetCard>
            </div>

            <div className="border-b border-[#F1F1F1] md:col-span-4 md:border-b-0">
              <WidgetCard title="Tài chính">
                <div className="grid gap-4">
                  <FinanceList />
                  <div className="pt-2">
                    <div className="text-[13px] font-semibold tracking-tight text-zinc-900">
                      Báo cáo
                    </div>
                    <div className="mt-2">
                      <ReportsList />
                    </div>
                  </div>
                </div>
              </WidgetCard>
            </div>

            <div className="md:col-span-12">
              <SocialWidget />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function tabLabel(
  id: "occupancy" | "availability" | "rate" | "product"
) {
  if (id === "availability") return "Tình trạng phòng";
  if (id === "rate") return "Quản lý giá";
  if (id === "product") return "Báo cáo sản phẩm";
  return "Công suất";
}

