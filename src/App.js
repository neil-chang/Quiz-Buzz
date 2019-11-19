import React, { Component } from "react";
import axios from "axios"; // Package for HTTP req handling
import cheerio from "cheerio"; // Package for web scrapping functionality

import "./App.css";
import WelcomeScreen from "./Components/WelcomeScreen";
import TitleBar from "./Components/TitleBar";
import TextOption from "./Components/TextOption";
import ImageOption from "./Components/ImageOption";
import AnswerList from "./Components/AnswersList";
import EmailInputs from "./Components/EmailInputs";

/* Main app component which holds majority of the state and methods to be used. Conditionally renders various components/screens of the app and feeds the required methods */

class App extends Component {
  state = {
    answers: {},
    curQuestion: 0,
    quizQuestions: [],
    quizTitle: "",
    loading: false,
    url: ""
  };

  getContents = () => {
    if (this.state.url === "") {
      alert("Must provide a URL!");
    } else {
      this.setState({ loading: true });
      axios(`https://cors-anywhere.herokuapp.com/${this.state.url}`, {
        method: "GET"
      })
        .then(res => {
          const $ = cheerio.load(res.data); // Retrieves HTML for given URL, enables scrapping

          const quizTitle = $(".buzz-title").text(); // Retrieves quiz title
          const titlesQuery = [
            "legend > h2",
            "legend > div > div > p",
            "legend > div > span"
          ];
          let questions = [];

          // Retrieves each quiz question and its corresponding options
          $("fieldset").each((i, ele) => {
            let curQuestion = {};

            // QUESTION TITLES **********************************************
            titlesQuery.forEach(cur => {
              let title = "";
              let image = "none";

              if (cur === "legend > div > div > p") {
                title = `${$(ele)
                  .find(cur)
                  .html()}`
                  .replace(/<br>/g, " ")
                  .replace(/&apos;/g, "'")
                  .trim();
              } else {
                title = $(ele)
                  .find(cur)
                  .text()
                  .trim();
              }

              if (cur === "legend > h2") {
                image = $(ele)
                  .find(cur)
                  .next()
                  .children()
                  .attr("data-src");
                if (image === undefined) {
                  image = "none";
                }
              }

              if (title !== "" && title !== "null") {
                curQuestion["question"] = title;
                curQuestion["questionImage"] = image;
                curQuestion["options"] = [];
              }
            });

            // ***** There are many different HTML layouts for various options so these filters below will scrap for almost all styles/types of options **********************************************************************

            // IMAGE-TILES OPTIONS *******************************************
            $(ele)
              .find(".image-tile__details")
              .each((i, ele) => {
                let imageObj = {};

                if (
                  $(ele)
                    .children()
                    .first()
                    .text() !== ""
                ) {
                  imageObj["text"] = $(ele)
                    .children()
                    .first()
                    .text();
                } else {
                  imageObj["text"] = $(ele)
                    .prev()
                    .attr("title");
                }
                imageObj["image"] = $(ele)
                  .prev()
                  .attr("style")
                  .split("(")
                  .join(", ")
                  .split(")")
                  .join(", ")
                  .split(", ")[1];
                curQuestion["options"].push(imageObj);
              });
            // BLOCK-TEXT OPTIONS **********************************************
            $(ele)
              .find(".block-grid__item")
              .each((i, ele) => {
                if ($(ele).find("label").length) {
                  curQuestion["options"].push($(ele).text());
                }
              });
            // SUBBUZZ-TEXT OPTIONS ********************************************
            $(ele)
              .find(".quiz-v3-answer")
              .each((i, ele) => {
                curQuestion["options"].push(
                  $(ele)
                    .find("span")
                    .text()
                );
              });
            // SUBBUZZ-IMAGE OPTIONS ********************************************
            $(ele)
              .find(".subbuzz-quiz__answer__text")
              .each((i, ele) => {
                let imageObj = {};

                if ($(ele).find("i").length) {
                  imageObj["text"] = $(ele)
                    .find("i")
                    .text();
                } else {
                  imageObj["text"] = $(ele)
                    .text()
                    .trim();
                }
                imageObj["image"] = $(ele)
                  .parent()
                  .prev()
                  .children()
                  .first()
                  .children()
                  .attr("data-src");
                curQuestion["options"].push(imageObj);
              });
            questions.push(curQuestion);
          });

          this.setState({ quizTitle: quizTitle, quizQuestions: questions });
        })
        .catch(err => {
          console.log(err);
          alert("Something went wrong! Unable to build quiz.");
        });
    }
  };
  qChange = e => {
    let answer = e;
    this.setState(prevState => {
      let question = prevState.quizQuestions[prevState.curQuestion].question;
      prevState.answers[question] = answer;
      return {
        curQuestion: prevState.curQuestion + 1,
        answers: prevState.answers
      };
    });
  };
  questionBack = () => {
    this.setState(prevState => {
      return { curQuestion: prevState.curQuestion - 1 };
    });
  };

  urlChange = e => this.setState({ url: e.target.value });

  render() {
    const { getContents, qChange, questionBack, urlChange } = this;
    const {
      answers,
      curQuestion,
      loading,
      quizQuestions,
      quizTitle,
      url
    } = this.state;

    return (
      <React.Fragment>
        <div className="app-container">
          {/* WELCOME SCREEN */}
          {quizQuestions.length < 1 && (
            <WelcomeScreen
              getContents={getContents}
              loading={loading}
              url={url}
              urlChange={urlChange}
            />
          )}

          {/* QUETIONS SCREENS */}
          {quizQuestions.length >= 1 && curQuestion !== quizQuestions.length ? (
            <div className="questions-screen">
              <TitleBar
                curQuestion={curQuestion}
                quizQuestions={quizQuestions}
                quizTitle={quizTitle}
              />
              <div className="options-container">
                {curQuestion !== 0 && (
                  <button className="back-btn" onClick={questionBack}>
                    Back
                  </button>
                )}
                <h2 className="question-title">
                  {quizQuestions[curQuestion].question}
                </h2>
                {quizQuestions[curQuestion].questionImage !== "none" ? (
                  <img
                    className="question-image"
                    src={quizQuestions[curQuestion].questionImage}
                    alt="question"
                  />
                ) : null}
                {typeof quizQuestions[curQuestion].options[0] == "string"
                  ? quizQuestions[curQuestion].options.map(op => {
                      return <TextOption qChange={qChange} op={op} />;
                    })
                  : quizQuestions[curQuestion].options.map(op => {
                      return <ImageOption qChange={qChange} op={op} />;
                    })}
              </div>
            </div>
          ) : null}

          {/* FINISH SCREEN */}
          {curQuestion === quizQuestions.length && quizQuestions.length > 1 ? (
            <div className="finish-screen">
              <AnswerList answers={answers} />
              <EmailInputs quizTitle={quizTitle} answers={answers} />
            </div>
          ) : null}
        </div>

        <a
          style={{ display: "block", textAlign: "center" }}
          href="https://www.freepik.com/free-photos-vectors/background"
        >
          Background vector created by freepik - www.freepik.com
        </a>
      </React.Fragment>
    );
  }
}

export default App;
