import bcryptjs from 'bcryptjs';

const hashPassword = async (password: string): Promise<{ success: boolean, hashedPassword: string }> => {
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    return { success: true, hashedPassword };
  } catch (error) {
    console.error("Hash password error:", error);
    return { success: false, hashedPassword: "" };
  }
};

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    const isPasswordMatch = await bcryptjs.compare(password, hashedPassword);
    return isPasswordMatch;
  } catch (error) {
    console.error("Compare password error:", error);
    return false;
  }
};

const validateEmail = (email: string): { success: boolean, value?: string, message?: string } => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailRegex.test(email)) {
    return { success: true, value: email };
  }
  return { success: false, message: "Invalid email format" };
};

const validatePassword = (password: string): { success: boolean, value?: string, message?: string } => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
  if (passwordRegex.test(password)) {
    return { success: true, value: password };
  }
  return { success: false, message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character." };
};

const UserHelper = {
  hashPassword,
  comparePassword,
  validateEmail,
  validatePassword
};

export default UserHelper;