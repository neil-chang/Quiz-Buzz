import React from "react";
import PropTypes from "prop-types";

/* A sticky top bar on the questions screen which displays the quiz title and the current question status. */

const TitleBar = ({ curQuestion, quizQuestions, quizTitle }) => {
  return (
    <div className="title-bar">
      <h3 className="quiz-title">{quizTitle}</h3>
      <h3 className="question-counter">{`Question: ${curQuestion + 1}/${
        quizQuestions.length
      }`}</h3>
    </div>
  );
};

TitleBar.propTypes = {
  curQuestion: PropTypes.number,
  quizQuestions: PropTypes.array,
  quizTitle: PropTypes.string
};

export default TitleBar;
