import AdPawsCard from "@/components/AdPawsCard";
import InsightCard from "@/components/Dashboard/InsightCard";
import DayCareQuickForm from "@/components/Form/Forms/DayCareQuickForm";
import HotelQuickForm from "@/components/Form/Forms/HotelQuickForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { getClockTime, getFormattedDate, getTimeOfDay } from "@/lib/utils";
import {
  ArrowUpIcon,
  DoorOpen,
  HotelIcon,
  HouseIcon,
  PawPrintIcon,
} from "lucide-react";

export default function Dashboard() {
  const { user, company } = useAuth();
  return (
    <div className="h-full px-6 py-4 overflow-auto">
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
      <div className="">
        <div className="grid grid-cols-6 lg:grid-cols-12 grid-template-rows-[162px_162px_162px_162px_auto] lg:grid-template-rows-[162px_auto] gap-6">
          <InsightCard
            title="Huéspedes de hoy"
            data="20"
            mainIcon={PawPrintIcon}
            iconBackgroundColor="#E4F0E4"
            iconColor="#80AF80"
            iconFill="#80AF80"
            disclaimer="+10% vs semana pasada"
            disclaimerIcon={ArrowUpIcon}
            className="col-span-3 landscape:xl:col-span-3 order-2 landscape:lg:col-span-4"
          />
          <InsightCard
            title="Llegando hoy"
            data="8"
            mainIcon={HotelIcon}
            iconBackgroundColor="#C5DAEF"
            iconColor="#2563EB"
            iconFill="transparent"
            disclaimer="4 han hecho check-in"
            disclaimerIcon={ArrowUpIcon}
            className="col-span-3 landscape:xl:col-span-3 order-2 landscape:lg:col-span-4"
          />
          <InsightCard
            title="Saliendo hoy"
            data="5"
            mainIcon={DoorOpen}
            iconBackgroundColor="#FFEDD5"
            iconColor="#E4A542"
            iconFill="transparent"
            disclaimer="2 pickups retrasados"
            disclaimerIcon={ArrowUpIcon}
            className="col-span-3 landscape:xl:col-span-3 order-3 landscape:lg:col-span-4"
          />
          <InsightCard
            title="Capacidad"
            data="80%"
            mainIcon={HouseIcon}
            iconBackgroundColor="#FCE7F3"
            iconColor="#EB5595"
            iconFill="transparent"
            disclaimer="5 habitaciones disponibles"
            disclaimerIcon={ArrowUpIcon}
            className="col-span-3 landscape:xl:col-span-3 order-4 landscape:lg:col-span-4"
          />
          <AdPawsCard className="col-span-3 row-span-4 order-1 lg:col-span-4 overflow-hidden landscape:lg:order-1 landscape:xl:order-5">
            <div className="w-full min-w-0 h-full flex flex-col">
              <p className="text-lg font-bold">Check-In rápido</p>
              <div className="mt-6 h-full">
                <Tabs defaultValue="hotel" className="w-full h-full">
                  <TabsList className="bg-[#F5F9F2] dark:bg-gray-500 mb-4">
                    <TabsTrigger
                      value="hotel"
                      className="data-[state=active]:bg-secondary! data-[state=active]:text-white! hover:cursor-pointer"
                    >
                      Hotel
                    </TabsTrigger>
                    <TabsTrigger
                      className="data-[state=active]:bg-secondary! data-[state=active]:text-white! hover:cursor-pointer"
                      value="daycare"
                    >
                      Guardería
                    </TabsTrigger>
                    {/* <TabsTrigger
                      className="data-[state=active]:bg-secondary! data-[state=active]:text-white! hover:cursor-pointer"
                      value="train"
                    >
                      Entrenamiento
                    </TabsTrigger> */}
                  </TabsList>
                  <TabsContent value="hotel">
                    <HotelQuickForm />
                  </TabsContent>
                  <TabsContent value="daycare">
                    <DayCareQuickForm />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </AdPawsCard>
        </div>
      </div>
    </div>
  );
}
