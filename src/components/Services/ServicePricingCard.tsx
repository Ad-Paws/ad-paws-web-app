import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdPawsCard from "@/components/AdPawsCard";
import { Switch } from "../ui/switch";
import { type ServiceCategory } from "@/lib/api/services.api";

export interface ServicePricing {
  id: string;
  name: string;
  description: string;
  price: number;
  priceUnit: string;
  status: string;
  category: ServiceCategory;
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

  const handleToggleStatus = () => {
    if (service.status === "ACTIVE") {
      onEdit?.({ ...service, status: "INACTIVE" });
    } else {
      onEdit?.({ ...service, status: "ACTIVE" });
    }
  };

  return (
    <AdPawsCard className="p-5 gap-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-secondary dark:text-secondary-foreground">
              {service.name}
            </h3>
            <span className="text-sm pt-[2px] text-muted-foreground">
              {service.category === "MAIN" ? "Principal" : "Adicional"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{service.description}</p>
        </div>
        <div>
          <Switch
            checked={service.status === "ACTIVE"}
            onCheckedChange={handleToggleStatus}
          />
        </div>
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
