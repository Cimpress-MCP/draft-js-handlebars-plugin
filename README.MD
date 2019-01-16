# draft-js-handlebars-plugin


## Installation

`npm install draft-js-handlebars-plugin --save`


## Import

`import createPlaceholderVisualizationPlugin, { insertPlaceholderEntity, placeholderVisualizationDecorator, selectionUtils } from 'draft-js-handlebars-plugin'`

## Usage

### createPlaceholderVisualizationPlugin()

Function that creates the plugin that has to be added to draft-js plugins

### insertPlaceholderEntity(currentContent, placeholderText, selection, inlineStyle, link)

Returns a new ContentState with the placeholder entity created on the selection specified if provided, if not is added at the end of the editor.

```
 /**
 *
 * @param {ContentState} currentContent
 * @param {String} placeholderText
 * @param {SelectionState} selection
 * @param {DraftInlineStyle} inlineStyle
 * @param {String} link
 */
```
### placeholderVisualizationDecorator

Decorator included in the plugin


### selectionUtils


Useful functions for handling selections on draft js

- moveBehindEntity(entityKey, editorState) 
//Move selector behind the entity with the entity key provided.

- selectWholeEntities(getEditorState, setEditorState, traversingLeft = true)
