import { FieldError, FieldErrors, FieldErrorsImpl, Merge, UseFormRegister } from "react-hook-form";
import { ShippingData } from "./order";

export interface ValidationFieldError {
  register: UseFormRegister<ShippingData>;
  errors: FieldErrors<ShippingData>;
}