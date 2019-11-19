import React from 'react';
import PropTypes from 'prop-types';

/* A box which displays text only option */

const TextOption = ({ qChange, op }) => {
  return (
    <div className="text-opt" onClick={e => qChange(op)}>
      <h5 className="text">{op}</h5>
    </div>
  );
};

TextOption.propTypes = {
  qChange: PropTypes.func,
  op: PropTypes.string
};

export default TextOption;
