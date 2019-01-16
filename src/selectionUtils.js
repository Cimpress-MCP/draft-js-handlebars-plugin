import {EditorState} from 'draft-js';
import {getEntityRange} from 'draftjs-utils';

/** *
 * This function moves focus to the end of the entity (outside)
 *
 * @param entityKey
 * @param editorState
 * @returns {*}
 */
export const moveBehindEntity = (entityKey, editorState) => {
  const selectionState = editorState.getSelection();
  const anchorKey = selectionState.getAnchorKey();
  const range = getEntityRange(editorState, entityKey);
  if (!range) {
    return editorState;
  }
  const updateSelection = new SelectionState({
    anchorKey: anchorKey,
    anchorOffset: range.end,
    focusKey: anchorKey,
    focusOffset: range.end,
    isBackward: false,
  });
  return EditorState.forceSelection(editorState, updateSelection);
};

/**
 *
 * @param getEditorState
 * @param setEditorState
 * @param traversingLeft
 */
export const selectWholeEntities = (getEditorState, setEditorState, traversingLeft = true) => {
  const editorState = getEditorState();
  const selection = editorState.getSelection();
  const content = editorState.getCurrentContent();
  const blockAnchor = content.getBlockForKey(selection.getAnchorKey());
  const entityAnchor = blockAnchor.getEntityAt(selection.getAnchorOffset());
  const blockFocus = content.getBlockForKey(selection.getFocusKey());
  const entityFocus = blockFocus.getEntityAt(selection.getFocusOffset() + (selection.isBackward && traversingLeft ? -1 : 0));
  let updatedSelection = selection;
  if (entityAnchor) {
    const range = getEntityRange(editorState, entityAnchor);
    if (range) {
      updatedSelection = updatedSelection.merge({
        anchorKey: blockFocus.getKey(),
        anchorOffset: selection.isBackward && traversingLeft ? range.end : range.start,
      });
    }
  }
  if (entityFocus) {
    const range = getEntityRange(editorState, entityFocus);
    if (range) {
      updatedSelection = updatedSelection.merge({
        focusKey: blockAnchor.getKey(),
        focusOffset: selection.isBackward && traversingLeft ? range.start : range.end,
      });
    }
  }
  setEditorState(EditorState.forceSelection(editorState, updatedSelection));
  return entityAnchor || entityFocus;
};

