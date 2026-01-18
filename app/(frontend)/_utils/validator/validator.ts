const validateEmail = (email: string) => {
  const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const isValid = regex.test(email);

  const message = isValid ? "" : "Invalid email address";
  return {
    message,
  };
};

const validateUsername = (username: string) => {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;

  const isValid = regex.test(username);

  const message = isValid
    ? ""
    : "Username must be 3–20 characters and contain only letters, numbers, and underscore";
  return {
    message,
  };
};

const validateName = (name: string) => {
  const regex = /^[A-Za-z]{3,} [A-Za-z]{3,}(?: [A-Za-z]+)*$/;

  const message = regex.test(name)
    ? ""
    : "Name must have at least two words, the first two with at least 3 letters, using only A–Z or a–z";
  return {
    message,
  };
};

const validatePassword = (password: string) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%\^&*])[A-Za-z\d!@#$%\^&*]{8,20}$/;

  const isValid = regex.test(password);

  const message = isValid ? "" : "Password must be 8–20 characters and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*)";
  return {
    message
  };
};

const Validator = {
  validateEmail,
  validateUsername,
  validateName,
  validatePassword,
};

export default Validator;
