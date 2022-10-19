// Copyright (c) Kernel Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/*
 * BCS implementation {@see https://github.com/diem/bcs } for JavaScript.
 * Intended to be used for Move applications; supports both NodeJS and browser.
 *
 * Extending Mysten Lab's BCS library to support optional data.
 */


import { bcs, BcsWriter, BcsReader, TypeInterface, encodeStr, decodeStr } from "@mysten/bcs";
import { toB64, fromB64, fromHEX, toHEX } from "@mysten/bcs";

export { toB64, fromB64, fromHEX, toHEX };
export { ExtendedBcs as bcs, BcsWriter, BcsReader, TypeInterface, encodeStr, decodeStr };

class ExtendedBcs extends bcs {
    public static registerOptionType(name: string, valueType: string) {
        return this.registerType(
            name,
            (writer: BcsWriter, data: any) => writeOption(writer, data, (writer: BcsWriter, val: any) => {
                return bcs.getTypeInterface(valueType)._encodeRaw(writer, val);
            }),
            (reader: BcsReader) => readOption(reader, (reader: BcsReader) => {
                return bcs.getTypeInterface(valueType)._decodeRaw(reader);
            })
        );

    }
}

function writeOption(
    writer: BcsWriter,
    value: any,
    cb: (writer: BcsWriter, value: any) => {}
): BcsWriter {
    if (value != null) {
        writer.write8(1);
        cb(writer, value);
    }
    else {
        writer.write8(0);
    }
    return writer;
}

function readOption(reader: BcsReader, cb: (reader: BcsReader) => any): any {
    let isSome = reader.read8().toString(10) === '1';
    if (!isSome) {
        return null;
    }
    return cb(reader);
}