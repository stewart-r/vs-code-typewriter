import * as child from 'child_process';
import * as SpawnOptions from 'child_process';

export namespace ServerProcess {

    export function spawn(cmd: string, args: string[], options?) : child.ChildProcess {
        console.log(`Starting server with command: ${cmd}`);
        return child.spawn("dotnet", [ cmd ].concat(args), options);
    }

}