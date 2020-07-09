import { bindable, inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { activationStrategy } from 'aurelia-router';
import moment from 'moment';
import numeral from 'numeral';
import { Service } from './service';
import VBWithPORequestService from '../shared/vb-with-po-request-service';
import VBNonPORequestService from '../shared/vb-non-po-request-service';
import { PermissionHelper } from '../../../utils/permission-helper';
import { PO, NONPO  } from '../shared/permission-constants';
import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api"
const VBWithPOLoader = require('../../../loader/vb-with-po-request-loader');
const VBNonPOLoader = require('../../../loader/vb-non-po-request-loader');
const UnitLoader = require('../../../loader/unit-loader');

@inject(Router, Service, VBWithPORequestService, VBNonPORequestService, PermissionHelper)
export class Create {
    columnsWithPO = [
        { field: "Approve_Status", checkbox: true, sortable: false },
        { field: "VBNo", title: "No VB" },
        {
            field: "Date", title: "Tgl VB", formatter: function (value, data, index) {
                return moment.utc(value).local().format('DD MMM YYYY');
            },
        },
        {
            field: "Amount", title: "VB Uang", formatter: function (value, data, index) {
                return numeral(value).format('0,000.0000');
            },
        },
        { field: "CreateBy", title: "Pemohon" },
        { field: "UnitName", title: "Unit" },
    ];

    columnsNonPO = [
        { field: "Approve_Status", checkbox: true, sortable: false },
        { field: "VBNo", title: "No VB" },
        {
            field: "Date", title: "Tgl VB", formatter: function (value, data, index) {
                return moment.utc(value).local().format('DD MMM YYYY');
            },
        },
        {
            field: "Amount", title: "VB Uang", formatter: function (value, data, index) {
                return numeral(value).format('0,000.0000');
            },
        },
        { field: "CurrencyCode", title: "Mata Uang" },
        { field: "CreateBy", title: "Pemohon" },
        { field: "UnitName", title: "Unit" },
    ];

    tableOptions = {
        pagination: false,
        showColumns: false,
        search: false,
        showToggle: false,
    };

    filterWithPO={
        "VBRequestCategory":"PO"
    }

    filterNonPO={
        "VBRequestCategory":"NONPO"
    }

    formOptions = {
        cancelText: "Kembali",
        saveText: "Simpan",
    };

    @bindable vbWithPO;
    @bindable vbNonPO;
    @bindable unit;
    @bindable date;

    async activate(params) {
        params.role.position=parseInt(params.role.position);
        params.role.hasPermission=true;
        params.role.positionAutocomplete=parseInt(params.role.positionAutocomplete);
        this.activeRole = params.role;
    }

    constructor(router, service, vbWithPORequestService, vbNonPORequestService, permissionHelper) {
        this.router = router;
        this.service = service;
        this.vbWithPORequestService = vbWithPORequestService;
        this.vbNonPORequestService = vbNonPORequestService;

        this.selectVB = ['VBNo'];
        this.selectUnit = ['Name'];
        this.selectDate = ['Date'];
        this.documentData = [];
        this.selectedItems = [];

        this.permissions = permissionHelper.getUserPermissions();
        this.initPermission();
    }

    initPermission() {
        this.roles = [PO, NONPO];
        this.accessCount = 0;

        for (let i = this.roles.length - 1; i >= 0; i--) {
            if (this.permissions.hasOwnProperty(this.roles[i].code)) {
                this.roles[i].hasPermission = true;
                this.accessCount++;
                this.activeRole = this.roles[i];
            }
        }
    }

    changeRole(role) {
        if (role.key !== this.activeRole.key) {
            this.activeRole = role;
            this.selectedItems.splice(0, this.selectedItems.length);
            this.documentData.splice(0, this.documentData.length);
            this.documentTable.refresh();
        }
    }

    vbWithPOChanged(newValue, oldValue) {
        if (newValue) {
            this.vbWithPO = newValue;
        } else if (oldValue) {
            this.vbWithPO == null;
        }else{
            this.vbWithPO == null;
        }
    }

    vbNonPOChanged(newValue, oldValue) {
        if (newValue) {
            this.vbNonPO = newValue;
        } else if (oldValue) {
            this.vbNonPO == null;
        }else{
            this.vbNonPO == null;
        }
    }

    unitChanged(newValue, oldValue){
        if (newValue) {
            console.log(newValue)
            this.unit = newValue;
        } else if (oldValue) {
            this.unit == null;
        }else{
            this.unit == null;
        }
    }

    dateChanged(newValue, oldValue) {
        if (newValue) {
            this.date = newValue;
        } else if (oldValue) {
            this.date == null;
        }else{
            this.date == null;
        }
    }

    determineActivationStrategy() {
        return activationStrategy.replace;
    }

    search() {
        let filter = { 
            VBRequestCategory: this.activeRole.key,
            Apporve_Status: false,
        };

        if (this.vbWithPO)
            filter.VBNo = this.vbWithPO.VBNo;
            
        if (this.vbNonPO)
            filter.VBNo = this.vbNonPO.VBNo;

        if (this.unit)
            filter.UnitName = this.unit.Name;

        if (this.date){
            filter.Date = this.date != "Invalid Date" ? moment(this.date).format("YYYY-MM-DD") : null;
        }

        let arg = {
            page: 1,
            size: 255,
            filter: JSON.stringify(filter),
        };

        if(this.activeRole.key === 'PO') {
            this.vbWithPORequestService.search(arg)
            .then(result => {
                var CashierApproval=[];
                for(var data of result.data){
                    var config = Container.instance.get(Config);
                    var _endpoint = config.getEndpoint("finance");
                    const resource = `vb-with-po-request/${data.Id}`;
                    var apprv=  _endpoint.find(resource);
                        // .then(result => {
                        //     var dispoData= result.data;
                        //     return dispoData.CreatedBy;
                        // });
                     CashierApproval.push(apprv);
                }
                Promise.all(CashierApproval).then(dispo=>{
                    var dataCashierApproval=[];
                    for(var dataResult of dispo){
                        dataCashierApproval.push(dataResult.data);
                    }
                    for(var data of result.data){
                        var same= dataCashierApproval.find(a=>a.Id==data.Id);
                        if(same){
                            // data.totalPaid=same.DPP+same.VatValue;
                            // if(same.IncomeTaxBy=="Supplier"){
                            //     data.totalPaid=same.DPP+same.VatValue-same.IncomeTaxValue;
                            // }
                            data.CreatedBy=same.CreatedBy;
                        }
                    }
                    this.selectedItems.splice(0, this.selectedItems.length);
                    this.documentData.splice(0, this.documentData.length);
                    this.documentData.push(...result.data)
                    this.documentTable.refresh();
                })
                
            });
        } else if(this.activeRole.key === 'NONPO') {
            this.vbNonPORequestService.search(arg)
            .then(result => {
                var CashierApproval=[];
                for(var data of result.data){
                    var config = Container.instance.get(Config);
                    var _endpoint = config.getEndpoint("finance");
                    const resource = `vb-non-po-request/${data.Id}`;
                    var apprv=  _endpoint.find(resource);
                        // .then(result => {
                        //     var dispoData= result.data;
                        //     return dispoData.CreatedBy;
                        // });
                     CashierApproval.push(apprv);
                }
                Promise.all(CashierApproval).then(dispo=>{
                    var dataCashierApproval=[];
                    for(var dataResult of dispo){
                        dataCashierApproval.push(dataResult.data);
                    }
                    for(var data of result.data){
                        var same= dataCashierApproval.find(a=>a.Id==data.Id);
                        if(same){
                            // data.totalPaid=same.DPP+same.VatValue;
                            // if(same.IncomeTaxBy=="Supplier"){
                            //     data.totalPaid=same.DPP+same.VatValue-same.IncomeTaxValue;
                            // }
                            data.CreatedBy=same.CreatedBy;
                        }
                    }
                    this.selectedItems.splice(0, this.selectedItems.length);
                    this.documentData.splice(0, this.documentData.length);
                    this.documentData.push(...result.data)
                    this.documentTable.refresh();
                })
                
            });
        }

        
    }

    cancelCallback(event) {
        this.router.navigateToRoute('list');
    }

    saveCallback(event) {
        let data = {
            VBRequestCategory: this.activeRole.key,
            CashierApproval: [],
        };

        for (let s of this.selectedItems) {
            data.CashierApproval.push({
                Id: s.Id,
                VBNo: s.VBNo,
            });
        }

        this.service.create(data)
            .then(result => {
                alert("Data berhasil dibuat");
                this.router.navigateToRoute('create', {role:this.activeRole}, { replace: true, trigger: true });
            })
            .catch(e => {
                this.error = e;
            });
    }

    get vbWithPOLoader() {
        return VBWithPOLoader;
    }

    get vbNonPOLoader() {
        return VBNonPOLoader;
    }

    get unitLoader() {
        return UnitLoader;
    }

    vbNonPOView = (vbNonPO) => {
        return vbNonPO.VBNo
    }

    vbWithPOView = (vbWithPO) => {
        return vbWithPO.VBNo
    }

    unitView = (unit) => {
        return `${unit.Code} - ${unit.Name}`

    }

}