const formatPhoneNumber = (dialCode, phoneNumber) => {
  const phoneNumberOnly = phoneNumber.split(dialCode);

  return dialCode ? `(+${dialCode})-${phoneNumberOnly[1]}` : phoneNumber;
};

export default formatPhoneNumber;