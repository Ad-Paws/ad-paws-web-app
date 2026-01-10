import { useState, useMemo } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import type { Dog } from "../types";

interface DogSelectorProps {
  dogs: Dog[];
  selectedDogId: string;
  onSelect: (dogId: string) => void;
  placeholder?: string;
}

export function DogSelector({
  dogs,
  selectedDogId,
  onSelect,
  placeholder = "Buscar perro...",
}: DogSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get selected dog details
  const selectedDog = dogs.find((dog) => dog.id === selectedDogId);

  // Filter dogs based on search query
  const filteredDogs = useMemo(() => {
    if (!searchQuery.trim()) return dogs;

    const query = searchQuery.toLowerCase();
    return dogs.filter((dog) => {
      const dogName = dog.name.toLowerCase();
      const ownerName = `${dog.owner?.name || ""} ${dog.owner?.lastname || ""}`
        .toLowerCase()
        .trim();
      return dogName.includes(query) || ownerName.includes(query);
    });
  }, [dogs, searchQuery]);

  const handleSelect = (dogId: string) => {
    onSelect(dogId);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
            selectedDog
              ? "border-[#A3C585] bg-[#A3C585]/10"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          {selectedDog ? (
            <>
              {/* Dog Image */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                {selectedDog.imageUrl ? (
                  <img
                    src={selectedDog.imageUrl}
                    alt={selectedDog.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#A3C585]/20 text-[#A3C585] font-semibold text-lg">
                    {selectedDog.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {/* Dog Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{selectedDog.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {selectedDog.owner?.name} {selectedDog.owner?.lastname}
                </p>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <span className="flex-1 text-gray-500">{placeholder}</span>
              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        {/* Search Input */}
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o dueño..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
        </div>

        {/* Dogs List */}
        <div className="max-h-[250px] overflow-y-auto p-2">
          {filteredDogs.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500">
              No se encontraron perros
            </div>
          ) : (
            <div className="space-y-1">
              {filteredDogs.map((dog) => (
                <button
                  key={dog.id}
                  type="button"
                  onClick={() => handleSelect(dog.id)}
                  className={`w-full p-2 rounded-lg text-left transition-all flex items-center gap-3 ${
                    selectedDogId === dog.id
                      ? "bg-[#A3C585]/10"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {/* Dog Image */}
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    {dog.imageUrl ? (
                      <img
                        src={dog.imageUrl}
                        alt={dog.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#A3C585]/20 text-[#A3C585] font-semibold">
                        {dog.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {/* Dog Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{dog.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {dog.owner?.name} {dog.owner?.lastname}
                    </p>
                  </div>
                  {/* Selected indicator */}
                  {selectedDogId === dog.id && (
                    <div className="w-5 h-5 rounded-full bg-[#A3C585] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
