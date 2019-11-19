import React, { Component } from "react";
import PropTypes from "prop-types";

/* Displays a list of the questions and options choosen by the user as well as submit button*/

class AnswersList extends Component {
  parseAnswers = () => {
    let answerStrings = [];

    for (let [key, value] of Object.entries(this.props.answers)) {
      answerStrings.push(
        <div className="answer-item" key={value}>
          <h3 className="answer-text">
            {key} (<span className="answer-choice">{value}</span>)
          </h3>
        </div>
      );
    }
    return answerStrings;
  };

  render() {
    const { parseAnswers } = this;
    return (
      <React.Fragment>
        <h1 className="answer-list-title">Your Answers:</h1>
        {parseAnswers()}
      </React.Fragment>
    );
  }
}

AnswersList.propTypes = {
  answers: PropTypes.object
};

export default AnswersList;
