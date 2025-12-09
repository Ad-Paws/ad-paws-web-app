import React from "react";
import AdPawsCard from "../AdPawsCard";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface MiniInsightCardProps {
  title: string;
  data: string | number;
  mainIcon: LucideIcon;
  iconBackgroundColor?: string;
  iconColor?: string;
  iconFill?: string;
  className?: string;
}

const MiniInsightCard: React.FC<MiniInsightCardProps> = ({
  title,
  data,
  mainIcon: MainIcon,
  iconBackgroundColor = "#E4F0E4",
  iconColor = "#80AF80",
  iconFill = "#80AF80",
  className,
}) => {
  return (
    <AdPawsCard
      className={clsx("hover:shadow-md hover:cursor-pointer !p-4", className)}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-[#6B7280] dark:text-gray-400 uppercase tracking-wide font-medium">
            {title}
          </p>
          <p className="text-2xl font-bold">{data}</p>
        </div>
        <div
          className="rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <MainIcon className="w-4 h-4" fill={iconFill} color={iconColor} />
        </div>
      </div>
    </AdPawsCard>
  );
};

export default MiniInsightCard;
