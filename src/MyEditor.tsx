import { useMemo, useState } from 'react';
import { createEditor, BaseElement, Descendant, Element, Node } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, ReactEditor, RenderElementProps, Slate, withReact } from 'slate-react';
import { ListType, onKeyDown, withLists, withListsReact } from '@prezly/slate-lists';

declare module 'slate' {
    interface CustomTypes {
        Element: { type: Type } & BaseElement;
    }
}

enum Type {
    PARAGRAPH = 'paragraph',
    ORDERED_LIST = 'ordered-list',
    UNORDERED_LIST = 'unordered-list',
    LIST_ITEM = 'list-item',
    LIST_ITEM_TEXT = 'list-item-text',
}

const withListsPlugin = withLists({
    isConvertibleToListTextNode(node: Node) {
        return Element.isElementType(node, Type.PARAGRAPH);
    },
    isDefaultTextNode(node: Node) {
        return Element.isElementType(node, Type.PARAGRAPH);
    },
    isListNode(node: Node, type?: ListType) {
        if (type) {
            const nodeType =
                type === ListType.ORDERED_LIST ? Type.ORDERED_LIST : Type.UNORDERED_LIST;
            return Element.isElementType(node, nodeType);
        }
        return (
            Element.isElementType(node, Type.ORDERED_LIST) ||
            Element.isElementType(node, Type.UNORDERED_LIST)
        );
    },
    isListItemNode(node: Node) {
        return Element.isElementType(node, Type.LIST_ITEM);
    },
    isListItemTextNode(node: Node) {
        return Element.isElementType(node, Type.LIST_ITEM_TEXT);
    },
    createDefaultTextNode(props = {}) {
        return { children: [{ text: '' }], ...props, type: Type.PARAGRAPH };
    },
    createListNode(type: ListType = ListType.UNORDERED, props = {}) {
        const nodeType = type === ListType.ORDERED_LIST ? Type.ORDERED_LIST : Type.UNORDERED_LIST;
        return { children: [{ text: '' }], ...props, type: nodeType };
    },
    createListItemNode(props = {}) {
        return { children: [{ text: '' }], ...props, type: Type.LIST_ITEM };
    },
    createListItemTextNode(props = {}) {
        return { children: [{ text: '' }], ...props, type: Type.LIST_ITEM_TEXT };
    },
});

function renderElement({ element, attributes, children }: RenderElementProps) {
    switch (element.type) {
        case Type.PARAGRAPH:
            return <p {...attributes}>{children}</p>;
        case Type.ORDERED_LIST:
            return <ol {...attributes}>{children}</ol>;
        case Type.UNORDERED_LIST:
            return <ul {...attributes}>{children}</ul>;
        case Type.LIST_ITEM:
            return <li {...attributes}>{children}</li>;
        case Type.LIST_ITEM_TEXT:
            return <div {...attributes}>{children}</div>;
        default:
            return <div {...attributes}>{children}</div>;
    }
}

const initialValue: Descendant[] = [
    { type: Type.PARAGRAPH, children: [{ text: 'Hello world!' }] },
    {
        type: Type.ORDERED_LIST,
        children: [
            {
                type: Type.LIST_ITEM,
                children: [{ type: Type.LIST_ITEM_TEXT, children: [{ text: 'One' }] }],
            },
            {
                type: Type.LIST_ITEM,
                children: [{ type: Type.LIST_ITEM_TEXT, children: [{ text: 'Two' }] }],
            },
            {
                type: Type.LIST_ITEM,
                children: [{ type: Type.LIST_ITEM_TEXT, children: [{ text: 'Three' }] }],
            },
        ],
    },
    {
        type: Type.UNORDERED_LIST,
        children: [
            {
                type: Type.LIST_ITEM,
                children: [{ type: Type.LIST_ITEM_TEXT, children: [{ text: 'Red' }] }],
            },
            {
                type: Type.LIST_ITEM,
                children: [{ type: Type.LIST_ITEM_TEXT, children: [{ text: 'Green' }] }],
            },
            {
                type: Type.LIST_ITEM,
                children: [{ type: Type.LIST_ITEM_TEXT, children: [{ text: 'Blue' }] }],
            },
        ],
    },
];

export function MyEditor() {
    const [value, setValue] = useState(initialValue);
    const editor = useMemo(
        () =>
            withListsReact(withListsPlugin(withHistory(withReact(createEditor() as ReactEditor)))),
        [],
    );

    return (
        <Slate editor={editor} value={value} onChange={setValue}>
            <Editable
                onKeyDown={(event) => onKeyDown(editor, event)}
                renderElement={renderElement}
            />
        </Slate>
    );
}
