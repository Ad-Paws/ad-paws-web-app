import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the time of day in Spanish based on the current hour or a provided hour
 * @param hour - Optional hour (0-23). If not provided, uses current hour
 * @returns "mañana" (morning), "tarde" (afternoon), or "noche" (evening/night)
 */
export function getTimeOfDay(
  hour?: number
): "Buenos días" | "Buenas tardes" | "Buenas noches" {
  const currentHour = hour ?? new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Buenos días"; // Morning: 5am - 11:59am
  } else if (currentHour >= 12 && currentHour < 20) {
    return "Buenas tardes"; // Afternoon: 12pm - 7:59pm
  } else {
    return "Buenas noches"; // Evening/Night: 8pm - 4:59am
  }
}

/**
 * Format the current time as a clock string (HH:MM AM/PM)
 * @param date - Optional date object. If not provided, uses current time
 * @returns Formatted time string like "02:23 AM"
 */
export function getClockTime(date?: Date): string {
  const currentDate = date ?? new Date();

  return currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format the date with weekday and short month (e.g., "Thursday, Dec 4")
 * @param date - Optional date object. If not provided, uses current date
 * @returns Formatted date string like "Thursday, Dec 4"
 */
export function getFormattedDate(date?: Date): string {
  const currentDate = date ?? new Date();

  return currentDate.toLocaleDateString("es-ES", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export const DOG_BREEDS = {
  affenpinscher: "Affenpinscher",
  afghanHound: "Afghan Hound",
  airedaleTerrier: "Airedale Terrier",
  akita: "Akita",
  alaskanMalamute: "Alaskan Malamute",
  americanBulldog: "American Bulldog",
  americanCockerSpaniel: "American Cocker Spaniel",
  americanEskimoDog: "American Eskimo Dog",
  americanFoxhound: "American Foxhound",
  americanHairlessTerrier: "American Hairless Terrier",
  americanPitBullTerrier: "American Pit Bull Terrier",
  americanStaffordshireTerrier: "American Staffordshire Terrier",
  americanWaterSpaniel: "American Water Spaniel",
  anatolianShepherdDog: "Anatolian Shepherd Dog",
  appenzellerSennenhund: "Appenzeller Sennenhund",
  australianCattleDog: "Australian Cattle Dog",
  australianKelpie: "Australian Kelpie",
  australianShepherd: "Australian Shepherd",
  australianStumpyTailCattleDog: "Australian Stumpy Tail Cattle Dog",
  australianTerrier: "Australian Terrier",
  azawakh: "Azawakh",
  barbet: "Barbet",
  basenji: "Basenji",
  bassetFauveDeBretagne: "Basset Fauve de Bretagne",
  bassetHound: "Basset Hound",
  bavarianMountainScentHound: "Bavarian Mountain Scent Hound",
  beagle: "Beagle",
  beardedCollie: "Bearded Collie",
  beauceron: "Beauceron",
  bedlingtonTerrier: "Bedlington Terrier",
  belgianLaekenois: "Belgian Laekenois",
  belgianMalinois: "Belgian Malinois",
  belgianSheepdog: "Belgian Sheepdog",
  belgianTervuren: "Belgian Tervuren",
  bergamasco: "Bergamasco",
  bergerPicard: "Berger Picard",
  berneseMountainDog: "Bernese Mountain Dog",
  bichonFrise: "Bichon Frise",
  blackAndTanCoonhound: "Black and Tan Coonhound",
  blackRussianTerrier: "Black Russian Terrier",
  bloodhound: "Bloodhound",
  borderCollie: "Border Collie",
  borderTerrier: "Border Terrier",
  borzoi: "Borzoi",
  bostonTerrier: "Boston Terrier",
  bouvierDesFlandres: "Bouvier des Flandres",
  boxer: "Boxer",
  boykinSpaniel: "Boykin Spaniel",
  brindleHound: "Brindle Hound",
  briard: "Briard",
  brittany: "Brittany",
  brusselsGriffon: "Brussels Griffon",
  bullTerrier: "Bull Terrier",
  bulldog: "Bulldog",
  bullmastiff: "Bullmastiff",
  cairnTerrier: "Cairn Terrier",
  caneCorso: "Cane Corso",
  cardiganWelshCorgi: "Cardigan Welsh Corgi",
  carolinaDog: "Carolina Dog",
  catahoulaLeopardDog: "Catahoula Leopard Dog",
  caucasianShepherdDog: "Caucasian Shepherd Dog",
  cavalierKingCharlesSpaniel: "Cavalier King Charles Spaniel",
  centralAsianShepherdDog: "Central Asian Shepherd Dog",
  chesapeakeBayRetriever: "Chesapeake Bay Retriever",
  chihuahua: "Chihuahua",
  chineseCrested: "Chinese Crested",
  chineseSharPei: "Chinese Shar-Pei",
  chinook: "Chinook",
  chowChow: "Chow Chow",
  clumberSpaniel: "Clumber Spaniel",
  cockerSpaniel: "Cocker Spaniel",
  collie: "Collie",
  cotonDeTulear: "Coton de Tuléar",
  curlyCoatedRetriever: "Curly-Coated Retriever",
  dachshund: "Dachshund",
  dalmatian: "Dalmatian",
  dandieDinmontTerrier: "Dandie Dinmont Terrier",
  denmarkFeist: "Denmark Feist",
  dobermanPinscher: "Doberman Pinscher",
  dogoArgentino: "Dogo Argentino",
  dogueDeBordeaux: "Dogue de Bordeaux",
  dutchShepherd: "Dutch Shepherd",
  englishCockerSpaniel: "English Cocker Spaniel",
  englishFoxhound: "English Foxhound",
  englishSetter: "English Setter",
  englishSpringerSpaniel: "English Springer Spaniel",
  englishToySpaniel: "English Toy Spaniel",
  entlebucher: "Entlebucher Mountain Dog",
  fieldSpaniel: "Field Spaniel",
  finnishLapphund: "Finnish Lapphund",
  finnishSpitz: "Finnish Spitz",
  flatCoatedRetriever: "Flat-Coated Retriever",
  frenchBulldog: "French Bulldog",
  germanPinscher: "German Pinscher",
  germanShepherd: "German Shepherd",
  germanShorthairedPointer: "German Shorthaired Pointer",
  germanWirehairedPointer: "German Wirehaired Pointer",
  giantSchnauzer: "Giant Schnauzer",
  glenOfImaalTerrier: "Glen of Imaal Terrier",
  goldenRetriever: "Golden Retriever",
  gordonSetter: "Gordon Setter",
  greatDane: "Great Dane",
  greatPyrenees: "Great Pyrenees",
  greaterSwissMountainDog: "Greater Swiss Mountain Dog",
  greyhound: "Greyhound",
  harrier: "Harrier",
  havanese: "Havanese",
  ibizanHound: "Ibizan Hound",
  icelandicSheepdog: "Icelandic Sheepdog",
  irishRedAndWhiteSetter: "Irish Red and White Setter",
  irishSetter: "Irish Setter",
  irishTerrier: "Irish Terrier",
  irishWolfhound: "Irish Wolfhound",
  italianGreyhound: "Italian Greyhound",
  japaneseChin: "Japanese Chin",
  japaneseSpitz: "Japanese Spitz",
  keeshond: "Keeshond",
  kerryBlueTerrier: "Kerry Blue Terrier",
  kingCharlesSpaniel: "King Charles Spaniel",
  komondor: "Komondor",
  kuvasz: "Kuvasz",
  labradorRetriever: "Labrador Retriever",
  lagottoRomagnolo: "Lagotto Romagnolo",
  lakelandTerrier: "Lakeland Terrier",
  leonberger: "Leonberger",
  lhasaApso: "Lhasa Apso",
  lowchen: "Löwchen",
  maltese: "Maltese",
  manchesterTerrier: "Manchester Terrier",
  mastiff: "Mastiff",
  miniatureBullTerrier: "Miniature Bull Terrier",
  miniaturePinscher: "Miniature Pinscher",
  miniatureSchnauzer: "Miniature Schnauzer",
  neapolitanMastiff: "Neapolitan Mastiff",
  newfoundland: "Newfoundland",
  norfolkTerrier: "Norfolk Terrier",
  norwegianBuhund: "Norwegian Buhund",
  norwegianElkhound: "Norwegian Elkhound",
  norwegianLundehund: "Norwegian Lundehund",
  norwichTerrier: "Norwich Terrier",
  oldEnglishSheepdog: "Old English Sheepdog",
  otterhound: "Otterhound",
  papillon: "Papillon",
  parsonRussellTerrier: "Parson Russell Terrier",
  pekinese: "Pekingese",
  pembrokeWelshCorgi: "Pembroke Welsh Corgi",
  petitBassetGriffonVendeen: "Petit Basset Griffon Vendéen",
  pharaohHound: "Pharaoh Hound",
  plottHound: "Plott Hound",
  pointer: "Pointer",
  polishLowlandSheepdog: "Polish Lowland Sheepdog",
  pomeranian: "Pomeranian",
  poodle: "Poodle",
  portuguesePodengo: "Portuguese Podengo",
  portugueseWaterDog: "Portuguese Water Dog",
  pug: "Pug",
  puli: "Puli",
  pyreneanShepherd: "Pyrenean Shepherd",
  ratTerrier: "Rat Terrier",
  redboneCoonhound: "Redbone Coonhound",
  rhodesianRidgeback: "Rhodesian Ridgeback",
  rottweiler: "Rottweiler",
  saintBernard: "Saint Bernard",
  saluki: "Saluki",
  samoyed: "Samoyed",
  schipperke: "Schipperke",
  scottishDeerhound: "Scottish Deerhound",
  scottishTerrier: "Scottish Terrier",
  sealyhamTerrier: "Sealyham Terrier",
  shetlandSheepdog: "Shetland Sheepdog",
  shibaInu: "Shiba Inu",
  shihTzu: "Shih Tzu",
  siberianHusky: "Siberian Husky",
  silkyTerrier: "Silky Terrier",
  skyeTerrier: "Skye Terrier",
  smoothFoxTerrier: "Smooth Fox Terrier",
  softCoatedWheatenTerrier: "Soft Coated Wheaten Terrier",
  spanishWaterDog: "Spanish Water Dog",
  spinoneItaliano: "Spinone Italiano",
  staffordshireBullTerrier: "Staffordshire Bull Terrier",
  standardSchnauzer: "Standard Schnauzer",
  sussexSpaniel: "Sussex Spaniel",
  swedishVallhund: "Swedish Vallhund",
  tibetanMastiff: "Tibetan Mastiff",
  tibetanSpaniel: "Tibetan Spaniel",
  tibetanTerrier: "Tibetan Terrier",
  toyFoxTerrier: "Toy Fox Terrier",
  treeingWalkerCoonhound: "Treeing Walker Coonhound",
  vizsla: "Vizsla",
  weimaraner: "Weimaraner",
  welshSpringerSpaniel: "Welsh Springer Spaniel",
  welshTerrier: "Welsh Terrier",
  westHighlandWhiteTerrier: "West Highland White Terrier",
  whippet: "Whippet",
  wireFoxTerrier: "Wire Fox Terrier",
  wirehairedPointingGriffon: "Wirehaired Pointing Griffon",
  xoloitzcuintli: "Xoloitzcuintli",
  yorkshireTerrier: "Yorkshire Terrier",
} as const;
