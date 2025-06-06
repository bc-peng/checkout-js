import creditCardType from 'credit-card-type';
import { FieldProps } from 'formik';
import { max } from 'lodash';
import React, {
    ChangeEventHandler,
    createRef,
    FunctionComponent,
    memo,
    PureComponent,
    ReactNode,
    RefObject,
    useCallback,
    useMemo,
} from 'react';

import { TranslatedString } from '@bigcommerce/checkout/locale';
import { FormField, IconLock, TextInput } from '@bigcommerce/checkout/ui';

import formatCreditCardNumber from '../formatCreditCardNumber/formatCreditCardNumber';

export interface CreditCardNumberFieldProps {
    name: string;
}

class CreditCardNumberInput extends PureComponent<FieldProps<string>> {
    private inputRef: RefObject<HTMLInputElement> = createRef();
    private nextSelectionEnd = 0;

    componentDidUpdate(): void {
        if (this.inputRef.current && this.inputRef.current.selectionEnd !== this.nextSelectionEnd) {
            this.inputRef.current.setSelectionRange(this.nextSelectionEnd, this.nextSelectionEnd);
        }
    }

    render(): ReactNode {
        const { field } = this.props;

        return (
            <>
                <TextInput
                    {...field}
                    additionalClassName="has-icon"
                    autoComplete="cc-number"
                    id={field.name}
                    onChange={this.handleChange}
                    ref={this.inputRef}
                    type="tel"
                />

                <IconLock />
            </>
        );
    }

    private handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const separator = ' ';
        const { value = '' } = event.target;
        const { field, form } = this.props;
        const { name, value: previousValue = '' } = field;
        const selectionEnd = this.inputRef.current && this.inputRef.current.selectionEnd;

        // Only allow digits and spaces
        if (new RegExp(`[^\\d${separator}]`).test(value)) {
            return form.setFieldValue(name, previousValue);
        }

        const maxLength = max(creditCardType(value).map((info) => max(info.lengths)));

        const formattedValue = formatCreditCardNumber(
            value.replace(new RegExp(separator, 'g'), '').slice(0, maxLength),
            separator,
        );

        if (selectionEnd === value.length && value.length < formattedValue.length) {
            this.nextSelectionEnd = formattedValue.length;
        } else {
            this.nextSelectionEnd = selectionEnd || 0;
        }

        return form.setFieldValue(name, formattedValue);
    };
}

const CreditCardNumberField: FunctionComponent<CreditCardNumberFieldProps> = ({ name }) => {
    const renderInput = useCallback(
        ({ field, form, meta }: FieldProps<string>) => (
            <CreditCardNumberInput field={field} form={form} meta={meta} />
        ),
        [],
    );

    const labelContent = useMemo(
        () => <TranslatedString id="payment.credit_card_number_label" />,
        [],
    );

    return (
        <FormField
            additionalClassName="form-field--ccNumber"
            input={renderInput}
            labelContent={labelContent}
            name={name}
        />
    );
};

export default memo(CreditCardNumberField);
