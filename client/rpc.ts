import { callEventName, responseEventName } from '../shared/events';
import { nanoid } from 'nanoid/non-secure';


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

export function Call<T>(name: string, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
        const id = getNextId();
        pendingCallbacks[id] = resolve;
        emitNet(callEventName, id, name, ...args);
    });
}

export function Notify(name: string, ...args: any[]): void {
    emitNet(callEventName, null, name, ...args);
}

const registeredMethods: { [key: string]: Function } = {};

onNet(callEventName, async (id: string, name: string, ...args: any[]) => {
    if (registeredMethods[name]) {
        try {
            const result = await registeredMethods[name](...args);
            if (id) {
                emitNet(responseEventName, id, result);
            }
        } catch (e) {
            console.error(`[ts-rpc] An error occurred while executing "${name}": ${e instanceof Error ? e.message : e}`);
        }
    } else {
        console.error(`[ts-rpc] Method "${name}" is not registered.`);
    }
});

export function Register(name: string, callback: Function) {
    registeredMethods[name] = callback;
}