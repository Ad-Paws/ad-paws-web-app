import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SignupSuccessScreenProps {
  onGoHome?: () => void;
}

const SignupSuccessScreen = ({ onGoHome }: SignupSuccessScreenProps) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      navigate("/inicio");
    }
  };

  return (
    <div className="min-h-dvh w-full bg-[#f5f7f2] flex flex-col">
      {/* Main content centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Success Icon */}
        <div className="w-28 h-28 rounded-full bg-primary flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
          <Check className="w-14 h-14 text-white stroke-[3]" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-secondary font-bookmania mb-3 text-center">
          ¡Todo listo!
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground text-center max-w-xs leading-relaxed">
          Tu cuenta ha sido creada exitosamente. Vamos a encontrar la estancia
          perfecta para tu amigo peludo.
        </p>
      </main>

      {/* Button at bottom */}
      <div className="px-6 pb-8">
        <Button
          type="button"
          size="lg"
          onClick={handleGoHome}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-12 text-base font-semibold"
        >
          Ir al inicio
        </Button>
      </div>
    </div>
  );
};

export default SignupSuccessScreen;

