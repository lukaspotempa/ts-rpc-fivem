# ts-rpc: A TypeScript RPC Library for FiveM

A simple and lightweight library for creating and managing [Remote Procedure Calls](https://en.wikipedia.org/wiki/Remote_procedure_call) (RPC) between the client and server in FiveM, written in TypeScript.

This library provides a straightforward way to define functions on the server that can be called from the client (and vice-versa).

## Installation

1.  **Download:** Download or clone this repository into your `resources` directory.
2.  **Install Dependencies:** Navigate to the resource directory in your terminal and run `npm install`.
3.  **Build:** Run `npm run build` to compile the TypeScript code.
4.  **Add to `server.cfg`:** Ensure the resource is started in your `server.cfg`:
    ```cfg
    ensure ts-rpc
    ```

## Usage

The library must be imported as a dependency. You can do this by configuring your `fxmanifest.lua`.

Add the following to your resource's `fxmanifest.lua`:

```lua
dependencies {
    'ts-rpc'
}
```

### Server-Side Usage

#### Registering a Method

To expose a function that can be called from the client, use `Register`. The first argument to the callback will always be the `source` (player NET ID) of the client that made the call.

```typescript
// server/your-server-script.ts
const RPC = global.exports['ts-rpc'].getRPC();
RPC.Register("HelloWorld", (source: string) => {
  return "Server says: Hello World!";
});

// client/your-client-script.ts
const RPC = global.exports['ts-rpc'].getRPC();
const result = RPC.Call('HelloWorld');
console.log(result);
```

#### Sending a Notification (No Response)

If you don't need a response, use `Notify`.

```typescript
// server/your-script.ts
const RPC = global.exports['ts-rpc'].getRPC();

RPC.Notify(playerId, 'updateScore', 100);
```

## Questions?
Need help with the implementation? Add me on Discord: `avoid09`
