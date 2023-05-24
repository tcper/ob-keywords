import { MarkdownView, ItemView, Plugin, WorkspaceLeaf } from "obsidian";
import React from "react";
import ReactDOM from "react-dom";

import KeywordView from "./ui/KeywordView";



const VIEW_TYPE = "keywords-view";

class KeywordView extends ItemView {
  private reactComponent: React.ReactElement;
  private insertText:(text:string) => void;

  setInsert(f:(text:string) => void):void {
    this.insertText = f;
  }

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return "keywordView";
  }

  getIcon(): string {
    return "plug-2";
  }

  async onOpen(): Promise<void> {
    this.reactComponent = React.createElement(KeywordView, {
      insert: this.insertText
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ReactDOM.render(this.reactComponent, (this as any).contentEl);
  }
}

export default class KeywordPlugin extends Plugin {
  private view: KeywordView;

  async onload(): Promise<void> {
    this.registerView(
      VIEW_TYPE,
      (leaf: WorkspaceLeaf) => {
        const app = this.app;
        function insertText(text: string) {
          if (text.length === 0 || text==null) return
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          app.commands.executeCommandById("editor:focus")
          const markdownView = app.workspace.getActiveViewOfType(MarkdownView)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const cursor = markdownView.editor.getCursor('from')
          // console.log(cursor);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          markdownView.editor.replaceRange(text, cursor, cursor)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          markdownView.editor.setCursor({...cursor, ch: cursor.ch + text.length})
        }
        this.view = new KeywordView(leaf)
        this.view.setInsert(insertText);
        return this.view;
      }
    );

    this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
  }

  onLayoutReady(): void {
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length) {
      return;
    }
    this.app.workspace.getRightLeaf(false).setViewState({
      type: VIEW_TYPE,
    });
  }
}
