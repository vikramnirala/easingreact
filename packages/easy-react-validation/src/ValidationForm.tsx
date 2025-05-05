import React, {
  createContext,
  useRef,
  useImperativeHandle,
  useContext,
} from 'react';

type FieldInfo = {
  name: string;
  ref: any;
};

type ValidationFormContextType = {
  registerField: (name: string, ref: any) => void;
};

const ValidationFormContext = createContext<ValidationFormContextType | null>(
  null,
);

export const useValidationForm = () => useContext(ValidationFormContext);

export const ValidationForm = React.forwardRef(
  ({ children }: { children: React.ReactNode }, ref) => {
    const fields = useRef<FieldInfo[]>([]);

    const registerField = (name: string, refElement: any) => {
      const existingIndex = fields.current.findIndex((f) => f.name === name);
      const fieldInfo: FieldInfo = { name, ref: refElement };
      if (existingIndex >= 0) {
        fields.current[existingIndex] = fieldInfo;
      } else {
        fields.current.push(fieldInfo);
      }
    };

    useImperativeHandle(ref, () => ({
      validate: () => {
        const errors: Record<string, string> = {};
        fields.current.forEach(({ name, ref }) => {
          const el = ref?.current;
          if (!el) return; // skip if no element found
          const val = el.value ?? '';

          const required = el.required;
          const minLength = el.minLength;
          const maxLength = el.maxLength;
          const pattern = el.pattern;

          if (required && !val) {
            errors[name] = 'This field is required';
            return;
          }
          if (minLength > 0 && val.length < minLength) {
            errors[name] = `Minimum length is ${minLength}`;
            return;
          }
          if (maxLength > 0 && val.length > maxLength) {
            errors[name] = `Maximum length is ${maxLength}`;
            return;
          }
          if (pattern) {
            const regex = new RegExp(pattern);
            if (!regex.test(val)) {
              errors[name] = 'Invalid format';
              return;
            }
          }
        });
        return errors;
      },
    }));

    return (
      <ValidationFormContext.Provider value={{ registerField }}>
        {children}
      </ValidationFormContext.Provider>
    );
  },
);
