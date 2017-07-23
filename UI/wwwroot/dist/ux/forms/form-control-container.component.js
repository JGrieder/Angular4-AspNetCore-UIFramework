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
var form_control_feedback_directive_1 = require("./form-control-feedback.directive");
var input_directive_1 = require("./input.directive");
var input_group_addon_directive_1 = require("./input-group-addon.directive");
/**
 * TODO Create a CSS Class to make sure the required symbol appears as Red
 * TODO Consider implementing a means for a user to override the required symbol with something from Font-Awesome
 *
 * TODO Make sure the control can support multiple validators
 * TODO Resolve custom validation message for form-control-feedback directives
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
        if (this._formControlFeedbackChildren.length < 0)
            return "none";
        if (this._hintChildren.length < 0)
            return "none";
        if (this._formControlFeedbackChildren.find(this._isErrorMessageDefined)) {
            if (input.isErrorState())
                return "error";
        }
        if (this._formControlFeedbackChildren.find(this._isWarningMessageDefined)) {
            if (input.isWarningState())
                return "warning";
        }
        if (this._formControlFeedbackChildren.find(this._isSuccessMessageDefined)) {
            if (input.isSuccessState())
                return "success";
        }
        return "hint";
    };
    /**
     * Predicate for seeing if at least one feedback message directive is defined with a type of 'error'
     * @param feedback
     */
    FormControlContainerComponent.prototype._isErrorMessageDefined = function (feedback) {
        return feedback.type === "error";
    };
    /**
     * Predicate for seeing if at least one feedback message directive is defined with a type of 'warning'
     * @param feedback
     */
    FormControlContainerComponent.prototype._isWarningMessageDefined = function (feedback) {
        return feedback.type === "warning";
    };
    /**
     * Predicate for seeing if at least one feedback message directive is defined with a type of 'success'
     * @param feedback
     */
    FormControlContainerComponent.prototype._isSuccessMessageDefined = function (feedback) {
        return feedback.type === "success";
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
    return FormControlContainerComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], FormControlContainerComponent.prototype, "label", void 0);
