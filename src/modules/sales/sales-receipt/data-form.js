import {
  bindable,
  inject,
  containerless,
  computedFrom,
  BindingEngine,
} from "aurelia-framework";
import { BindingSignaler } from "aurelia-templating-resources";
import { Service, ServiceCore } from "./service";

var BuyersLoader = require("../../../loader/buyers-loader");
var BankLoader = require("../../../loader/account-banks-loader");
var CurrencyLoader = require("../../../loader/currency-loader");
var UnitLoader = require("../../../loader/unit-loader");
var SalesInvoiceLoader = require("../../../loader/sales-invoice-loader");

@containerless()
@inject(Service, ServiceCore, BindingSignaler, BindingEngine)
export class DataForm {
  @bindable title;
  @bindable readOnly;
  @bindable data;
  @bindable error;

  mediumControlOptions = {
    control: {
      length: 6,
    },
  };

  smallControlOptions = {
    control: {
      length: 2,
    },
  };

  constructor(service, serviceCore, bindingSignaler, bindingEngine) {
    this.service = service;
    this.serviceCore = serviceCore;
    this.signaler = bindingSignaler;
    this.bindingEngine = bindingEngine;
  }

  @computedFrom("data.Id")
  get isEdit() {
    return (this.data.Id || "").toString() !== "";
  }

  async bind(context) {
    this.context = context;
    this.context._this = this;
    this.data = this.context.data;
    this.error = this.context.error;

    this.TotalPaid = this.data.TotalPaid;
    this.data.TotalPaid = this.getTotalPaid;

    if (this.data.Buyer && this.data.Buyer.Id) {
      // this.selectedBuyer = await this.serviceCore.getBuyerById(
      //   this.data.Buyer.Id
      // );
      this.selectedBuyer = this.data.Buyer;
    }

    if (this.data.Bank && this.data.Bank.Id) {
      this.selectedBank = await this.serviceCore.getBankById(this.data.Bank.Id);
      // this.selectedBank = this.data.Bank;
    }

    if (this.data.Currency && this.data.Currency.Id) {
      this.selectedCurrency = await this.serviceCore.getCurrencyById(
        this.data.Currency.Id
      );
      // this.selectedCurrency = this.data.Currency;
    }

    if (this.data.Unit && this.data.Unit.Id) {
      this.selectedUnit = await this.serviceCore.getUnitById(this.data.Unit.Id);
      // this.selectedUnit = this.data.Unit;
    }

    if (this.data.SalesReceiptDate) {
      this.salesInvoiceTableOptions.SalesReceiptDate = this.data.SalesReceiptDate;
      this.SalesReceiptDate = this.data.SalesReceiptDate;
    }

    if (this.data.TotalPaid) {
      this.TotalPaid = this.data.TotalPaid;
      this.data.TotalPaid = this.getTotalPaid;
    }
  }

  get getTotalPaid() {
    var result = 0;
    if (this.data.SalesReceiptDetails) {
      for (var item of this.data.SalesReceiptDetails) {
        result += item.Nominal;
      }
    }
    this.data.TotalPaid = result;
    return result;
  }

  salesReceiptDetailsInfo = {
    columns: [
      "No. Faktur Jual",
      "Tempo (hari)",
      "Total Harga",
      "Sisa Pembayaran",
      "Total Pembayaran",
      "Akumulasi",
      "Lunas",
    ],
  };

  salesInvoiceTableOptions = {};

  enterDelegate(event) {
    if (event.charCode === 13) {
      event.preventDefault();
      return false;
    } else return true;
  }

  @bindable SalesReceiptDate;
  SalesReceiptDateChanged(newValue, oldValue) {
    if (this.SalesReceiptDate) {
      this.salesInvoiceTableOptions.SalesReceiptDate = this.SalesReceiptDate;
    }
    this.data.SalesReceiptDate = this.SalesReceiptDate;
  }

