import { ReactNode } from "react";

export interface MenuItem {
  label: string;
  icon: ReactNode;
  activeIcon?: ReactNode;
}

export interface Voucher {
  id: string;
  code: string;
  description: string;
  value: string;
  quantity: string
}