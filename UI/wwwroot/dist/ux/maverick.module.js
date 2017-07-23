"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var maverick_forms_module_1 = require("./forms/maverick-forms.module");
var MaverickModule = (function () {
    function MaverickModule() {
    }
    return MaverickModule;
}());
MaverickModule = __decorate([
    core_1.NgModule({
        imports: [
            maverick_forms_module_1.MaverickFormsModule
        ],
        exports: [
            maverick_forms_module_1.MaverickFormsModule
        ]
    })
], MaverickModule);
exports.MaverickModule = MaverickModule;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV4L21hdmVyaWNrLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLHNDQUF5QztBQUV6Qyx1RUFBb0U7QUFVcEUsSUFBYSxjQUFjO0lBQTNCO0lBQThCLENBQUM7SUFBRCxxQkFBQztBQUFELENBQTlCLEFBQStCLElBQUE7QUFBbEIsY0FBYztJQVIxQixlQUFRLENBQUM7UUFDTixPQUFPLEVBQUU7WUFDTCwyQ0FBbUI7U0FDdEI7UUFDRCxPQUFPLEVBQUU7WUFDTCwyQ0FBbUI7U0FDdEI7S0FDSixDQUFDO0dBQ1csY0FBYyxDQUFJO0FBQWxCLHdDQUFjIiwiZmlsZSI6InV4L21hdmVyaWNrLm1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuXHJcbmltcG9ydCB7IE1hdmVyaWNrRm9ybXNNb2R1bGUgfSBmcm9tIFwiLi9mb3Jtcy9tYXZlcmljay1mb3Jtcy5tb2R1bGVcIjtcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbICAgXHJcbiAgICAgICAgTWF2ZXJpY2tGb3Jtc01vZHVsZVxyXG4gICAgXSxcclxuICAgIGV4cG9ydHM6IFtcclxuICAgICAgICBNYXZlcmlja0Zvcm1zTW9kdWxlXHJcbiAgICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNYXZlcmlja01vZHVsZSB7IH0iXSwic291cmNlUm9vdCI6Ii4vQ29udGVudC9hcHBsaWNhdGlvbiJ9
