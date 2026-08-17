import { Button } from "@/components/ui/button";
import type { CompanySignupStep1Values } from "./CompanySignupStep1Form";
import type { CompanySignupStep2Values } from "./CompanySignupStep2Form";

interface CompanySignupStep3FormProps {
  companyInfo: CompanySignupStep1Values;
  ownerInfo: CompanySignupStep2Values;
  onConfirm: () => void;
  onEditCompanyInfo: () => void;
  onEditOwnerInfo: () => void;
  loading?: boolean;
}

const CompanySignupStep3Form = ({
  companyInfo,
  ownerInfo,
  onConfirm,
  onEditCompanyInfo,
  onEditOwnerInfo,
  loading = false,
}: CompanySignupStep3FormProps) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Company Information Section */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Información de la empresa
          </h2>
          <button
            type="button"
            onClick={onEditCompanyInfo}
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Editar
          </button>
        </div>

        <div className="space-y-3">
          <InfoRow label="Nombre" value={companyInfo.companyName} />
          <InfoRow label="Correo" value={companyInfo.companyEmail} />
          <InfoRow label="Teléfono" value={companyInfo.companyPhone} />
        </div>
      </div>

      {/* Owner Information Section */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Información del usuario
          </h2>
          <button
            type="button"
            onClick={onEditOwnerInfo}
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Editar
          </button>
        </div>

        <div className="space-y-3">
          <InfoRow label="Nombre" value={ownerInfo.ownerName} />
          <InfoRow label="Correo" value={ownerInfo.ownerEmail} />
          <InfoRow label="Contraseña" value={"•".repeat(8)} />
        </div>
      </div>

      {/* Confirm Button */}
      <Button
        type="button"
        size="lg"
        onClick={onConfirm}
        disabled={loading}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-12 text-base font-semibold mt-2"
      >
        {loading ? "Creando cuenta..." : "Confirmar y crear cuenta"}
      </Button>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground text-right">
      {value}
    </span>
  </div>
);

export default CompanySignupStep3Form;
