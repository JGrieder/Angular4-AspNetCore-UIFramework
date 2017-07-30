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
    InputDirective.prototype.getCustomError = function () {
        return this._elementRef.nativeElement.validationMessage;
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
        selector: "input, textarea",
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV4L2Zvcm1zL2lucHV0LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUF3RjtBQUN4Rix3Q0FBdUU7QUFFdkU7Ozs7OztHQU1HO0FBbUJILElBQWEsY0FBYztJQXlEdkIsd0JBQ1ksV0FBdUIsRUFDdkIsU0FBb0IsRUFDRCxTQUFvQixFQUMzQixXQUFtQixFQUNuQixnQkFBb0M7UUFMNUQsaUJBZUM7UUFkVyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUN2QixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ0QsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUMzQixnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUNuQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQW9CO1FBRXhELElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBRXJCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7YUFDdkYsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFwQyxDQUFvQyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQXRERCxzQkFBVyxvQ0FBUTthQUFuQixjQUF3QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzthQUMzRixVQUFvQixLQUFVLElBQUksSUFB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ImZpbGUiOiJ1eC9mb3Jtcy9pbnB1dC5kaXJlY3RpdmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIElucHV0LCBSZW5kZXJlcjIsIEVsZW1lbnRSZWYsIFNlbGYsIE9wdGlvbmFsIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgTmdDb250cm9sLCBOZ0Zvcm0sIEZvcm1Hcm91cERpcmVjdGl2ZSB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xyXG5cclxuLyoqXHJcbiAqIFRPRE86IFN1cHBvcnQgTWFza2luZ1xyXG4gKiAgICAgICBSZWZlcmVuY2UgdGV4dC1tYXNrIG9uIEdpdEh1YlxyXG4gKiAgICAgICBUcmFuc2xhdGUgdGhlIHNoYXJlZCBKYXZhc2NyaXB0IENvZGUgaW50byBBbmd1bGFyIFNlcnZpY2U/XHJcbiAqIFRPRE86IENoZWNrIHRvIHNlZSBpZiBwYXJlbnQgZm9ybSBoYXMgbm8tdmFsaWRhdGUgZW5hYmxlZFxyXG4gKiBcclxuICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6IFwiaW5wdXQsIHRleHRhcmVhXCIsXHJcbiAgICBob3N0OiB7XHJcbiAgICAgICAgXCJbY2xhc3MuZm9ybS1jb250cm9sXVwiOiBcInRydWVcIixcclxuICAgICAgICBcIltjbGFzcy5mb3JtLWNvbnRyb2wtd2FybmluZ11cIjogXCJpc1dhcm5pbmdTdGF0ZSgpXCIsXHJcbiAgICAgICAgXCJbY2xhc3MuZm9ybS1jb250cm9sLXN1Y2Nlc3NdXCI6IFwiaXNTdWNjZXNzU3RhdGUoKVwiLFxyXG4gICAgICAgIFwiW2NsYXNzLmZvcm0tY29udHJvbC1kYW5nZXJdXCI6IFwiaXNFcnJvclN0YXRlKClcIixcclxuICAgICAgICBcIltpZF1cIjogXCJpZFwiLFxyXG4gICAgICAgIFwiW3BsYWNlaG9sZGVyXVwiOiBcInBsYWNlaG9sZGVyXCIsXHJcbiAgICAgICAgXCJbZGlzYWJsZWRdXCI6IFwiZGlzYWJsZWRcIixcclxuICAgICAgICBcIltyZXF1aXJlZF1cIjogXCJyZXF1aXJlZFwiLFxyXG4gICAgICAgIFwiW2F0dHIuYXJpYS1kZXNjcmliZWRieV1cIjogXCJhcmlhRGVzY3JpYmVkQnkgfHwgbnVsbFwiLFxyXG4gICAgICAgIFwiW2F0dHIuYXJpYS1pbnZhbGlkXVwiOiBcImlzV2FybmluZ1N0YXRlKClcIixcclxuICAgICAgICBcIihibHVyKVwiOiBcIl9vbkJsdXIoKVwiLFxyXG4gICAgICAgIFwiKGZvY3VzKVwiOiBcIl9vbkZvY3VzKClcIixcclxuICAgICAgICBcIihpbnB1dClcIjogXCJfb25JbnB1dCgpXCJcclxuICAgIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIElucHV0RGlyZWN0aXZlIHtcclxuICAgIC8vUHJpdmF0ZSBWYXJpYWJsZXNcclxuICAgIHByaXZhdGUgX3R5cGU6IHN0cmluZztcclxuICAgIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfcmVxdWlyZWQ6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9pZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfbmV2ZXJFbXB0eUlucHV0VHlwZXM6IEFycmF5PHN0cmluZz47XHJcbiAgICBwcml2YXRlIF9wbGFjZWhvbGRlcjogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfZm9ybU5vVmFsaWRhdGU6IGJvb2xlYW47XHJcblxyXG4gICAgLy9QdWJsaWMgUHJvcGVydGllc1xyXG4gICAgLy9XaGV0aGVyIG9yIG5vdCB0aGUgZWxlbWVudCBpcyBmb2N1c2VkXHJcbiAgICBwdWJsaWMgZm9jdXNlZDogYm9vbGVhbjtcclxuXHJcbiAgICAvLyBTZXQgdGhlIGFyaWEtZGVzY3JpYmVkYnkgYXR0cmlidXRlIG9uIHRoZSBpbnB1dCBmb3IgaW1wcm92ZWQgQTExWVxyXG4gICAgcHVibGljIGFyaWFEZXNjcmliZWRCeTogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgZ2V0IGRpc2FibGVkKCkgeyByZXR1cm4gdGhpcy5uZ0NvbnRyb2wgPyB0aGlzLm5nQ29udHJvbC5kaXNhYmxlZCA6IHRoaXMuX2Rpc2FibGVkOyB9XHJcbiAgICBwdWJsaWMgc2V0IGRpc2FibGVkKHZhbHVlOiBhbnkpIHsgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZSAhPSBudWxsICYmIGAke3ZhbHVlfWAgIT09IFwiZmFsc2VcIjsgfVxyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgZ2V0IGlkKCkgeyByZXR1cm4gdGhpcy5faWQ7IH1cclxuICAgIHB1YmxpYyBzZXQgaWQodmFsdWU6IHN0cmluZykgeyB0aGlzLl9pZCA9IHZhbHVlOyB9XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBnZXQgcmVxdWlyZWQoKSB7IHJldHVybiB0aGlzLl9yZXF1aXJlZDsgfVxyXG4gICAgcHVibGljIHNldCByZXF1aXJlZCh2YWx1ZTogYW55KSB7IHRoaXMuX3JlcXVpcmVkID0gdmFsdWUgIT0gbnVsbCAmJiBgJHt2YWx1ZX1gICE9PSBcImZhbHNlXCI7IH1cclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIGdldCB0eXBlKCkgeyByZXR1cm4gdGhpcy5fdHlwZTsgfVxyXG4gICAgcHVibGljIHNldCB0eXBlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl90eXBlID0gdmFsdWUgfHwgXCJ0ZXh0XCI7XHJcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVUeXBlKCk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pc1RleHRBcmVhKCkgJiYgdGhpcy5nZXRTdXBwb3J0ZWRJbnB1dFR5cGVzKCkuaGFzKHRoaXMuX3R5cGUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgXCJ0eXBlXCIsIHRoaXMuX3R5cGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIGdldCBwbGFjZWhvbGRlcigpIHsgcmV0dXJuIHRoaXMuX3BsYWNlaG9sZGVyOyB9XHJcbiAgICBwdWJsaWMgc2V0IHBsYWNlaG9sZGVyKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5fcGxhY2Vob2xkZXIgPSB2YWx1ZTsgfVxyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgZ2V0IGZvcm1Ob1ZhbGlkYXRlKCkgeyByZXR1cm4gdGhpcy5fZm9ybU5vVmFsaWRhdGU7IH1cclxuICAgIHB1YmxpYyBzZXQgZm9ybU5vVmFsaWRhdGUodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fZm9ybU5vVmFsaWRhdGUgPSB2YWx1ZTsgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKSB7IHJldHVybiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IHN0cmluZykgeyB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB2YWx1ZTsgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgZW1wdHkoKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLl9pc05ldmVyRW1wdHkoKSAmJlxyXG4gICAgICAgICAgICAodGhpcy52YWx1ZSA9PSBudWxsIHx8IHRoaXMudmFsdWUgPT09IFwiXCIpICYmXHJcbiAgICAgICAgICAgICF0aGlzLl9pc0JhZElucHV0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcclxuICAgICAgICBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxyXG4gICAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgcHVibGljIG5nQ29udHJvbDogTmdDb250cm9sLFxyXG4gICAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX3BhcmVudEZvcm06IE5nRm9ybSxcclxuICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZVxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICAgIHRoaXMuX2Rpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcmVxdWlyZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlciA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuX25ldmVyRW1wdHlJbnB1dFR5cGVzID0gW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCIsIFwiZGF0ZXRpbWUtbG9jYWxcIiwgXCJtb250aFwiLCBcInRpbWVcIiwgXCJ3ZWVrXCJdXHJcbiAgICAgICAgICAgIC5maWx0ZXIodCA9PiB0aGlzLmdldFN1cHBvcnRlZElucHV0VHlwZXMoKS5oYXModCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vUHVibGljIE1ldGhvZHNcclxuICAgIHB1YmxpYyBmb2N1cygpOiB2b2lkIHsgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7IH1cclxuXHJcbiAgICBwdWJsaWMgaXNXYXJuaW5nU3RhdGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuZm9ybU5vVmFsaWRhdGUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAoIXRoaXMucmVxdWlyZWQgJiYgdGhpcy5lbXB0eSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLm5nQ29udHJvbDtcclxuICAgICAgICBjb25zdCBpc0ludmFsaWQgPSBjb250cm9sICYmIGNvbnRyb2wuaW52YWxpZDtcclxuICAgICAgICBjb25zdCBpc1RvdWNoZWQgPSBjb250cm9sICYmIGNvbnRyb2wudG91Y2hlZDtcclxuICAgICAgICBjb25zdCBpc1N1Ym1pdHRlZCA9ICh0aGlzLl9wYXJlbnRGb3JtR3JvdXAgJiYgdGhpcy5fcGFyZW50Rm9ybUdyb3VwLnN1Ym1pdHRlZCkgfHxcclxuICAgICAgICAgICAgKHRoaXMuX3BhcmVudEZvcm0gJiYgdGhpcy5fcGFyZW50Rm9ybS5zdWJtaXR0ZWQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICByZXR1cm4gKGlzSW52YWxpZCAmJiAoaXNUb3VjaGVkIHx8IGlzU3VibWl0dGVkKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBpc1N1Y2Nlc3NTdGF0ZSgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5lbXB0eSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmZvcm1Ob1ZhbGlkYXRlKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLm5nQ29udHJvbDtcclxuICAgICAgICBjb25zdCBpc1ZhbGlkID0gY29udHJvbCAmJiBjb250cm9sLnZhbGlkO1xyXG4gICAgICAgIGNvbnN0IGlzVG91Y2hlZCA9IGNvbnRyb2wgJiYgY29udHJvbC50b3VjaGVkO1xyXG5cclxuICAgICAgICByZXR1cm4gaXNUb3VjaGVkICYmIGlzVmFsaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzRXJyb3JTdGF0ZSgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5lbXB0eSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmZvcm1Ob1ZhbGlkYXRlKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLm5nQ29udHJvbDtcclxuICAgICAgICBjb25zdCBpc1RvdWNoZWQgPSBjb250cm9sICYmIGNvbnRyb2wudG91Y2hlZDtcclxuICAgICAgICBjb25zdCBpc1N1Ym1pdHRlZCA9ICh0aGlzLl9wYXJlbnRGb3JtR3JvdXAgJiYgdGhpcy5fcGFyZW50Rm9ybUdyb3VwLnN1Ym1pdHRlZCkgfHxcclxuICAgICAgICAgICAgKHRoaXMuX3BhcmVudEZvcm0gJiYgdGhpcy5fcGFyZW50Rm9ybS5zdWJtaXR0ZWQpO1xyXG4gICAgICAgIGNvbnN0IGZpZWxkSGFzRXJyb3IgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsaWRpdHkuY3VzdG9tRXJyb3I7XHJcblxyXG4gICAgICAgIHJldHVybiBmaWVsZEhhc0Vycm9yICYmIChpc1RvdWNoZWQgfHwgaXNTdWJtaXR0ZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDdXN0b21FcnJvcihlcnJvck1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIC8vU2V0IFZhbGlkaXR5LkN1c3RvbUVycm9yIHRvIHRydWUgYW5kIHByb3ZpZGUgYSBjdXN0b20gbWVzc2FnZSB0byBkaXNwbGF5LlxyXG4gICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zZXRDdXN0b21WYWxpZGl0eShlcnJvck1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDdXN0b21FcnJvcigpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsaWRhdGlvbk1lc3NhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFN1cHBvcnRlZElucHV0VHlwZXMoKTogU2V0PHN0cmluZz4ge1xyXG4gICAgICAgIGNvbnN0IGZlYXR1cmVUZXN0SW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIikgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICBjb25zdCBzdXBwb3J0ZWRJbnB1dFR5cGVzID0gbmV3IFNldChbXHJcbiAgICAgICAgICAgIFwiY29sb3JcIixcclxuICAgICAgICAgICAgXCJidXR0b25cIixcclxuICAgICAgICAgICAgXCJjaGVja2JveFwiLFxyXG4gICAgICAgICAgICBcImRhdGVcIixcclxuICAgICAgICAgICAgXCJkYXRldGltZS1sb2NhbFwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCIsXHJcbiAgICAgICAgICAgIFwiZmlsZVwiLFxyXG4gICAgICAgICAgICBcImhpZGRlblwiLFxyXG4gICAgICAgICAgICBcImltYWdlXCIsXHJcbiAgICAgICAgICAgIFwibW9udGhcIixcclxuICAgICAgICAgICAgXCJudW1iZXJcIixcclxuICAgICAgICAgICAgXCJwYXNzd29yZFwiLFxyXG4gICAgICAgICAgICBcInJhZGlvXCIsXHJcbiAgICAgICAgICAgIFwicmFuZ2VcIixcclxuICAgICAgICAgICAgXCJyZXNldFwiLFxyXG4gICAgICAgICAgICBcInNlYXJjaFwiLFxyXG4gICAgICAgICAgICBcInN1Ym1pdFwiLFxyXG4gICAgICAgICAgICBcInRlbFwiLFxyXG4gICAgICAgICAgICBcInRleHRcIixcclxuICAgICAgICAgICAgXCJ0aW1lXCIsXHJcbiAgICAgICAgICAgIFwidXJsXCIsXHJcbiAgICAgICAgICAgIFwid2Vla1wiXHJcbiAgICAgICAgXS5maWx0ZXIodmFsdWUgPT4ge1xyXG4gICAgICAgICAgICBmZWF0dXJlVGVzdElucHV0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgdmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmVhdHVyZVRlc3RJbnB1dC50eXBlID09PSB2YWx1ZTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBwb3J0ZWRJbnB1dFR5cGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vUHJpdmF0ZSBNZXRob2RzXHJcbiAgICBwcml2YXRlIF9vbkZvY3VzKCk6IHZvaWQgeyB0aGlzLmZvY3VzZWQgPSB0cnVlOyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfb25CbHVyKCk6IHZvaWQgeyB0aGlzLmZvY3VzZWQgPSBmYWxzZTsgfVxyXG5cclxuICAgIHByaXZhdGUgX29uSW5wdXQoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWxpZGl0eS5jdXN0b21FcnJvcikge1xyXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0Q3VzdG9tVmFsaWRpdHkoXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3ZhbGlkYXRlVHlwZSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBpbnZhbGlkVHlwZXNGb3JJbnB1dEVsZW1lbnQ6IEFycmF5PHN0cmluZz4gPSBbXCJidXR0b25cIiwgXCJoaWRkZW5cIiwgXCJyZXNldFwiLCBcInN1Ym1pdFwiXTtcclxuICAgICAgICBpZiAoaW52YWxpZFR5cGVzRm9ySW5wdXRFbGVtZW50LmluZGV4T2YodGhpcy5fdHlwZSkgIT09IC0xKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYElucHV0IHR5cGUgXCIke3RoaXMuX3R5cGV9XCIgaXNuJ3Qgc3VwcG9ydGVkIGJ5IG1hdi1mb3JtLWdyb3VwYCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaXNOZXZlckVtcHR5KCkgeyByZXR1cm4gdGhpcy5fbmV2ZXJFbXB0eUlucHV0VHlwZXMuaW5kZXhPZih0aGlzLl90eXBlKSAhPT0gLTE7IH1cclxuXHJcbiAgICBwcml2YXRlIF9pc0JhZElucHV0KCkgeyByZXR1cm4gKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWxpZGl0eS5iYWRJbnB1dDsgfVxyXG5cclxuICAgIHB1YmxpYyBpc1RleHRBcmVhKCkge1xyXG4gICAgICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICAgICAgcmV0dXJuIG5hdGl2ZUVsZW1lbnQgPyBuYXRpdmVFbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwidGV4dGFyZWFcIiA6IGZhbHNlO1xyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiIuL0NvbnRlbnQvYXBwbGljYXRpb24ifQ==
