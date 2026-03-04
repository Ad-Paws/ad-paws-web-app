import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdPawsCard from "@/components/AdPawsCard";
import { Switch } from "../ui/switch";
import {
  UPDATE_SERVICE,
  type Service,
  type ServiceCategory,
} from "@/lib/api/services.api";
import { useMutation } from "@apollo/client/react";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const [updateService, { loading: isUpdating }] = useMutation(UPDATE_SERVICE, {
    onCompleted: async (result) => {
      const resultData = result as { updateService: Service };
      console.log(resultData);
      await queryClient.invalidateQueries({
        predicate: (query) => {
          console.log(query);
          return query.queryKey[0] === "servicesByCompany";
        },
      });
    },
  });

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(service.price);

  const handleToggleStatus = () => {
    const status = service.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    updateService({ variables: { input: { id: service.id, status } } });
  };

  return (
    <AdPawsCard className="p-5 gap-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-secondary">{service.name}</h3>
            <span className="text-sm pt-[2px] text-muted-foreground">
              {service.category === "MAIN" ? "Principal" : "Adicional"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{service.description}</p>
        </div>
        <div>
          <Switch
            disabled={isUpdating}
            checked={service.status === "ACTIVE"}
            onCheckedChange={handleToggleStatus}
          />
        </div>
      </div>

      <div className="bg-[#F5F9F2] dark:bg-muted rounded-lg px-4 py-3 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-secondary">
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
