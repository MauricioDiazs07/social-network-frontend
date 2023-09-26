import strings from '../i18n/strings';

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const passwordRegex = /^(?=.*\d)(?=.*\W)(?=.*[a-z])(?=.*[A-Z]).{1,}$/;

const nameRegex = /^([\w]{1,})+([\w\s]{0,})+$/i;

// regex for atm card number
const atmCardNumberRegex = /^[0-9]{16}$/;

// regex for cvv
const cvvRegex = /^[0-9]{3}$/;

// regex for age
const ageRegex = /^[0-9]*$/;

// regex for curp
const curpRegex = /^[A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}\d{2}$/;

// regex for section
const sectionRegex = /^(\d{4})$/;

// Name validation
const validateName = name => {
  if (!name) {
    return {
      status: false,
      msg: strings.thisFieldIsMandatory,
    };
  } else {
    return nameRegex.test(name)
      ? {status: true, msg: ''}
      : {
          status: false,
          msg: strings.validName,
        };
  }
};

// ATM card number validation
const validateCardNumber = atmCardNumber => {
  if (!atmCardNumber) {
    return {
      status: false,
      msg: strings.thisFieldIsMandatory,
    };
  } else {
    return atmCardNumberRegex.test(atmCardNumber)
      ? {status: true, msg: ''}
      : {
          status: false,
          msg: strings.validCardNumber,
        };
  }
};

// CVV validation
const validateCvv = cvv => {
  if (!cvv) {
    return {
      status: false,
      msg: strings.thisFieldIsMandatory,
    };
  } else {
    return cvvRegex.test(cvv)
      ? {status: true, msg: ''}
      : {
          status: false,
          msg: strings.validCvv,
        };
  }
};

//Email validation
const validateEmail = email => {
  if (!email) {
    return {
      status: false,
      msg: strings.thisFieldIsMandatory,
    };
  } else {
    return emailRegex.test(email)
      ? {status: true, msg: ''}
      : {
          status: false,
          msg: strings.validEmail,
        };
  }
};

//Email validation
const validateOptionalEmail = email => {
  if (!email) {
    return {
      status: false,
      msg: "",
    };
  } else {
    return emailRegex.test(email)
      ? {status: true, msg: ''}
      : {
          status: false,
          msg: strings.validEmail,
        };
  }
};

const validateNotNecessatyEmail = email => {
  if (!email) {
    return {
      status: true,
      msg: '',
    };
  } else {
    return emailRegex.test(email)
      ? {status: true, msg: ''}
      : {
          status: false,
          msg: strings.validEmail,
        };
  }
};

//Password validation
const validatePassword = (pass, isConfrimPass, password) => {
  if (!pass) {
    return {
      status: false,
      msg: strings.plsEnterPassword,
    };
  } else if (pass.length < 8) {
    return {
      status: false,
      msg: strings.validatePassword,
    };
  } else {
    if (passwordRegex.test(pass)) {
      if (isConfrimPass && password != pass) {
        return {
          status: false,
          msg: strings.confirmPassValidString,
        };
      }
      return {status: true, msg: ''};
    } else {
      return {
        status: false,
        msg: strings.validatePassword,
      };
    }
  }
};

// confirm password validation
const validateConfirmPassword = (pass, password) => {
  if (!pass) {
    return {
      status: false,
      msg: strings.plsEnterPassword,
    };
  } else if (pass.length < 8) {
    return {
      status: false,
      msg: strings.validatePassword,
    };
  } else {
    if (passwordRegex.test(pass)) {
      if (password != pass) {
        return {
          status: false,
          msg: strings.confirmPassValidString,
        };
      }
      return {status: true, msg: ''};
    } else {
      return {
        status: false,
        msg: strings.validatePassword,
      };
    }
  }
};

const validateAge = (strAge) => {
  const age = parseInt(strAge);

  if (!strAge) {
    return {
      status: false,
      msg: strings.thisFieldIsMandatory,
    };
  } else if (
      (!ageRegex.test(strAge)) ||
      (age < 1 || age > 150)
    ) {
    return {
      status: false,
      msg: strings.validAge
    }
  } else {
    return {
      status: true,
      msg: ''
    }
  }
};

const validateNotEmptyField = (text) => {
  if (!text) {
    return {
      status: false,
      msg: strings.thisFieldIsMandatory
    }
  }

  return {
    status: true,
    msg: ''
  }
}

const validateNotEmptyContact = (email, phoneNo) => {
  if (!email && !phoneNo) {
    return {
      status: false,
      msg: strings.contactNeeded
    }
  }

  return {
    status: true,
    msg: ''
  }
}

const validateINE = (ine_) => {
  if (!ine_) {
    return {
      status: false,
      msg: strings.thisFieldIsMandatory,
    };
  } else {
    return curpRegex.test(ine_)
      ? {status: true, msg: ''}
      : {
          status: false,
          msg: strings.validCurp,
        };
  }
}

const validateSection = (sect) => {
  if (!sect) {
    return {
      status: false,
      msg: strings.thisFieldIsMandatory,
    };
  } else {
    return sectionRegex.test(sect)
      ? {status: true, msg: ''}
      : {
          status: false,
          msg: strings.validSect,
        };
  }
}

//Password validation
const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    return {
      status: false,
      msg: strings.phoneNeeded,
    };
  } else if (phoneNumber.length < 10 || phoneNumber.length > 10) {
    return {
      status: false,
      msg: strings.validatePhoneNumber,
    };
  } else {
    if (ageRegex.test(phoneNumber)) {
      return {status: true, msg: ''};
    } else {
      return {
        status: false,
        msg: strings.validatePhoneNumber,
      };
    }
  }
};

export {
  validateEmail,
  validateNotNecessatyEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validateCardNumber,
  validateCvv,
  validateAge,
  validateNotEmptyField,
  validateNotEmptyContact,
  validateINE,
  validateSection,
  validatePhoneNumber,
  validateOptionalEmail,
};
