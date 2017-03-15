
export function configure(config) {
    config.globalResources(
        './dialog/dialog',
        './form/pagination',

        './form/basic/checkbox',
        './form/basic/datepicker',
        './form/basic/dropdown',
        './form/basic/multiline',
        './form/basic/numeric',
        './form/basic/radiobutton',
        './form/basic/password',
        './form/basic/textbox',
        './form/basic/auto-suggest',
        './form/basic/timepicker',

        './customs/auto-suggests/budget-auto-suggest',
        './customs/auto-suggests/buyer-auto-suggest',
        './customs/auto-suggests/category-auto-suggest',
        './customs/auto-suggests/currency-auto-suggest',
        './customs/auto-suggests/delivery-order-auto-suggest',
        './customs/auto-suggests/delivery-order-auto-suggest-by-supplier',
        './customs/auto-suggests/division-auto-suggest',
        './customs/auto-suggests/sales-material-auto-suggest',
        './customs/auto-suggests/lamp-standard-auto-suggest',
        './customs/auto-suggests/machine-auto-suggest',
        './customs/auto-suggests/machine-auto-suggest-by-division',
        './customs/auto-suggests/purchase-order-auto-suggest',
        './customs/auto-suggests/purchase-order-auto-suggest-by-user',
        './customs/auto-suggests/purchase-order-external-auto-suggest',
        './customs/auto-suggests/purchase-request-auto-suggest',
        './customs/auto-suggests/purchase-request-auto-suggest-by-user',
        './customs/auto-suggests/purchase-request-auto-suggest-posted',
        './customs/auto-suggests/supplier-auto-suggest',
        './customs/auto-suggests/thread-auto-suggest',
        './customs/auto-suggests/unit-auto-suggest',
        './customs/auto-suggests/unit-payment-order-auto-suggest',
        './customs/auto-suggests/unit-receipt-note-auto-suggest',
        './customs/auto-suggests/uom-auto-suggest',
        './customs/auto-suggests/uster-auto-suggest',
        './customs/auto-suggests/vat-auto-suggest',
        //'./customs/auto-suggests/color-auto-suggest-by-production-order',
        './customs/auto-suggests/instruction-auto-suggest-by-filter',
        './customs/auto-suggests/production-order-auto-suggest',
        './customs/auto-suggests/step-auto-suggest',
        './customs/auto-suggests/order-type-auto-suggest',
        './customs/auto-suggests/process-type-auto-suggest',
        './customs/auto-suggests/material-construction-auto-suggest',
        './customs/auto-suggests/yarn-material-auto-suggest',
        './customs/auto-suggests/finish-type-auto-suggest',
        './customs/auto-suggests/standard-test-auto-suggest',
        './customs/auto-suggests/account-auto-suggest',
        './customs/auto-suggests/production-order-auto-suggest',
        './customs/auto-suggests/machine-type-auto-suggest',
        './customs/auto-suggests/account-auto-suggest',
        './customs/auto-suggests/machine-event-auto-suggest',
        './customs/auto-suggests/comodity-auto-suggest',
        './customs/auto-suggests/quality-auto-suggest',
        './customs/auto-suggests/account-bank-auto-suggest',
        './customs/auto-suggests/kanban-auto-suggest',
        './customs/auto-suggests/term-of-payment-auto-suggest',

        './customs/collections/account/role-item-collection',
        './customs/collections/role/role-permission-item-collection',
        './customs/collections/delivery-order/delivery-order-item-collection',
        './customs/collections/purchase-order/purchase-order-item-collection',
        './customs/collections/production-order/production-order-detail-collection',
        './customs/collections/purchase-order-external/purchase-order-external-item-collection',
        './customs/collections/purchase-request/purchase-request-item-collection',
        './customs/collections/unit-payment-order/unit-payment-order-item-collection',
        './customs/collections/unit-payment-price-correction-note/unit-payment-price-correction-note-collection',
        './customs/collections/unit-payment-quantity-correction-note/unit-payment-quantity-correction-note-collection',
        './customs/collections/unit-receipt-note/unit-receipt-note-item-collection',


        './customs/collections/machine-type/machine-type-indicator-collection',
        './customs/collections/monitoring-specification-machine/monitoring-specification-machine-collection',
        // './customs/collections/monitoring-event/monitoring-event-item-collection',

        './customs/collections/production-order-lamp-standard/production-order-lamp-standard-collection'
        // './customs/collections/monitoring-event/monitoring-event-item-collection'

    );
}
