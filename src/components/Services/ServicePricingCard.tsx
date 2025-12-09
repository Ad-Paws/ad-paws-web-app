import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdPawsCard from "@/components/AdPawsCard";

export interface ServicePricing {
  id: string;
  name: string;
  description: string;
  price: number;
  priceUnit: string;
}

interface ServicePricingCardProps {
  service: ServicePricing;
  onEdit?: (service: ServicePricing) => void;
  onDelete?: (service: ServicePricing) => void;
}

const ServicePricingCard = ({
  service,
  onEdit,
  onDelete,
}: ServicePricingCardProps) => {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(service.price);

  return (
    <AdPawsCard className="p-5 gap-3">
      <div className="space-y-1">
        <h3 className="font-bold text-secondary dark:text-secondary-foreground">
          {service.name}
        </h3>
        <p className="text-sm text-muted-foreground">{service.description}</p>
      </div>

      <div className="bg-[#F5F9F2] dark:bg-muted rounded-lg px-4 py-3 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-secondary dark:text-secondary-foreground">
            {formattedPrice}
          </span>
          <span className="text-sm text-muted-foreground">
            / {service.priceUnit}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit?.(service)}
            className="text-muted-foreground hover:text-secondary hover:bg-white/50"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete?.(service)}
            className="text-muted-foreground hover:text-destructive hover:bg-white/50"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </AdPawsCard>
  );
};

export default ServicePricingCard;

