import {Modifier, EditorState, SelectionState} from 'draft-js';
import {getEntityRange} from 'draftjs-utils';
import {handleDraftEditorPastedText} from 'draftjs-conductor';
import placeholderVisualizationDecorator from './decorator';
import {selectWholeEntities, moveBehindEntity} from './selectionUtils';
import createPlaceholderEntity from './insertPlaceholderEntity';

const PLACEHOLDER_REGEX = /[{]?{{[^{}]*}}[}]?/g;

/**
 * This function contains code that makes sure that the overridden functionality (produceNewEditorState)
 * is only invoked when the PLACEHOLDER type entity is selected
 *
 * @param editorState
 * @param setEditorState
 * @param produceNewEditorState The action to that will produce new editor state. This is a function that takes
 *  in selection state as input and produces editor state
 * @returns {*}
 */
function handleInCaseOfPlaceholderEntity(editorState, setEditorState, produceNewEditorState) {
  const state = editorState;
  const selection = state.getSelection();

  const startOffset = selection.getStartOffset();
  const endOffset = selection.getEndOffset();
  const content = state.getCurrentContent();
  const block = content.getBlockForKey(selection.getStartKey());
  const entityStart = block.getEntityAt(startOffset);
  const entityEnd = block.getEntityAt(endOffset);

  const isPlaceholderAt = (entity) => entity !== null && content.getEntity(entity).getType() === 'PLACEHOLDER';

  if (isPlaceholderAt(entityStart) || isPlaceholderAt(entityEnd)) {
    const rangeStart = getEntityRange(state, entityStart);
    if (!selection.isCollapsed || (rangeStart && startOffset > rangeStart.start)) {
      const newEditorState = moveBehindEntity(entityEnd || entityStart, editorState);
      setEditorState(produceNewEditorState(newEditorState));
      return 'handled';
    }
  }

  return 'not-handled';
}

/**
 * This function is used to find all the matches according to a RegEx
 *
 * @param regex
 * @param contentBlock
 * @param callback
 * @returns {Array}
 */
function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr; let start;
  const range = [];
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    if (callback) {
      callback(null, {start: start, end: start + matchArr[0].length});
    }
    range.push({start: start, end: start + matchArr[0].length});
  }
  return range;
}

export default (config = {}) => {
  return {
    decorators: [
      placeholderVisualizationDecorator,
    ],
    onDownArrow: (event, {getEditorState, setEditorState}) => {
      if (event.shiftKey) {
        if (selectWholeEntities(getEditorState, setEditorState)) {
          event.preventDefault();
        }
      }
    },
    onUpArrow: (event, {getEditorState, setEditorState}) => {
      if (event.shiftKey) {
        if (selectWholeEntities(getEditorState, setEditorState)) {
          event.preventDefault();
        }
      }
    },
    onRightArrow: (event, {getEditorState, setEditorState}) => {
      if (event.shiftKey) {
        if (selectWholeEntities(getEditorState, setEditorState, false)) {
          event.preventDefault();
        }
      }
    },
    onLeftArrow: (event, {getEditorState, setEditorState}) => {
      if (event.shiftKey) {
        if (selectWholeEntities(getEditorState, setEditorState, true)) {
          event.preventDefault();
        }
      }
    },
    /**
     * Overriding the handle return, so that pressing "enter" when the caret is on the placeholder
     * wouldn't split the text in half (wouldn't split the block)
     *
     * @param event
     * @param editorState
     * @param getEditorState
     * @param setEditorState
     * @returns {*}
     */
    handleReturn(event, editorState, {getEditorState, setEditorState}) {
      return handleInCaseOfPlaceholderEntity(editorState, setEditorState,
          (editorState) => {
            const newContent = Modifier.splitBlock(editorState.getCurrentContent(), editorState.getSelection());
            return EditorState.push(editorState, newContent, 'split-block');
          }
      );
    },
    /**
     * Overriding handle before input to make sure that PLACEHOLDER entities can't me modified once created.
     *
     * @param chars
     * @param editorState
     * @param getEditorState
     * @param setEditorState
     * @returns {*}
     */
    handleBeforeInput(chars, editorState, {getEditorState, setEditorState}) {
      return handleInCaseOfPlaceholderEntity(editorState, setEditorState,
          (editorState) => {
            const content = Modifier.insertText(
                editorState.getCurrentContent(),
                editorState.getSelection(),
                chars,
                editorState.getCurrentInlineStyle(),
                null
            );
            return EditorState.push(
                editorState,
                content,
                'insert-characters'
            );
          });
    },
    /**
     * It is also required to override paste, to make sure it doesn't split existing placeholder entities
     * @param text
     * @param html
     * @param editorState
     * @param getEditorState
     * @param setEditorState
     * @returns {*}
     */
    handlePastedText(text, html, editorState, {getEditorState, setEditorState}) {
      const newState = handleDraftEditorPastedText(html, editorState);
      if (newState) { // handleDraftEditorPastedText detects when the copied text is from a draft js editor with the plugin
        setEditorState(newState);
        return 'handled';
      }
      return handleInCaseOfPlaceholderEntity(editorState, setEditorState,
          (editorState) => {
            const content = Modifier.insertText(
                editorState.getCurrentContent(),
                editorState.getSelection(),
                text,
                editorState.getCurrentInlineStyle(),
                null
            );
            return EditorState.push(
                editorState,
                content,
                'insert-characters'
            );
          });
    },
    /**
     * Overriding on change in order to discover new entities of type PLACEHOLDER,
     * especially when the page first loads (but also when the user is typing)
     *
     * @param editorState
     * @param getEditorState
     * @param setEditorState
     * @returns {*}
     */
    onChange: (editorState, {getEditorState, setEditorState}) => {
      let currentContent = editorState.getCurrentContent();
      currentContent.getBlockMap().map((block, i) => {
        const blockKey = block.getKey();
        const ranges = findWithRegex(PLACEHOLDER_REGEX, block);
        return ranges.map((range, i) => {
          currentContent = editorState.getCurrentContent();
          block = currentContent.getBlockForKey(block.getKey());
          const ranges = findWithRegex(PLACEHOLDER_REGEX, block);
          range = ranges[0];
          const start = range.start;
          const end = range.end;
          const text = block.getText().substring(start, end);
          const selection = new SelectionState({
            anchorKey: blockKey,
            anchorOffset: start,
            focusKey: blockKey,
            focusOffset: end,
          });
          const entityKey = block.getEntityAt(start);
          let entity = null;
          let link = null;
          if (entityKey !== null) {
            entity = currentContent.getEntity(entityKey);
            link = entity.data.url;
          }
          if (entity === null || entity.getType() === 'LINK') {
            editorState = EditorState.forceSelection(editorState, selection);
            const newContentState = createPlaceholderEntity(currentContent, text, selection, editorState.getCurrentInlineStyle(),
                link);
            editorState = EditorState.push(editorState, newContentState, 'remove-range');
          }
          return editorState;
        });
      });
      return editorState;
    },
  };
};
