interface SignupUserData {
  email: string;
  password: string;
  confirmPassword: string;
  handle: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

export const isEmail = (email: string) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

export const isEmpty = (string: string) => {
  if (string.trim() === '') return true;
  else return false;
};

export const validateSignupData = (data: SignupUserData) => {
  let errors = {} as SignupUserData;

  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty';
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address';
  }

  if (isEmpty(data.password)) errors.password = 'Must not be empty';
  if (isEmpty(data.confirmPassword))
    errors.confirmPassword = 'Must not be empty';
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = 'Passwords must match';
  if (isEmpty(data.handle)) errors.handle = 'Must not be empty';

  return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};

export const validateLoginData = (data: LoginUserData) => {
  let errors = {} as LoginUserData;

  if (isEmpty(data.email)) errors.email = 'Must not be empty';
  if (isEmpty(data.password)) errors.password = 'Must not be empty';

  return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};
