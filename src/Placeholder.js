import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tooltip} from '@cimpress/react-components';
import PlaceholderTooltipHelper from './PlaceholderTooltipHelper';
import './Placeholders.css';

const SUBTYPES = {
  OPEN: 'open',
  CLOSE: 'close',
  NO_ESCAPE_HTML: 'noEscapeHtml',
  FORMULA: 'formula',
};

const removeHandlebarsSyntax = (placeholder) => {
  return placeholder.replace(/[{]{2,3}[#/]?|[}]{2,3}/g, '');
};

const calculateDisplayText = (placeholderText) => {
  const openingBracketsCount = (placeholderText.match(/[{]/g) || []).length;
  placeholderText = placeholderText.replace(/}+/g, '}'.repeat(openingBracketsCount));
  let displayText;
  if (placeholderText.includes(' ')) {
    displayText = `${placeholderText.split(' ')[0]}(…)`;
  } else if (placeholderText.length > 5 && placeholderText.includes('.')) {
    displayText = placeholderText.split('.').slice(-1).pop();
  } else {
    displayText = placeholderText;
  }
  displayText = removeHandlebarsSyntax(displayText);

  if (placeholderText.includes('{{{')) {
    displayText = `˂୵˃ ${displayText}`;
  }

  return displayText;
};

const analizePlaceholder = (placeholder) => {
  const display = calculateDisplayText(placeholder);
  const subTypes = [];

  if (placeholder.includes('{{#')) {
    subTypes.push(SUBTYPES.OPEN);
  } else if (placeholder.includes('{{/')) {
    subTypes.push(SUBTYPES.CLOSE);
  }

  if (placeholder.includes('{{{')) {
    subTypes.push(SUBTYPES.NO_ESCAPE_HTML);
  }

  if (placeholder.includes(' ')) {
    subTypes.push(SUBTYPES.FORMULA);
  }

  return {
    subTypes,
    display,
    placeholder,
  };
};


export {
  SUBTYPES,
  analizePlaceholder,
};

export default class Placeholder extends Component {
  render() {
    const {placeholder, url} = this.props;
    const data = analizePlaceholder(placeholder);
    const display = this.props.display || data.display;
    const subTypes = data.subTypes;

    let auxiliaryClassName = '';
    let showPlaceholder = true;
    const descriptions = [];

    if (!subTypes.length) {
      descriptions.push({
        title: 'placeholders:placeholder',
        description: 'placeholders:explain_placeholders',
      });
    } else if (subTypes.includes(SUBTYPES.OPEN)) {
      descriptions.push({
        title: 'placeholders:block_expression',
        description: 'placeholders:explain_opening_block_expression',
      });
      auxiliaryClassName = 'auxiliaryPlaceholderOpen';
    } else if (subTypes.includes(SUBTYPES.CLOSE)) {
      descriptions.push({
        title: 'placeholders:closing_block_expression',
      });
      auxiliaryClassName = 'auxiliaryPlaceholderClose';
      showPlaceholder = false;
    }
    if (subTypes.includes(SUBTYPES.NO_ESCAPE_HTML) && !subTypes.includes(SUBTYPES.CLOSE)) {
      descriptions.push({
        title: 'placeholders:no_escape_html',
        description: 'placeholders:explain_no_escape_html',
      });
    }

    if (subTypes.includes(SUBTYPES.FORMULA)) {
      descriptions.push({
        title: 'placeholders:formula',
        description: 'placeholders:explain_formula',
      });
    }

    return <span className={`placeholder-wrapper`}>
      <Tooltip
        className={'placeholderContextHelp'}
        variety={'popover'}
        direction={'top'}
        contents={
          <PlaceholderTooltipHelper
            placeholder={placeholder}
            descriptions={descriptions}
            showPlaceholder={showPlaceholder} />
        }>
        <div className={auxiliaryClassName || 'placeholder'}>
          {!url ? display : <a href={url}>{display}</a>}
        </div>
      </Tooltip>
    </span>;
  }
}

Placeholder.propTypes = {
  placeholder: PropTypes.string.isRequired,
  url: PropTypes.string,
  display: PropTypes.any,
};
