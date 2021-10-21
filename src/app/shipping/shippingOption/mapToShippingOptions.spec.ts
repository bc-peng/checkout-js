import { createCheckoutService, Cart, CheckoutService } from '@bigcommerce/checkout-sdk';

import { getCart } from '../../cart/carts.mock';
import { getPhysicalItem } from '../../cart/lineItem.mock';
import { CheckoutContextProps } from '../../checkout';
import { getCheckout } from '../../checkout/checkouts.mock';
import { getStoreConfig } from '../../config/config.mock';
import { getCustomer } from '../../customer/customers.mock';
import { getConsignment } from '../consignment.mock';

import { mapToShippingOptions } from './ShippingOptions';

describe('mapToShippingProps()', () => {
    let checkoutContextProps: CheckoutContextProps;
    let checkoutService: CheckoutService;

    beforeEach(() => {
        checkoutService = createCheckoutService();

        checkoutContextProps = {
            checkoutService,
            checkoutState: checkoutService.getState(),
        };

    });

    it('returns null when not initialized', () => {
        expect(mapToShippingOptions(checkoutContextProps, {
            shouldShowShippingOptions: true,
            isMultiShippingMode: true,
        })).toEqual(null);
    });

    it('returns sorted consignments with respect to line-items order', () => {
        const unsortedConsignments = [
            {
                ...getConsignment(),
                id: 'lineItem2',
                lineItemIds: ['shouldComeLast'],
            },
            {
                ...getConsignment(),
                id: 'lineItem1',
                lineItemIds: ['666'],
            },
        ];
        const sortedConsignments = [
            unsortedConsignments[1],
            unsortedConsignments[0],
        ];

        jest.spyOn(checkoutService.getState().data, 'getCheckout').mockReturnValue(getCheckout());
        jest.spyOn(checkoutService.getState().data, 'getConfig').mockReturnValue(getStoreConfig());
        jest.spyOn(checkoutService.getState().data, 'getCustomer').mockReturnValue(getCustomer());
        jest.spyOn(checkoutService.getState().data, 'getConsignments').mockReturnValue(unsortedConsignments);
        jest.spyOn(checkoutService.getState().data, 'getCart').mockReturnValue({
            ...getCart(),
            lineItems: {
                physicalItems: [
                    getPhysicalItem(),
                    {...getPhysicalItem(), id: 'shouldComeLast'},
                    ],
            },
        } as Cart);

        expect(mapToShippingOptions(checkoutContextProps, {
            shouldShowShippingOptions: true,
            isMultiShippingMode: true,
        })?.consignments).toEqual(sortedConsignments);
    });
});
