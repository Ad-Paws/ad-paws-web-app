import logo from "@/assets/logo.svg";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <img src={logo} alt="Ad Paws Logo" className={cn(className)} />
  );
}
