export const password_validation_service = {
    isPasswordValid,
    isPasswordConfrimed,
  };
  
  function isPasswordValid(password: any) {
    var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    //This regular expression evaluates that the password should contain symbols and numbers. Should contain lower and upper case. Length should be between 8-20 characters.
    return regex.test(password); //If test is passed it returns true else in case of failure returns false
  }
  
  function isPasswordConfrimed(password: any, confirmPassword: any) {
    return password === confirmPassword; //If test is passed it returns true else in case of failure returns false
  }