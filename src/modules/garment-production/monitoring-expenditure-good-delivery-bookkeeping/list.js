import {inject} from 'aurelia-framework';
import {Service} from "./service";
import {Router} from 'aurelia-router';
import moment from 'moment';
const UnitLoader = require('../../../loader/garment-units-loader');

@inject(Router, Service)
export class List {
    constructor(router, service) {
        this.service = service;
        this.router = router;

    }
    bind(context) {
        this.context = context;
    }
    
    searching() {
        var info = {
            unit : this.unit ? this.unit.Id : "",
            dateFrom : this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : "",
            dateTo : this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : ""
        }
        this.service.search(info)
            .then(result => {
                this.data=[];
                console.log(result);
                for(var _data of result){
                      
                    _data.expenditureDate= moment(_data.expenditureDate).format("YYYY-MM-DD");
                    _data.price=_data.price.toLocaleString('en-EN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    _data.qty=_data.qty.toLocaleString('en-EN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    this.data.push(_data);

                 }
            });
    }
    
    ExportToExcel() {
        var info = {
            unit : this.unit ? this.unit.Id : "",
            dateFrom : this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : "",
            dateTo : this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : "",
            type:"bookkeeping"
      
        }
        this.service.generateExcel(info);
    }

    get unitLoader(){
        return UnitLoader;
    }
    unitView = (unit) => {
        return `${unit.Code} - ${unit.Name}`;
    
    }

    
    reset() {
        this.dateFrom = null;
        this.dateTo = null;
        this.unit = null;
    }
}