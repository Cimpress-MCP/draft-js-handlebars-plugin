import React from 'react';

import { storiesOf } from '@storybook/react';
import TestEditor from './TestEditor';

storiesOf('Draft-js Handlebars Plugin', module)
  .add('with text and no handlebars', () => <TestEditor value={'Hi!'} onChange={() => { }} />)
  .add('with placeholder', () => <TestEditor value={'Hi {{name}}!'} onChange={() => { }} />)
  .add('with array', () => <TestEditor value={'{{#people}} Hi {{name}}! {{/people}}'} onChange={() => { }} />)
  .add('with complex formula', () => <TestEditor value={'{{#people}} Hi {{#eq name "Victor"}}{{replace value "_" " "}} {{lastname}} !{{/eq}}{{/people}}'} onChange={() => { }} />);
