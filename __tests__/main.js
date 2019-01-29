import React from 'react';
import { convertToRaw } from 'draft-js';
import TestEditor from '../stories/TestEditor'
import { shallow, render, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

function createEditor(wrapper, value, onChange) {
    return wrapper(<TestEditor
        onChange={onChange}
        value={value}
    />);
}

describe('Plugin renders properly', () => {

    test('with empty value', () => {
        const value = '';
        const editor = createEditor(mount, value, () => { });
        const editorState = editor.state().editorState;
        const contentState = editorState.getCurrentContent();
        const content = convertToRaw(contentState);

        expect(content.blocks.length).toEqual(1);
        expect(content.blocks[0].text).toEqual(value);
        expect(Object.keys(content.entityMap).length).toEqual(0);
    });

    test('with just simple text', () => {
        const value = 'Hi';
        const editor = createEditor(mount, value, () => { });
        const editorState = editor.state().editorState;
        const contentState = editorState.getCurrentContent();
        const content = convertToRaw(contentState);

        expect(content.blocks.length).toEqual(1);
        expect(content.blocks[0].text).toEqual(value);
        expect(Object.keys(content.entityMap).length).toEqual(0);
    });

    test('with just a placeholder', () => {
        const value = '{{name}}';
        const editor = createEditor(mount, value, () => { });
        const editorState = editor.state().editorState;
        const contentState = editorState.getCurrentContent();
        const content = convertToRaw(contentState);

        expect(content.blocks.length).toEqual(1);
        expect(content.blocks[0].text).toEqual('name');
        expect(content.blocks[0].entityRanges).toEqual([
            { "key": 0, "length": 4, "offset": 0 }
        ]);
        expect(Object.keys(content.entityMap).length).toEqual(1);
        expect(content.entityMap[0]).toEqual({
            data: {
                display: "name",
                escapeHtml: true,
                placeholder: "name",
                subTypes: [],
                url: null
            },
            mutability: "IMMUTABLE",
            type: "PLACEHOLDER"
        });
    });

    test('with text and a placeholder', () => {
        const value = 'Hi {{name}}';
        const editor = createEditor(mount, value, () => { });
        const editorState = editor.state().editorState;
        const contentState = editorState.getCurrentContent();
        const content = convertToRaw(contentState);

        expect(content.blocks.length).toEqual(1);
        expect(content.blocks[0].text).toEqual('Hi name');
        expect(content.blocks[0].entityRanges).toEqual([
            { "key": 0, "length": 4, "offset": 3 }
        ]);
        expect(Object.keys(content.entityMap).length).toEqual(1);
        expect(content.entityMap[0]).toEqual({
            data: {
                display: "name",
                escapeHtml: true,
                placeholder: "name",
                subTypes: [],
                url: null
            },
            mutability: "IMMUTABLE",
            type: "PLACEHOLDER"
        });
    });


    test('with text and a placeholder inside array', () => {
        const value = '{{#people}} Hi {{name}} {{/people}}';
        const editor = createEditor(mount, value, () => { });
        const editorState = editor.state().editorState;
        const contentState = editorState.getCurrentContent();
        const content = convertToRaw(contentState);

        expect(content.blocks.length).toEqual(1);
        expect(content.blocks[0].text).toEqual('people Hi name people');
        expect(content.blocks[0].entityRanges).toEqual([
            { "key": 0, "length": 6, "offset": 0 },
            { "key": 1, "length": 4, "offset": 10 },
            { "key": 2, "length": 6, "offset": 15 },

        ]);
        expect(Object.keys(content.entityMap).length).toEqual(3);
        expect(content.entityMap[0].data.display).toEqual('people');
        expect(content.entityMap[0].data.placeholder).toEqual('people');
        expect(content.entityMap[0].data.subTypes[0]).toEqual('open');
        expect(content.entityMap[1].data.display).toEqual('name');
        expect(content.entityMap[1].data.placeholder).toEqual('name');
        expect(content.entityMap[2].data.display).toEqual('people');
        expect(content.entityMap[2].data.placeholder).toEqual('people');
        expect(content.entityMap[2].data.subTypes[0]).toEqual('close');
    });

    test('with escaped html', () => {
        const value = '{{{desc}}}';
        const editor = createEditor(mount, value, () => { });
        const editorState = editor.state().editorState;
        const contentState = editorState.getCurrentContent();
        const content = convertToRaw(contentState);

        expect(content.blocks.length).toEqual(1);
        expect(content.blocks[0].text).toEqual('˂୵˃ desc');
        expect(content.blocks[0].entityRanges).toEqual([
            { "key": 0, "length": 8, "offset": 0 }
        ]);
        expect(Object.keys(content.entityMap).length).toEqual(1);
        expect(content.entityMap[0]).toEqual({
            data: {
                display: "˂୵˃ desc",
                escapeHtml: false,
                placeholder: "desc",
                subTypes: ['noEscapeHtml'],
                url: null
            },
            mutability: "IMMUTABLE",
            type: "PLACEHOLDER"
        });
    });


    test('with formula', () => {
        const value = '{{#eq name "Victor"}}';
        const editor = createEditor(mount, value, () => { });
        const editorState = editor.state().editorState;
        const contentState = editorState.getCurrentContent();
        const content = convertToRaw(contentState);

        expect(content.blocks.length).toEqual(1);
        expect(content.blocks[0].text).toEqual('eq(…)');
        expect(content.blocks[0].entityRanges).toEqual([
            { "key": 0, "length": 5, "offset": 0 }
        ]);
        expect(Object.keys(content.entityMap).length).toEqual(1);
        expect(content.entityMap[0]).toEqual({
            data: {
                display: "eq(…)",
                escapeHtml: true,
                placeholder: "eq name \"Victor\"",
                subTypes: ['open', 'formula'],
                url: null
            },
            mutability: "IMMUTABLE",
            type: "PLACEHOLDER"
        });
    });

});
