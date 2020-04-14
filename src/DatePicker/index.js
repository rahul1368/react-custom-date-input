import React, { Component } from "react";
import CustomDatePicker, { buttonClick } from "./custom-datepicker";

export default class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateObj: new Date("06/01/2018"), // MM/DD/YYYY
      clickSubmitCount: 0
    };
    this.errorElementRef = React.createRef();
  }
  setDate(dateObj) {
    if (dateObj) {
      this.setState({ dateObj }, () => {
        buttonClick(this.state.dateObj, this.errorElementRef.current);
      });
    }
  }
  sumitClickHandler = () => {
    this.setState(state => {
      return { clickSubmitCount: state.clickSubmitCount + 1 };
    });
  };
  render() {
    return (
      <div className="wrapper">
        <div id="date-block">
          <CustomDatePicker
            value={this.state.dateObj}
            setDate={dateObj => this.setDate(dateObj)}
            clickSubmitCount={this.state.clickSubmitCount}
          />
          <div ref={this.errorElementRef} className="error-msg" />
        </div>
        <div className="button-block">
          <button onClick={this.sumitClickHandler} className="continue">
            Submit
          </button>
        </div>
      </div>
    );
  }
}
