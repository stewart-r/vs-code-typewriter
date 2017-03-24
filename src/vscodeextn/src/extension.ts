'use strict';
import * as vscode from 'vscode';
import { TypewriterLanguageProvider } from './TypewriterLanguageProvider';
import { ServerProcess } from './ServerProcess'
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const disposables: vscode.Disposable[] = [];

let windowUri = vscode.Uri.parse(`il-viewer://authority/${TypewriterLanguageProvider.Scheme}`);
let serverProcess : child_process.ChildProcess;

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

    let extnPath = vscode.extensions.getExtension("stewart-r.vs-code-typewriter").extensionPath;

    const fullPath = path.join(extnPath, "server","VsCodeTypewriter.WebApi.dll");
    fs.exists(fullPath, function(exists){
        if (!exists){
            console.log(`Unable to start server, can't find path at ${fullPath}`);
            vscode.window.showErrorMessage("Unable to start server, check developer console");
            return;
        }
        
        startServer(fullPath);
    });

    context.subscriptions.push(...disposables);
}

// this method is called when your extension is deactivated

export function deactivate() {
    serverProcess.kill('SIGTERM');
    disposables.forEach(d => d.dispose());
}

export function startServer(path: string){

    serverProcess = ServerProcess.spawn(path, [ ]);
    serverProcess.on('error', data => {
        console.log("Error starting server");
    });

    let out = serverProcess.stdout;
    out.on("readable", function(){
        let data = serverProcess.stdout.read();
    });

    process.on('SIGTERM', () => {
        serverProcess.kill();
        process.exit(0); 
    });

    process.on('SIGHUP', () => {
        serverProcess.kill();
        process.exit(0); 
    });

    serverProcess.stdout.on('data', data => {
        let response = data != null ? data.toString() : "";
        console.log(`Server output: ${response}`)
        process.stdout.write(data);
    });

    process.stdin.on('data', data => {
        var res = data.toString();
        serverProcess.stdin.write(data); 
    });
}