import { BellIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useModal } from "@ebay/nice-modal-react";
import SearchDialog from "./Dialog/SearchDialog";
import { useEffect } from "react";

const Header = () => {
  const modal = useModal(SearchDialog);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "j" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        modal.show();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal]);

  return (
    <div className="shrink-0 h-[80px] bg-white/60 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10 border-b border-[#E4F0E4]/50">
      <div
        onClick={() => modal.show()}
        className="bg-[#E4F0E4] max-w-[434px] flex flex-row gap-2 items-center border border-[#F3F4F6] rounded-md py-2 px-4 cursor-pointer"
      >
        <SearchIcon className="w-4 h-4" />
        <p className="text-muted-foreground text-sm">
          Click ó{" "}
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">⌘</span>+ J
          </kbd>
          para buscar.
        </p>
      </div>
      <div className="flex gap-6 items-center">
        <Button
          variant="outline"
          className="bg-[#FFF] hover:bg-[#F5F9F2] border-[#F3F4F6] rounded-full w-[36px]"
        >
          <BellIcon className="w-4 h-4" />
        </Button>
        <Button size="lg" variant="secondary" className="rounded-full">
          {/* <PlusCircleIcon className="w-4 h-4" /> */}
          <span className="text-base mb-[1px]">Check-In</span>
        </Button>
      </div>
    </div>
  );
};

export default Header;
