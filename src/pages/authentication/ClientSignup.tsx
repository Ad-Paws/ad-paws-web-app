import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ClientSignupStep1Form, {
  type ClientSignupStep1Values,
} from "@/components/Form/Forms/ClientSignupStep1Form";
import ClientSignupStep2Form, {
  type DogFormValues,
} from "@/components/Form/Forms/ClientSignupStep2Form";
import ClientSignupStep3Form from "@/components/Form/Forms/ClientSignupStep3Form";
import SignupSuccessScreen from "@/components/Form/Forms/SignupSuccessScreen";
import { useMutation } from "@apollo/client/react";
import { CREATE_USER_CLIENT } from "@/lib/api/user.api";
import { CREATE_USER_DOGS } from "@/lib/api/dogs.api";

const TOTAL_STEPS = 3;

interface StepContent {
  title: string;
  subtitle: string;
}

const stepContent: Record<number, StepContent> = {
  1: {
    title: "Queremos conocerte",
    subtitle: "Primero, cuéntanos sobre ti.",
  },
  2: {
    title: "Cuéntanos sobre tu perro",
    subtitle: "Agrega a tus amigos peludos para completar tu perfil.",
  },
  3: {
    title: "¿Es correcto?",
    subtitle: "Por favor revisa tu información.",
  },
};

interface SignupFormData {
  step1?: ClientSignupStep1Values;
  dogs?: DogFormValues[];
}

const ClientSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createUserDogs] = useMutation(CREATE_USER_DOGS, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onCompleted(data: any) {
      console.log("Dogs created:", data);
      setIsSubmitting(false);
      setIsSuccess(true);
    },
    onError(error) {
      console.error("Error creating dogs:", error);
      setIsSubmitting(false);
    },
  });
  const [createUserClient] = useMutation(CREATE_USER_CLIENT, {
    onCompleted: (createdUser: unknown) => {
      console.log("User created:", createdUser);
      createUserDogs({
        variables: {
          input: {
            dogs: formData.dogs?.map((dog) => {
              return {
                ageYears: parseInt(dog.ageYears),
                ageMonths: parseInt(dog.ageMonths),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ownerId: parseInt((createdUser as any)?.createUser?.user?.id),
                size: dog.size as "SMALL" | "MEDIUM" | "LARGE" | "GIGANTIC",
                gender: dog.gender as "Male" | "Female",
                weight: parseInt(dog.weight),
                breed: dog.breed,
                color: dog.color,
                name: dog.name,
                picture: dog.photo,
              };
            }),
          },
        },
      });
    },
  });

  const handleStep1Submit = (data: ClientSignupStep1Values) => {
    setFormData((prev) => ({ ...prev, step1: data }));
    setCurrentStep(2);
  };

  const handleStep2Submit = (dogs: DogFormValues[]) => {
    setFormData((prev) => ({ ...prev, dogs }));
    setCurrentStep(3);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const { step1: userData } = formData;
      const userBody = {
        ...userData,
        birthDate: userData?.birthdate?.toISOString(),
      };
      delete userBody.birthdate;
      createUserClient({ variables: { input: userBody } });
      setIsSubmitting(true);
    } catch (error) {
      console.error("Error creating account:", error);
      setIsSubmitting(false);
    }
  };

  const handleEditUserInfo = () => {
    setCurrentStep(1);
  };

  const handleEditDog = (dogId: string) => {
    // Navigate to step 2 - the dog data is already stored in formData.dogs
    console.log("Edit dog:", dogId);
    setCurrentStep(2);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentContent = stepContent[currentStep];

  // Show success screen after account creation
  if (isSuccess) {
    return <SignupSuccessScreen />;
  }

  return (
    <div className="min-h-dvh w-full bg-[#f5f7f2] flex flex-col">
      {/* Header with back button and step indicator */}
      <header className="flex items-center justify-between px-4 py-4">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 text-secondary hover:text-secondary/80 transition-colors"
          aria-label="Regresar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary font-bookmania mb-2">
            {currentContent.title}
          </h1>
          <p className="text-muted-foreground">{currentContent.subtitle}</p>
        </div>

        {/* Step 1 Form */}
        {currentStep === 1 && (
          <ClientSignupStep1Form
            onSubmit={handleStep1Submit}
            defaultValues={formData.step1}
          />
        )}

        {/* Step 2 Form - Dog Registration */}
        {currentStep === 2 && (
          <ClientSignupStep2Form
            onSubmit={handleStep2Submit}
            defaultDogs={formData.dogs}
          />
        )}

        {/* Step 3 - Confirmation */}
        {currentStep === 3 && formData.step1 && formData.dogs && (
          <ClientSignupStep3Form
            userInfo={formData.step1}
            dogs={formData.dogs}
            onConfirm={handleConfirm}
            onEditUserInfo={handleEditUserInfo}
            onEditDog={handleEditDog}
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
  );
};

export default ClientSignup;
