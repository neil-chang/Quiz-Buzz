import React from "react";
import PropTypes from "prop-types";

/* A screen containing the app title, an input bar for a BuzzFeed URL and a button that scrapes the given URL and builds the quiz. */

const WelcomeScreen = ({ getContents, loading, randomUrl, url, urlChange }) => {
  return (
    <div className="welcome-screen">
      <h1 className="app-title">Quiz Buzz</h1>
      <input
        className="url-input"
        onChange={urlChange}
        placeholder="BuzzFeed quiz URL..."
        type="text"
        value={url}
      ></input>
      <button className="build-btn" onClick={getContents} type="button">
        Build
      </button>
      <button className="build-btn" onClick={randomUrl} type="button">
        Sample URL
      </button>
      {loading && <h1 style={{ color: "white" }}>Loading...</h1>}
    </div>
  );
};

WelcomeScreen.propTypes = {
  getContents: PropTypes.func,
  loading: PropTypes.bool,
  randomUrl: PropTypes.func,
  url: PropTypes.string,
  urlChange: PropTypes.func
};

export default WelcomeScreen;
