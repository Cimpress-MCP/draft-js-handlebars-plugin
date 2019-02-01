import {Modifier} from 'draft-js';
import {analizePlaceholder} from './Placeholder';

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
  const analisedPlaceholder = analizePlaceholder(placeholderText);
  analisedPlaceholder.url = link;
  return insertEntity(currentContent, selection, analisedPlaceholder, inlineStyle);
}
