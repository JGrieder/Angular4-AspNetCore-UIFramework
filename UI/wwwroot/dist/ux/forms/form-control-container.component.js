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
var input_group_addon_directive_1 = require("./input-group-addon.directive");
/**
 * TODO Create a CSS Class to make sure the required symbol appears as Red
 * TODO Consider implementing a means for a user to override the required symbol with something from Font-Awesome
 *
 * TODO Add Validation for Input Messages
 */
var FormControlContainerComponent = (function () {
    function FormControlContainerComponent(_elementRef, _changeDetectorRef) {
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._formControlFeedbackAnimationState = "";
    }
    FormControlContainerComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._validateInputChild();
        this._validateFieldAddons();
        this._processHints();
        //Revalidate when things change
        this._hintChildren.changes.subscribe(function () { return _this._processHints(); });
        this._containerHasInputGroupAddonChildren = this._inputGroupAddonChildren.length > 0;
    };
    FormControlContainerComponent.prototype.ngAfterContentChecked = function () {
        this._validateInputChild();
    };
    FormControlContainerComponent.prototype.ngAfterViewInit = function () {
        //Avoid Animations on Load.
        this._formControlFeedbackAnimationState = "enter";
        this._changeDetectorRef.detectChanges();
    };
    /**
     * Determines whether or not to display messaging based on the state of the form
     * Defaults to none if no Feedback Message Directives are defined
     */
    FormControlContainerComponent.prototype._getDisplayedMessages = function () {
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
    FormControlContainerComponent.prototype._shouldForward = function (prop) {
        var control = this._inputChild ? this._inputChild.ngControl : null;
        return control && control[prop];
    };
    /**
     * Does the extra processing that is required when handling the hints.
     */
    FormControlContainerComponent.prototype._processHints = function () {
        this._validateHints();
        this._syncAriaDescribedBy();
    };
    /**
     * Ensure that there is a maximum of one of each `div[hint]` alignment specified
     */
    FormControlContainerComponent.prototype._validateHints = function () {
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
    FormControlContainerComponent.prototype._syncAriaDescribedBy = function () {
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
    FormControlContainerComponent.prototype._validateInputChild = function () {
        if (!this._inputChild)
            throw new Error("Form Control must contain an mav-input directive. " +
                "Did you forget to add mav-input to the native input or textarea element?");
    };
    FormControlContainerComponent.prototype._validateFieldAddons = function () {
        if (this._inputChild.isTextArea()) {
            if (this._inputGroupAddonChildren.length > 0) {
                throw new Error("Form Control Container does not allow for field addons to be attached to a text area");
            }
        }
    };
    FormControlContainerComponent.prototype._getSuccessMessage = function () {
        if (!this.messages)
            return null;
        return this.messages["success"];
    };
    FormControlContainerComponent.prototype._getValidationMessage = function () {
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
    return FormControlContainerComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], FormControlContainerComponent.prototype, "label", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FormControlContainerComponent.prototype, "messages", void 0);
__decorate([
    core_1.ContentChild(input_directive_1.InputDirective),
    __metadata("design:type", input_directive_1.InputDirective)
], FormControlContainerComponent.prototype, "_inputChild", void 0);
__decorate([
    core_1.ContentChildren(hint_directive_1.HintDirective),
    __metadata("design:type", core_1.QueryList)
], FormControlContainerComponent.prototype, "_hintChildren", void 0);
__decorate([
    core_1.ContentChildren(input_group_addon_directive_1.InputGroupAddonDirective),
    __metadata("design:type", core_1.QueryList)
], FormControlContainerComponent.prototype, "_inputGroupAddonChildren", void 0);
FormControlContainerComponent = __decorate([
    core_1.Component({
        selector: "form-control",
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
            "[class.form-group]": "true",
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
        template: "<label [attr.for]=\"_inputChild.id\" class=\"form-control-label\">{{label}}\n        <span class=\"required\" *ngIf=\"_inputChild.required\">*</span>\n     </label>\n     \n     <div [class.input-group]=\"_containerHasInputGroupAddonChildren\">\n        <ng-content select=\"input-group-addon[type='prefix']\"></ng-content>\n        <ng-content select=\"input, textarea\"></ng-content>\n        <ng-content select=\"input-group-addon[type='suffix']\"></ng-content>\n     </div>\n   \n     <div [ngSwitch]=\"this._getDisplayedMessages()\">\n        <div *ngSwitchCase=\"'error'\" [@transitionMessages]=\"_formControlFeedbackAnimationState\">\n            <div class=\"form-control-feedback\">{{_inputChild.getCustomError()}}</div>\n        </div>\n        <div *ngSwitchCase=\"'warning'\" [@transitionMessages]=\"_formControlFeedbackAnimationState\">\n            <div class=\"form-control-feedback\">{{_getValidationMessage()}}</div>\n        </div>\n        <div *ngSwitchCase=\"'success'\" [@transitionMessages]=\"_formControlFeedbackAnimationState\">\n            <div class=\"form-control-feedback\">{{_getSuccessMessage()}}</div>\n        </div>\n        <div *ngSwitchCase=\"'hint'\" [@transitionMessages]=\"_formControlFeedbackAnimationState\" class=\"clearfix\">\n            <ng-content select=\"hint:not([align='end'])\"></ng-content>\n            <ng-content select=\"hint[align='end']\"></ng-content>\n        </div>\n     </div>"
    }),
    __metadata("design:paramtypes", [core_1.ElementRef,
        core_1.ChangeDetectorRef])
], FormControlContainerComponent);
exports.FormControlContainerComponent = FormControlContainerComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV4L2Zvcm1zL2Zvcm0tY29udHJvbC1jb250YWluZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBWXVCO0FBQ3ZCLGtEQUFpRjtBQUNqRixtREFBaUQ7QUFDakQscURBQW1EO0FBQ25ELDZFQUF5RTtBQUV6RTs7Ozs7R0FLRztBQXlESCxJQUFhLDZCQUE2QjtJQXFCdEMsdUNBQ1ksV0FBdUIsRUFDdkIsa0JBQXFDO1FBRHJDLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQ3ZCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFFN0MsSUFBSSxDQUFDLGtDQUFrQyxHQUFHLEVBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRU0sMERBQWtCLEdBQXpCO1FBQUEsaUJBUUM7UUFQRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFckIsK0JBQStCO1FBQy9CLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLGFBQWEsRUFBRSxFQUFwQixDQUFvQixDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLG9DQUFvQyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFFTSw2REFBcUIsR0FBNUI7UUFDSSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRU0sdURBQWUsR0FBdEI7UUFDSSwyQkFBMkI7UUFDM0IsSUFBSSxDQUFDLGtDQUFrQyxHQUFHLE9BQU8sQ0FBQztRQUNsRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDNUMsQ0FBQztJQUVEOzs7T0FHRztJQUNLLDZEQUFxQixHQUE3QjtRQUNJLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDL0IsSUFBTSxRQUFRLEdBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFNUYsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNqQixNQUFNLENBQUMsUUFBUSxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDdEMsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFFekMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUU3QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBRTdDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN0QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssc0RBQWMsR0FBdEIsVUFBdUIsSUFBWTtRQUMvQixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUNyRSxNQUFNLENBQUMsT0FBTyxJQUFLLE9BQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQ7O09BRUc7SUFDSyxxREFBYSxHQUFyQjtRQUNJLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBR0Q7O09BRUc7SUFDSyxzREFBYyxHQUF0QjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLElBQUksV0FBd0IsQ0FBQztZQUM3QixJQUFJLFNBQXNCLENBQUM7WUFDM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFtQjtnQkFDM0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUN6QixFQUFFLENBQUMsQ0FBQyxXQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsa0RBQWtELENBQUMsQ0FBQztvQkFDeEUsQ0FBQztvQkFDRCxXQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQzlCLEVBQUUsQ0FBQyxDQUFDLFNBQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO29CQUN0RSxDQUFDO29CQUNELFNBQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ25CLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLDREQUFvQixHQUE1QjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQU0sR0FBRyxHQUFrQixFQUFFLENBQUM7WUFDOUIsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxLQUFLLEtBQUssT0FBTyxFQUF0QixDQUFzQixDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3RHLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssRUFBcEIsQ0FBb0IsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUVsRyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUM7Z0JBQ1YsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFM0IsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNSLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXpCLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNLLDJEQUFtQixHQUEzQjtRQUNJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLG9EQUFvRDtnQkFDaEUsMEVBQTBFLENBQUMsQ0FBQztJQUN4RixDQUFDO0lBRU8sNERBQW9CLEdBQTVCO1FBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLElBQUksS0FBSyxDQUFDLHNGQUFzRixDQUFDLENBQUM7WUFDNUcsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRU8sMERBQWtCLEdBQTFCO1FBRUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRU8sNkRBQXFCLEdBQTdCO1FBQUEsaUJBaUJDO1FBaEJHLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUVqRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDekIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUVoQyxJQUFJLGlCQUE4QixDQUFDO1FBRW5DLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLEdBQUc7WUFDL0IsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZCxpQkFBaUIsR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2hCLENBQUM7WUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0lBQzdCLENBQUM7SUFDTCxvQ0FBQztBQUFELENBNUtBLEFBNEtDLElBQUE7QUF6S0c7SUFEQyxZQUFLLEVBQUU7OzREQUNhO0FBR3JCO0lBREMsWUFBSyxFQUFFOzsrREFDa0M7QUFHMUM7SUFEQyxtQkFBWSxDQUFDLGdDQUFjLENBQUM7OEJBQ1IsZ0NBQWM7a0VBQUM7QUFHcEM7SUFEQyxzQkFBZSxDQUFDLDhCQUFhLENBQUM7OEJBQ1IsZ0JBQVM7b0VBQWdCO0FBR2hEO0lBREMsc0JBQWUsQ0FBQyxzREFBd0IsQ0FBQzs4QkFDUixnQkFBUzsrRUFBMkI7QUFmN0QsNkJBQTZCO0lBdkR6QyxnQkFBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLGNBQWM7UUFDeEIsVUFBVSxFQUNWO1lBQ0ksb0JBQU8sQ0FBQyxvQkFBb0IsRUFDeEI7Z0JBQ0ksa0JBQUssQ0FBQyxPQUFPLEVBQUUsa0JBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQztnQkFDbEUsdUJBQVUsQ0FBQyxlQUFlLEVBQ3RCO29CQUNJLGtCQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxtQkFBbUIsRUFBRSxDQUFDO29CQUNyRCxvQkFBTyxDQUFDLHdDQUF3QyxDQUFDO2lCQUNwRCxDQUFDO2FBQ1QsQ0FBQztTQUNUO1FBQ0QsSUFBSSxFQUFFO1lBQ0YsY0FBYyxFQUFFLE1BQU07WUFDdEIsb0JBQW9CLEVBQUUsTUFBTTtZQUM1QixxQkFBcUIsRUFBRSw4QkFBOEI7WUFDckQscUJBQXFCLEVBQUUsOEJBQThCO1lBQ3JELG9CQUFvQixFQUFFLDRCQUE0QjtZQUNsRCxzQkFBc0IsRUFBRSw2QkFBNkI7WUFDckQsb0JBQW9CLEVBQUUsMkJBQTJCO1lBQ2pELHFCQUFxQixFQUFFLDRCQUE0QjtZQUNuRCxrQkFBa0IsRUFBRSx5QkFBeUI7WUFDN0Msa0JBQWtCLEVBQUUseUJBQXlCO1lBQzdDLG9CQUFvQixFQUFFLDJCQUEyQjtZQUNqRCxvQkFBb0IsRUFBRSwyQkFBMkI7U0FDcEQ7UUFDRCxhQUFhLEVBQUUsd0JBQWlCLENBQUMsSUFBSTtRQUNyQyxRQUFRLEVBQUUsbTZDQXdCRjtLQUNYLENBQUM7cUNBdUIyQixpQkFBVTtRQUNILHdCQUFpQjtHQXZCeEMsNkJBQTZCLENBNEt6QztBQTVLWSxzRUFBNkIiLCJmaWxlIjoidXgvZm9ybXMvZm9ybS1jb250cm9sLWNvbnRhaW5lci5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gICAgQ29tcG9uZW50LFxyXG4gICAgSW5wdXQsXHJcbiAgICBDb250ZW50Q2hpbGQsXHJcbiAgICBDb250ZW50Q2hpbGRyZW4sXHJcbiAgICBRdWVyeUxpc3QsXHJcbiAgICBWaWV3RW5jYXBzdWxhdGlvbixcclxuICAgIEFmdGVyVmlld0luaXQsXHJcbiAgICBBZnRlckNvbnRlbnRJbml0LFxyXG4gICAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcclxuICAgIEVsZW1lbnRSZWYsXHJcbiAgICBDaGFuZ2VEZXRlY3RvclJlZlxyXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IGFuaW1hdGUsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gXCJAYW5ndWxhci9hbmltYXRpb25zXCI7XHJcbmltcG9ydCB7IEhpbnREaXJlY3RpdmUgfSBmcm9tIFwiLi9oaW50LmRpcmVjdGl2ZVwiO1xyXG5pbXBvcnQgeyBJbnB1dERpcmVjdGl2ZSB9IGZyb20gXCIuL2lucHV0LmRpcmVjdGl2ZVwiO1xyXG5pbXBvcnQgeyBJbnB1dEdyb3VwQWRkb25EaXJlY3RpdmUgfSBmcm9tIFwiLi9pbnB1dC1ncm91cC1hZGRvbi5kaXJlY3RpdmVcIjtcclxuXHJcbi8qKlxyXG4gKiBUT0RPIENyZWF0ZSBhIENTUyBDbGFzcyB0byBtYWtlIHN1cmUgdGhlIHJlcXVpcmVkIHN5bWJvbCBhcHBlYXJzIGFzIFJlZFxyXG4gKiBUT0RPIENvbnNpZGVyIGltcGxlbWVudGluZyBhIG1lYW5zIGZvciBhIHVzZXIgdG8gb3ZlcnJpZGUgdGhlIHJlcXVpcmVkIHN5bWJvbCB3aXRoIHNvbWV0aGluZyBmcm9tIEZvbnQtQXdlc29tZVxyXG4gKlxyXG4gKiBUT0RPIEFkZCBWYWxpZGF0aW9uIGZvciBJbnB1dCBNZXNzYWdlc1xyXG4gKi9cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6IFwiZm9ybS1jb250cm9sXCIsXHJcbiAgICBhbmltYXRpb25zOlxyXG4gICAgW1xyXG4gICAgICAgIHRyaWdnZXIoXCJ0cmFuc2l0aW9uTWVzc2FnZXNcIixcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgc3RhdGUoXCJlbnRlclwiLCBzdHlsZSh7IG9wYWNpdHk6IDEsIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGVZKDAlKVwiIH0pKSxcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oXCJ2b2lkID0+IGVudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSh7IG9wYWNpdHk6IDAsIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGVZKC0xMDAlKVwiIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlKFwiMzAwbXMgY3ViaWMtYmV6aWVyKDAuNTUsIDAsIDAuNTUsIDAuMilcIilcclxuICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICBdKVxyXG4gICAgXSxcclxuICAgIGhvc3Q6IHtcclxuICAgICAgICBcIlthdHRyLmFsaWduXVwiOiBcIm51bGxcIixcclxuICAgICAgICBcIltjbGFzcy5mb3JtLWdyb3VwXVwiOiBcInRydWVcIixcclxuICAgICAgICBcIltjbGFzcy5oYXMtc3VjY2Vzc11cIjogXCJfaW5wdXRDaGlsZC5pc1N1Y2Nlc3NTdGF0ZSgpXCIsXHJcbiAgICAgICAgXCJbY2xhc3MuaGFzLXdhcm5pbmddXCI6IFwiX2lucHV0Q2hpbGQuaXNXYXJuaW5nU3RhdGUoKVwiLFxyXG4gICAgICAgIFwiW2NsYXNzLmhhcy1kYW5nZXJdXCI6IFwiX2lucHV0Q2hpbGQuaXNFcnJvclN0YXRlKClcIixcclxuICAgICAgICBcIltjbGFzcy5uZy11bnRvdWNoZWRdXCI6IFwiX3Nob3VsZEZvcndhcmQoJ3VudG91Y2hlZCcpXCIsXHJcbiAgICAgICAgXCJbY2xhc3MubmctdG91Y2hlZF1cIjogXCJfc2hvdWxkRm9yd2FyZCgndG91Y2hlZCcpXCIsXHJcbiAgICAgICAgXCJbY2xhc3MubmctcHJpc3RpbmVdXCI6IFwiX3Nob3VsZEZvcndhcmQoJ3ByaXN0aW5lJylcIixcclxuICAgICAgICBcIltjbGFzcy5uZy1kaXJ0eV1cIjogXCJfc2hvdWxkRm9yd2FyZCgnZGlydHknKVwiLFxyXG4gICAgICAgIFwiW2NsYXNzLm5nLXZhbGlkXVwiOiBcIl9zaG91bGRGb3J3YXJkKCd2YWxpZCcpXCIsXHJcbiAgICAgICAgXCJbY2xhc3MubmctaW52YWxpZF1cIjogXCJfc2hvdWxkRm9yd2FyZCgnaW52YWxpZCcpXCIsXHJcbiAgICAgICAgXCJbY2xhc3MubmctcGVuZGluZ11cIjogXCJfc2hvdWxkRm9yd2FyZCgncGVuZGluZycpXCJcclxuICAgIH0sXHJcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG4gICAgdGVtcGxhdGU6IGA8bGFiZWwgW2F0dHIuZm9yXT1cIl9pbnB1dENoaWxkLmlkXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wtbGFiZWxcIj57e2xhYmVsfX1cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInJlcXVpcmVkXCIgKm5nSWY9XCJfaW5wdXRDaGlsZC5yZXF1aXJlZFwiPio8L3NwYW4+XHJcbiAgICAgPC9sYWJlbD5cclxuICAgICBcclxuICAgICA8ZGl2IFtjbGFzcy5pbnB1dC1ncm91cF09XCJfY29udGFpbmVySGFzSW5wdXRHcm91cEFkZG9uQ2hpbGRyZW5cIj5cclxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpbnB1dC1ncm91cC1hZGRvblt0eXBlPSdwcmVmaXgnXVwiPjwvbmctY29udGVudD5cclxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpbnB1dCwgdGV4dGFyZWFcIj48L25nLWNvbnRlbnQ+XHJcbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiaW5wdXQtZ3JvdXAtYWRkb25bdHlwZT0nc3VmZml4J11cIj48L25nLWNvbnRlbnQ+XHJcbiAgICAgPC9kaXY+XHJcbiAgIFxyXG4gICAgIDxkaXYgW25nU3dpdGNoXT1cInRoaXMuX2dldERpc3BsYXllZE1lc3NhZ2VzKClcIj5cclxuICAgICAgICA8ZGl2ICpuZ1N3aXRjaENhc2U9XCInZXJyb3InXCIgW0B0cmFuc2l0aW9uTWVzc2FnZXNdPVwiX2Zvcm1Db250cm9sRmVlZGJhY2tBbmltYXRpb25TdGF0ZVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1jb250cm9sLWZlZWRiYWNrXCI+e3tfaW5wdXRDaGlsZC5nZXRDdXN0b21FcnJvcigpfX08L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2ICpuZ1N3aXRjaENhc2U9XCInd2FybmluZydcIiBbQHRyYW5zaXRpb25NZXNzYWdlc109XCJfZm9ybUNvbnRyb2xGZWVkYmFja0FuaW1hdGlvblN0YXRlXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWNvbnRyb2wtZmVlZGJhY2tcIj57e19nZXRWYWxpZGF0aW9uTWVzc2FnZSgpfX08L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2ICpuZ1N3aXRjaENhc2U9XCInc3VjY2VzcydcIiBbQHRyYW5zaXRpb25NZXNzYWdlc109XCJfZm9ybUNvbnRyb2xGZWVkYmFja0FuaW1hdGlvblN0YXRlXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWNvbnRyb2wtZmVlZGJhY2tcIj57e19nZXRTdWNjZXNzTWVzc2FnZSgpfX08L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2ICpuZ1N3aXRjaENhc2U9XCInaGludCdcIiBbQHRyYW5zaXRpb25NZXNzYWdlc109XCJfZm9ybUNvbnRyb2xGZWVkYmFja0FuaW1hdGlvblN0YXRlXCIgY2xhc3M9XCJjbGVhcmZpeFwiPlxyXG4gICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJoaW50Om5vdChbYWxpZ249J2VuZCddKVwiPjwvbmctY29udGVudD5cclxuICAgICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiaGludFthbGlnbj0nZW5kJ11cIj48L25nLWNvbnRlbnQ+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgPC9kaXY+YFxyXG59KVxyXG5leHBvcnQgY2xhc3MgRm9ybUNvbnRyb2xDb250YWluZXJDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBBZnRlckNvbnRlbnRJbml0LCBBZnRlckNvbnRlbnRDaGVja2VkIHtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIGxhYmVsOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBtZXNzYWdlczogTWFwPHN0cmluZywgU2V0PHN0cmluZz4+O1xyXG5cclxuICAgIEBDb250ZW50Q2hpbGQoSW5wdXREaXJlY3RpdmUpXHJcbiAgICBwcml2YXRlIF9pbnB1dENoaWxkOiBJbnB1dERpcmVjdGl2ZTtcclxuXHJcbiAgICBAQ29udGVudENoaWxkcmVuKEhpbnREaXJlY3RpdmUpXHJcbiAgICBwcml2YXRlIF9oaW50Q2hpbGRyZW46IFF1ZXJ5TGlzdDxIaW50RGlyZWN0aXZlPjtcclxuICAgIFxyXG4gICAgQENvbnRlbnRDaGlsZHJlbihJbnB1dEdyb3VwQWRkb25EaXJlY3RpdmUpXHJcbiAgICBwcml2YXRlIF9pbnB1dEdyb3VwQWRkb25DaGlsZHJlbjogUXVlcnlMaXN0PElucHV0R3JvdXBBZGRvbkRpcmVjdGl2ZT47XHJcblxyXG4gICAgcHJpdmF0ZSBfZm9ybUNvbnRyb2xGZWVkYmFja0FuaW1hdGlvblN0YXRlOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSBfY29udGFpbmVySGFzSW5wdXRHcm91cEFkZG9uQ2hpbGRyZW46IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcclxuICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fZm9ybUNvbnRyb2xGZWVkYmFja0FuaW1hdGlvblN0YXRlID0gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlSW5wdXRDaGlsZCgpO1xyXG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlRmllbGRBZGRvbnMoKTtcclxuICAgICAgICB0aGlzLl9wcm9jZXNzSGludHMoKTtcclxuXHJcbiAgICAgICAgLy9SZXZhbGlkYXRlIHdoZW4gdGhpbmdzIGNoYW5nZVxyXG4gICAgICAgIHRoaXMuX2hpbnRDaGlsZHJlbi5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9wcm9jZXNzSGludHMoKSk7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVySGFzSW5wdXRHcm91cEFkZG9uQ2hpbGRyZW4gPSB0aGlzLl9pbnB1dEdyb3VwQWRkb25DaGlsZHJlbi5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZ0FmdGVyQ29udGVudENoZWNrZWQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVJbnB1dENoaWxkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgICAgICAvL0F2b2lkIEFuaW1hdGlvbnMgb24gTG9hZC5cclxuICAgICAgICB0aGlzLl9mb3JtQ29udHJvbEZlZWRiYWNrQW5pbWF0aW9uU3RhdGUgPSBcImVudGVyXCI7XHJcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0byBkaXNwbGF5IG1lc3NhZ2luZyBiYXNlZCBvbiB0aGUgc3RhdGUgb2YgdGhlIGZvcm1cclxuICAgICAqIERlZmF1bHRzIHRvIG5vbmUgaWYgbm8gRmVlZGJhY2sgTWVzc2FnZSBEaXJlY3RpdmVzIGFyZSBkZWZpbmVkXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2dldERpc3BsYXllZE1lc3NhZ2VzKCk6IFwiZXJyb3JcIiB8IFwiaGludFwiIHwgXCJ3YXJuaW5nXCIgfCBcInN1Y2Nlc3NcIiB8IFwibm9uZVwiIHtcclxuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMuX2lucHV0Q2hpbGQ7XHJcbiAgICAgICAgY29uc3QgaGFzSGludHM6IGJvb2xlYW4gPSAodGhpcy5faGludENoaWxkcmVuLmxlbmd0aCA+IDAgJiYgdGhpcy5faGludENoaWxkcmVuLmxlbmd0aCA8PSAyKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm1lc3NhZ2VzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBoYXNIaW50cyA/IFwiaGludFwiIDogXCJub25lXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChpbnB1dC5pc0Vycm9yU3RhdGUoKSkgcmV0dXJuIFwiZXJyb3JcIjtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoaW5wdXQuaXNXYXJuaW5nU3RhdGUoKSkgcmV0dXJuIFwid2FybmluZ1wiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChpbnB1dC5pc1N1Y2Nlc3NTdGF0ZSgpKSByZXR1cm4gXCJzdWNjZXNzXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGhhc0hpbnRzID8gXCJoaW50XCIgOiBcIm5vbmVcIjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBjbGFzcyBmcm9tIHRoZSBOZ0NvbnRyb2wgc2hvdWxkIGJlIGZvcndhcmRlZCB0byB0aGUgaG9zdCBlbGVtZW50LlxyXG4gICAgICogQHBhcmFtIHByb3BcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfc2hvdWxkRm9yd2FyZChwcm9wOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCBjb250cm9sID0gdGhpcy5faW5wdXRDaGlsZCA/IHRoaXMuX2lucHV0Q2hpbGQubmdDb250cm9sIDogbnVsbDtcclxuICAgICAgICByZXR1cm4gY29udHJvbCAmJiAoY29udHJvbCBhcyBhbnkpW3Byb3BdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRG9lcyB0aGUgZXh0cmEgcHJvY2Vzc2luZyB0aGF0IGlzIHJlcXVpcmVkIHdoZW4gaGFuZGxpbmcgdGhlIGhpbnRzLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9wcm9jZXNzSGludHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVIaW50cygpO1xyXG4gICAgICAgIHRoaXMuX3N5bmNBcmlhRGVzY3JpYmVkQnkoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbnN1cmUgdGhhdCB0aGVyZSBpcyBhIG1heGltdW0gb2Ygb25lIG9mIGVhY2ggYGRpdltoaW50XWAgYWxpZ25tZW50IHNwZWNpZmllZFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF92YWxpZGF0ZUhpbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9oaW50Q2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgbGV0IHN0YXJ0SGludDogSGludERpcmVjdGl2ZTtcclxuICAgICAgICAgICAgbGV0IGVuZEhpbnQ6IEhpbnREaXJlY3RpdmU7XHJcbiAgICAgICAgICAgIHRoaXMuX2hpbnRDaGlsZHJlbi5mb3JFYWNoKChoaW50OiBIaW50RGlyZWN0aXZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaGludC5hbGlnbiA9PT0gXCJzdGFydFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0SGludCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIGhpbnQgd2FzIGFscmVhZHkgZGVjbGFyZWQgZm9yIGFsaWduPVxcXCJzdGFydFxcXCIuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzdGFydEhpbnQgPSBoaW50O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChoaW50LmFsaWduID09PSBcImVuZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZEhpbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQSBoaW50IHdhcyBhbHJlYWR5IGRlY2xhcmVkIGZvciBhbGlnbj1cXFwiZW5kXFxcIi5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVuZEhpbnQgPSBoaW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBjaGlsZCBpbnB1dCdzIGBhcmlhLWRlc2NyaWJlZGJ5YCB0byBhIHNwYWNlLXNlcGFyYXRlZCBsaXN0IG9mIHRoZSBpZHNcclxuICAgICAqIG9mIHRoZSBjdXJyZW50bHktc3BlY2lmaWVkIGhpbnRzLCBhcyB3ZWxsIGFzIGEgZ2VuZXJhdGVkIGlkIGZvciB0aGUgaGludCBsYWJlbC5cclxuICAgICAqIEByZXR1cm5zIHt9IFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9zeW5jQXJpYURlc2NyaWJlZEJ5KCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbnB1dENoaWxkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkczogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gICAgICAgICAgICBjb25zdCBzdGFydEhpbnQgPSB0aGlzLl9oaW50Q2hpbGRyZW4gPyB0aGlzLl9oaW50Q2hpbGRyZW4uZmluZChoaW50ID0+IGhpbnQuYWxpZ24gPT09IFwic3RhcnRcIikgOiBudWxsO1xyXG4gICAgICAgICAgICBjb25zdCBlbmRIaW50ID0gdGhpcy5faGludENoaWxkcmVuID8gdGhpcy5faGludENoaWxkcmVuLmZpbmQoaGludCA9PiBoaW50LmFsaWduID09PSBcImVuZFwiKSA6IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3RhcnRIaW50KVxyXG4gICAgICAgICAgICAgICAgaWRzLnB1c2goc3RhcnRIaW50LmlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlbmRIaW50KVxyXG4gICAgICAgICAgICAgICAgaWRzLnB1c2goZW5kSGludC5pZCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9pbnB1dENoaWxkLmFyaWFEZXNjcmliZWRCeSA9IGlkcy5qb2luKFwiIFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIGNvbnRhaW5lcidzIGlucHV0IGNoaWxkIHdhcyByZW1vdmVkLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF92YWxpZGF0ZUlucHV0Q2hpbGQoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pbnB1dENoaWxkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGb3JtIENvbnRyb2wgbXVzdCBjb250YWluIGFuIG1hdi1pbnB1dCBkaXJlY3RpdmUuIFwiICtcclxuICAgICAgICAgICAgICAgIFwiRGlkIHlvdSBmb3JnZXQgdG8gYWRkIG1hdi1pbnB1dCB0byB0aGUgbmF0aXZlIGlucHV0IG9yIHRleHRhcmVhIGVsZW1lbnQ/XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3ZhbGlkYXRlRmllbGRBZGRvbnMoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lucHV0Q2hpbGQuaXNUZXh0QXJlYSgpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbnB1dEdyb3VwQWRkb25DaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGb3JtIENvbnRyb2wgQ29udGFpbmVyIGRvZXMgbm90IGFsbG93IGZvciBmaWVsZCBhZGRvbnMgdG8gYmUgYXR0YWNoZWQgdG8gYSB0ZXh0IGFyZWFcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0U3VjY2Vzc01lc3NhZ2UoKTogU2V0PHN0cmluZz4ge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMubWVzc2FnZXMpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2VzW1wic3VjY2Vzc1wiXTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9nZXRWYWxpZGF0aW9uTWVzc2FnZSgpOiBTZXQ8c3RyaW5nPiB7XHJcbiAgICAgICAgY29uc3QgZXJyb3JzID0gdGhpcy5faW5wdXRDaGlsZC5uZ0NvbnRyb2wuZXJyb3JzO1xyXG5cclxuICAgICAgICBpZiAoIWVycm9ycykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKCF0aGlzLm1lc3NhZ2VzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgdmFsaWRhdGlvbk1lc3NhZ2U6IFNldDxzdHJpbmc+O1xyXG5cclxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLm1lc3NhZ2VzKS5zb21lKGtleSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcnNba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgdmFsaWRhdGlvbk1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2VzW2tleV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2YWxpZGF0aW9uTWVzc2FnZTtcclxuICAgIH1cclxufSJdLCJzb3VyY2VSb290IjoiLi9Db250ZW50L2FwcGxpY2F0aW9uIn0=
