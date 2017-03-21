'use strict';
import * as vscode from 'vscode';
import { TypewriterLanguageProvider } from './TypewriterLanguageProvider'

const disposables: vscode.Disposable[] = [];

let windowUri = vscode.Uri.parse(`il-viewer://authority/${TypewriterLanguageProvider.Scheme}`);

export function activate(context: vscode.ExtensionContext) {

    console.log('activating...');

    let invokationDisposable = vscode.commands.registerCommand('extension.showOutput', () => {
        return vscode.commands.executeCommand('vscode.previewHtml', windowUri, vscode.ViewColumn.Two, 'output').then((success) => {
        }, (reason) => {
            vscode.window.showErrorMessage("There's been an error: " + reason);
        });
    });
    disposables.push(invokationDisposable);

    let provider = new TypewriterLanguageProvider(windowUri);
    let providerDisposable = vscode.workspace.registerTextDocumentContentProvider(TypewriterLanguageProvider.Scheme, provider);
    disposables.push(providerDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}