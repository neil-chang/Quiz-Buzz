import React from 'react';
import PropTypes from 'prop-types';

/* A box which displays an image and text option */

const ImageOption = ({ qChange, op }) => {
  return (
    <div className="image-opt" onClick={e => qChange(op.text)}>
      <img className="image" alt={op.text} src={op.image} />
      <h5 className="image-txt-opt">{op.text}</h5>
    </div>
  );
};

ImageOption.propTypes = {
  qChange: PropTypes.func,
  op: PropTypes.object
};

export default ImageOption;
