"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
/**
 * TODO Add Support for Input Group Button
 */
var InputGroupAddonDirective = (function () {
    function InputGroupAddonDirective() {
    }
    return InputGroupAddonDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], InputGroupAddonDirective.prototype, "type", void 0);
InputGroupAddonDirective = __decorate([
    core_1.Directive({
        selector: "input-group-addon",
        host: {
            "[class.input-group-addon]": "true"
        }
    })
], InputGroupAddonDirective);
exports.InputGroupAddonDirective = InputGroupAddonDirective;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV4L2Zvcm1zL2lucHV0LWdyb3VwLWFkZG9uLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFpRDtBQUVqRDs7R0FFRztBQVFILElBQWEsd0JBQXdCO0lBQXJDO0lBS0EsQ0FBQztJQUFELCtCQUFDO0FBQUQsQ0FMQSxBQUtDLElBQUE7QUFGRztJQURDLFlBQUssRUFBRTs7c0RBQ3lCO0FBSHhCLHdCQUF3QjtJQU5wQyxnQkFBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLG1CQUFtQjtRQUM3QixJQUFJLEVBQUU7WUFDRiwyQkFBMkIsRUFBRSxNQUFNO1NBQ3RDO0tBQ0osQ0FBQztHQUNXLHdCQUF3QixDQUtwQztBQUxZLDREQUF3QiIsImZpbGUiOiJ1eC9mb3Jtcy9pbnB1dC1ncm91cC1hZGRvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIElucHV0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuXHJcbi8qKlxyXG4gKiBUT0RPIEFkZCBTdXBwb3J0IGZvciBJbnB1dCBHcm91cCBCdXR0b24gXHJcbiAqL1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogXCJpbnB1dC1ncm91cC1hZGRvblwiLFxyXG4gICAgaG9zdDoge1xyXG4gICAgICAgIFwiW2NsYXNzLmlucHV0LWdyb3VwLWFkZG9uXVwiOiBcInRydWVcIlxyXG4gICAgfVxyXG59KVxyXG5leHBvcnQgY2xhc3MgSW5wdXRHcm91cEFkZG9uRGlyZWN0aXZlIHtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIHR5cGU6IFwicHJlZml4XCIgfCBcInN1ZmZpeFwiO1xyXG5cclxufSJdLCJzb3VyY2VSb290IjoiLi9Db250ZW50L2FwcGxpY2F0aW9uIn0=
