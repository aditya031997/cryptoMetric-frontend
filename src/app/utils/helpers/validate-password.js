export const validatePassword = (value) =>
  value.search(/[a-z]/) < 0 || value.search(/\d/) < 0 || value.search(/[A-Z]/) < 0 || value.search(/[\W_]/) < 0;
