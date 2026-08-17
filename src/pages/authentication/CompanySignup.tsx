import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import CompanySignupStep1Form, {
  type CompanySignupStep1Values,
} from "@/components/Form/Forms/CompanySignupStep1Form";
import CompanySignupStep2Form, {
  type CompanySignupStep2Values,
} from "@/components/Form/Forms/CompanySignupStep2Form";
import CompanySignupStep3Form from "@/components/Form/Forms/CompanySignupStep3Form";
import {
  CREATE_USER_MUTATION,
  CREATE_COMPANY_MUTATION,
} from "@/graphql/operations/account";
import { SIGN_IN_MUTATION } from "@/graphql/operations/session";
import { useAuth } from "@/contexts/AuthContext";
import { showToast } from "@/lib/toast";

const TOTAL_STEPS = 3;

interface StepContent {
  title: string;
  subtitle: string;
}

const stepContent: Record<number, StepContent> = {
  1: {
    title: "Cuéntanos sobre tu empresa",
    subtitle: "Primero, necesitamos algunos datos de tu negocio.",
  },
  2: {
    title: "Crea tu usuario",
    subtitle: "Esta será la cuenta principal de la empresa.",
  },
  3: {
    title: "¿Es correcto?",
    subtitle: "Por favor revisa la información antes de continuar.",
  },
};

interface CompanySignupFormData {
  company?: CompanySignupStep1Values;
  owner?: CompanySignupStep2Values;
}

const CompanySignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CompanySignupFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const [createCompany] = useMutation(CREATE_COMPANY_MUTATION);
  const [signInUser] = useMutation(SIGN_IN_MUTATION);

  const handleStep1Submit = (data: CompanySignupStep1Values) => {
    setFormData((prev) => ({ ...prev, company: data }));
    setCurrentStep(2);
  };

  const handleStep2Submit = (data: CompanySignupStep2Values) => {
    setFormData((prev) => ({ ...prev, owner: data }));
    setCurrentStep(3);
  };

  const handleConfirm = async () => {
    const { company, owner } = formData;
    if (!company || !owner) return;

    setIsSubmitting(true);
    try {
      // Flujo nuevo: createUser crea la cuenta Y la cookie de sesión;
      // createCompany registra la empresa y hace OWNER al caller.
      // Si la cuenta ya existía (p. ej. reintento tras fallar createCompany),
      // se inicia sesión con esas credenciales y se continúa.
      try {
        await createUser({
          variables: {
            input: {
              name: owner.ownerName,
              email: owner.ownerEmail,
              password: owner.ownerPassword,
            },
          },
        });
      } catch {
        await signInUser({
          variables: {
            input: { email: owner.ownerEmail, password: owner.ownerPassword },
          },
        });
      }

      await createCompany({
        variables: {
          input: {
            name: company.companyName,
            email: company.companyEmail,
            phone: company.companyPhone,
          },
        },
      });
      await login();

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error creating company account:", error);
      showToast.error(
        "No se pudo crear la cuenta",
        error instanceof Error ? error.message : "Error desconocido"
      );
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentContent = stepContent[currentStep];

  return (
    <div className="min-h-dvh w-full flex flex-row items-center justify-center bg-background lg:p-6">
      <div className="h-dvh max-h-none lg:max-h-[calc(100dvh-4rem)] md:rounded-md md:shadow-lg w-full bg-[#f5f7f2] flex flex-col lg:max-w-3/5 xl:max-w-2/5">
        {/* Header with back button and step indicator */}
        <header className="flex items-center justify-between px-4 py-4">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 text-secondary hover:text-secondary/80 transition-colors cursor-pointer"
              aria-label="Regresar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-5 h-5" />
          )}
          <span className="text-sm text-muted-foreground font-medium">
            {currentStep} de {TOTAL_STEPS}
          </span>
        </header>

        {/* Progress bar */}
        <div className="px-4 mb-6">
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 px-6 pb-8 flex flex-col overflow-y-auto">
          {/* Title section */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-3xl font-bold text-secondary font-bookmania mb-2">
              {currentContent.title}
            </h1>
            <p className="text-muted-foreground">{currentContent.subtitle}</p>
          </div>

          {/* Step 1 - Company info */}
          {currentStep === 1 && (
            <CompanySignupStep1Form
              onSubmit={handleStep1Submit}
              defaultValues={formData.company}
            />
          )}

          {/* Step 2 - Owner/User info */}
          {currentStep === 2 && (
            <CompanySignupStep2Form
              onSubmit={handleStep2Submit}
              defaultValues={formData.owner}
            />
          )}

          {/* Step 3 - Confirmation */}
          {currentStep === 3 && formData.company && formData.owner && (
            <CompanySignupStep3Form
              companyInfo={formData.company}
              ownerInfo={formData.owner}
              onConfirm={handleConfirm}
              onEditCompanyInfo={() => setCurrentStep(1)}
              onEditOwnerInfo={() => setCurrentStep(2)}
              loading={isSubmitting}
            />
          )}

          {/* Login link */}
          <div className="mt-6 text-center">
            <span className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/auth/login"
                className="font-semibold text-secondary hover:text-secondary/80 underline underline-offset-2"
              >
                Inicia sesión
              </Link>
            </span>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanySignup;
