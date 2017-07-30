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
var animations_1 = require("@angular/animations");
var hint_directive_1 = require("./hint.directive");
var input_directive_1 = require("./input.directive");
var text_field_addon_directive_1 = require("./text-field-addon.directive");
/**
 * TODO Create a CSS Class to make sure the required symbol appears as Red
 * TODO Consider implementing a means for a user to override the required symbol with something from Font-Awesome
 *
 * TODO In Error flow support a fallback approach in case the native validation message does not trigger
 */
var TextFieldComponent = (function () {
    function TextFieldComponent(_elementRef, _changeDetectorRef) {
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._formControlFeedbackAnimationState = "";
    }
    TextFieldComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._validateInputChild();
        this._validateFieldAddons();
        this._processHints();
        //Revalidate when things change
        this._hintChildren.changes.subscribe(function () { return _this._processHints(); });
        this._containerHasTextFieldAddonChildren = this._textFieldAddonChildren.length > 0;
    };
    TextFieldComponent.prototype.ngAfterContentChecked = function () {
        this._validateInputChild();
    };
    TextFieldComponent.prototype.ngAfterViewInit = function () {
        //Avoid Animations on Load.
        this._formControlFeedbackAnimationState = "enter";
        this._changeDetectorRef.detectChanges();
    };
    /**
     * Determines whether or not to display messaging based on the state of the form
     * Defaults to none if no Feedback Message Directives are defined
     */
    TextFieldComponent.prototype._getDisplayedMessages = function () {
        var input = this._inputChild;
        var hasHints = (this._hintChildren.length > 0 && this._hintChildren.length <= 2);
        if (!this.messages) {
            return hasHints ? "hint" : "none";
        }
        if (input.isErrorState())
            return "error";
        if (input.isWarningState())
            return "warning";
        if (input.isSuccessState())
            return "success";
        return hasHints ? "hint" : "none";
    };
    /**
     * Determines whether a class from the NgControl should be forwarded to the host element.
     * @param prop
     */
    TextFieldComponent.prototype._shouldForward = function (prop) {
        var control = this._inputChild ? this._inputChild.ngControl : null;
        return control && control[prop];
    };
    /**
     * Does the extra processing that is required when handling the hints.
     */
    TextFieldComponent.prototype._processHints = function () {
        this._validateHints();
        this._syncAriaDescribedBy();
    };
    /**
     * Ensure that there is a maximum of one of each `div[hint]` alignment specified
     */
    TextFieldComponent.prototype._validateHints = function () {
        if (this._hintChildren) {
            var startHint_1;
            var endHint_1;
            this._hintChildren.forEach(function (hint) {
                if (hint.align === "start") {
                    if (startHint_1) {
                        throw new Error("A hint was already declared for align=\"start\".");
                    }
                    startHint_1 = hint;
                }
                else if (hint.align === "end") {
                    if (endHint_1) {
                        throw new Error("A hint was already declared for align=\"end\".");
                    }
                    endHint_1 = hint;
                }
            });
        }
    };
    /**
     * Sets the child input's `aria-describedby` to a space-separated list of the ids
     * of the currently-specified hints, as well as a generated id for the hint label.
     * @returns {}
     */
    TextFieldComponent.prototype._syncAriaDescribedBy = function () {
        if (this._inputChild) {
            var ids = [];
            var startHint = this._hintChildren ? this._hintChildren.find(function (hint) { return hint.align === "start"; }) : null;
            var endHint = this._hintChildren ? this._hintChildren.find(function (hint) { return hint.align === "end"; }) : null;
            if (startHint)
                ids.push(startHint.id);
            if (endHint)
                ids.push(endHint.id);
            this._inputChild.ariaDescribedBy = ids.join(" ");
        }
    };
    /**
     * Throws an error if the container's input child was removed.
     */
    TextFieldComponent.prototype._validateInputChild = function () {
        if (!this._inputChild)
            throw new Error("Form Control must contain an mav-input directive. " +
                "Did you forget to add mav-input to the native input or textarea element?");
    };
    TextFieldComponent.prototype._validateFieldAddons = function () {
        if (this._inputChild.isTextArea()) {
            if (this._textFieldAddonChildren.length > 0) {
                throw new Error("Form Control Container does not allow for field addons to be attached to a text area");
            }
        }
    };
    TextFieldComponent.prototype._getSuccessMessage = function () {
        if (!this.messages)
            return null;
        if (!this.messages["success"])
            return null;
        return this.messages["success"];
    };
    TextFieldComponent.prototype._getValidationMessage = function () {
        var _this = this;
        var errors = this._inputChild.ngControl.errors;
        if (!errors)
            return null;
        if (!this.messages)
            return null;
        var validationMessage;
        Object.keys(this.messages).some(function (key) {
            if (errors[key]) {
                validationMessage = _this.messages[key];
                return true;
            }
            return false;
        });
        return validationMessage;
    };
    return TextFieldComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TextFieldComponent.prototype, "label", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TextFieldComponent.prototype, "messages", void 0);
