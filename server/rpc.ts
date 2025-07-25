import { callEventName, responseEventName } from '../shared/events';
import { nanoid } from 'nanoid';

const registeredMethods: { [key: string]: Function } = {};

onNet(callEventName, async (id: string, name: string, ...args: any[]) => {
    const src = source;
    if (registeredMethods[name]) {
        const result = registeredMethods[name](src, ...args);
        if (id) {
            emitNet(responseEventName, src, id, await result);
        }
    } else {
        console.error(`[ts-rpc] Method "${name}" is not registered.`);
    }
});

export function Register(name: string, callback: Function) {
    registeredMethods[name] = callback;
}

const pendingCallbacks: { [key: string]: Function } = {};

function getNextId() {
    return nanoid();
}

onNet(responseEventName, (id: string, ...args: any[]) => {
    if (pendingCallbacks[id]) {
        pendingCallbacks[id](...args);
        delete pendingCallbacks[id];
    }
});

export function Call<T>(name: string, player: number, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
        const id = getNextId();
        const timeout = setTimeout(() => {
            if (pendingCallbacks[id]) {
                delete pendingCallbacks[id];
                reject(new Error('RPC call timed out'));
            }
        }, 10000);

        pendingCallbacks[id] = (...cbArgs: any[]) => {
            clearTimeout(timeout);
            resolve(cbArgs[0]);
        };
        emitNet(callEventName, player, id, name, ...args);
    });
}

export function Notify(name: string, player: number, ...args: any[]): void {
    emitNet(callEventName, player, null, name, ...args);
}