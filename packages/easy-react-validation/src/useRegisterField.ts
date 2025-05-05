import { useRef, useEffect } from 'react';
import { useValidationForm } from './ValidationForm';

export const useRegisterField = (name: string) => {
  const ref = useRef<any>(null);
  const formContext = useValidationForm();

  useEffect(() => {
    if (formContext && name) {
      formContext.registerField(name, ref);
    }
  }, [name, formContext]);

  return ref;
};