__decorate([
    core_1.ContentChild(input_directive_1.InputDirective),
    __metadata("design:type", input_directive_1.InputDirective)
], TextFieldComponent.prototype, "_inputChild", void 0);
__decorate([
    core_1.ContentChildren(hint_directive_1.HintDirective),
    __metadata("design:type", core_1.QueryList)
], TextFieldComponent.prototype, "_hintChildren", void 0);
__decorate([
    core_1.ContentChildren(text_field_addon_directive_1.TextFieldAddonDirective),
    __metadata("design:type", core_1.QueryList)
], TextFieldComponent.prototype, "_textFieldAddonChildren", void 0);
TextFieldComponent = __decorate([
    core_1.Component({
        selector: "text-field",
        animations: [
            animations_1.trigger("transitionMessages", [
                animations_1.state("enter", animations_1.style({ opacity: 1, transform: "translateY(0%)" })),
                animations_1.transition("void => enter", [
                    animations_1.style({ opacity: 0, transform: "translateY(-100%)" }),
                    animations_1.animate("300ms cubic-bezier(0.55, 0, 0.55, 0.2)")
                ])
            ])
        ],
        host: {
            "[attr.align]": "null",
            "[class.has-success]": "_inputChild.isSuccessState()",
            "[class.has-warning]": "_inputChild.isWarningState()",
            "[class.has-danger]": "_inputChild.isErrorState()",
            "[class.ng-untouched]": "_shouldForward('untouched')",
            "[class.ng-touched]": "_shouldForward('touched')",
            "[class.ng-pristine]": "_shouldForward('pristine')",
            "[class.ng-dirty]": "_shouldForward('dirty')",
            "[class.ng-valid]": "_shouldForward('valid')",
            "[class.ng-invalid]": "_shouldForward('invalid')",
            "[class.ng-pending]": "_shouldForward('pending')"
        },
        encapsulation: core_1.ViewEncapsulation.None,
        template: "<label [attr.for]=\"_inputChild.id\" class=\"form-control-label\">{{label}}\n        <span class=\"required\" *ngIf=\"_inputChild.required\">*</span>\n     </label>\n     \n     <div [class.input-group]=\"_containerHasTextFieldAddonChildren\">\n        <ng-content select=\"text-field-addon[position='left']\"></ng-content>\n        <ng-content select=\"input, textarea\"></ng-content>\n        <ng-content select=\"text-field-addon[position='right']\"></ng-content>\n     </div>\n   \n     <div [ngSwitch]=\"this._getDisplayedMessages()\">\n        <div *ngSwitchCase=\"'error'\" [@transitionMessages]=\"_formControlFeedbackAnimationState\">\n            <div class=\"form-control-feedback\">{{_inputChild.getCustomError()}}</div>\n        </div>\n        <div *ngSwitchCase=\"'warning'\" [@transitionMessages]=\"_formControlFeedbackAnimationState\">\n            <div class=\"form-control-feedback\">{{_getValidationMessage()}}</div>\n        </div>\n        <div *ngSwitchCase=\"'success'\" [@transitionMessages]=\"_formControlFeedbackAnimationState\">\n            <div class=\"form-control-feedback\">{{_getSuccessMessage()}}</div>\n        </div>\n        <div *ngSwitchCase=\"'hint'\" [@transitionMessages]=\"_formControlFeedbackAnimationState\" class=\"clearfix\">\n            <ng-content select=\"hint:not([align='end'])\"></ng-content>\n            <ng-content select=\"hint[align='end']\"></ng-content>\n        </div>\n     </div>"
    }),
    __metadata("design:paramtypes", [core_1.ElementRef,
        core_1.ChangeDetectorRef])
], TextFieldComponent);
exports.TextFieldComponent = TextFieldComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV4L2Zvcm1zL3RleHQtZmllbGQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBWXVCO0FBQ3ZCLGtEQUFpRjtBQUNqRixtREFBaUQ7QUFDakQscURBQW1EO0FBQ25ELDJFQUF1RTtBQUV2RTs7Ozs7R0FLRztBQXdESCxJQUFhLGtCQUFrQjtJQXFCM0IsNEJBQ1ksV0FBdUIsRUFDdkIsa0JBQXFDO1FBRHJDLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQ3ZCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFFN0MsSUFBSSxDQUFDLGtDQUFrQyxHQUFHLEVBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRU0sK0NBQWtCLEdBQXpCO1FBQUEsaUJBUUM7UUFQRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFckIsK0JBQStCO1FBQy9CLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLGFBQWEsRUFBRSxFQUFwQixDQUFvQixDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLG1DQUFtQyxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFTSxrREFBcUIsR0FBNUI7UUFDSSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRU0sNENBQWUsR0FBdEI7UUFDSSwyQkFBMkI7UUFDM0IsSUFBSSxDQUFDLGtDQUFrQyxHQUFHLE9BQU8sQ0FBQztRQUNsRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDNUMsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGtEQUFxQixHQUE3QjtRQUNJLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7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TyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO2dCQUNsRSx1QkFBVSxDQUFDLGVBQWUsRUFDdEI7b0JBQ0ksa0JBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLG1CQUFtQixFQUFFLENBQUM7b0JBQ3JELG9CQUFPLENBQUMsd0NBQXdDLENBQUM7aUJBQ3BELENBQUM7YUFDVCxDQUFDO1NBQ1Q7UUFDRCxJQUFJLEVBQUU7WUFDRixjQUFjLEVBQUUsTUFBTTtZQUN0QixxQkFBcUIsRUFBRSw4QkFBOEI7WUFDckQscUJBQXFCLEVBQUUsOEJBQThCO1lBQ3JELG9CQUFvQixFQUFFLDRCQUE0QjtZQUNsRCxzQkFBc0IsRUFBRSw2QkFBNkI7WUFDckQsb0JBQW9CLEVBQUUsMkJBQTJCO1lBQ2pELHFCQUFxQixFQUFFLDRCQUE0QjtZQUNuRCxrQkFBa0IsRUFBRSx5QkFBeUI7WUFDN0Msa0JBQWtCLEVBQUUseUJBQXlCO1lBQzdDLG9CQUFvQixFQUFFLDJCQUEyQjtZQUNqRCxvQkFBb0IsRUFBRSwyQkFBMkI7U0FDcEQ7UUFDRCxhQUFhLEVBQUUsd0JBQWlCLENBQUMsSUFBSTtRQUNyQyxRQUFRLEVBQUUscTZDQXdCRjtLQUNYLENBQUM7cUNBdUIyQixpQkFBVTtRQUNILHdCQUFpQjtHQXZCeEMsa0JBQWtCLENBNks5QjtBQTdLWSxnREFBa0IiLCJmaWxlIjoidXgvZm9ybXMvdGV4dC1maWVsZC5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gICAgQ29tcG9uZW50LFxyXG4gICAgSW5wdXQsXHJcbiAgICBDb250ZW50Q2hpbGQsXHJcbiAgICBDb250ZW50Q2hpbGRyZW4sXHJcbiAgICBRdWVyeUxpc3QsXHJcbiAgICBWaWV3RW5jYXBzdWxhdGlvbixcclxuICAgIEFmdGVyVmlld0luaXQsXHJcbiAgICBBZnRlckNvbnRlbnRJbml0LFxyXG4gICAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcclxuICAgIEVsZW1lbnRSZWYsXHJcbiAgICBDaGFuZ2VEZXRlY3RvclJlZlxyXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IGFuaW1hdGUsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gXCJAYW5ndWxhci9hbmltYXRpb25zXCI7XHJcbmltcG9ydCB7IEhpbnREaXJlY3RpdmUgfSBmcm9tIFwiLi9oaW50LmRpcmVjdGl2ZVwiO1xyXG5pbXBvcnQgeyBJbnB1dERpcmVjdGl2ZSB9IGZyb20gXCIuL2lucHV0LmRpcmVjdGl2ZVwiO1xyXG5pbXBvcnQgeyBUZXh0RmllbGRBZGRvbkRpcmVjdGl2ZSB9IGZyb20gXCIuL3RleHQtZmllbGQtYWRkb24uZGlyZWN0aXZlXCI7XHJcblxyXG4vKipcclxuICogVE9ETyBDcmVhdGUgYSBDU1MgQ2xhc3MgdG8gbWFrZSBzdXJlIHRoZSByZXF1aXJlZCBzeW1ib2wgYXBwZWFycyBhcyBSZWRcclxuICogVE9ETyBDb25zaWRlciBpbXBsZW1lbnRpbmcgYSBtZWFucyBmb3IgYSB1c2VyIHRvIG92ZXJyaWRlIHRoZSByZXF1aXJlZCBzeW1ib2wgd2l0aCBzb21ldGhpbmcgZnJvbSBGb250LUF3ZXNvbWVcclxuICpcclxuICogVE9ETyBJbiBFcnJvciBmbG93IHN1cHBvcnQgYSBmYWxsYmFjayBhcHByb2FjaCBpbiBjYXNlIHRoZSBuYXRpdmUgdmFsaWRhdGlvbiBtZXNzYWdlIGRvZXMgbm90IHRyaWdnZXJcclxuICovXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiBcInRleHQtZmllbGRcIixcclxuICAgIGFuaW1hdGlvbnM6XHJcbiAgICBbXHJcbiAgICAgICAgdHJpZ2dlcihcInRyYW5zaXRpb25NZXNzYWdlc1wiLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICBzdGF0ZShcImVudGVyXCIsIHN0eWxlKHsgb3BhY2l0eTogMSwgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoMCUpXCIgfSkpLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbihcInZvaWQgPT4gZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlKHsgb3BhY2l0eTogMCwgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoLTEwMCUpXCIgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGUoXCIzMDBtcyBjdWJpYy1iZXppZXIoMC41NSwgMCwgMC41NSwgMC4yKVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgIF0pXHJcbiAgICBdLFxyXG4gICAgaG9zdDoge1xyXG4gICAgICAgIFwiW2F0dHIuYWxpZ25dXCI6IFwibnVsbFwiLFxyXG4gICAgICAgIFwiW2NsYXNzLmhhcy1zdWNjZXNzXVwiOiBcIl9pbnB1dENoaWxkLmlzU3VjY2Vzc1N0YXRlKClcIixcclxuICAgICAgICBcIltjbGFzcy5oYXMtd2FybmluZ11cIjogXCJfaW5wdXRDaGlsZC5pc1dhcm5pbmdTdGF0ZSgpXCIsXHJcbiAgICAgICAgXCJbY2xhc3MuaGFzLWRhbmdlcl1cIjogXCJfaW5wdXRDaGlsZC5pc0Vycm9yU3RhdGUoKVwiLFxyXG4gICAgICAgIFwiW2NsYXNzLm5nLXVudG91Y2hlZF1cIjogXCJfc2hvdWxkRm9yd2FyZCgndW50b3VjaGVkJylcIixcclxuICAgICAgICBcIltjbGFzcy5uZy10b3VjaGVkXVwiOiBcIl9zaG91bGRGb3J3YXJkKCd0b3VjaGVkJylcIixcclxuICAgICAgICBcIltjbGFzcy5uZy1wcmlzdGluZV1cIjogXCJfc2hvdWxkRm9yd2FyZCgncHJpc3RpbmUnKVwiLFxyXG4gICAgICAgIFwiW2NsYXNzLm5nLWRpcnR5XVwiOiBcIl9zaG91bGRGb3J3YXJkKCdkaXJ0eScpXCIsXHJcbiAgICAgICAgXCJbY2xhc3MubmctdmFsaWRdXCI6IFwiX3Nob3VsZEZvcndhcmQoJ3ZhbGlkJylcIixcclxuICAgICAgICBcIltjbGFzcy5uZy1pbnZhbGlkXVwiOiBcIl9zaG91bGRGb3J3YXJkKCdpbnZhbGlkJylcIixcclxuICAgICAgICBcIltjbGFzcy5uZy1wZW5kaW5nXVwiOiBcIl9zaG91bGRGb3J3YXJkKCdwZW5kaW5nJylcIlxyXG4gICAgfSxcclxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXHJcbiAgICB0ZW1wbGF0ZTogYDxsYWJlbCBbYXR0ci5mb3JdPVwiX2lucHV0Q2hpbGQuaWRcIiBjbGFzcz1cImZvcm0tY29udHJvbC1sYWJlbFwiPnt7bGFiZWx9fVxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwicmVxdWlyZWRcIiAqbmdJZj1cIl9pbnB1dENoaWxkLnJlcXVpcmVkXCI+Kjwvc3Bhbj5cclxuICAgICA8L2xhYmVsPlxyXG4gICAgIFxyXG4gICAgIDxkaXYgW2NsYXNzLmlucHV0LWdyb3VwXT1cIl9jb250YWluZXJIYXNUZXh0RmllbGRBZGRvbkNoaWxkcmVuXCI+XHJcbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwidGV4dC1maWVsZC1hZGRvbltwb3NpdGlvbj0nbGVmdCddXCI+PC9uZy1jb250ZW50PlxyXG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlucHV0LCB0ZXh0YXJlYVwiPjwvbmctY29udGVudD5cclxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJ0ZXh0LWZpZWxkLWFkZG9uW3Bvc2l0aW9uPSdyaWdodCddXCI+PC9uZy1jb250ZW50PlxyXG4gICAgIDwvZGl2PlxyXG4gICBcclxuICAgICA8ZGl2IFtuZ1N3aXRjaF09XCJ0aGlzLl9nZXREaXNwbGF5ZWRNZXNzYWdlcygpXCI+XHJcbiAgICAgICAgPGRpdiAqbmdTd2l0Y2hDYXNlPVwiJ2Vycm9yJ1wiIFtAdHJhbnNpdGlvbk1lc3NhZ2VzXT1cIl9mb3JtQ29udHJvbEZlZWRiYWNrQW5pbWF0aW9uU3RhdGVcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tY29udHJvbC1mZWVkYmFja1wiPnt7X2lucHV0Q2hpbGQuZ2V0Q3VzdG9tRXJyb3IoKX19PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiAqbmdTd2l0Y2hDYXNlPVwiJ3dhcm5pbmcnXCIgW0B0cmFuc2l0aW9uTWVzc2FnZXNdPVwiX2Zvcm1Db250cm9sRmVlZGJhY2tBbmltYXRpb25TdGF0ZVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1jb250cm9sLWZlZWRiYWNrXCI+e3tfZ2V0VmFsaWRhdGlvbk1lc3NhZ2UoKX19PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiAqbmdTd2l0Y2hDYXNlPVwiJ3N1Y2Nlc3MnXCIgW0B0cmFuc2l0aW9uTWVzc2FnZXNdPVwiX2Zvcm1Db250cm9sRmVlZGJhY2tBbmltYXRpb25TdGF0ZVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1jb250cm9sLWZlZWRiYWNrXCI+e3tfZ2V0U3VjY2Vzc01lc3NhZ2UoKX19PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiAqbmdTd2l0Y2hDYXNlPVwiJ2hpbnQnXCIgW0B0cmFuc2l0aW9uTWVzc2FnZXNdPVwiX2Zvcm1Db250cm9sRmVlZGJhY2tBbmltYXRpb25TdGF0ZVwiIGNsYXNzPVwiY2xlYXJmaXhcIj5cclxuICAgICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiaGludDpub3QoW2FsaWduPSdlbmQnXSlcIj48L25nLWNvbnRlbnQ+XHJcbiAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImhpbnRbYWxpZ249J2VuZCddXCI+PC9uZy1jb250ZW50PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgIDwvZGl2PmBcclxufSlcclxuZXhwb3J0IGNsYXNzIFRleHRGaWVsZENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIEFmdGVyQ29udGVudEluaXQsIEFmdGVyQ29udGVudENoZWNrZWQge1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgbGFiZWw6IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIG1lc3NhZ2VzOiBNYXA8c3RyaW5nLCBTZXQ8c3RyaW5nPj47XHJcblxyXG4gICAgQENvbnRlbnRDaGlsZChJbnB1dERpcmVjdGl2ZSlcclxuICAgIHByaXZhdGUgX2lucHV0Q2hpbGQ6IElucHV0RGlyZWN0aXZlO1xyXG5cclxuICAgIEBDb250ZW50Q2hpbGRyZW4oSGludERpcmVjdGl2ZSlcclxuICAgIHByaXZhdGUgX2hpbnRDaGlsZHJlbjogUXVlcnlMaXN0PEhpbnREaXJlY3RpdmU+O1xyXG4gICAgXHJcbiAgICBAQ29udGVudENoaWxkcmVuKFRleHRGaWVsZEFkZG9uRGlyZWN0aXZlKVxyXG4gICAgcHJpdmF0ZSBfdGV4dEZpZWxkQWRkb25DaGlsZHJlbjogUXVlcnlMaXN0PFRleHRGaWVsZEFkZG9uRGlyZWN0aXZlPjtcclxuXHJcbiAgICBwcml2YXRlIF9mb3JtQ29udHJvbEZlZWRiYWNrQW5pbWF0aW9uU3RhdGU6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIF9jb250YWluZXJIYXNUZXh0RmllbGRBZGRvbkNoaWxkcmVuOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXHJcbiAgICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2Zvcm1Db250cm9sRmVlZGJhY2tBbmltYXRpb25TdGF0ZSA9IFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl92YWxpZGF0ZUlucHV0Q2hpbGQoKTtcclxuICAgICAgICB0aGlzLl92YWxpZGF0ZUZpZWxkQWRkb25zKCk7XHJcbiAgICAgICAgdGhpcy5fcHJvY2Vzc0hpbnRzKCk7XHJcblxyXG4gICAgICAgIC8vUmV2YWxpZGF0ZSB3aGVuIHRoaW5ncyBjaGFuZ2VcclxuICAgICAgICB0aGlzLl9oaW50Q2hpbGRyZW4uY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fcHJvY2Vzc0hpbnRzKCkpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lckhhc1RleHRGaWVsZEFkZG9uQ2hpbGRyZW4gPSB0aGlzLl90ZXh0RmllbGRBZGRvbkNoaWxkcmVuLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl92YWxpZGF0ZUlucHV0Q2hpbGQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgICAgIC8vQXZvaWQgQW5pbWF0aW9ucyBvbiBMb2FkLlxyXG4gICAgICAgIHRoaXMuX2Zvcm1Db250cm9sRmVlZGJhY2tBbmltYXRpb25TdGF0ZSA9IFwiZW50ZXJcIjtcclxuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRvIGRpc3BsYXkgbWVzc2FnaW5nIGJhc2VkIG9uIHRoZSBzdGF0ZSBvZiB0aGUgZm9ybVxyXG4gICAgICogRGVmYXVsdHMgdG8gbm9uZSBpZiBubyBGZWVkYmFjayBNZXNzYWdlIERpcmVjdGl2ZXMgYXJlIGRlZmluZWRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfZ2V0RGlzcGxheWVkTWVzc2FnZXMoKTogXCJlcnJvclwiIHwgXCJoaW50XCIgfCBcIndhcm5pbmdcIiB8IFwic3VjY2Vzc1wiIHwgXCJub25lXCIge1xyXG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5faW5wdXRDaGlsZDtcclxuICAgICAgICBjb25zdCBoYXNIaW50czogYm9vbGVhbiA9ICh0aGlzLl9oaW50Q2hpbGRyZW4ubGVuZ3RoID4gMCAmJiB0aGlzLl9oaW50Q2hpbGRyZW4ubGVuZ3RoIDw9IDIpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMubWVzc2FnZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGhhc0hpbnRzID8gXCJoaW50XCIgOiBcIm5vbmVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGlucHV0LmlzRXJyb3JTdGF0ZSgpKSByZXR1cm4gXCJlcnJvclwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChpbnB1dC5pc1dhcm5pbmdTdGF0ZSgpKSByZXR1cm4gXCJ3YXJuaW5nXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGlucHV0LmlzU3VjY2Vzc1N0YXRlKCkpIHJldHVybiBcInN1Y2Nlc3NcIjtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gaGFzSGludHMgPyBcImhpbnRcIiA6IFwibm9uZVwiO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhIGNsYXNzIGZyb20gdGhlIE5nQ29udHJvbCBzaG91bGQgYmUgZm9yd2FyZGVkIHRvIHRoZSBob3N0IGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0gcHJvcFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9zaG91bGRGb3J3YXJkKHByb3A6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLl9pbnB1dENoaWxkID8gdGhpcy5faW5wdXRDaGlsZC5uZ0NvbnRyb2wgOiBudWxsO1xyXG4gICAgICAgIHJldHVybiBjb250cm9sICYmIChjb250cm9sIGFzIGFueSlbcHJvcF07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEb2VzIHRoZSBleHRyYSBwcm9jZXNzaW5nIHRoYXQgaXMgcmVxdWlyZWQgd2hlbiBoYW5kbGluZyB0aGUgaGludHMuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3Byb2Nlc3NIaW50cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl92YWxpZGF0ZUhpbnRzKCk7XHJcbiAgICAgICAgdGhpcy5fc3luY0FyaWFEZXNjcmliZWRCeSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEVuc3VyZSB0aGF0IHRoZXJlIGlzIGEgbWF4aW11bSBvZiBvbmUgb2YgZWFjaCBgZGl2W2hpbnRdYCBhbGlnbm1lbnQgc3BlY2lmaWVkXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3ZhbGlkYXRlSGludHMoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2hpbnRDaGlsZHJlbikge1xyXG4gICAgICAgICAgICBsZXQgc3RhcnRIaW50OiBIaW50RGlyZWN0aXZlO1xyXG4gICAgICAgICAgICBsZXQgZW5kSGludDogSGludERpcmVjdGl2ZTtcclxuICAgICAgICAgICAgdGhpcy5faGludENoaWxkcmVuLmZvckVhY2goKGhpbnQ6IEhpbnREaXJlY3RpdmUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChoaW50LmFsaWduID09PSBcInN0YXJ0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRIaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgaGludCB3YXMgYWxyZWFkeSBkZWNsYXJlZCBmb3IgYWxpZ249XFxcInN0YXJ0XFxcIi5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0SGludCA9IGhpbnQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhpbnQuYWxpZ24gPT09IFwiZW5kXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZW5kSGludCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIGhpbnQgd2FzIGFscmVhZHkgZGVjbGFyZWQgZm9yIGFsaWduPVxcXCJlbmRcXFwiLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZW5kSGludCA9IGhpbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGNoaWxkIGlucHV0J3MgYGFyaWEtZGVzY3JpYmVkYnlgIHRvIGEgc3BhY2Utc2VwYXJhdGVkIGxpc3Qgb2YgdGhlIGlkc1xyXG4gICAgICogb2YgdGhlIGN1cnJlbnRseS1zcGVjaWZpZWQgaGludHMsIGFzIHdlbGwgYXMgYSBnZW5lcmF0ZWQgaWQgZm9yIHRoZSBoaW50IGxhYmVsLlxyXG4gICAgICogQHJldHVybnMge30gXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3N5bmNBcmlhRGVzY3JpYmVkQnkoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lucHV0Q2hpbGQpIHtcclxuICAgICAgICAgICAgY29uc3QgaWRzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0SGludCA9IHRoaXMuX2hpbnRDaGlsZHJlbiA/IHRoaXMuX2hpbnRDaGlsZHJlbi5maW5kKGhpbnQgPT4gaGludC5hbGlnbiA9PT0gXCJzdGFydFwiKSA6IG51bGw7XHJcbiAgICAgICAgICAgIGNvbnN0IGVuZEhpbnQgPSB0aGlzLl9oaW50Q2hpbGRyZW4gPyB0aGlzLl9oaW50Q2hpbGRyZW4uZmluZChoaW50ID0+IGhpbnQuYWxpZ24gPT09IFwiZW5kXCIpIDogbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdGFydEhpbnQpXHJcbiAgICAgICAgICAgICAgICBpZHMucHVzaChzdGFydEhpbnQuaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGVuZEhpbnQpXHJcbiAgICAgICAgICAgICAgICBpZHMucHVzaChlbmRIaW50LmlkKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2lucHV0Q2hpbGQuYXJpYURlc2NyaWJlZEJ5ID0gaWRzLmpvaW4oXCIgXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRocm93cyBhbiBlcnJvciBpZiB0aGUgY29udGFpbmVyJ3MgaW5wdXQgY2hpbGQgd2FzIHJlbW92ZWQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3ZhbGlkYXRlSW5wdXRDaGlsZCgpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2lucHV0Q2hpbGQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZvcm0gQ29udHJvbCBtdXN0IGNvbnRhaW4gYW4gbWF2LWlucHV0IGRpcmVjdGl2ZS4gXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJEaWQgeW91IGZvcmdldCB0byBhZGQgbWF2LWlucHV0IHRvIHRoZSBuYXRpdmUgaW5wdXQgb3IgdGV4dGFyZWEgZWxlbWVudD9cIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdmFsaWRhdGVGaWVsZEFkZG9ucygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5faW5wdXRDaGlsZC5pc1RleHRBcmVhKCkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3RleHRGaWVsZEFkZG9uQ2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRm9ybSBDb250cm9sIENvbnRhaW5lciBkb2VzIG5vdCBhbGxvdyBmb3IgZmllbGQgYWRkb25zIHRvIGJlIGF0dGFjaGVkIHRvIGEgdGV4dCBhcmVhXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldFN1Y2Nlc3NNZXNzYWdlKCk6IFNldDxzdHJpbmc+IHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm1lc3NhZ2VzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZiAoIXRoaXMubWVzc2FnZXNbXCJzdWNjZXNzXCJdKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gdGhpcy5tZXNzYWdlc1tcInN1Y2Nlc3NcIl07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0VmFsaWRhdGlvbk1lc3NhZ2UoKTogU2V0PHN0cmluZz4ge1xyXG4gICAgICAgIGNvbnN0IGVycm9ycyA9IHRoaXMuX2lucHV0Q2hpbGQubmdDb250cm9sLmVycm9ycztcclxuXHJcbiAgICAgICAgaWYgKCFlcnJvcnMpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICghdGhpcy5tZXNzYWdlcykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHZhbGlkYXRpb25NZXNzYWdlOiBTZXQ8c3RyaW5nPjtcclxuXHJcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5tZXNzYWdlcykuc29tZShrZXkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3JzW2tleV0pIHtcclxuICAgICAgICAgICAgICAgIHZhbGlkYXRpb25NZXNzYWdlID0gdGhpcy5tZXNzYWdlc1trZXldO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdmFsaWRhdGlvbk1lc3NhZ2U7XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6Ii4vQ29udGVudC9hcHBsaWNhdGlvbiJ9
