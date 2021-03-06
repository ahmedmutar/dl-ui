import { inject, bindable, computedFrom } from 'aurelia-framework';
import { Service } from "./service";

let InspectionAreaLoader = require("../../../loader/input-inspection-material-loader");

@inject(Service)
export class DataForm {
    @bindable title;
    @bindable readOnly;
    @bindable data;
    @bindable error;
    formOptions = {
        cancelText: "Kembali",
        saveText: "Simpan",
        deleteText: "Hapus",
        editText: "Ubah",
    }
    controlOptions = {
        label: {
            length: 4,
        },
        control: {
            length: 4,
        },
    };
    itemColumns = ["No. SPP", "No. Kereta", "Material", "Unit", "Buyer", "Warna", "Motif", "Keterangan", "Grade", "Satuan", "Saldo"];
    shifts = ["PAGI", "SIANG"];
    detailOptions = {};
    destinationAreas = ["TRANSIT", "PACKING", "GUDANG AVAL"];
    areas = ["INSPECTION MATERIAL", "PROD", "TRANSIT", "PACK", "GUDANG JADI", "SHIP", "AWAL", "LAB"]
    constructor(service) {
        this.service = service;
    }

    get inspectionAreaLoader() {
        return InspectionAreaLoader;
    }

    areaMovementTextFormatter = (areaInput) => {
        return `${areaInput.bonNo}`
    }
    @computedFrom("data.id")
    get isEdit() {
        return (this.data.id || '').toString() != '';
    }

    bind(context) {
        this.context = context;
        this.data = this.context.data;

        this.data.area = "INSPECTION MATERIAL";

        this.error = this.context.error;
        this.cancelCallback = this.context.cancelCallback;
        this.deleteCallback = this.context.deleteCallback;
        this.editCallback = this.context.editCallback;
        this.saveCallback = this.context.saveCallback;
        if (this.data.bonNo) {
            this.selectedInspectionMaterial = {};
            this.selectedInspectionMaterial.bonNo = this.data.bonNo;
        }

        if (this.data.destinationArea) {
            this.destinationArea = this.data.destinationArea;
        }

    }
    addItemCallback = (e) => {
        this.data.inspectionMaterialProductionOrders = this.data.inspectionMaterialProductionOrders || [];
        this.data.inspectionMaterialProductionOrders.push({})
    };

    @bindable selectedInspectionMaterial;
    selectedInspectionMaterialChanged(n, o) {
        if (this.selectedInspectionMaterial) {
            this.data.inputInspectionMaterialId = this.selectedInspectionMaterial.id;
            if (this.selectedInspectionMaterial.inspectionMaterialProductionOrders) {
                this.data.inspectionMaterialProductionOrders = this.selectedInspectionMaterial.inspectionMaterialProductionOrders.filter(s => s.isChecked == true && s.hasOutputDocument == false);
            }

        }

    }


    @bindable destinationArea;
    destinationAreaChanged(n, o) {
        if (this.destinationArea) {
            this.data.destinationArea = this.destinationArea;
            this.detailOptions.destinationArea = this.data.destinationArea;

            if (!this.data.id) {

                this.selectedInspectionMaterial = null;
                this.data.inspectionMaterialProductionOrders = [];
            }
        }
    }

    ExportToExcel() {
        this.service.generateExcel(this.data.id);
    }
}


