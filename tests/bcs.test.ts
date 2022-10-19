// Copyright (c) Kernel Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect } from 'vitest';
import { bcs } from '../src/index';
import { BN } from 'bn.js';

describe('Move bcs', () => {
    it('should de/ser options', () => {
        bcs.registerOptionType('option<u8>', bcs.U8);

        expect(bcs.ser('option<u8>', 1).toString('hex')).toEqual('0101');
        expect(bcs.de('option<u8>', '0101', 'hex')).toEqual(new BN(1));

        expect(bcs.ser('option<u8>', null).toString('hex')).toEqual('00');
        expect(bcs.de('option<u8>', '00', 'hex')).toEqual(null);

        bcs.registerVectorType('vector<option<u8>>', 'option<u8>');
        expect(bcs.ser('vector<option<u8>>', [1, 2, 3, null, null, 5]).toString('hex')).toEqual('0601010102010300000105');
        expect(bcs.de('vector<option<u8>>', '0601010102010300000105', 'hex')).toEqual([new BN(1), new BN(2), new BN(3), null, null, new BN(5)]);
    });
});
