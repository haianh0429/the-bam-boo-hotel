import {
  FinanceList,
  HeaderLinksInline,
  MiniOccupancyChart,
  PercentDonut,
  ReportsList,
  RingStat,
  Sidebar,
  SpacesRing,
  SocialWidget,
  TopBar,
  WidgetCard,
} from "@/components/DashboardWidgets";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <div className="mx-auto flex w-full max-w-7xl">
        <Sidebar />
        <main className="flex-1">
          <div className="grid grid-cols-1 border-l border-[#F1F1F1] lg:grid-cols-12">
            {/* Left two columns (like Mews main area) */}
            <div className="border-r border-[#F1F1F1] lg:col-span-8">
              {/* Top row: 3 columns like Mews */}
              <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
                <div className="border-b border-[#F1F1F1] lg:col-span-4 lg:border-r lg:border-r-[#F1F1F1]">
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

                <div className="border-b border-[#F1F1F1] lg:col-span-4 lg:border-r lg:border-r-[#F1F1F1]">
                  <WidgetCard
                    title="Đơn hàng"
                    headerLinks={
                      <HeaderLinksInline
                        items={[
                          { label: "Không có việc cần làm" },
                          { label: "Trạng thái đơn" },
                        ]}
                      />
                    }
                  >
                    <div className="border border-[#F1F1F1] bg-white px-3 py-2 text-[13px] text-zinc-600">
                      Không có việc cần làm.
                    </div>
                  </WidgetCard>
                </div>

                <div className="border-b border-[#F1F1F1] lg:col-span-4">
                  <WidgetCard
                    title="Khu vực"
                    headerLinks={
                      <HeaderLinksInline items={[{ label: "Trạng thái phòng" }]} />
                    }
                  >
                    <SpacesRing
                      clean={25}
                      inspected={3}
                      dirty={12}
                      outOfService={3}
                    />
                  </WidgetCard>
                </div>
              </div>

              {/* Bottom row: Occupancy wide + optional social */}
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="border-b border-[#F1F1F1] lg:col-span-12">
                  <WidgetCard title="Công suất">
                    <MiniOccupancyChart />
                  </WidgetCard>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-4">
              <div className="border-b border-[#F1F1F1]">
                <WidgetCard title="Khách hàng">
                  <div className="grid gap-5">
                    <PercentDonut label="Hồ sơ khách đến" a={75} b={25} />
                    <PercentDonut label="Hồ sơ khách đang ở" a={75} b={25} />
                  </div>
                </WidgetCard>
              </div>

              <div className="border-b border-[#F1F1F1]">
                <WidgetCard title="Tài chính">
                  <FinanceList />
                </WidgetCard>
              </div>

              <div>
                <WidgetCard title="Báo cáo">
                  <ReportsList />
                </WidgetCard>
              </div>

              <div className="border-t border-[#F1F1F1]">
                <SocialWidget />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

