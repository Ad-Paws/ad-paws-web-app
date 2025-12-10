import React from "react";
import AdPawsCard from "./AdPawsCard";
import { Button } from "./ui/button";
import { MarsIcon, MessageSquareIcon, VenusIcon } from "lucide-react";
import clsx from "clsx";
import type { Gender } from "@/types/Dog";

interface PetCardProps {
  name: string;
  breed: string;
  age: string;
  weight: string;
  sex: Gender;
  imageUrl: string;
  ownerAvatarUrl?: string;
  onViewProfile?: () => void;
  onMessage?: () => void;
  className?: string;
}

const SexIcon: React.FC<{ sex: Gender }> = ({ sex }) => {
  if (sex === "Male") {
    return <MarsIcon className="w-5 h-5" stroke="#60A5AD" />;
  }
  return <VenusIcon className="w-5 h-5" stroke="#E57399" />;
};

const PetCard: React.FC<PetCardProps> = ({
  name,
  breed,
  age,
  weight,
  sex,
  imageUrl,
  ownerAvatarUrl,
  onViewProfile,
  onMessage,
  className,
}) => {
  return (
    <AdPawsCard className={clsx("!p-0 overflow-hidden w-full", className)}>
      {/* Pet Image */}
      <div className="relative aspect-[4/3] w-full max-h-[284px]">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        {/* Owner Avatar */}
        {ownerAvatarUrl && (
          <div className="absolute -bottom-8 right-6">
            <img
              src={ownerAvatarUrl}
              alt="Owner"
              className="w-16 h-16 rounded-full border-2 border-white object-cover shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {/* Name and Breed */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{breed}</p>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center mb-4 px-2 border-t-1 border-[#F3F4F6] pt-4">
          <div className="flex-1 text-center border-r-">
            <p className="text-sm text-gray-400 uppercase tracking-wide">
              Edad
            </p>
            <p className="text-base font-medium text-gray-700 dark:text-white">
              {age}
            </p>
          </div>
          <div className="flex-1 text-center border-r-1 border-[#F3F4F6]  border-l-1">
            <p className="text-sm text-gray-400 uppercase tracking-wide">
              Peso
            </p>
            <p className="text-base font-medium text-gray-700 dark:text-white">
              {weight}
            </p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-sm text-gray-400 uppercase tracking-wide">
              Sexo
            </p>
            <div className="flex justify-center mt-0.5">
              <SexIcon sex={sex} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 rounded-md border-[#E4F0E4] text-gray-700 dark:text-white hover:bg-[#E4F0E4]/50 dark:hover:bg-gray-500/50"
            onClick={onViewProfile}
          >
            Ver perfil
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-9 h-9 p-0 rounded-full border-[#E4F0E4] text-[#80AF80] hover:bg-[#E4F0E4]/50 dark:hover:bg-gray-500/50"
            onClick={onMessage}
          >
            <MessageSquareIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </AdPawsCard>
  );
};

export default PetCard;
