import React, { Component, Fragment } from "react";
export default class CustomDatePicker extends Component {
  constructor(props) {
    super(props);
    let dateObj = props.value;
    let date = (dateObj && dateObj.getDate().toString()) || "";
    let month = (dateObj && (dateObj.getMonth() + 1).toString()) || "";
    let year = (dateObj && dateObj.getFullYear().toString()) || "";
    if (date.length == 1) {
      date = "0" + date;
    }
    if (month.length == 1) {
      month = "0" + month;
    }
    this.state = {
      date: date || null,
      month: month || null,
      year: year || null,
      isDateValid: true,
      appendTo: props.appendTo,
      disabled: !!props.disabled,
      onChange: props.onChange,
      onBlur: props.onBlur
    };
    this.dateRef = React.createRef();
    this.monthRef = React.createRef();
    this.yearRef = React.createRef();

    let dateInputObj = {
      type: "tel",
      name: "date",
      maxLength: "2",
      placeholder: "DD",
      className: "dd-input",
      autoComplete: "off",
      defaultValue: this.state.date || "",
      ref: this.dateRef
    };
    let monthInputObj = {
      type: "tel",
      name: "month",
      maxLength: "2",
      placeholder: "MM",
      className: "mm-input",
      autoComplete: "off",
      defaultValue: this.state.month || "",
      ref: this.monthRef
    };
    let yearInputObj = {
      type: "tel",
      name: "year",
      maxLength: "4",
      placeholder: "YYYY",
      className: "yy-input",
      autoComplete: "off",
      defaultValue: this.state.year || "",
      ref: this.yearRef
    };
    this.inputList = [
      new this.inputElementConstructor(dateInputObj),
      new this.inputElementConstructor(monthInputObj),
      new this.inputElementConstructor(yearInputObj)
    ];
  }
  inputElementConstructor = function(params) {
    this.type = params.type;
    this.name = params.name;
    this.maxLength = params.maxLength;
    this.placeholder = params.placeholder;
    this.className = params.className;
    this.autoComplete = params.autoComplete;
    this.defaultValue = params.defaultValue;
    this.ref = params.ref;
  };
  componentDidMount() {
    this.dateRef.current.focus();
    this._bindDateEvents(this.dateRef.current);
    this._bindMonthEvents(this.monthRef.current);
    this._bindYearEvents(this.yearRef.current);
  }
  componentDidUpdate(nextProps) {
    if (this.props.clickSubmitCount != nextProps.clickSubmitCount) {
      this.props.setDate({
        date: this.state.date,
        month: this.state.month,
        year: this.state.year,
        getDate: this.getDate
      });
    }
  }
  getDate() {
    if (
      this.date &&
      this.month &&
      this.year &&
      this.year.toString().length == 4
    ) {
      return new Date(this.month + "/" + this.date + "/" + this.year);
    }
    return null;
  }
  _bindDateEvents(el) {
    let date = this.state.date;
    let maxlength = this.dateRef.current.getAttribute("maxLength");
    this.on(el, {
      blur: e => {
        if (e.target.value && parseInt(e.target.value) != 0) {
          if (e.target.value.length < 2) {
            date = "0" + e.target.value;
            e.target.value = date;
            this.setState({ date });
          }
        } else {
          date = "";
          e.target.value = date;
          this.setState({ date });
        }
        this.onBlurHandler();
      },
      input: e => {
        if (e.target.value && isNaN(parseInt(e.target.value))) {
          e.target.value = date;
          this.setState({ date });
        } else if (e.target.value.length > maxlength) {
          e.target.value = date;
          this.setState({ date });
        } else {
          let validDD = this.__getValidDDInput(e.target.value);
          e.target.value = validDD;
          this.setState({ date: validDD });
        }
        this.onChangeHandler();
        if (e.target.value.length == maxlength) {
          // Focus on MM input
          this.monthRef.current.focus();
        }
      }
    });
  }
  _bindMonthEvents(el) {
    let month = this.state.month;
    let maxlength = this.monthRef.current.getAttribute("maxLength");
    this.on(el, {
      blur: e => {
        if (e.target.value && parseInt(e.target.value) != 0) {
          if (e.target.value.length < 2) {
            month = "0" + e.target.value;
            e.target.value = month;
            this.setState({ month });
          }
        } else {
          month = "";
          e.target.value = month;
          this.setState({ month });
        }
        this.onBlurHandler();
      },
      input: e => {
        if (e.target.value && isNaN(parseInt(e.target.value))) {
          e.target.value = month;
          this.setState({ month });
        } else if (e.target.value.length > maxlength) {
          e.target.value = month;
          this.setState({ month });
        } else {
          let validMM = this.__getValidMMInput(e.target.value);
          e.target.value = validMM;
          this.setState({ month: validMM });
        }
        this.onChangeHandler();
        if (e.target.value.length == maxlength) {
          // Focus on YY input
          this.yearRef.current.focus();
        }
      }
    });
  }

