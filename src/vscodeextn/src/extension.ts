'use strict';
import * as vscode from 'vscode';
import { TypewriterLanguageProvider } from './TypewriterLanguageProvider';
import * as fs from 'fs';
import * as path from 'path';

const disposables: vscode.Disposable[] = [];

let windowUri = vscode.Uri.parse(`il-viewer://authority/${TypewriterLanguageProvider.Scheme}`);

export function activate(context: vscode.ExtensionContext) {

    console.log('activating...');

    let invocationDisposable = vscode.commands.registerCommand('extension.showOutput', () => {
        return vscode.commands.executeCommand('vscode.previewHtml', windowUri, vscode.ViewColumn.Two, 'output').then((success) => {
        }, (reason) => {
            vscode.window.showErrorMessage("There's been an error: " + reason);
        });
    });
    disposables.push(invocationDisposable);

    let provider = new TypewriterLanguageProvider(windowUri);
    let providerDisposable = vscode.workspace.registerTextDocumentContentProvider(TypewriterLanguageProvider.Scheme, provider);
    disposables.push(providerDisposable);

    const fullPath = path.join(vscode.extensions.getExtension("stewart-r.vs-code-typewriter").extensionPath) + "/server/ilViewer.WebApi.dll";//TODO
    fs.exists(fullPath, function(exists){
        if (!exists){
            console.log(`Unable to start server, can't find path at ${fullPath}`);
            vscode.window.showErrorMessage("Unable to start server, check developer console");
            return;
        }
        
        //startServer(fullPath);
    });

    context.subscriptions.push(...disposables);
}

// this method is called when your extension is deactivated
export function deactivate() {
}