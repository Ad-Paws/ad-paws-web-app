import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicePricingCard, type ServicePricing } from "@/components/Services";

// Mock data - replace with API data
const boardingServices: ServicePricing[] = [
  {
    id: "boarding-1",
    name: "Suite Estándar",
    description:
      "Habitación privada y cómoda con paseos diarios y alimentación. Perfecta para perritos relajados.",
    price: 45.0,
    priceUnit: "por noche",
  },
  {
    id: "boarding-2",
    name: "Suite Deluxe",
    description:
      "Suite espaciosa con cama premium, tiempo extra de juego y acceso a webcam.",
    price: 65.0,
    priceUnit: "por noche",
  },
  {
    id: "boarding-3",
    name: "Suite de Lujo",
    description:
      "Experiencia VIP con área exterior privada, TV y atención personalizada.",
    price: 85.0,
    priceUnit: "por noche",
  },
];

const daycareServices: ServicePricing[] = [
  {
    id: "daycare-1",
    name: "Pase de Día Completo",
    description:
      "Hasta 8 horas de juego supervisado y socialización. Disponible Lun-Vie.",
    price: 30.0,
    priceUnit: "por día",
  },
  {
    id: "daycare-2",
    name: "Pase de Medio Día",
    description: "Hasta 4 horas de juego. Mañana (8am-12pm) o Tarde (1pm-5pm).",
    price: 20.0,
    priceUnit: "por medio día",
  },
  {
    id: "daycare-3",
    name: "Paquete de 10 Días",
    description:
      "Paquete prepagado para 10 días completos de guardería a tarifa con descuento.",
    price: 270.0,
    priceUnit: "paquete",
  },
];

const groomingServices: ServicePricing[] = [
  {
    id: "grooming-1",
    name: "Baño y Cepillado",
    description:
      "Baño completo con shampoo premium, secado y cepillado profundo.",
    price: 35.0,
    priceUnit: "por sesión",
  },
  {
    id: "grooming-2",
    name: "Estética Completa",
    description:
      "Paquete completo de estética: baño, corte de pelo, corte de uñas, limpieza de oídos y cepillado.",
    price: 65.0,
    priceUnit: "por sesión",
  },
  {
    id: "grooming-3",
    name: "Corte de Uñas",
    description: "Servicio rápido de corte y limado de uñas. Sin cita previa.",
    price: 15.0,
    priceUnit: "por sesión",
  },
];

const extrasServices: ServicePricing[] = [
  {
    id: "extras-1",
    name: "Paseo Extra",
    description:
      "Paseo adicional de 20 minutos por el vecindario o área de juegos.",
    price: 10.0,
    priceUnit: "por paseo",
  },
  {
    id: "extras-2",
    name: "Administración de Medicamentos",
    description:
      "Medicamento oral o tópico administrado en horarios programados durante la estancia.",
    price: 5.0,
    priceUnit: "por día",
  },
  {
    id: "extras-3",
    name: "Actualización con Fotos",
    description: "Fotos y videos diarios enviados directamente a tu teléfono.",
    price: 8.0,
    priceUnit: "por día",
  },
  {
    id: "extras-4",
    name: "Preparación de Comida Especial",
    description:
      "Preparación de comida personalizada para mascotas con restricciones dietéticas o dietas especiales.",
    price: 12.0,
    priceUnit: "por día",
  },
];

const Services = () => {
  const handleEdit = (service: ServicePricing) => {
    console.log("Edit service:", service);
    // TODO: Open edit modal
  };

  const handleDelete = (service: ServicePricing) => {
    console.log("Delete service:", service);
    // TODO: Open delete confirmation
  };

  const renderServiceCards = (services: ServicePricing[]) => (
    <div className="space-y-4">
      {services.map((service) => (
        <ServicePricingCard
          key={service.id}
          service={service}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );

  return (
    <div className="h-full px-6 py-4 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary dark:text-secondary-foreground">
          Servicios y Precios
        </h1>
        <p className="text-muted-foreground mt-1">
          Configura tus servicios, paquetes y extras.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="daycare" className="w-full">
        <TabsList className="bg-transparent gap-4 mb-6 h-auto p-0">
          <TabsTrigger
            value="boarding"
            className="data-[state=active]:bg-secondary! data-[state=active]:text-white! hover:cursor-pointer"
          >
            Hotel / Estancias
          </TabsTrigger>
          <TabsTrigger
            value="daycare"
            className="data-[state=active]:bg-secondary! data-[state=active]:text-white! hover:cursor-pointer"
          >
            Guardería
          </TabsTrigger>
          <TabsTrigger
            value="grooming"
            className="data-[state=active]:bg-secondary! data-[state=active]:text-white! hover:cursor-pointer"
          >
            Estética
          </TabsTrigger>
          <TabsTrigger
            value="extras"
            className="data-[state=active]:bg-secondary! data-[state=active]:text-white! hover:cursor-pointer"
          >
            Extras y Adicionales
          </TabsTrigger>
        </TabsList>

        <TabsContent value="boarding" className="mt-0">
          {renderServiceCards(boardingServices)}
        </TabsContent>
        <TabsContent value="daycare" className="mt-0">
          {renderServiceCards(daycareServices)}
        </TabsContent>
        <TabsContent value="grooming" className="mt-0">
          {renderServiceCards(groomingServices)}
        </TabsContent>
        <TabsContent value="extras" className="mt-0">
          {renderServiceCards(extrasServices)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Services;
