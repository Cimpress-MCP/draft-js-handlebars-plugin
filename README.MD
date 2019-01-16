# draft-js-handlebars-plugin


## Installation

`npm install draft-js-handlebars-plugin --save`


add the css dependencies

```html
<link rel="stylesheet" href="https://static.ux.cimpress.io/mcp-ux-css/1.4/development/1.4.8/css/mcp-ux-css.min.css" charset="utf-8" integrity="sha256-N7q2V/oEomo+XXIEsLN2JsmpMoGvO8EgGC9eWPjx8Ec=" crossorigin="anonymous">
<link rel="stylesheet" href="//cloud.typography.com/7971714/6011752/css/fonts.css"/>
```



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
