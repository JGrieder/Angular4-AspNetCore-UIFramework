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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
/**
 * TODO: Support Masking
 *       Reference text-mask on GitHub
 *       Translate the shared Javascript Code into Angular Service?
 * TODO: Check to see if parent form has no-validate enabled
 *
 */
var InputDirective = (function () {
    function InputDirective(_elementRef, _renderer, ngControl, _parentForm, _parentFormGroup) {
        var _this = this;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this.ngControl = ngControl;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        this._type = "text";
        this._disabled = false;
        this._required = false;
        this._placeholder = "";
        this.focused = false;
        this._neverEmptyInputTypes = ["date", "datetime", "datetime-local", "month", "time", "week"]
            .filter(function (t) { return _this.getSupportedInputTypes().has(t); });
    }
    Object.defineProperty(InputDirective.prototype, "disabled", {
        get: function () { return this.ngControl ? this.ngControl.disabled : this._disabled; },
        set: function (value) { this._disabled = value != null && "" + value !== "false"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputDirective.prototype, "id", {
        get: function () { return this._id; },
        set: function (value) { this._id = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputDirective.prototype, "required", {
        get: function () { return this._required; },
        set: function (value) { this._required = value != null && "" + value !== "false"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputDirective.prototype, "type", {
        get: function () { return this._type; },
        set: function (value) {
            this._type = value || "text";
            this._validateType();
            if (!this.isTextArea() && this.getSupportedInputTypes().has(this._type)) {
                this._renderer.setProperty(this._elementRef.nativeElement, "type", this._type);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputDirective.prototype, "placeholder", {
        get: function () { return this._placeholder; },
        set: function (value) { this._placeholder = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputDirective.prototype, "formNoValidate", {
        get: function () { return this._formNoValidate; },
        set: function (value) { this._formNoValidate = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputDirective.prototype, "value", {
        get: function () { return this._elementRef.nativeElement.value; },
        set: function (value) { this._elementRef.nativeElement.value = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputDirective.prototype, "empty", {
        get: function () {
            return !this._isNeverEmpty() &&
                (this.value == null || this.value === "") &&
                !this._isBadInput();
        },
        enumerable: true,
        configurable: true
    });
    //Public Methods
    InputDirective.prototype.focus = function () { this._elementRef.nativeElement.focus(); };
    InputDirective.prototype.isWarningState = function () {
        if (this.formNoValidate)
            return false;
        if (!this.required && this.empty)
            return false;
        var control = this.ngControl;
        var isInvalid = control && control.invalid;
        var isTouched = control && control.touched;
        var isSubmitted = (this._parentFormGroup && this._parentFormGroup.submitted) ||
            (this._parentForm && this._parentForm.submitted);
        return (isInvalid && (isTouched || isSubmitted));
    };
    InputDirective.prototype.isSuccessState = function () {
        if (this.empty)
            return false;
        if (this.formNoValidate)
            return false;
        var control = this.ngControl;
        var isValid = control && control.valid;
        var isTouched = control && control.touched;
        return isTouched && isValid;
    };
    InputDirective.prototype.isErrorState = function () {
        if (this.empty)
            return false;
        if (this.formNoValidate)
            return false;
        var control = this.ngControl;
        var isTouched = control && control.touched;
        var isSubmitted = (this._parentFormGroup && this._parentFormGroup.submitted) ||
            (this._parentForm && this._parentForm.submitted);
        var fieldHasError = this._elementRef.nativeElement.validity.customError;
        return fieldHasError && (isTouched || isSubmitted);
    };
    InputDirective.prototype.setCustomError = function (errorMessage) {
        //Set Validity.CustomError to true and provide a custom message to display.
        this._elementRef.nativeElement.setCustomValidity(errorMessage);
    };
    InputDirective.prototype.getSupportedInputTypes = function () {
        var featureTestInput = document.createElement("input");
        var supportedInputTypes = new Set([
            "color",
            "button",
            "checkbox",
            "date",
            "datetime-local",
            "email",
            "file",
            "hidden",
            "image",
            "month",
            "number",
            "password",
            "radio",
            "range",
            "reset",
            "search",
            "submit",
            "tel",
            "text",
            "time",
            "url",
            "week"
        ].filter(function (value) {
            featureTestInput.setAttribute("type", value);
            return featureTestInput.type === value;
        }));
        return supportedInputTypes;
    };
    //Private Methods
    InputDirective.prototype._onFocus = function () { this.focused = true; };
    InputDirective.prototype._onBlur = function () { this.focused = false; };
    InputDirective.prototype._onInput = function () {
        if (this._elementRef.nativeElement.validity.customError) {
            this._elementRef.nativeElement.setCustomValidity("");
        }
    };
    InputDirective.prototype._validateType = function () {
        var invalidTypesForInputElement = ["button", "hidden", "reset", "submit"];
        if (invalidTypesForInputElement.indexOf(this._type) !== -1)
            throw new Error("Input type \"" + this._type + "\" isn't supported by mav-form-group");
    };
    InputDirective.prototype._isNeverEmpty = function () { return this._neverEmptyInputTypes.indexOf(this._type) !== -1; };
    InputDirective.prototype._isBadInput = function () { return this._elementRef.nativeElement.validity.badInput; };
    InputDirective.prototype.isTextArea = function () {
        var nativeElement = this._elementRef.nativeElement;
        return nativeElement ? nativeElement.nodeName.toLowerCase() === "textarea" : false;
    };
    return InputDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], InputDirective.prototype, "disabled", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [String])
], InputDirective.prototype, "id", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], InputDirective.prototype, "required", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [String])
], InputDirective.prototype, "type", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [String])
], InputDirective.prototype, "placeholder", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Boolean])
], InputDirective.prototype, "formNoValidate", null);
InputDirective = __decorate([
    core_1.Directive({
        selector: "input[mav-input], textarea[mav-input]",
        host: {
            "[class.form-control]": "true",
            "[class.form-control-warning]": "isWarningState()",
            "[class.form-control-success]": "isSuccessState()",
            "[class.form-control-danger]": "isErrorState()",
            "[id]": "id",
            "[placeholder]": "placeholder",
            "[disabled]": "disabled",
            "[required]": "required",
            "[attr.aria-describedby]": "ariaDescribedBy || null",
            "[attr.aria-invalid]": "isWarningState()",
            "(blur)": "_onBlur()",
            "(focus)": "_onFocus()",
            "(input)": "_onInput()"
        }
    }),
    __param(2, core_1.Optional()), __param(2, core_1.Self()),
    __param(3, core_1.Optional()),
    __param(4, core_1.Optional()),
    __metadata("design:paramtypes", [core_1.ElementRef,
        core_1.Renderer2,
        forms_1.NgControl,
        forms_1.NgForm,
        forms_1.FormGroupDirective])
], InputDirective);
exports.InputDirective = InputDirective;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV4L2Zvcm1zL2lucHV0LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUF3RjtBQUN4Rix3Q0FBdUU7QUFFdkU7Ozs7OztHQU1HO0FBbUJILElBQWEsY0FBYztJQXlEdkIsd0JBQ1ksV0FBdUIsRUFDdkIsU0FBb0IsRUFDRCxTQUFvQixFQUMzQixXQUFtQixFQUNuQixnQkFBb0M7UUFMNUQsaUJBZUM7UUFkVyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUN2QixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ0QsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUMzQixnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUNuQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQW9CO1FBRXhELElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBRXJCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7YUFDdkYsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFwQyxDQUFvQyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQXRERCxzQkFBVyxvQ0FBUTthQUFuQixjQUF3QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzthQUMzRixVQUFvQixLQUFVLElBQUksSUFB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QUFLLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDdkYsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FqTEEsQUFpTEMsSUFBQTtBQS9KRztJQURDLFlBQUssRUFBRTs7OzhDQUNtRjtBQUkzRjtJQURDLFlBQUssRUFBRTs7O3dDQUM0QjtBQUlwQztJQURDLFlBQUssRUFBRTs7OzhDQUN3QztBQUloRDtJQURDLFlBQUssRUFBRTs7OzBDQUNnQztBQVd4QztJQURDLFlBQUssRUFBRTs7O2lEQUM4QztBQUl0RDtJQURDLFlBQUssRUFBRTs7O29EQUNvRDtBQTdDbkQsY0FBYztJQWxCMUIsZ0JBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSx1Q0FBdUM7UUFDakQsSUFBSSxFQUFFO1lBQ0Ysc0JBQXNCLEVBQUUsTUFBTTtZQUM5Qiw4QkFBOEIsRUFBRSxrQkFBa0I7WUFDbEQsOEJBQThCLEVBQUUsa0JBQWtCO1lBQ2xELDZCQUE2QixFQUFFLGdCQUFnQjtZQUMvQyxNQUFNLEVBQUUsSUFBSTtZQUNaLGVBQWUsRUFBRSxhQUFhO1lBQzlCLFlBQVksRUFBRSxVQUFVO1lBQ3hCLFlBQVksRUFBRSxVQUFVO1lBQ3hCLHlCQUF5QixFQUFFLHlCQUF5QjtZQUNwRCxxQkFBcUIsRUFBRSxrQkFBa0I7WUFDekMsUUFBUSxFQUFFLFdBQVc7WUFDckIsU0FBUyxFQUFFLFlBQVk7WUFDdkIsU0FBUyxFQUFFLFlBQVk7U0FDMUI7S0FDSixDQUFDO0lBNkRPLFdBQUEsZUFBUSxFQUFFLENBQUEsRUFBRSxXQUFBLFdBQUksRUFBRSxDQUFBO0lBQ2xCLFdBQUEsZUFBUSxFQUFFLENBQUE7SUFDVixXQUFBLGVBQVEsRUFBRSxDQUFBO3FDQUpVLGlCQUFVO1FBQ1osZ0JBQVM7UUFDVSxpQkFBUztRQUNkLGNBQU07UUFDRCwwQkFBa0I7R0E5RG5ELGNBQWMsQ0FpTDFCO0FBakxZLHdDQUFjIiwiZmlsZSI6InV4L2Zvcm1zL2lucHV0LmRpcmVjdGl2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIFJlbmRlcmVyMiwgRWxlbWVudFJlZiwgU2VsZiwgT3B0aW9uYWwgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBOZ0NvbnRyb2wsIE5nRm9ybSwgRm9ybUdyb3VwRGlyZWN0aXZlIH0gZnJvbSBcIkBhbmd1bGFyL2Zvcm1zXCI7XHJcblxyXG4vKipcclxuICogVE9ETzogU3VwcG9ydCBNYXNraW5nXHJcbiAqICAgICAgIFJlZmVyZW5jZSB0ZXh0LW1hc2sgb24gR2l0SHViXHJcbiAqICAgICAgIFRyYW5zbGF0ZSB0aGUgc2hhcmVkIEphdmFzY3JpcHQgQ29kZSBpbnRvIEFuZ3VsYXIgU2VydmljZT9cclxuICogVE9ETzogQ2hlY2sgdG8gc2VlIGlmIHBhcmVudCBmb3JtIGhhcyBuby12YWxpZGF0ZSBlbmFibGVkXHJcbiAqIFxyXG4gKi9cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogXCJpbnB1dFttYXYtaW5wdXRdLCB0ZXh0YXJlYVttYXYtaW5wdXRdXCIsXHJcbiAgICBob3N0OiB7XHJcbiAgICAgICAgXCJbY2xhc3MuZm9ybS1jb250cm9sXVwiOiBcInRydWVcIixcclxuICAgICAgICBcIltjbGFzcy5mb3JtLWNvbnRyb2wtd2FybmluZ11cIjogXCJpc1dhcm5pbmdTdGF0ZSgpXCIsXHJcbiAgICAgICAgXCJbY2xhc3MuZm9ybS1jb250cm9sLXN1Y2Nlc3NdXCI6IFwiaXNTdWNjZXNzU3RhdGUoKVwiLFxyXG4gICAgICAgIFwiW2NsYXNzLmZvcm0tY29udHJvbC1kYW5nZXJdXCI6IFwiaXNFcnJvclN0YXRlKClcIixcclxuICAgICAgICBcIltpZF1cIjogXCJpZFwiLFxyXG4gICAgICAgIFwiW3BsYWNlaG9sZGVyXVwiOiBcInBsYWNlaG9sZGVyXCIsXHJcbiAgICAgICAgXCJbZGlzYWJsZWRdXCI6IFwiZGlzYWJsZWRcIixcclxuICAgICAgICBcIltyZXF1aXJlZF1cIjogXCJyZXF1aXJlZFwiLFxyXG4gICAgICAgIFwiW2F0dHIuYXJpYS1kZXNjcmliZWRieV1cIjogXCJhcmlhRGVzY3JpYmVkQnkgfHwgbnVsbFwiLFxyXG4gICAgICAgIFwiW2F0dHIuYXJpYS1pbnZhbGlkXVwiOiBcImlzV2FybmluZ1N0YXRlKClcIixcclxuICAgICAgICBcIihibHVyKVwiOiBcIl9vbkJsdXIoKVwiLFxyXG4gICAgICAgIFwiKGZvY3VzKVwiOiBcIl9vbkZvY3VzKClcIixcclxuICAgICAgICBcIihpbnB1dClcIjogXCJfb25JbnB1dCgpXCJcclxuICAgIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIElucHV0RGlyZWN0aXZlIHtcclxuICAgIC8vUHJpdmF0ZSBWYXJpYWJsZXNcclxuICAgIHByaXZhdGUgX3R5cGU6IHN0cmluZztcclxuICAgIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfcmVxdWlyZWQ6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9pZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfbmV2ZXJFbXB0eUlucHV0VHlwZXM6IEFycmF5PHN0cmluZz47XHJcbiAgICBwcml2YXRlIF9wbGFjZWhvbGRlcjogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfZm9ybU5vVmFsaWRhdGU6IGJvb2xlYW47XHJcblxyXG4gICAgLy9QdWJsaWMgUHJvcGVydGllc1xyXG4gICAgLy9XaGV0aGVyIG9yIG5vdCB0aGUgZWxlbWVudCBpcyBmb2N1c2VkXHJcbiAgICBwdWJsaWMgZm9jdXNlZDogYm9vbGVhbjtcclxuXHJcbiAgICAvLyBTZXQgdGhlIGFyaWEtZGVzY3JpYmVkYnkgYXR0cmlidXRlIG9uIHRoZSBpbnB1dCBmb3IgaW1wcm92ZWQgQTExWVxyXG4gICAgcHVibGljIGFyaWFEZXNjcmliZWRCeTogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgZ2V0IGRpc2FibGVkKCkgeyByZXR1cm4gdGhpcy5uZ0NvbnRyb2wgPyB0aGlzLm5nQ29udHJvbC5kaXNhYmxlZCA6IHRoaXMuX2Rpc2FibGVkOyB9XHJcbiAgICBwdWJsaWMgc2V0IGRpc2FibGVkKHZhbHVlOiBhbnkpIHsgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZSAhPSBudWxsICYmIGAke3ZhbHVlfWAgIT09IFwiZmFsc2VcIjsgfVxyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgZ2V0IGlkKCkgeyByZXR1cm4gdGhpcy5faWQ7IH1cclxuICAgIHB1YmxpYyBzZXQgaWQodmFsdWU6IHN0cmluZykgeyB0aGlzLl9pZCA9IHZhbHVlOyB9XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBnZXQgcmVxdWlyZWQoKSB7IHJldHVybiB0aGlzLl9yZXF1aXJlZDsgfVxyXG4gICAgcHVibGljIHNldCByZXF1aXJlZCh2YWx1ZTogYW55KSB7IHRoaXMuX3JlcXVpcmVkID0gdmFsdWUgIT0gbnVsbCAmJiBgJHt2YWx1ZX1gICE9PSBcImZhbHNlXCI7IH1cclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIGdldCB0eXBlKCkgeyByZXR1cm4gdGhpcy5fdHlwZTsgfVxyXG4gICAgcHVibGljIHNldCB0eXBlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl90eXBlID0gdmFsdWUgfHwgXCJ0ZXh0XCI7XHJcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVUeXBlKCk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pc1RleHRBcmVhKCkgJiYgdGhpcy5nZXRTdXBwb3J0ZWRJbnB1dFR5cGVzKCkuaGFzKHRoaXMuX3R5cGUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgXCJ0eXBlXCIsIHRoaXMuX3R5cGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIGdldCBwbGFjZWhvbGRlcigpIHsgcmV0dXJuIHRoaXMuX3BsYWNlaG9sZGVyOyB9XHJcbiAgICBwdWJsaWMgc2V0IHBsYWNlaG9sZGVyKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5fcGxhY2Vob2xkZXIgPSB2YWx1ZTsgfVxyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgZ2V0IGZvcm1Ob1ZhbGlkYXRlKCkgeyByZXR1cm4gdGhpcy5fZm9ybU5vVmFsaWRhdGU7IH1cclxuICAgIHB1YmxpYyBzZXQgZm9ybU5vVmFsaWRhdGUodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fZm9ybU5vVmFsaWRhdGUgPSB2YWx1ZTsgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKSB7IHJldHVybiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IHN0cmluZykgeyB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB2YWx1ZTsgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgZW1wdHkoKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLl9pc05ldmVyRW1wdHkoKSAmJlxyXG4gICAgICAgICAgICAodGhpcy52YWx1ZSA9PSBudWxsIHx8IHRoaXMudmFsdWUgPT09IFwiXCIpICYmXHJcbiAgICAgICAgICAgICF0aGlzLl9pc0JhZElucHV0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcclxuICAgICAgICBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxyXG4gICAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgcHVibGljIG5nQ29udHJvbDogTmdDb250cm9sLFxyXG4gICAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX3BhcmVudEZvcm06IE5nRm9ybSxcclxuICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZVxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICAgIHRoaXMuX2Rpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcmVxdWlyZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlciA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuX25ldmVyRW1wdHlJbnB1dFR5cGVzID0gW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCIsIFwiZGF0ZXRpbWUtbG9jYWxcIiwgXCJtb250aFwiLCBcInRpbWVcIiwgXCJ3ZWVrXCJdXHJcbiAgICAgICAgICAgIC5maWx0ZXIodCA9PiB0aGlzLmdldFN1cHBvcnRlZElucHV0VHlwZXMoKS5oYXModCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vUHVibGljIE1ldGhvZHNcclxuICAgIHB1YmxpYyBmb2N1cygpOiB2b2lkIHsgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7IH1cclxuXHJcbiAgICBwdWJsaWMgaXNXYXJuaW5nU3RhdGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuZm9ybU5vVmFsaWRhdGUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAoIXRoaXMucmVxdWlyZWQgJiYgdGhpcy5lbXB0eSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICBjb25zdCBjb250cm9sID0gdGhpcy5uZ0NvbnRyb2w7XHJcbiAgICAgICAgY29uc3QgaXNJbnZhbGlkID0gY29udHJvbCAmJiBjb250cm9sLmludmFsaWQ7XHJcbiAgICAgICAgY29uc3QgaXNUb3VjaGVkID0gY29udHJvbCAmJiBjb250cm9sLnRvdWNoZWQ7XHJcbiAgICAgICAgY29uc3QgaXNTdWJtaXR0ZWQgPSAodGhpcy5fcGFyZW50Rm9ybUdyb3VwICYmIHRoaXMuX3BhcmVudEZvcm1Hcm91cC5zdWJtaXR0ZWQpIHx8XHJcbiAgICAgICAgICAgICh0aGlzLl9wYXJlbnRGb3JtICYmIHRoaXMuX3BhcmVudEZvcm0uc3VibWl0dGVkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChpc0ludmFsaWQgJiYgKGlzVG91Y2hlZCB8fCBpc1N1Ym1pdHRlZCkpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgaXNTdWNjZXNzU3RhdGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuZW1wdHkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5mb3JtTm9WYWxpZGF0ZSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICBjb25zdCBjb250cm9sID0gdGhpcy5uZ0NvbnRyb2w7XHJcbiAgICAgICAgY29uc3QgaXNWYWxpZCA9IGNvbnRyb2wgJiYgY29udHJvbC52YWxpZDtcclxuICAgICAgICBjb25zdCBpc1RvdWNoZWQgPSBjb250cm9sICYmIGNvbnRyb2wudG91Y2hlZDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGlzVG91Y2hlZCAmJiBpc1ZhbGlkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0Vycm9yU3RhdGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuZW1wdHkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5mb3JtTm9WYWxpZGF0ZSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICBjb25zdCBjb250cm9sID0gdGhpcy5uZ0NvbnRyb2w7XHJcbiAgICAgICAgY29uc3QgaXNUb3VjaGVkID0gY29udHJvbCAmJiBjb250cm9sLnRvdWNoZWQ7XHJcbiAgICAgICAgY29uc3QgaXNTdWJtaXR0ZWQgPSAodGhpcy5fcGFyZW50Rm9ybUdyb3VwICYmIHRoaXMuX3BhcmVudEZvcm1Hcm91cC5zdWJtaXR0ZWQpIHx8XHJcbiAgICAgICAgICAgICh0aGlzLl9wYXJlbnRGb3JtICYmIHRoaXMuX3BhcmVudEZvcm0uc3VibWl0dGVkKTtcclxuICAgICAgICBjb25zdCBmaWVsZEhhc0Vycm9yID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbGlkaXR5LmN1c3RvbUVycm9yO1xyXG5cclxuICAgICAgICByZXR1cm4gZmllbGRIYXNFcnJvciAmJiAoaXNUb3VjaGVkIHx8IGlzU3VibWl0dGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q3VzdG9tRXJyb3IoZXJyb3JNZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAvL1NldCBWYWxpZGl0eS5DdXN0b21FcnJvciB0byB0cnVlIGFuZCBwcm92aWRlIGEgY3VzdG9tIG1lc3NhZ2UgdG8gZGlzcGxheS5cclxuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0Q3VzdG9tVmFsaWRpdHkoZXJyb3JNZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U3VwcG9ydGVkSW5wdXRUeXBlcygpOiBTZXQ8c3RyaW5nPiB7XHJcbiAgICAgICAgY29uc3QgZmVhdHVyZVRlc3RJbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IHN1cHBvcnRlZElucHV0VHlwZXMgPSBuZXcgU2V0KFtcclxuICAgICAgICAgICAgXCJjb2xvclwiLFxyXG4gICAgICAgICAgICBcImJ1dHRvblwiLFxyXG4gICAgICAgICAgICBcImNoZWNrYm94XCIsXHJcbiAgICAgICAgICAgIFwiZGF0ZVwiLFxyXG4gICAgICAgICAgICBcImRhdGV0aW1lLWxvY2FsXCIsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIixcclxuICAgICAgICAgICAgXCJmaWxlXCIsXHJcbiAgICAgICAgICAgIFwiaGlkZGVuXCIsXHJcbiAgICAgICAgICAgIFwiaW1hZ2VcIixcclxuICAgICAgICAgICAgXCJtb250aFwiLFxyXG4gICAgICAgICAgICBcIm51bWJlclwiLFxyXG4gICAgICAgICAgICBcInBhc3N3b3JkXCIsXHJcbiAgICAgICAgICAgIFwicmFkaW9cIixcclxuICAgICAgICAgICAgXCJyYW5nZVwiLFxyXG4gICAgICAgICAgICBcInJlc2V0XCIsXHJcbiAgICAgICAgICAgIFwic2VhcmNoXCIsXHJcbiAgICAgICAgICAgIFwic3VibWl0XCIsXHJcbiAgICAgICAgICAgIFwidGVsXCIsXHJcbiAgICAgICAgICAgIFwidGV4dFwiLFxyXG4gICAgICAgICAgICBcInRpbWVcIixcclxuICAgICAgICAgICAgXCJ1cmxcIixcclxuICAgICAgICAgICAgXCJ3ZWVrXCJcclxuICAgICAgICBdLmZpbHRlcih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgIGZlYXR1cmVUZXN0SW5wdXQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmZWF0dXJlVGVzdElucHV0LnR5cGUgPT09IHZhbHVlO1xyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cHBvcnRlZElucHV0VHlwZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy9Qcml2YXRlIE1ldGhvZHNcclxuICAgIHByaXZhdGUgX29uRm9jdXMoKTogdm9pZCB7IHRoaXMuZm9jdXNlZCA9IHRydWU7IH1cclxuXHJcbiAgICBwcml2YXRlIF9vbkJsdXIoKTogdm9pZCB7IHRoaXMuZm9jdXNlZCA9IGZhbHNlOyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfb25JbnB1dCgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbGlkaXR5LmN1c3RvbUVycm9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zZXRDdXN0b21WYWxpZGl0eShcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdmFsaWRhdGVUeXBlKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGludmFsaWRUeXBlc0ZvcklucHV0RWxlbWVudDogQXJyYXk8c3RyaW5nPiA9IFtcImJ1dHRvblwiLCBcImhpZGRlblwiLCBcInJlc2V0XCIsIFwic3VibWl0XCJdO1xyXG4gICAgICAgIGlmIChpbnZhbGlkVHlwZXNGb3JJbnB1dEVsZW1lbnQuaW5kZXhPZih0aGlzLl90eXBlKSAhPT0gLTEpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5wdXQgdHlwZSBcIiR7dGhpcy5fdHlwZX1cIiBpc24ndCBzdXBwb3J0ZWQgYnkgbWF2LWZvcm0tZ3JvdXBgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9pc05ldmVyRW1wdHkoKSB7IHJldHVybiB0aGlzLl9uZXZlckVtcHR5SW5wdXRUeXBlcy5pbmRleE9mKHRoaXMuX3R5cGUpICE9PSAtMTsgfVxyXG5cclxuICAgIHByaXZhdGUgX2lzQmFkSW5wdXQoKSB7IHJldHVybiAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbGlkaXR5LmJhZElucHV0OyB9XHJcblxyXG4gICAgcHVibGljIGlzVGV4dEFyZWEoKSB7XHJcbiAgICAgICAgY29uc3QgbmF0aXZlRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcclxuICAgICAgICByZXR1cm4gbmF0aXZlRWxlbWVudCA/IG5hdGl2ZUVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0ZXh0YXJlYVwiIDogZmFsc2U7XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6Ii4vQ29udGVudC9hcHBsaWNhdGlvbiJ9
