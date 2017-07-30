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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV4L2Zvcm1zL2lucHV0LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUF3RjtBQUN4Rix3Q0FBdUU7QUFFdkU7Ozs7OztHQU1HO0FBbUJILElBQWEsY0FBYztJQXlEdkIsd0JBQ1ksV0FBdUIsRUFDdkIsU0FBb0IsRUFDRCxTQUFvQixFQUMzQixXQUFtQixFQUNuQixnQkFBb0M7UUFMNUQsaUJBZUM7UUFkVyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUN2QixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ0QsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUMzQixnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUNuQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQW9CO1FBRXhELElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBRXJCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7YUFDdkYsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFwQyxDQUFvQyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQXRERCxzQkFBVyxvQ0FBUTthQUFuQixjQUF3QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzthQUMzRixVQUFvQixLQUFVLElBQUksSUFB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ImZpbGUiOiJ1eC9mb3Jtcy9pbnB1dC5kaXJlY3RpdmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIElucHV0LCBSZW5kZXJlcjIsIEVsZW1lbnRSZWYsIFNlbGYsIE9wdGlvbmFsIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgTmdDb250cm9sLCBOZ0Zvcm0sIEZvcm1Hcm91cERpcmVjdGl2ZSB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xyXG5cclxuLyoqXHJcbiAqIFRPRE86IFN1cHBvcnQgTWFza2luZ1xyXG4gKiAgICAgICBSZWZlcmVuY2UgdGV4dC1tYXNrIG9uIEdpdEh1YlxyXG4gKiAgICAgICBUcmFuc2xhdGUgdGhlIHNoYXJlZCBKYXZhc2NyaXB0IENvZGUgaW50byBBbmd1bGFyIFNlcnZpY2U/XHJcbiAqIFRPRE86IENoZWNrIHRvIHNlZSBpZiBwYXJlbnQgZm9ybSBoYXMgbm8tdmFsaWRhdGUgZW5hYmxlZFxyXG4gKiBcclxuICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6IFwiaW5wdXRbbWF2LWlucHV0XSwgdGV4dGFyZWFbbWF2LWlucHV0XVwiLFxyXG4gICAgaG9zdDoge1xyXG4gICAgICAgIFwiW2NsYXNzLmZvcm0tY29udHJvbF1cIjogXCJ0cnVlXCIsXHJcbiAgICAgICAgXCJbY2xhc3MuZm9ybS1jb250cm9sLXdhcm5pbmddXCI6IFwiaXNXYXJuaW5nU3RhdGUoKVwiLFxyXG4gICAgICAgIFwiW2NsYXNzLmZvcm0tY29udHJvbC1zdWNjZXNzXVwiOiBcImlzU3VjY2Vzc1N0YXRlKClcIixcclxuICAgICAgICBcIltjbGFzcy5mb3JtLWNvbnRyb2wtZGFuZ2VyXVwiOiBcImlzRXJyb3JTdGF0ZSgpXCIsXHJcbiAgICAgICAgXCJbaWRdXCI6IFwiaWRcIixcclxuICAgICAgICBcIltwbGFjZWhvbGRlcl1cIjogXCJwbGFjZWhvbGRlclwiLFxyXG4gICAgICAgIFwiW2Rpc2FibGVkXVwiOiBcImRpc2FibGVkXCIsXHJcbiAgICAgICAgXCJbcmVxdWlyZWRdXCI6IFwicmVxdWlyZWRcIixcclxuICAgICAgICBcIlthdHRyLmFyaWEtZGVzY3JpYmVkYnldXCI6IFwiYXJpYURlc2NyaWJlZEJ5IHx8IG51bGxcIixcclxuICAgICAgICBcIlthdHRyLmFyaWEtaW52YWxpZF1cIjogXCJpc1dhcm5pbmdTdGF0ZSgpXCIsXHJcbiAgICAgICAgXCIoYmx1cilcIjogXCJfb25CbHVyKClcIixcclxuICAgICAgICBcIihmb2N1cylcIjogXCJfb25Gb2N1cygpXCIsXHJcbiAgICAgICAgXCIoaW5wdXQpXCI6IFwiX29uSW5wdXQoKVwiXHJcbiAgICB9XHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBJbnB1dERpcmVjdGl2ZSB7XHJcbiAgICAvL1ByaXZhdGUgVmFyaWFibGVzXHJcbiAgICBwcml2YXRlIF90eXBlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX3JlcXVpcmVkOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfaWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgX25ldmVyRW1wdHlJbnB1dFR5cGVzOiBBcnJheTxzdHJpbmc+O1xyXG4gICAgcHJpdmF0ZSBfcGxhY2Vob2xkZXI6IHN0cmluZztcclxuICAgIHByaXZhdGUgX2Zvcm1Ob1ZhbGlkYXRlOiBib29sZWFuO1xyXG5cclxuICAgIC8vUHVibGljIFByb3BlcnRpZXNcclxuICAgIC8vV2hldGhlciBvciBub3QgdGhlIGVsZW1lbnQgaXMgZm9jdXNlZFxyXG4gICAgcHVibGljIGZvY3VzZWQ6IGJvb2xlYW47XHJcblxyXG4gICAgLy8gU2V0IHRoZSBhcmlhLWRlc2NyaWJlZGJ5IGF0dHJpYnV0ZSBvbiB0aGUgaW5wdXQgZm9yIGltcHJvdmVkIEExMVlcclxuICAgIHB1YmxpYyBhcmlhRGVzY3JpYmVkQnk6IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIGdldCBkaXNhYmxlZCgpIHsgcmV0dXJuIHRoaXMubmdDb250cm9sID8gdGhpcy5uZ0NvbnRyb2wuZGlzYWJsZWQgOiB0aGlzLl9kaXNhYmxlZDsgfVxyXG4gICAgcHVibGljIHNldCBkaXNhYmxlZCh2YWx1ZTogYW55KSB7IHRoaXMuX2Rpc2FibGVkID0gdmFsdWUgIT0gbnVsbCAmJiBgJHt2YWx1ZX1gICE9PSBcImZhbHNlXCI7IH1cclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIGdldCBpZCgpIHsgcmV0dXJuIHRoaXMuX2lkOyB9XHJcbiAgICBwdWJsaWMgc2V0IGlkKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5faWQgPSB2YWx1ZTsgfVxyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgZ2V0IHJlcXVpcmVkKCkgeyByZXR1cm4gdGhpcy5fcmVxdWlyZWQ7IH1cclxuICAgIHB1YmxpYyBzZXQgcmVxdWlyZWQodmFsdWU6IGFueSkgeyB0aGlzLl9yZXF1aXJlZCA9IHZhbHVlICE9IG51bGwgJiYgYCR7dmFsdWV9YCAhPT0gXCJmYWxzZVwiOyB9XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBnZXQgdHlwZSgpIHsgcmV0dXJuIHRoaXMuX3R5cGU7IH1cclxuICAgIHB1YmxpYyBzZXQgdHlwZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IHZhbHVlIHx8IFwidGV4dFwiO1xyXG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlVHlwZSgpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaXNUZXh0QXJlYSgpICYmIHRoaXMuZ2V0U3VwcG9ydGVkSW5wdXRUeXBlcygpLmhhcyh0aGlzLl90eXBlKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIFwidHlwZVwiLCB0aGlzLl90eXBlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBnZXQgcGxhY2Vob2xkZXIoKSB7IHJldHVybiB0aGlzLl9wbGFjZWhvbGRlcjsgfVxyXG4gICAgcHVibGljIHNldCBwbGFjZWhvbGRlcih2YWx1ZTogc3RyaW5nKSB7IHRoaXMuX3BsYWNlaG9sZGVyID0gdmFsdWU7IH1cclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIGdldCBmb3JtTm9WYWxpZGF0ZSgpIHsgcmV0dXJuIHRoaXMuX2Zvcm1Ob1ZhbGlkYXRlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGZvcm1Ob1ZhbGlkYXRlKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2Zvcm1Ob1ZhbGlkYXRlID0gdmFsdWU7IH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHZhbHVlKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlID0gdmFsdWU7IH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGVtcHR5KCkge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5faXNOZXZlckVtcHR5KCkgJiZcclxuICAgICAgICAgICAgKHRoaXMudmFsdWUgPT0gbnVsbCB8fCB0aGlzLnZhbHVlID09PSBcIlwiKSAmJlxyXG4gICAgICAgICAgICAhdGhpcy5faXNCYWRJbnB1dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXHJcbiAgICAgICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcclxuICAgICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIHB1YmxpYyBuZ0NvbnRyb2w6IE5nQ29udHJvbCxcclxuICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXHJcbiAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmVcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuX3R5cGUgPSBcInRleHRcIjtcclxuICAgICAgICB0aGlzLl9kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3JlcXVpcmVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXIgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLl9uZXZlckVtcHR5SW5wdXRUeXBlcyA9IFtcImRhdGVcIiwgXCJkYXRldGltZVwiLCBcImRhdGV0aW1lLWxvY2FsXCIsIFwibW9udGhcIiwgXCJ0aW1lXCIsIFwid2Vla1wiXVxyXG4gICAgICAgICAgICAuZmlsdGVyKHQgPT4gdGhpcy5nZXRTdXBwb3J0ZWRJbnB1dFR5cGVzKCkuaGFzKHQpKTtcclxuICAgIH1cclxuXHJcbiAgICAvL1B1YmxpYyBNZXRob2RzXHJcbiAgICBwdWJsaWMgZm9jdXMoKTogdm9pZCB7IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpOyB9XHJcblxyXG4gICAgcHVibGljIGlzV2FybmluZ1N0YXRlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmZvcm1Ob1ZhbGlkYXRlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKCF0aGlzLnJlcXVpcmVkICYmIHRoaXMuZW1wdHkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjb250cm9sID0gdGhpcy5uZ0NvbnRyb2w7XHJcbiAgICAgICAgY29uc3QgaXNJbnZhbGlkID0gY29udHJvbCAmJiBjb250cm9sLmludmFsaWQ7XHJcbiAgICAgICAgY29uc3QgaXNUb3VjaGVkID0gY29udHJvbCAmJiBjb250cm9sLnRvdWNoZWQ7XHJcbiAgICAgICAgY29uc3QgaXNTdWJtaXR0ZWQgPSAodGhpcy5fcGFyZW50Rm9ybUdyb3VwICYmIHRoaXMuX3BhcmVudEZvcm1Hcm91cC5zdWJtaXR0ZWQpIHx8XHJcbiAgICAgICAgICAgICh0aGlzLl9wYXJlbnRGb3JtICYmIHRoaXMuX3BhcmVudEZvcm0uc3VibWl0dGVkKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIChpc0ludmFsaWQgJiYgKGlzVG91Y2hlZCB8fCBpc1N1Ym1pdHRlZCkpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgaXNTdWNjZXNzU3RhdGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuZW1wdHkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5mb3JtTm9WYWxpZGF0ZSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICBjb25zdCBjb250cm9sID0gdGhpcy5uZ0NvbnRyb2w7XHJcbiAgICAgICAgY29uc3QgaXNWYWxpZCA9IGNvbnRyb2wgJiYgY29udHJvbC52YWxpZDtcclxuICAgICAgICBjb25zdCBpc1RvdWNoZWQgPSBjb250cm9sICYmIGNvbnRyb2wudG91Y2hlZDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGlzVG91Y2hlZCAmJiBpc1ZhbGlkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0Vycm9yU3RhdGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuZW1wdHkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5mb3JtTm9WYWxpZGF0ZSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICBjb25zdCBjb250cm9sID0gdGhpcy5uZ0NvbnRyb2w7XHJcbiAgICAgICAgY29uc3QgaXNUb3VjaGVkID0gY29udHJvbCAmJiBjb250cm9sLnRvdWNoZWQ7XHJcbiAgICAgICAgY29uc3QgaXNTdWJtaXR0ZWQgPSAodGhpcy5fcGFyZW50Rm9ybUdyb3VwICYmIHRoaXMuX3BhcmVudEZvcm1Hcm91cC5zdWJtaXR0ZWQpIHx8XHJcbiAgICAgICAgICAgICh0aGlzLl9wYXJlbnRGb3JtICYmIHRoaXMuX3BhcmVudEZvcm0uc3VibWl0dGVkKTtcclxuICAgICAgICBjb25zdCBmaWVsZEhhc0Vycm9yID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbGlkaXR5LmN1c3RvbUVycm9yO1xyXG5cclxuICAgICAgICByZXR1cm4gZmllbGRIYXNFcnJvciAmJiAoaXNUb3VjaGVkIHx8IGlzU3VibWl0dGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q3VzdG9tRXJyb3IoZXJyb3JNZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAvL1NldCBWYWxpZGl0eS5DdXN0b21FcnJvciB0byB0cnVlIGFuZCBwcm92aWRlIGEgY3VzdG9tIG1lc3NhZ2UgdG8gZGlzcGxheS5cclxuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0Q3VzdG9tVmFsaWRpdHkoZXJyb3JNZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q3VzdG9tRXJyb3IoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbGlkYXRpb25NZXNzYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTdXBwb3J0ZWRJbnB1dFR5cGVzKCk6IFNldDxzdHJpbmc+IHtcclxuICAgICAgICBjb25zdCBmZWF0dXJlVGVzdElucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgY29uc3Qgc3VwcG9ydGVkSW5wdXRUeXBlcyA9IG5ldyBTZXQoW1xyXG4gICAgICAgICAgICBcImNvbG9yXCIsXHJcbiAgICAgICAgICAgIFwiYnV0dG9uXCIsXHJcbiAgICAgICAgICAgIFwiY2hlY2tib3hcIixcclxuICAgICAgICAgICAgXCJkYXRlXCIsXHJcbiAgICAgICAgICAgIFwiZGF0ZXRpbWUtbG9jYWxcIixcclxuICAgICAgICAgICAgXCJlbWFpbFwiLFxyXG4gICAgICAgICAgICBcImZpbGVcIixcclxuICAgICAgICAgICAgXCJoaWRkZW5cIixcclxuICAgICAgICAgICAgXCJpbWFnZVwiLFxyXG4gICAgICAgICAgICBcIm1vbnRoXCIsXHJcbiAgICAgICAgICAgIFwibnVtYmVyXCIsXHJcbiAgICAgICAgICAgIFwicGFzc3dvcmRcIixcclxuICAgICAgICAgICAgXCJyYWRpb1wiLFxyXG4gICAgICAgICAgICBcInJhbmdlXCIsXHJcbiAgICAgICAgICAgIFwicmVzZXRcIixcclxuICAgICAgICAgICAgXCJzZWFyY2hcIixcclxuICAgICAgICAgICAgXCJzdWJtaXRcIixcclxuICAgICAgICAgICAgXCJ0ZWxcIixcclxuICAgICAgICAgICAgXCJ0ZXh0XCIsXHJcbiAgICAgICAgICAgIFwidGltZVwiLFxyXG4gICAgICAgICAgICBcInVybFwiLFxyXG4gICAgICAgICAgICBcIndlZWtcIlxyXG4gICAgICAgIF0uZmlsdGVyKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgZmVhdHVyZVRlc3RJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZlYXR1cmVUZXN0SW5wdXQudHlwZSA9PT0gdmFsdWU7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwcG9ydGVkSW5wdXRUeXBlcztcclxuICAgIH1cclxuXHJcbiAgICAvL1ByaXZhdGUgTWV0aG9kc1xyXG4gICAgcHJpdmF0ZSBfb25Gb2N1cygpOiB2b2lkIHsgdGhpcy5mb2N1c2VkID0gdHJ1ZTsgfVxyXG5cclxuICAgIHByaXZhdGUgX29uQmx1cigpOiB2b2lkIHsgdGhpcy5mb2N1c2VkID0gZmFsc2U7IH1cclxuXHJcbiAgICBwcml2YXRlIF9vbklucHV0KCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsaWRpdHkuY3VzdG9tRXJyb3IpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNldEN1c3RvbVZhbGlkaXR5KFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF92YWxpZGF0ZVR5cGUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgaW52YWxpZFR5cGVzRm9ySW5wdXRFbGVtZW50OiBBcnJheTxzdHJpbmc+ID0gW1wiYnV0dG9uXCIsIFwiaGlkZGVuXCIsIFwicmVzZXRcIiwgXCJzdWJtaXRcIl07XHJcbiAgICAgICAgaWYgKGludmFsaWRUeXBlc0ZvcklucHV0RWxlbWVudC5pbmRleE9mKHRoaXMuX3R5cGUpICE9PSAtMSlcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnB1dCB0eXBlIFwiJHt0aGlzLl90eXBlfVwiIGlzbid0IHN1cHBvcnRlZCBieSBtYXYtZm9ybS1ncm91cGApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2lzTmV2ZXJFbXB0eSgpIHsgcmV0dXJuIHRoaXMuX25ldmVyRW1wdHlJbnB1dFR5cGVzLmluZGV4T2YodGhpcy5fdHlwZSkgIT09IC0xOyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaXNCYWRJbnB1dCgpIHsgcmV0dXJuICh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsaWRpdHkuYmFkSW5wdXQ7IH1cclxuXHJcbiAgICBwdWJsaWMgaXNUZXh0QXJlYSgpIHtcclxuICAgICAgICBjb25zdCBuYXRpdmVFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xyXG4gICAgICAgIHJldHVybiBuYXRpdmVFbGVtZW50ID8gbmF0aXZlRWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInRleHRhcmVhXCIgOiBmYWxzZTtcclxuICAgIH1cclxufSJdLCJzb3VyY2VSb290IjoiLi9Db250ZW50L2FwcGxpY2F0aW9uIn0=