  @bindable selectedBuyer;
  // async 
  selectedBuyerChanged(newValue, oldValue) {
    // if (this.selectedBuyer && this.selectedBuyer.Id) {
    if (newValue) {
      this.data.Buyer = {};
      this.data.Buyer.Id = this.selectedBuyer.Id;
      this.data.Buyer.Name = this.selectedBuyer.Name;
      this.data.Buyer.Address = this.selectedBuyer.Address;
      // var salesInvoice = await this.service.getSalesInvoiceByBuyerId(
      //   this.data.Buyer.Id
      // );
      // if (this.selectedBuyer && this.selectedBuyer.Id) {
      //   var invoiceData = salesInvoice.data;
      //   if (!this.data.Id) {
      //     this.data.SalesReceiptDetails = [];
      //     for (var item of invoiceData) {
      //       if (item.Currency.Id == this.data.Bank.CurrencyId) {
      //         var invoice = {
      //           SalesInvoice: item,
      //           Currency: item.Currency,
      //           DueDate: item.DueDate,
      //           TotalPayment: item.TotalPayment,
      //           TotalPaid: item.TotalPaid,
      //         };
      //         this.data.SalesReceiptDetails.push(invoice);
      //       }
      //     }
      //   }
      // }
    } else {
      this.data.Buyer.Id = null;
      this.data.Buyer.Name = null;
      this.data.Buyer.Address = null;
    }
  }

  @bindable selectedBank;
  async selectedBankChanged(newValue, oldValue) {
    // if (this.selectedBank && this.selectedBank.Id) {
    if (newValue) {
      this.data.Bank = {};
      this.data.Bank.Id = this.selectedBank.Id;
      this.data.AccountCOA = this.selectedBank.AccountCOA;
      this.data.Bank.AccountName = this.selectedBank.AccountName;
      this.data.Bank.AccountNumber = this.selectedBank.AccountNumber;
      this.data.Bank.BankName = this.selectedBank.BankName;
      this.data.Bank.Code = this.selectedBank.BankCode;
      this.data.Bank.CurrencyId = this.selectedBank.Currency.Id;

      var salesInvoice = await this.service.getSalesInvoiceByBuyerId(
        this.data.Buyer.Id
      );
      if (this.selectedBuyer && this.selectedBuyer.Id) {
        var invoiceData = salesInvoice.data;
        if (!this.data.Id) {
          this.data.SalesReceiptDetails = [];
          for (var item of invoiceData) {
            if (item.Currency.Id == this.data.Bank.CurrencyId) {
              var invoice = {
                SalesInvoice: item,
                Currency: item.Currency,
                DueDate: item.DueDate,
                TotalPayment: item.TotalPayment,
                TotalPaid: item.TotalPaid,
              };
              this.data.SalesReceiptDetails.push(invoice);
            }
          }
        }
      }
      
    } else {
      this.data.Bank.Id = null;
      this.data.AccountCOA = null;
      this.data.Bank.AccountName = null;
      this.data.Bank.AccountNumber = null;
      this.data.Bank.BankName = null;
      this.data.Bank.Code = null;
    }
  }

  @bindable selectedCurrency;
  selectedCurrencyChanged(newValue, oldValue) {
    // if (this.selectedCurrency && this.selectedCurrency.Id) {
    if (newValue) {
      this.data.Currency = {};
      this.data.Currency.Id = this.selectedCurrency.Id;
      this.data.Currency.Code = this.selectedCurrency.Code;
      this.data.Currency.Rate = this.selectedCurrency.Rate;
      this.data.Currency.Symbol = this.selectedCurrency.Symbol;
    } else {
      this.data.Currency.Id = null;
      this.data.Currency.Code = null;
      this.data.Currency.Rate = null;
      this.data.Currency.Symbol = null;
    }
  }

  @bindable selectedUnit;
  selectedUnitChanged(newValue, oldValue) {
    // if (this.selectedUnit && this.selectedUnit.Id) {
    if (newValue) {
      this.data.Unit = {};
      this.data.Unit.Id = this.selectedUnit.Id;
      this.data.Unit.Name = this.selectedUnit.Name;
    } else {
      this.data.Unit.Id = null;
      this.data.Unit.Name = null;
    }
  }

  get buyersLoader() {
    return BuyersLoader;
  }
  get bankLoader() {
    return BankLoader;
  }
  get currencyLoader() {
    return CurrencyLoader;
  }
  get unitLoader() {
    return UnitLoader;
  }
  get salesInvoiceLoader() {
    return SalesInvoiceLoader;
  }

  bankView = (bank) => {
    return bank.AccountName
      ? `${bank.BankName} ${bank.AccountName} ${bank.AccountNumber} (${bank.Currency.Code})`
      : "";
  };
}
