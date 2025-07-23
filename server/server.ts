// @ts-nocheck
import * as RPC from './rpc';

global.exports('getRPC', () => {
  return { 
    Register: RPC.Register,
    Call: RPC.Call,
    Notify: RPC.Notify
  };
});
