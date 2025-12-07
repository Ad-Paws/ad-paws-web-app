import { Button } from "@/components/ui/button";
import MiniInsightCard from "@/components/Dashboard/MiniInsightCard";
import PetCard from "@/components/PetCard";
import {
  CheckIcon,
  FileUpIcon,
  PawPrintIcon,
  PlusIcon,
  StarIcon,
  SyringeIcon,
} from "lucide-react";

const Guests = () => {
  return (
    <div className="h-full px-6 py-4 overflow-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-2xl font-bold">Guestión de Peks</p>
          <p className="text-[#6B7280] mt-1">
            Edita perfiles, reportes médicos y más.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant={"link"}
            size={"lg"}
            className="rounded-md bg-white text-black! hover:no-underline"
          >
            <FileUpIcon className="w-4 h-4" />
            Exportar
          </Button>
          <Button
            variant={undefined}
            size={"lg"}
            className="rounded-md bg-accent!"
          >
            <PlusIcon className="w-4 h-4" />
            Añadir nuevo Pek
          </Button>
        </div>
      </div>

      {/* Mini Insight Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <MiniInsightCard
          title="Peks registrados"
          data="1,248"
          mainIcon={PawPrintIcon}
          iconBackgroundColor="#F5F0E8"
          iconColor="#8B7355"
          iconFill="#8B7355"
        />
        <MiniInsightCard
          title="Check-In hoy"
          data="24"
          mainIcon={CheckIcon}
          iconBackgroundColor="#E4F0E4"
          iconColor="#4CAF50"
          iconFill="none"
        />
        <MiniInsightCard
          title="Vacunas vencidas"
          data="8"
          mainIcon={SyringeIcon}
          iconBackgroundColor="#FCE4E4"
          iconColor="#E57373"
          iconFill="none"
        />
        <MiniInsightCard
          title="NUEVOS ESTE MES"
          data="15"
          mainIcon={StarIcon}
          iconBackgroundColor="#EFF6FF"
          iconColor="#C5DAEF"
          iconFill="#C5DAEF"
        />
      </div>

      {/* Pet Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        <PetCard
          name="Cooper"
          breed="Golden Retriever"
          age="3 yrs"
          weight="65 lbs"
          sex="male"
          imageUrl="https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop"
          ownerAvatarUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
        />
        <PetCard
          name="Luna"
          breed="Labrador"
          age="2 yrs"
          weight="55 lbs"
          sex="female"
          imageUrl="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop"
          ownerAvatarUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
        />
        <PetCard
          name="Max"
          breed="German Shepherd"
          age="4 yrs"
          weight="75 lbs"
          sex="male"
          imageUrl="https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop"
          ownerAvatarUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
        />
        <PetCard
          name="Bella"
          breed="French Bulldog"
          age="1 yr"
          weight="22 lbs"
          sex="female"
          imageUrl="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop"
        />
        <PetCard
          name="Bella"
          breed="French Bulldog"
          age="1 yr"
          weight="22 lbs"
          sex="female"
          imageUrl="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop"
        />
      </div>
    </div>
  );
};

export default Guests;
