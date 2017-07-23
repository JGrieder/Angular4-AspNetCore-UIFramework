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
var FormControlFeedbackDirective = (function () {
    function FormControlFeedbackDirective() {
    }
    return FormControlFeedbackDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], FormControlFeedbackDirective.prototype, "type", void 0);
FormControlFeedbackDirective = __decorate([
    core_1.Directive({
        selector: "form-control-feedback",
        host: {
            "[class.form-control-feedback]": "true"
        }
    })
], FormControlFeedbackDirective);
exports.FormControlFeedbackDirective = FormControlFeedbackDirective;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV4L2Zvcm1zL2Zvcm0tY29udHJvbC1mZWVkYmFjay5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBaUQ7QUFRakQsSUFBYSw0QkFBNEI7SUFBekM7SUFJQSxDQUFDO0lBQUQsbUNBQUM7QUFBRCxDQUpBLEFBSUMsSUFBQTtBQURHO0lBREMsWUFBSyxFQUFFOzswREFDcUM7QUFIcEMsNEJBQTRCO0lBTnhDLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsdUJBQXVCO1FBQ2pDLElBQUksRUFBRTtZQUNGLCtCQUErQixFQUFFLE1BQU07U0FDMUM7S0FDSixDQUFDO0dBQ1csNEJBQTRCLENBSXhDO0FBSlksb0VBQTRCIiwiZmlsZSI6InV4L2Zvcm1zL2Zvcm0tY29udHJvbC1mZWVkYmFjay5kaXJlY3RpdmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIElucHV0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6IFwiZm9ybS1jb250cm9sLWZlZWRiYWNrXCIsXHJcbiAgICBob3N0OiB7XHJcbiAgICAgICAgXCJbY2xhc3MuZm9ybS1jb250cm9sLWZlZWRiYWNrXVwiOiBcInRydWVcIlxyXG4gICAgfVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRm9ybUNvbnRyb2xGZWVkYmFja0RpcmVjdGl2ZSB7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyB0eXBlOiBcImVycm9yXCIgfCBcInN1Y2Nlc3NcIiB8IFwid2FybmluZ1wiO1xyXG59Il0sInNvdXJjZVJvb3QiOiIuL0NvbnRlbnQvYXBwbGljYXRpb24ifQ==
