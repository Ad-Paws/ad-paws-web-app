import { toast, ToastContainer, Slide } from "react-toastify";
import type { ToastOptions } from "react-toastify";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

interface ToastMessageProps {
  title: string;
  description?: string;
}

function ToastMessage({ title, description }: ToastMessageProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="toast-title font-medium text-sm">{title}</span>
      {description && <span className="text-xs opacity-90">{description}</span>}
    </div>
  );
}

export const showToast = {
  success: (title: string, description?: string, options?: ToastOptions) => {
    toast.success(<ToastMessage title={title} description={description} />, {
      ...defaultOptions,
      icon: <CheckCircle className="w-5 h-5" />,
      ...options,
    });
  },

  error: (title: string, description?: string, options?: ToastOptions) => {
    toast.error(<ToastMessage title={title} description={description} />, {
      ...defaultOptions,
      icon: <XCircle className="w-5 h-5" />,
      ...options,
    });
  },

  warning: (title: string, description?: string, options?: ToastOptions) => {
    toast.warning(<ToastMessage title={title} description={description} />, {
      ...defaultOptions,
      icon: <AlertTriangle className="w-5 h-5" />,
      ...options,
    });
  },

  info: (title: string, description?: string, options?: ToastOptions) => {
    toast.info(<ToastMessage title={title} description={description} />, {
      ...defaultOptions,
      icon: <Info className="w-5 h-5" />,
      ...options,
    });
  },
};

export function AdPawsToastContainer() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Slide}
      toastClassName="!rounded-lg !shadow-lg !font-sans"
      className="!top-4 !right-4"
    />
  );
}

export { toast };
