export const checkUsername = (username) => {
  if (username.length < 7 || username.length > 20) {
    return "Username must be between 7 and 20 characters";
  }
  if (username.includes(" ")) {
    return "Username cannot contain spaces";
  }
  if (username !== username.toLowerCase()) {
    return "Username must be lowercase";
  }
  if (!username.match(/^[a-zA-Z0-9]+$/)) {
    return "Username can only contain letters and numbers";
  }
  return "Success";
};

export const checkPassword = (password) => {
  if (password.length < 7) {
    return "Password must be at least 7 characters";
  }
  if (password.includes(" ")) {
    return "Password cannot contain spaces";
  }
  return "Success";
};
