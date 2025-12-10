import AdPawsCard from "./AdPawsCard"
import { Skeleton } from "./ui/skeleton"
import clsx from "clsx"

interface PetCardSkeletonProps {
  className?: string
}

const PetCardSkeleton: React.FC<PetCardSkeletonProps> = ({ className }) => {
  return (
    <AdPawsCard className={clsx("!p-0 overflow-hidden w-full", className)}>
      {/* Pet Image Skeleton */}
      <div className="relative aspect-[4/3] w-full max-h-[284px]">
        <Skeleton className="w-full h-full rounded-none" />
        {/* Owner Avatar Skeleton */}
        <div className="absolute -bottom-8 right-6">
          <Skeleton className="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {/* Name and Breed Skeleton */}
        <div className="mb-4">
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Stats Skeleton */}
        <div className="flex justify-between items-center mb-4 px-2 border-t-1 border-[#F3F4F6] pt-4">
          <div className="flex-1 text-center">
            <p className="text-sm text-gray-400 uppercase tracking-wide">
              Edad
            </p>
            <Skeleton className="h-5 w-8 mx-auto mt-1" />
          </div>
          <div className="flex-1 text-center border-r-1 border-[#F3F4F6] border-l-1">
            <p className="text-sm text-gray-400 uppercase tracking-wide">
              Peso
            </p>
            <Skeleton className="h-5 w-10 mx-auto mt-1" />
          </div>
          <div className="flex-1 text-center">
            <p className="text-sm text-gray-400 uppercase tracking-wide">
              Sexo
            </p>
            <Skeleton className="h-5 w-5 mx-auto mt-1 rounded-full" />
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="flex-1 h-10 rounded-md" />
          <Skeleton className="w-9 h-9 rounded-full" />
        </div>
      </div>
    </AdPawsCard>
  )
}

export default PetCardSkeleton