__decorate([
    core_1.ContentChild(input_directive_1.InputDirective),
    __metadata("design:type", input_directive_1.InputDirective)
], FormControlContainerComponent.prototype, "_inputChild", void 0);
__decorate([
    core_1.ContentChildren(hint_directive_1.HintDirective),
    __metadata("design:type", core_1.QueryList)
], FormControlContainerComponent.prototype, "_hintChildren", void 0);
__decorate([
    core_1.ContentChildren(form_control_feedback_directive_1.FormControlFeedbackDirective),
    __metadata("design:type", core_1.QueryList)
], FormControlContainerComponent.prototype, "_formControlFeedbackChildren", void 0);
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
        template: "<label [attr.for]=\"_inputChild.id\" class=\"form-control-label\">{{label}}\n        <span class=\"required\" *ngIf=\"_inputChild.required\">*</span>\n     </label>\n     \n     <div [class.input-group]=\"_containerHasInputGroupAddonChildren\">\n        <ng-content select=\"input-group-addon[type='prefix']\"></ng-content>\n        <ng-content select=\"input, textarea\"></ng-content>\n        <ng-content select=\"input-group-addon[type='suffix']\"></ng-content>\n     </div>\n   \n     <div [ngSwitch]=\"this._getDisplayedMessages()\">\n        <div *ngSwitchCase=\"'error'\" [@transitionMessages]=\"_formControlFeedbackAnimationState\">\n            <ng-content select=\"form-control-feedback[type='error']\"></ng-content>\n        </div>\n        <div *ngSwitchCase=\"'warning'\" [@transitionMessages]=\"_formControlFeedbackAnimationState\">\n            <ng-content select=\"form-control-feedback[type='warning']\"></ng-content>\n        </div>\n        <div *ngSwitchCase=\"'success'\" [@transitionMessages]=\"_formControlFeedbackAnimationState\">\n            <ng-content select=\"form-control-feedback[type='success']\"></ng-content>\n        </div>\n        <div *ngSwitchCase=\"'hint'\" [@transitionMessages]=\"_formControlFeedbackAnimationState\" class=\"clearfix\">\n            <ng-content select=\"hint:not([align='end'])\"></ng-content>\n            <ng-content select=\"hint[align='end']\"></ng-content>\n        </div>\n     </div>"
    }),
    __metadata("design:paramtypes", [core_1.ElementRef,
        core_1.ChangeDetectorRef])
], FormControlContainerComponent);
exports.FormControlContainerComponent = FormControlContainerComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV4L2Zvcm1zL2Zvcm0tY29udHJvbC1jb250YWluZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBWXVCO0FBQ3ZCLGtEQUFpRjtBQUNqRixtREFBaUQ7QUFDakQscUZBQWlGO0FBQ2pGLHFEQUFtRDtBQUNuRCw2RUFBeUU7QUFFekU7Ozs7OztHQU1HO0FBeURILElBQWEsNkJBQTZCO0lBcUJ0Qyx1Q0FDWSxXQUF1QixFQUN2QixrQkFBcUM7UUFEckMsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDdkIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtRQUU3QyxJQUFJLENBQUMsa0NBQWtDLEdBQUcsRUFBRSxDQUFDO0lBQ2pELENBQUM7SUFFTSwwREFBa0IsR0FBekI7UUFBQSxpQkFRQztRQVBHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUVyQiwrQkFBK0I7UUFDL0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsYUFBYSxFQUFFLEVBQXBCLENBQW9CLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsb0NBQW9DLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDekYsQ0FBQztJQUVNLDZEQUFxQixHQUE1QjtRQUNJLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFTSx1REFBZSxHQUF0QjtRQUNJLDJCQUEyQjtRQUMzQixJQUFJLENBQUMsa0NBQWtDLEdBQUcsT0FBTyxDQUFDO1FBQ2xELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssNkRBQXFCLEdBQTdCO1FBQ0ksSUFBTSxLQUFL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O1FBQ0QsSUFBSSxFQUFFO1lBQ0YsY0FBYyxFQUFFLE1BQU07WUFDdEIsb0JBQW9CLEVBQUUsTUFBTTtZQUM1QixxQkFBcUIsRUFBRSw4QkFBOEI7WUFDckQscUJBQXFCLEVBQUUsOEJBQThCO1lBQ3JELG9CQUFvQixFQUFFLDRCQUE0QjtZQUNsRCxzQkFBc0IsRUFBRSw2QkFBNkI7WUFDckQsb0JBQW9CLEVBQUUsMkJBQTJCO1lBQ2pELHFCQUFxQixFQUFFLDRCQUE0QjtZQUNuRCxrQkFBa0IsRUFBRSx5QkFBeUI7WUFDN0Msa0JBQWtCLEVBQUUseUJBQXlCO1lBQzdDLG9CQUFvQixFQUFFLDJCQUEyQjtZQUNqRCxvQkFBb0IsRUFBRSwyQkFBMkI7U0FDcEQ7UUFDRCxhQUFhLEVBQUUsd0JBQWlCLENBQUMsSUFBSTtRQUNyQyxRQUFRLEVBQUMsMjZDQXdCRDtLQUNYLENBQUM7cUNBdUIyQixpQkFBVTtRQUNILHdCQUFpQjtHQXZCeEMsNkJBQTZCLENBK0t6QztBQS9LWSxzRUFBNkIiLCJmaWxlIjoidXgvZm9ybXMvZm9ybS1jb250cm9sLWNvbnRhaW5lci5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gICAgQ29tcG9uZW50LFxyXG4gICAgSW5wdXQsXHJcbiAgICBDb250ZW50Q2hpbGQsXHJcbiAgICBDb250ZW50Q2hpbGRyZW4sXHJcbiAgICBRdWVyeUxpc3QsXHJcbiAgICBWaWV3RW5jYXBzdWxhdGlvbixcclxuICAgIEFmdGVyVmlld0luaXQsXHJcbiAgICBBZnRlckNvbnRlbnRJbml0LFxyXG4gICAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcclxuICAgIEVsZW1lbnRSZWYsXHJcbiAgICBDaGFuZ2VEZXRlY3RvclJlZlxyXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IGFuaW1hdGUsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gXCJAYW5ndWxhci9hbmltYXRpb25zXCI7XHJcbmltcG9ydCB7IEhpbnREaXJlY3RpdmUgfSBmcm9tIFwiLi9oaW50LmRpcmVjdGl2ZVwiO1xyXG5pbXBvcnQgeyBGb3JtQ29udHJvbEZlZWRiYWNrRGlyZWN0aXZlIH0gZnJvbSBcIi4vZm9ybS1jb250cm9sLWZlZWRiYWNrLmRpcmVjdGl2ZVwiO1xyXG5pbXBvcnQgeyBJbnB1dERpcmVjdGl2ZSB9IGZyb20gXCIuL2lucHV0LmRpcmVjdGl2ZVwiO1xyXG5pbXBvcnQgeyBJbnB1dEdyb3VwQWRkb25EaXJlY3RpdmUgfSBmcm9tIFwiLi9pbnB1dC1ncm91cC1hZGRvbi5kaXJlY3RpdmVcIjtcclxuXHJcbi8qKlxyXG4gKiBUT0RPIENyZWF0ZSBhIENTUyBDbGFzcyB0byBtYWtlIHN1cmUgdGhlIHJlcXVpcmVkIHN5bWJvbCBhcHBlYXJzIGFzIFJlZFxyXG4gKiBUT0RPIENvbnNpZGVyIGltcGxlbWVudGluZyBhIG1lYW5zIGZvciBhIHVzZXIgdG8gb3ZlcnJpZGUgdGhlIHJlcXVpcmVkIHN5bWJvbCB3aXRoIHNvbWV0aGluZyBmcm9tIEZvbnQtQXdlc29tZVxyXG4gKlxyXG4gKiBUT0RPIE1ha2Ugc3VyZSB0aGUgY29udHJvbCBjYW4gc3VwcG9ydCBtdWx0aXBsZSB2YWxpZGF0b3JzXHJcbiAqIFRPRE8gUmVzb2x2ZSBjdXN0b20gdmFsaWRhdGlvbiBtZXNzYWdlIGZvciBmb3JtLWNvbnRyb2wtZmVlZGJhY2sgZGlyZWN0aXZlc1xyXG4gKi9cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6IFwiZm9ybS1jb250cm9sXCIsXHJcbiAgICBhbmltYXRpb25zOlxyXG4gICAgW1xyXG4gICAgICAgIHRyaWdnZXIoXCJ0cmFuc2l0aW9uTWVzc2FnZXNcIixcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgc3RhdGUoXCJlbnRlclwiLCBzdHlsZSh7IG9wYWNpdHk6IDEsIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGVZKDAlKVwiIH0pKSxcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oXCJ2b2lkID0+IGVudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSh7IG9wYWNpdHk6IDAsIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGVZKC0xMDAlKVwiIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlKFwiMzAwbXMgY3ViaWMtYmV6aWVyKDAuNTUsIDAsIDAuNTUsIDAuMilcIilcclxuICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICBdKVxyXG4gICAgXSxcclxuICAgIGhvc3Q6IHtcclxuICAgICAgICBcIlthdHRyLmFsaWduXVwiOiBcIm51bGxcIixcclxuICAgICAgICBcIltjbGFzcy5mb3JtLWdyb3VwXVwiOiBcInRydWVcIixcclxuICAgICAgICBcIltjbGFzcy5oYXMtc3VjY2Vzc11cIjogXCJfaW5wdXRDaGlsZC5pc1N1Y2Nlc3NTdGF0ZSgpXCIsXHJcbiAgICAgICAgXCJbY2xhc3MuaGFzLXdhcm5pbmddXCI6IFwiX2lucHV0Q2hpbGQuaXNXYXJuaW5nU3RhdGUoKVwiLFxyXG4gICAgICAgIFwiW2NsYXNzLmhhcy1kYW5nZXJdXCI6IFwiX2lucHV0Q2hpbGQuaXNFcnJvclN0YXRlKClcIixcclxuICAgICAgICBcIltjbGFzcy5uZy11bnRvdWNoZWRdXCI6IFwiX3Nob3VsZEZvcndhcmQoJ3VudG91Y2hlZCcpXCIsXHJcbiAgICAgICAgXCJbY2xhc3MubmctdG91Y2hlZF1cIjogXCJfc2hvdWxkRm9yd2FyZCgndG91Y2hlZCcpXCIsXHJcbiAgICAgICAgXCJbY2xhc3MubmctcHJpc3RpbmVdXCI6IFwiX3Nob3VsZEZvcndhcmQoJ3ByaXN0aW5lJylcIixcclxuICAgICAgICBcIltjbGFzcy5uZy1kaXJ0eV1cIjogXCJfc2hvdWxkRm9yd2FyZCgnZGlydHknKVwiLFxyXG4gICAgICAgIFwiW2NsYXNzLm5nLXZhbGlkXVwiOiBcIl9zaG91bGRGb3J3YXJkKCd2YWxpZCcpXCIsXHJcbiAgICAgICAgXCJbY2xhc3MubmctaW52YWxpZF1cIjogXCJfc2hvdWxkRm9yd2FyZCgnaW52YWxpZCcpXCIsXHJcbiAgICAgICAgXCJbY2xhc3MubmctcGVuZGluZ11cIjogXCJfc2hvdWxkRm9yd2FyZCgncGVuZGluZycpXCJcclxuICAgIH0sXHJcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG4gICAgdGVtcGxhdGU6YDxsYWJlbCBbYXR0ci5mb3JdPVwiX2lucHV0Q2hpbGQuaWRcIiBjbGFzcz1cImZvcm0tY29udHJvbC1sYWJlbFwiPnt7bGFiZWx9fVxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwicmVxdWlyZWRcIiAqbmdJZj1cIl9pbnB1dENoaWxkLnJlcXVpcmVkXCI+Kjwvc3Bhbj5cclxuICAgICA8L2xhYmVsPlxyXG4gICAgIFxyXG4gICAgIDxkaXYgW2NsYXNzLmlucHV0LWdyb3VwXT1cIl9jb250YWluZXJIYXNJbnB1dEdyb3VwQWRkb25DaGlsZHJlblwiPlxyXG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlucHV0LWdyb3VwLWFkZG9uW3R5cGU9J3ByZWZpeCddXCI+PC9uZy1jb250ZW50PlxyXG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlucHV0LCB0ZXh0YXJlYVwiPjwvbmctY29udGVudD5cclxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpbnB1dC1ncm91cC1hZGRvblt0eXBlPSdzdWZmaXgnXVwiPjwvbmctY29udGVudD5cclxuICAgICA8L2Rpdj5cclxuICAgXHJcbiAgICAgPGRpdiBbbmdTd2l0Y2hdPVwidGhpcy5fZ2V0RGlzcGxheWVkTWVzc2FnZXMoKVwiPlxyXG4gICAgICAgIDxkaXYgKm5nU3dpdGNoQ2FzZT1cIidlcnJvcidcIiBbQHRyYW5zaXRpb25NZXNzYWdlc109XCJfZm9ybUNvbnRyb2xGZWVkYmFja0FuaW1hdGlvblN0YXRlXCI+XHJcbiAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImZvcm0tY29udHJvbC1mZWVkYmFja1t0eXBlPSdlcnJvciddXCI+PC9uZy1jb250ZW50PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgKm5nU3dpdGNoQ2FzZT1cIid3YXJuaW5nJ1wiIFtAdHJhbnNpdGlvbk1lc3NhZ2VzXT1cIl9mb3JtQ29udHJvbEZlZWRiYWNrQW5pbWF0aW9uU3RhdGVcIj5cclxuICAgICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiZm9ybS1jb250cm9sLWZlZWRiYWNrW3R5cGU9J3dhcm5pbmcnXVwiPjwvbmctY29udGVudD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2ICpuZ1N3aXRjaENhc2U9XCInc3VjY2VzcydcIiBbQHRyYW5zaXRpb25NZXNzYWdlc109XCJfZm9ybUNvbnRyb2xGZWVkYmFja0FuaW1hdGlvblN0YXRlXCI+XHJcbiAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImZvcm0tY29udHJvbC1mZWVkYmFja1t0eXBlPSdzdWNjZXNzJ11cIj48L25nLWNvbnRlbnQ+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiAqbmdTd2l0Y2hDYXNlPVwiJ2hpbnQnXCIgW0B0cmFuc2l0aW9uTWVzc2FnZXNdPVwiX2Zvcm1Db250cm9sRmVlZGJhY2tBbmltYXRpb25TdGF0ZVwiIGNsYXNzPVwiY2xlYXJmaXhcIj5cclxuICAgICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiaGludDpub3QoW2FsaWduPSdlbmQnXSlcIj48L25nLWNvbnRlbnQ+XHJcbiAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImhpbnRbYWxpZ249J2VuZCddXCI+PC9uZy1jb250ZW50PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgIDwvZGl2PmBcclxufSlcclxuZXhwb3J0IGNsYXNzIEZvcm1Db250cm9sQ29udGFpbmVyQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJDb250ZW50Q2hlY2tlZCB7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBsYWJlbDogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBAQ29udGVudENoaWxkKElucHV0RGlyZWN0aXZlKVxyXG4gICAgcHJpdmF0ZSBfaW5wdXRDaGlsZDogSW5wdXREaXJlY3RpdmU7XHJcblxyXG4gICAgQENvbnRlbnRDaGlsZHJlbihIaW50RGlyZWN0aXZlKVxyXG4gICAgcHJpdmF0ZSBfaGludENoaWxkcmVuOiBRdWVyeUxpc3Q8SGludERpcmVjdGl2ZT47XHJcblxyXG4gICAgQENvbnRlbnRDaGlsZHJlbihGb3JtQ29udHJvbEZlZWRiYWNrRGlyZWN0aXZlKVxyXG4gICAgcHJpdmF0ZSBfZm9ybUNvbnRyb2xGZWVkYmFja0NoaWxkcmVuOiBRdWVyeUxpc3Q8Rm9ybUNvbnRyb2xGZWVkYmFja0RpcmVjdGl2ZT47XHJcblxyXG4gICAgQENvbnRlbnRDaGlsZHJlbihJbnB1dEdyb3VwQWRkb25EaXJlY3RpdmUpXHJcbiAgICBwcml2YXRlIF9pbnB1dEdyb3VwQWRkb25DaGlsZHJlbjogUXVlcnlMaXN0PElucHV0R3JvdXBBZGRvbkRpcmVjdGl2ZT47XHJcblxyXG4gICAgcHJpdmF0ZSBfZm9ybUNvbnRyb2xGZWVkYmFja0FuaW1hdGlvblN0YXRlOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSBfY29udGFpbmVySGFzSW5wdXRHcm91cEFkZG9uQ2hpbGRyZW46IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcclxuICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fZm9ybUNvbnRyb2xGZWVkYmFja0FuaW1hdGlvblN0YXRlID0gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlSW5wdXRDaGlsZCgpO1xyXG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlRmllbGRBZGRvbnMoKTtcclxuICAgICAgICB0aGlzLl9wcm9jZXNzSGludHMoKTtcclxuXHJcbiAgICAgICAgLy9SZXZhbGlkYXRlIHdoZW4gdGhpbmdzIGNoYW5nZVxyXG4gICAgICAgIHRoaXMuX2hpbnRDaGlsZHJlbi5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9wcm9jZXNzSGludHMoKSk7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVySGFzSW5wdXRHcm91cEFkZG9uQ2hpbGRyZW4gPSB0aGlzLl9pbnB1dEdyb3VwQWRkb25DaGlsZHJlbi5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZ0FmdGVyQ29udGVudENoZWNrZWQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVJbnB1dENoaWxkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgICAgICAvL0F2b2lkIEFuaW1hdGlvbnMgb24gTG9hZC5cclxuICAgICAgICB0aGlzLl9mb3JtQ29udHJvbEZlZWRiYWNrQW5pbWF0aW9uU3RhdGUgPSBcImVudGVyXCI7XHJcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0byBkaXNwbGF5IG1lc3NhZ2luZyBiYXNlZCBvbiB0aGUgc3RhdGUgb2YgdGhlIGZvcm1cclxuICAgICAqIERlZmF1bHRzIHRvIG5vbmUgaWYgbm8gRmVlZGJhY2sgTWVzc2FnZSBEaXJlY3RpdmVzIGFyZSBkZWZpbmVkXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2dldERpc3BsYXllZE1lc3NhZ2VzKCk6IFwiZXJyb3JcIiB8IFwiaGludFwiIHwgXCJ3YXJuaW5nXCIgfCBcInN1Y2Nlc3NcIiB8IFwibm9uZVwiIHtcclxuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMuX2lucHV0Q2hpbGQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9mb3JtQ29udHJvbEZlZWRiYWNrQ2hpbGRyZW4ubGVuZ3RoIDwgMCkgcmV0dXJuIFwibm9uZVwiO1xyXG4gICAgICAgIGlmICh0aGlzLl9oaW50Q2hpbGRyZW4ubGVuZ3RoIDwgMCkgcmV0dXJuIFwibm9uZVwiO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fZm9ybUNvbnRyb2xGZWVkYmFja0NoaWxkcmVuLmZpbmQodGhpcy5faXNFcnJvck1lc3NhZ2VEZWZpbmVkKSkge1xyXG4gICAgICAgICAgICBpZiAoaW5wdXQuaXNFcnJvclN0YXRlKCkpIHJldHVybiBcImVycm9yXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fZm9ybUNvbnRyb2xGZWVkYmFja0NoaWxkcmVuLmZpbmQodGhpcy5faXNXYXJuaW5nTWVzc2FnZURlZmluZWQpKSB7XHJcbiAgICAgICAgICAgIGlmIChpbnB1dC5pc1dhcm5pbmdTdGF0ZSgpKSByZXR1cm4gXCJ3YXJuaW5nXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fZm9ybUNvbnRyb2xGZWVkYmFja0NoaWxkcmVuLmZpbmQodGhpcy5faXNTdWNjZXNzTWVzc2FnZURlZmluZWQpKSB7XHJcbiAgICAgICAgICAgIGlmIChpbnB1dC5pc1N1Y2Nlc3NTdGF0ZSgpKSByZXR1cm4gXCJzdWNjZXNzXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gXCJoaW50XCI7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogUHJlZGljYXRlIGZvciBzZWVpbmcgaWYgYXQgbGVhc3Qgb25lIGZlZWRiYWNrIG1lc3NhZ2UgZGlyZWN0aXZlIGlzIGRlZmluZWQgd2l0aCBhIHR5cGUgb2YgJ2Vycm9yJ1xyXG4gICAgICogQHBhcmFtIGZlZWRiYWNrXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2lzRXJyb3JNZXNzYWdlRGVmaW5lZChmZWVkYmFjazogRm9ybUNvbnRyb2xGZWVkYmFja0RpcmVjdGl2ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBmZWVkYmFjay50eXBlID09PSBcImVycm9yXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcmVkaWNhdGUgZm9yIHNlZWluZyBpZiBhdCBsZWFzdCBvbmUgZmVlZGJhY2sgbWVzc2FnZSBkaXJlY3RpdmUgaXMgZGVmaW5lZCB3aXRoIGEgdHlwZSBvZiAnd2FybmluZydcclxuICAgICAqIEBwYXJhbSBmZWVkYmFja1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9pc1dhcm5pbmdNZXNzYWdlRGVmaW5lZChmZWVkYmFjazogRm9ybUNvbnRyb2xGZWVkYmFja0RpcmVjdGl2ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBmZWVkYmFjay50eXBlID09PSBcIndhcm5pbmdcIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByZWRpY2F0ZSBmb3Igc2VlaW5nIGlmIGF0IGxlYXN0IG9uZSBmZWVkYmFjayBtZXNzYWdlIGRpcmVjdGl2ZSBpcyBkZWZpbmVkIHdpdGggYSB0eXBlIG9mICdzdWNjZXNzJ1xyXG4gICAgICogQHBhcmFtIGZlZWRiYWNrXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2lzU3VjY2Vzc01lc3NhZ2VEZWZpbmVkKGZlZWRiYWNrOiBGb3JtQ29udHJvbEZlZWRiYWNrRGlyZWN0aXZlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIGZlZWRiYWNrLnR5cGUgPT09IFwic3VjY2Vzc1wiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgY2xhc3MgZnJvbSB0aGUgTmdDb250cm9sIHNob3VsZCBiZSBmb3J3YXJkZWQgdG8gdGhlIGhvc3QgZWxlbWVudC5cclxuICAgICAqIEBwYXJhbSBwcm9wXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3Nob3VsZEZvcndhcmQocHJvcDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgY29udHJvbCA9IHRoaXMuX2lucHV0Q2hpbGQgPyB0aGlzLl9pbnB1dENoaWxkLm5nQ29udHJvbCA6IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIGNvbnRyb2wgJiYgKGNvbnRyb2wgYXMgYW55KVtwcm9wXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERvZXMgdGhlIGV4dHJhIHByb2Nlc3NpbmcgdGhhdCBpcyByZXF1aXJlZCB3aGVuIGhhbmRsaW5nIHRoZSBoaW50cy5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfcHJvY2Vzc0hpbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlSGludHMoKTtcclxuICAgICAgICB0aGlzLl9zeW5jQXJpYURlc2NyaWJlZEJ5KCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRW5zdXJlIHRoYXQgdGhlcmUgaXMgYSBtYXhpbXVtIG9mIG9uZSBvZiBlYWNoIGBkaXZbaGludF1gIGFsaWdubWVudCBzcGVjaWZpZWRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfdmFsaWRhdGVIaW50cygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5faGludENoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGxldCBzdGFydEhpbnQ6IEhpbnREaXJlY3RpdmU7XHJcbiAgICAgICAgICAgIGxldCBlbmRIaW50OiBIaW50RGlyZWN0aXZlO1xyXG4gICAgICAgICAgICB0aGlzLl9oaW50Q2hpbGRyZW4uZm9yRWFjaCgoaGludDogSGludERpcmVjdGl2ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGhpbnQuYWxpZ24gPT09IFwic3RhcnRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFydEhpbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQSBoaW50IHdhcyBhbHJlYWR5IGRlY2xhcmVkIGZvciBhbGlnbj1cXFwic3RhcnRcXFwiLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRIaW50ID0gaGludDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGludC5hbGlnbiA9PT0gXCJlbmRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmRIaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgaGludCB3YXMgYWxyZWFkeSBkZWNsYXJlZCBmb3IgYWxpZ249XFxcImVuZFxcXCIuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbmRIaW50ID0gaGludDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgY2hpbGQgaW5wdXQncyBgYXJpYS1kZXNjcmliZWRieWAgdG8gYSBzcGFjZS1zZXBhcmF0ZWQgbGlzdCBvZiB0aGUgaWRzXHJcbiAgICAgKiBvZiB0aGUgY3VycmVudGx5LXNwZWNpZmllZCBoaW50cywgYXMgd2VsbCBhcyBhIGdlbmVyYXRlZCBpZCBmb3IgdGhlIGhpbnQgbGFiZWwuXHJcbiAgICAgKiBAcmV0dXJucyB7fSBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfc3luY0FyaWFEZXNjcmliZWRCeSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5faW5wdXRDaGlsZCkge1xyXG4gICAgICAgICAgICBjb25zdCBpZHM6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuICAgICAgICAgICAgY29uc3Qgc3RhcnRIaW50ID0gdGhpcy5faGludENoaWxkcmVuID8gdGhpcy5faGludENoaWxkcmVuLmZpbmQoaGludCA9PiBoaW50LmFsaWduID09PSBcInN0YXJ0XCIpIDogbnVsbDtcclxuICAgICAgICAgICAgY29uc3QgZW5kSGludCA9IHRoaXMuX2hpbnRDaGlsZHJlbiA/IHRoaXMuX2hpbnRDaGlsZHJlbi5maW5kKGhpbnQgPT4gaGludC5hbGlnbiA9PT0gXCJlbmRcIikgOiBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0YXJ0SGludClcclxuICAgICAgICAgICAgICAgIGlkcy5wdXNoKHN0YXJ0SGludC5pZCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZW5kSGludClcclxuICAgICAgICAgICAgICAgIGlkcy5wdXNoKGVuZEhpbnQuaWQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5faW5wdXRDaGlsZC5hcmlhRGVzY3JpYmVkQnkgPSBpZHMuam9pbihcIiBcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBjb250YWluZXIncyBpbnB1dCBjaGlsZCB3YXMgcmVtb3ZlZC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfdmFsaWRhdGVJbnB1dENoaWxkKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5faW5wdXRDaGlsZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRm9ybSBDb250cm9sIG11c3QgY29udGFpbiBhbiBtYXYtaW5wdXQgZGlyZWN0aXZlLiBcIiArXHJcbiAgICAgICAgICAgICAgICBcIkRpZCB5b3UgZm9yZ2V0IHRvIGFkZCBtYXYtaW5wdXQgdG8gdGhlIG5hdGl2ZSBpbnB1dCBvciB0ZXh0YXJlYSBlbGVtZW50P1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF92YWxpZGF0ZUZpZWxkQWRkb25zKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbnB1dENoaWxkLmlzVGV4dEFyZWEoKSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5faW5wdXRHcm91cEFkZG9uQ2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRm9ybSBDb250cm9sIENvbnRhaW5lciBkb2VzIG5vdCBhbGxvdyBmb3IgZmllbGQgYWRkb25zIHRvIGJlIGF0dGFjaGVkIHRvIGEgdGV4dCBhcmVhXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiIuL0NvbnRlbnQvYXBwbGljYXRpb24ifQ==
