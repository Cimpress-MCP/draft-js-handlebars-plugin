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
  const openingBracketsCount = (placeholderText.match(/[{]/g) || []).length;
  placeholderText = placeholderText.replace(/}+/g, '}'.repeat(openingBracketsCount));
  const subType = placeholderText.includes('{{#') ? 'open' : placeholderText.includes('{{/') ? 'close' : null;
  let displayText;
  if (placeholderText.includes(' ')) {
    displayText = `${placeholderText.split(' ')[0]} ★️`;
  } else if (placeholderText.length > 5 && placeholderText.includes('.')) {
    displayText = placeholderText.split('.').slice(-1).pop();
  } else {
    displayText = placeholderText;
  }
  const escapeHtml = !placeholderText.includes('{{{');
  const finalDisplayText = modifyPlaceholderDisplayText(displayText);
  const entityData = {
    subType: subType,
    placeholder: modifyPlaceholderDisplayText(placeholderText),
    escapeHtml: escapeHtml,
    url: link,
    display: escapeHtml ? finalDisplayText : `⌘ ${finalDisplayText}`,
  };
  const contentStateWithEntity = currentContent.createEntity(
      'PLACEHOLDER',
      'IMMUTABLE',
      entityData
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  if (selection) {
    return Modifier.replaceText(
        contentStateWithEntity,
        selection,
        entityData.display,
        inlineStyle,
        entityKey
    );
  }
  return Modifier.insertText(
      currentContent,
      selection,
      entityData.display,
      inlineStyle,
      entityKey);
}
