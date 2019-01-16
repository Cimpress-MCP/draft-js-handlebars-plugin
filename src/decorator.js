import React from 'react';
import {Tooltip} from '@cimpress/react-components';
import {Trans} from 'react-i18next';
import {selectWholeEntities} from './selectionUtils';
import './Placeholders.css';

/**
 * Decorator strategy defines how we are finding elements a decorator shiould be applied to
 * In this case, we are taking all entities of type PLACEHOLDER
 *
 * @param contentBlock
 * @param callback
 * @param contentState
 */
const placeholderEntityVisualizationStrategy = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null
                && contentState.getEntity(entityKey).getType() === 'PLACEHOLDER'
        );
      },
      callback
  );
};

/**
 * This is the definition of the object that will be used to decorate all placeholders that
 * are found within the text
 *
 * @param props
 * @returns {*}
 */
const placeHolderSpan = (props) => {
  const entity = props.contentState.getEntity(props.entityKey);
  let auxiliaryPlaceholderClassName = null;
  if (entity.data.subType === 'open') {
    auxiliaryPlaceholderClassName = 'auxiliaryPlaceholderOpen';
  } else if (entity.data.subType === 'close') {
    auxiliaryPlaceholderClassName = 'auxiliaryPlaceholderClose';
  }
  let decoratedChildren = props.children;
  if (entity.data.url) {
    decoratedChildren = <a>{props.children}</a>;
  }
  return <Tooltip className={'placeholderContextHelp'} variety={'popover'} direction={'left'} contents={<div className={'placeholderContextHelp'}>
    <pre>{entity.data.placeholder}</pre>
    <Trans i18nKey={auxiliaryPlaceholderClassName ? 'placeholders:explain_auxiliary_placeholders' : 'placeholders:explain_placeholders'} />
  </div>}>
    <div className={auxiliaryPlaceholderClassName || 'placeholder'}
      onMouseUp={(e) => setTimeout(() => selectWholeEntities(props.getEditorState, props.setEditorState), 20)}>
      {decoratedChildren}</div>
  </Tooltip>;
};

export default {
  strategy: placeholderEntityVisualizationStrategy,
  component: placeHolderSpan,
};
