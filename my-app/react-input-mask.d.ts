import * as React from 'react';
declare module 'react-input-mask' {
    export interface Props {
        mask: string | (string | RegExp);
        maskChar?: string;
        formatChars?: object;
        alwaysShowMask?: boolean;
        inputRef?: React.Ref<HTMLInputElement>;
        beforeMaskedValueChange?: (newState: any, oldState: any, userInput: string) => any;
        children?: React.ReactNode;
    }

    const ReactInputMask: React.FunctionComponent<Props>;
    export default ReactInputMask;
}
