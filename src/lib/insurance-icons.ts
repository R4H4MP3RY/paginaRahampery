import type { IconSvgElement } from "@hugeicons/react";
import {
  AirplaneTakeOff01Icon,
  AmbulanceIcon,
  Briefcase01Icon,
  Car01Icon,
  FavouriteIcon,
  Home01Icon,
  PiggyBankIcon,
  Stethoscope02Icon,
  BandageIcon,
  Coins01Icon,
  Shield01Icon,
  UserStar01Icon,
} from "@hugeicons/core-free-icons";
import type { InsuranceCategory } from "@/lib/site";

export const categoryIcons: Record<InsuranceCategory, IconSvgElement> = {
  salud: Stethoscope02Icon,
  patrimonio: Home01Icon,
  retiro: PiggyBankIcon,
  empresa: Briefcase01Icon,
};

export const insuranceIcons: Record<string, IconSvgElement> = {
  "seguro-de-vida": FavouriteIcon,
  "gastos-medicos-mayores": AmbulanceIcon,
  "gastos-medicos-menores": Stethoscope02Icon,
  "accidentes-personales": BandageIcon,
  "seguro-de-viajero": AirplaneTakeOff01Icon,
  "seguro-de-auto": Car01Icon,
  "seguro-de-hogar": Home01Icon,
  "plan-personal-de-retiro": PiggyBankIcon,
  "ahorro-para-el-retiro": Coins01Icon,
  "seguro-de-negocio": Briefcase01Icon,
  "seguro-hombre-clave": UserStar01Icon,
};

export const fallbackInsuranceIcon = Shield01Icon;
