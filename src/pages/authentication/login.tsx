import { SIGN_IN_MUTATION } from "@/graphql/operations/session";
import { useMutation } from "@apollo/client/react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "@/components/Form/Forms/LoginForm";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  // signUser crea la cookie de sesión en el servidor; los tokens devueltos
  // no se guardan (ver src/lib/auth.ts).
  const [signInUser, { loading, data, error }] = useMutation(SIGN_IN_MUTATION);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = (formData: LoginFormValues) => {
    signInUser({ variables: { input: formData } });
  };

  useEffect(() => {
    const handleLogin = async () => {
      if (data?.signUser) {
        try {
          // Save tokens and fetch user data
          await login();

          // Redirect to the page they were trying to access, or home
          const from =
            (location.state as { from?: { pathname: string } })?.from
              ?.pathname || "/";
          navigate(from, { replace: true });
        } catch (err) {
          console.error("Failed to login:", err);
          // Error is already handled in AuthContext
        }
      }
    };

    handleLogin();
  }, [data, login, navigate, location]);

  return (
    <div className="w-full max-w-[400px] border border-border rounded-lg p-6 bg-card">
      <div className="flex items-center justify-center mb-4">
        <Logo className="w-48" />
      </div>
      <div className="mb-6">
        <p className="text-2xl font-bold text-center mb-2">
          Incia sesión en tu cuenta
        </p>
        <p className="text-sm text-center text-muted-foreground font-medium">
          ¡Bienvenido de nuevo!
        </p>
      </div>
      {error && (
        <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive text-center">
            Error al iniciar sesión. Por favor, verifica tus credenciales.
          </p>
        </div>
      )}
      <LoginForm onSubmit={onSubmit} loading={loading} />
    </div>
  );
}
