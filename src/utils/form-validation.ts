import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

const isFieldError = (error: any): error is FieldError => {
    return error && typeof error.message === 'string';
};

export const getErrorMessage = (error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined) => {
  if (error && isFieldError(error)) {
    return error.message;
  }
  return ''; // Return an empty string if the error does not match FieldError
};

export const unicodeAlphabetRegex = /^[\p{L}\p{M}\s]+$/u;
export const phoneNumberRegex = /^0[3|5|7|8|9][0-9]{8}$/;