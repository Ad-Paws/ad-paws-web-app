import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <>
      <img
        src={"https://adpaws.com.mx/emails/resources/Logo_AdPaws_color.png"}
        alt="Ad Paws Logo"
        className={cn(className, "dark:hidden")}
      />
      <img
        src={"https://adpaws.com.mx/emails/resources/Logo_AdPaws_white.png"}
        alt="Ad Paws Logo"
        className={cn(className, "hidden dark:block")}
      />
    </>
  );
}
