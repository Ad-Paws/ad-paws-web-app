import { useAuth } from "@/contexts/AuthContext";
import { getClockTime, getFormattedDate, getTimeOfDay } from "@/lib/utils";
import CurrentGuests from "@/components/Dashboard/CurrentGuests";
import TodaysRevenue from "@/components/Dashboard/TodaysRevenue";

export default function Dashboard() {
  const { user, company } = useAuth();
  return (
    <div className="h-[calc(100dvh-80px)] px-6 py-4 overflow-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-2xl font-bold">
            ¡{getTimeOfDay()}, {user?.name}!
          </p>
          <p className="text-[#6B7280] mt-1 ml-1">
            Esto es lo que ha pasado hoy en {company?.name}.
          </p>
        </div>
        <div>
          <p className="text-2xl font-bold">{getClockTime()}</p>
          <p className="">{getFormattedDate()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 h-[calc(100%-92px)]">
        <CurrentGuests />
        <div className="flex flex-col gap-6">
          <TodaysRevenue />
        </div>
      </div>
    </div>
  );
}
