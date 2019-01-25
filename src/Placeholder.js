import React, {Component} from 'react';
import {Tooltip} from '@cimpress/react-components';
import PlaceholderTooltipHelper from './PlaceholderTooltipHelper';
import './Placeholders.css';

export default class Placeholder extends Component {
  render() {
    const {contentState, children, entityKey} = this.props;
    const entityData = contentState.getEntity(entityKey).data;
    const subTypes = entityData.subTypes;
    let auxiliaryClassName = '';
    let showPlaceholder = true;
    const descriptions = [];

    if (!subTypes.length) {
      descriptions.push({
        title: 'placeholders:placeholder',
        description: 'placeholders:explain_placeholders',
      });
    } else if (subTypes.includes('open')) {
      descriptions.push({
        title: 'placeholders:block_expression',
        description: 'placeholders:explain_opening_block_expression',
      });
      auxiliaryClassName = 'auxiliaryPlaceholderOpen';
    } else if (subTypes.includes('close')) {
      descriptions.push({
        title: 'placeholders:closing_block_expression',
      });
      auxiliaryClassName = 'auxiliaryPlaceholderClose';
      showPlaceholder = false;
    }
    if (subTypes.includes('noEscapeHtml') && !subTypes.includes('close')) {
      descriptions.push({
        title: 'placeholders:no_escape_html',
        description: 'placeholders:explain_no_escape_html',
      });
    }

    if (subTypes.includes('formula')) {
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
            placeholder={entityData.placeholder}
            descriptions={descriptions}
            showPlaceholder={showPlaceholder} />
        }>
        <div className={auxiliaryClassName || 'placeholder'}>
          {!entityData.url ? children : <a>{children}</a>}
        </div>
      </Tooltip>
    </span>;
  }
}
