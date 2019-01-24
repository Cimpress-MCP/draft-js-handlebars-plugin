import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import { Tooltip, TextField, Button } from '@cimpress/react-components';
import { I18nextProvider, Trans } from 'react-i18next';
import { getI18nInstance } from './utils/i18n';
import './Placeholders.css';

export default class Placeholder extends Component {
    constructor(props) {
        super(props)
        //this.hangleChange = this.hangleChange.bind(this)
    }

    /*hangleChange(e) {
        e.preventDefault()
        const { getEditorState, contentState, entityKey } = this.props
        const editorState = getEditorState()

        const newContentState = contentState.mergeEntityData(entityKey, {
            placeholder: e.target.value
        })
        const newEditorState = EditorState.push(editorState, newContentState, 'apply-entity')
        this.props.setEditorState(newEditorState);
    }*/

    render() {
        const { contentState, children, entityKey } = this.props
        const entity = contentState.getEntity(entityKey);
        let auxiliaryPlaceholderClassName = '';
        if (entity.data.subType === 'open') {
            auxiliaryPlaceholderClassName = 'auxiliaryPlaceholderOpen';
        } else if (entity.data.subType === 'close') {
            auxiliaryPlaceholderClassName = 'auxiliaryPlaceholderClose';
        }
        let decoratedChildren = children;
        if (entity.data.url) {
            decoratedChildren = <a>{children}</a>;
        }

        return <I18nextProvider i18n={getI18nInstance()}>
            <span className={`'placeholder-wrapper`}>
                <Tooltip className={'placeholderContextHelp'} variety={'popover'} direction={'top'} contents={<div className={'placeholderContextHelp'}>
                    <TextField
                        onClick={(e) => e.preventDefault()}
                        //onChange={this.hangleChange}
                        value={entity.data.placeholder}
                    />
                    <Trans i18nKey={auxiliaryPlaceholderClassName ? 'placeholders:explain_auxiliary_placeholders' : 'placeholders:explain_placeholders'} />
                </div>}>
                    <div className={auxiliaryPlaceholderClassName || 'placeholder'}>
                        {decoratedChildren}
                    </div>
                </Tooltip>
            </span>
        </I18nextProvider>;
    }
}
