import { useState } from 'react';
import { EMAIL_REGEX } from '../constants/config';

export function useFormValidation(initialValues, rules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const setField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};

    for (const [field, fieldRules] of Object.entries(rules)) {
      const value = values[field] ?? '';

      if (fieldRules.required && !String(value).trim()) {
        errs[field] = `${fieldRules.label} is required.`;
        continue;
      }

      if (fieldRules.email && value && !EMAIL_REGEX.test(String(value).trim())) {
        errs[field] = 'Please enter a valid email address.';
        continue;
      }

      if (fieldRules.minLength && value.length < fieldRules.minLength) {
        errs[field] = `${fieldRules.label} must be at least ${fieldRules.minLength} characters.`;
        continue;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return { values, errors, setField, validate };
}
