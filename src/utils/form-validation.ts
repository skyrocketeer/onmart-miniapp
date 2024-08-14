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