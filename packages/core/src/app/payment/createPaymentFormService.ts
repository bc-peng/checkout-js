import { FormikContextType } from 'formik';

import {
    PaymentFormService,
    PaymentFormValues,
} from '@bigcommerce/checkout/payment-integration-api';
import { FormContextType } from '@bigcommerce/checkout/ui';

import { PaymentContextProps } from './PaymentContext';

export default function createPaymentFormService(
    formikContext: FormikContextType<PaymentFormValues>,
    formContext: FormContextType,
    paymentContext: PaymentContextProps,
): PaymentFormService {
    const {
        setFieldTouched,
        setFieldValue,
        submitForm,
        validateForm,
        values,
    } = formikContext;

    const { isSubmitted, setSubmitted } = formContext;

    const { disableSubmit, setSubmit, setValidationSchema, hidePaymentSubmitButton } =
        paymentContext;

    const getFieldValue = <T>(key: string): T | unknown => values[key];

    return {
        disableSubmit,
        getFieldValue,
        getFormValues: () => values,
        hidePaymentSubmitButton,
        isSubmitted: () => isSubmitted,
        setFieldTouched: setFieldTouched as PaymentFormService['setFieldTouched'],
        setFieldValue: setFieldValue as PaymentFormService['setFieldValue'],
        setSubmit,
        setSubmitted,
        setValidationSchema,
        submitForm,
        validateForm,
    };
}
