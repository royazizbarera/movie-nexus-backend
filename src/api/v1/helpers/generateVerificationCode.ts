

// generate a random 6 digit number
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};