import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { Button } from "./ui/button";
import {
  BoneIcon,
  DogIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  SettingsIcon,
  UsersIcon,
  X,
} from "lucide-react";
import { SidebarNavLink } from "./SidebarNavLink";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar({
  isCollapsed,
  toggleSidebar,
}: {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border p-4 flex flex-col transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-center mb-8">
        {/* Logo - hide when collapsed */}
        <Logo
          className={cn(
            "transition-opacity duration-300",
            isCollapsed ? "w-0 opacity-0 hidden" : "w-32 opacity-100"
          )}
        />

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="shrink-0"
        >
          {isCollapsed ? (
            <MenuIcon className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar content goes here */}
      <nav className="flex-1 flex justify-between flex-col">
        <div className="space-y-2">
          <SidebarNavLink
            icon={HomeIcon}
            label="Inicio"
            to="/inicio"
            isCollapsed={isCollapsed}
          />
          <SidebarNavLink
            icon={DogIcon}
            label="Visitantes perrunos"
            to="/visitantes-perrunos"
            isCollapsed={isCollapsed}
          />
          <SidebarNavLink
            icon={UsersIcon}
            label="Propietarios"
            to="/propietarios"
            isCollapsed={isCollapsed}
          />
          <SidebarNavLink
            icon={BoneIcon}
            label="Servicios"
            to="/servicios"
            isCollapsed={isCollapsed}
          />
          <SidebarNavLink
            icon={SettingsIcon}
            label="Configuración"
            to="/configuracion"
            isCollapsed={isCollapsed}
          />
        </div>
        <SidebarNavLink
          icon={LogOutIcon}
          label="Cerrar sesión"
          isCollapsed={isCollapsed}
          onClick={handleLogout}
        />
      </nav>
    </aside>
  );
}
