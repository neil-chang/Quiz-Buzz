import React, { Component } from "react";
import PropTypes from "prop-types";
import emailjs from "emailjs-com"; // Package for client side email sending

/* Displays a button when clicked sends an email to the specified address containing the questions options picked */

class EmailInputs extends Component {
  state = {
    email: ""
  };

  handleSubmit = () => {
    const templateId = "quiz_buzz"; // Template created on EmailJS

    this.sendFeedback(templateId, {
      from_name: "Quiz Buzz",
      to_name: "User",
      to_email: this.state.email,
      quiz_title: this.props.quizTitle,
      message_html: this.parseAnswers()
    });
  };
  parseAnswers = () => {
    let answerStrings = [];

    for (let [key, value] of Object.entries(this.props.answers)) {
      answerStrings.push(`${key} ( ${value} )`);
    }
    return answerStrings.join("<br />");
  };

  sendFeedback = (templateId, variables) => {
    emailjs
      .send("gmail", templateId, variables, "user_qhfs14JH0NlvAx2ECMZzv")
      .then(res => {
        alert("Email has been sent!");
      })
      .catch(err => {
        alert("Must input a valid Email Address!");
        console.log("Email failed to send!:", err);
      });
  };
  updateEmail = e => {
    this.setState({ email: e.target.value });
  };

  render() {
    const { email } = this.state;
    const { updateEmail } = this;
    return (
      <React.Fragment>
        <h2 className="answer-list-title">Save a copy of your answers:</h2>
        <input
          className="url-input"
          type="text"
          onChange={updateEmail}
          placeholder="Email address..."
          value={email}
        ></input>
        <button className="build-btn" type="button" onClick={this.handleSubmit}>
          Send
        </button>
      </React.Fragment>
    );
  }
}

EmailInputs.propTypes = {
  answers: PropTypes.object,
  quizTitle: PropTypes.string
};

export default EmailInputs;
