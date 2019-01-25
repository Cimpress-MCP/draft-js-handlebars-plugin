import {Modifier} from 'draft-js';

/**
 * Stripping all the weird handlebars specific characters from the the display name
 *
 * @param originalText
 * @returns {*}
 */
function modifyPlaceholderDisplayText(originalText) {
  return originalText.replace(/[{]{2,3}[#/]?|[}]{2,3}/g, '');
}

function calculateDisplayText(placeholderText) {
  const openingBracketsCount = (placeholderText.match(/[{]/g) || []).length;
  placeholderText = placeholderText.replace(/}+/g, '}'.repeat(openingBracketsCount));
  let displayText;
  if (placeholderText.includes(' ')) {
    displayText = `ƒ(x) ${placeholderText.split(' ')[0]}`;
  } else if (placeholderText.length > 5 && placeholderText.includes('.')) {
    displayText = placeholderText.split('.').slice(-1).pop();
  } else {
    displayText = placeholderText;
  }
  return displayText;
}

function insertEntity(contentState, selection, entityData, inlineStyle) {
  const newContentState = contentState.createEntity(
      'PLACEHOLDER',
      'IMMUTABLE',
      entityData
  );
  const entityKey = newContentState.getLastCreatedEntityKey();
  return Modifier.replaceText(
      newContentState,
      selection,
      entityData.display,
      inlineStyle,
      entityKey);
}

/**
 * Returns a new ContentState with the placeholder entity created on the selection specified if provided, if not is added at the end of the editor.
 *
 * @param {ContentState} currentContent
 * @param {String} placeholderText
 * @param {SelectionState} selection
 * @param {DraftInlineStyle} inlineStyle
 * @param {String} link
 */
export default function insertPlaceholderEntity(currentContent, placeholderText, selection, inlineStyle, link) {
  const subTypes = [];
  const escapeHtml = !placeholderText.includes('{{{');
  const placeholder = modifyPlaceholderDisplayText(placeholderText);
  let display = calculateDisplayText(placeholderText);
  display = modifyPlaceholderDisplayText(display);
  display = escapeHtml ? display : `˂୵˃ ${display}`;

  if (placeholderText.includes('{{#')) {
    subTypes.push('open');
  } else if (placeholderText.includes('{{/')) {
    subTypes.push('close');
  }

  if (!escapeHtml) {
    subTypes.push('noEscapeHtml');
  }

  if (placeholderText.includes(' ')) {
    subTypes.push('formula');
  }

  const entityData = {
    url: link,
    subTypes,
    placeholder,
    escapeHtml,
    display,
  };

  return insertEntity(currentContent, selection, entityData, inlineStyle);
}
