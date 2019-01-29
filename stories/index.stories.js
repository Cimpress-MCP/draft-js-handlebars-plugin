import React from 'react';

import { storiesOf } from '@storybook/react';
import TestEditor from './TestEditor';

storiesOf('Draft-js Handlebars Plugin', module)
  .add('with text and no handlebars', () => <TestEditor value={'Hi!'} onChange={() => { }} />)
  .add('with placeholder', () => <TestEditor value={'Hi {{name}}! How are you? '} onChange={() => { }} />)
  .add('with just a placeholder', () => <TestEditor value={'{{name}}'} onChange={() => { }} />)
  .add('with just a placeholder and a formula', () => <TestEditor value={'{{name}}{{replace name "victor"}}'} onChange={() => { }} />)
  .add('with paragraph and placeholders', () => <TestEditor value={'Hi {{name}}! How are you? \nWill I see you on {{day}}?'} onChange={() => { }} />)
  .add('with array', () => <TestEditor value={'Hi {{#people}} {{name}} {{/people}}! '} onChange={() => { }} />)
  .add('with complex formula', () => <TestEditor value={'{{#people}} Hi {{{#eq name "Victor"}}}{{replace value "_" " "}} {{lastname}} !{{{/eq}}}{{/people}}'} onChange={() => { }} />)
  .add('Copy paste works', () => <div>
    <TestEditor value={'{{#people}} Hi {{{#eq name "Victor"}}}{{replace value "_" " "}} {{lastname}} !{{{/eq}}}{{/people}}'} onChange={() => { }} />
    <TestEditor value={''} onChange={() => { }} />
  </div>);
