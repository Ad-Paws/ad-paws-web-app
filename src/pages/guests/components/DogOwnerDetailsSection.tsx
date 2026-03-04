import { Phone, Mail } from "lucide-react";

interface Owner {
  id?: string | null;
  name?: string | null;
  lastname?: string | null;
  email?: string | null;
  phone?: string | null;
  profilePicture?: string | null;
}

interface DogOwnerDetailsSectionProps {
  owner: Owner;
}

const DogOwnerDetailsSection = ({ owner }: DogOwnerDetailsSectionProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
          <span className="text-amber-600">👤</span>
        </div>
        <h3 className="text-lg font-semibold">Detalles del Dueño</h3>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <img
          src={
            owner.profilePicture ||
            "https://ui-avatars.com/api/?background=8B7355&color=fff&name=" +
              encodeURIComponent(
                (owner.name?.charAt(0) || "") +
                  (owner.lastname?.charAt(0) || ""),
              )
          }
          alt={`${owner.name} ${owner.lastname}`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">
            {owner.name} {owner.lastname}
          </p>
          <p className="text-sm text-gray-500">Member since 2022</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{owner.phone || "N/A"}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Mail className="w-4 h-4 text-gray-400" />
          <span>{owner.email}</span>
        </div>
        {/* <div className="flex items-start gap-3 text-sm">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
          <span className="text-gray-600">
            123 Oak Street, Apt 4B
            <br />
            Springfield, CA 90210
          </span>
        </div> */}
        {/* <div className="flex items-center gap-3 text-sm">
          <AlertCircle className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 uppercase">
              Contacto de emergencia
            </p>
            <span>John Wilson - (555) 987-6543</span>
          </div>
        </div> */}
      </div>

      {/* <Button variant="outline" className="w-full mt-4 border-gray-200">
        Ver Perfil Completo
      </Button> */}
    </div>
  );
};

export default DogOwnerDetailsSection;