  _bindYearEvents(el) {
    let year = this.state.year;
    this.on(el, {
      blur: e => {
        if (e.target.value && parseInt(e.target.value) != 0) {
          if (e.target.value.length == 4) {
            year = e.target.value;
            this.setState({ year });
          }
        } else {
          year = "";
          e.target.value = year;
          this.setState({ year });
        }
        this.onBlurHandler();
      },
      input: e => {
        if (e.target.value && isNaN(parseInt(e.target.value))) {
          e.target.value = year;
          this.setState({ year });
        } else if (e.target.value.length > this.maxLength) {
          e.target.value = year;
          this.setState({ year });
        } else {
          let validYY = this.__getValidYYInput(e.target.value);
          e.target.value = validYY;
          this.setState({ year: validYY });
        }
        this.onChangeHandler();
      }
    });
  }

  __getValidDDInput(inputVal) {
    if (inputVal.length == 1) {
      if (inputVal > 3) {
        return "0" + inputVal;
      }
      return inputVal;
    } else if (inputVal.length > 1) {
      if (inputVal == "00") {
        return this.state.date;
      } else if (this.state.month) {
        let maxDate = this.__getMaxDayForMonth(
          this.state.month,
          this.state.year
        );
        if (inputVal <= maxDate) {
          return inputVal;
        }
        return this.state.date;
      } else {
        if (inputVal > 31) {
          return this.state.date;
        }
        return inputVal;
      }
    } else {
      return inputVal;
    }
  }
  __getValidMMInput(inputVal) {
    if (!inputVal) {
      this.dateRef.current.focus();
      return "";
    }
    if (inputVal.length == 1) {
      if (inputVal > 1) {
        return "0" + inputVal;
      }
      return inputVal;
    } else if (inputVal.length > 1) {
      if (inputVal > 12 || inputVal == "00") {
        return this.state.month;
      } else {
        this.yearRef.current.focus();
        return inputVal;
      }
    } else {
      return inputVal;
    }
  }
  __getValidYYInput(inputVal) {
    if (!inputVal) {
      this.monthRef.current.focus();
      return "";
    }
    return parseInt(inputVal);
  }
  onChangeHandler() {
    let isDateValid = !!this.getDate();
    this.setState({ isDateValid }, () => {
      if (this.onChange) {
        this.onChange();
      }
    });
  }

  onBlurHandler() {
    let isDateValid = !!this.getDate();
    this.setState({ isDateValid }, () => {
      if (this.onBlur) {
        this.onBlur();
      }
    });
  }

  on(el, events) {
    for (const key in events) {
      if (events.hasOwnProperty(key)) {
        el.addEventListener(key, events[key]);
      }
    }
  }

  off(el, events) {
    for (const key in events) {
      if (events.hasOwnProperty(key)) {
        el.removeEventListener(events[key]);
      }
    }
  }

  __getMaxDayForMonth(month, year) {
    month = month.replace(/^0+/, "");
    var MONTH_CONFIG = {
      1: { maxDate: 31 },
      2: { maxDate: !year || this.isLeapYear(year) ? 29 : 28 },
      3: { maxDate: 31 },
      4: { maxDate: 30 },
      5: { maxDate: 31 },
      6: { maxDate: 30 },
      7: { maxDate: 31 },
      8: { maxDate: 31 },
      9: { maxDate: 30 },
      10: { maxDate: 31 },
      11: { maxDate: 30 },
      12: { maxDate: 31 }
    };
    return MONTH_CONFIG[month].maxDate;
  }
  isLeapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  }

  render() {
    return (
      <div className="date-container">
        {this.inputList.map((inputProps, index) => (
          <Fragment key={index}>
            <input key={`input-${index}`} {...inputProps} />
            {index < 2 && (
              <span key={index} className="separator">
                /
              </span>
            )}
          </Fragment>
        ))}
      </div>
    );
  }
}

export function buttonClick(x, errorElement) {
  var dob = x.getDate();
  var ddmmyy = { dd: x.date, mm: x.month, yy: x.year };
  var isError = errorHandler({ dob, x }, ddmmyy, errorElement);
  if (!isError) {
    alert(dob);
  }
}

function errorHandler({ dob, x }, ddmmyy, errorElement) {
  var errorMsg;
  var isError = true;
  if (dob) {
    var age = getAge(dob);
    if (ddmmyy.dd != dob.getDate()) {
      errorMsg = "Enter valid date of birth";
    } else if (age < 18) {
      errorMsg = "You must be minimum 18 years old";
    } else if (age > 65) {
      errorMsg = "You must be maximum 65 years old";
    } else {
      errorMsg = "";
      isError = false;
    }
  } else {
    if (x.date || x.month || x.year) {
      errorMsg = "Enter valid date of birth";
    } else {
      errorMsg = "Enter date of birth";
    }
  }
  errorElement.innerHTML = errorMsg;
  if (errorMsg) {
    errorElement.classList.remove("hide");
  } else {
    errorElement.classList.add("hide");
  }
  return isError;
}

function getAge(dob) {
  var today = new Date();
  var age = today.getFullYear() - dob.getFullYear();
  var m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age = age - 1;
  }
  return age;
}
