import * as path from 'path';
import * as vscode from 'vscode';
import * as os from 'os';
import * as request from 'request';


export class TypewriterLanguageProvider implements vscode.TextDocumentContentProvider{
    public static Scheme = 'tst-viewer';
    
    private response;

    constructor (private uri:vscode.Uri){}

    public provideTextDocumentContent(uri:vscode.Uri):string{
        if (!this.response){
            this.makeRequest();
            return "making request";
        }

        let output = this.response;
        this.response = null;
        return output;
    }

    public makeRequest() {

            let options = {
                method: 'get',
                url: 'http://localhost:5000/'
            }

            request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    this.response = body;
                } else if (!error && response.statusCode == 500) {
                    // Something went wrong!
                    this.response = `
                    <p>Uh oh, something went wrong.</p>
                    <p>${body}</p>`;
                }
            });
        }
}