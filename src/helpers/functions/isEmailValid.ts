// TODO: update with  better validation or use package;
const isEmailValid = (email?: string) => {
  return email ? !!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,15}$/g) : false;
};

export default isEmailValid;
