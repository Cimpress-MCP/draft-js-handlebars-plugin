import React, {Component} from 'react';
import {I18nextProvider, Trans} from 'react-i18next';
import {getI18nInstance} from './utils/i18n';

export default class PlaceholderTooltipHelper extends Component {
  render() {
    const {placeholder, descriptions, showPlaceholder} = this.props;
    const renderedDescriptions = descriptions.map((d, i) =>{
      return <div key={i}>
        <h5><Trans i18nKey={d.title} /></h5>
        <Trans i18nKey={d.description} />
      </div>;
    });
    return <I18nextProvider i18n={getI18nInstance()}>
      <div className={'placeholderContextHelp'}>
        {showPlaceholder ? <pre>{placeholder}</pre>: null}
        {renderedDescriptions}
      </div>
    </I18nextProvider>;
  }
}
