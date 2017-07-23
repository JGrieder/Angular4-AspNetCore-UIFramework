import {
    Component,
    Input,
    ContentChild,
    ContentChildren,
    QueryList,
    ViewEncapsulation,
    AfterViewInit,
    AfterContentInit,
    AfterContentChecked,
    ElementRef,
    ChangeDetectorRef
} from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { HintDirective } from "./hint.directive";
import { FormControlFeedbackDirective } from "./form-control-feedback.directive";
import { InputDirective } from "./input.directive";
import { InputGroupAddonDirective } from "./input-group-addon.directive";

/**
 * TODO Create a CSS Class to make sure the required symbol appears as Red
 * TODO Consider implementing a means for a user to override the required symbol with something from Font-Awesome
 *
 * TODO Make sure the control can support multiple validators
 * TODO Resolve custom validation message for form-control-feedback directives
 */

@Component({
    selector: "form-control",
    animations:
    [
        trigger("transitionMessages",
            [
                state("enter", style({ opacity: 1, transform: "translateY(0%)" })),
                transition("void => enter",
                    [
                        style({ opacity: 0, transform: "translateY(-100%)" }),
                        animate("300ms cubic-bezier(0.55, 0, 0.55, 0.2)")
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
    encapsulation: ViewEncapsulation.None,
    template:`<label [attr.for]="_inputChild.id" class="form-control-label">{{label}}
        <span class="required" *ngIf="_inputChild.required">*</span>
     </label>
     
     <div [class.input-group]="_containerHasInputGroupAddonChildren">
        <ng-content select="input-group-addon[type='prefix']"></ng-content>
        <ng-content select="input, textarea"></ng-content>
        <ng-content select="input-group-addon[type='suffix']"></ng-content>
     </div>
   
     <div [ngSwitch]="this._getDisplayedMessages()">
        <div *ngSwitchCase="'error'" [@transitionMessages]="_formControlFeedbackAnimationState">
            <ng-content select="form-control-feedback[type='error']"></ng-content>
        </div>
        <div *ngSwitchCase="'warning'" [@transitionMessages]="_formControlFeedbackAnimationState">
            <ng-content select="form-control-feedback[type='warning']"></ng-content>
        </div>
        <div *ngSwitchCase="'success'" [@transitionMessages]="_formControlFeedbackAnimationState">
            <ng-content select="form-control-feedback[type='success']"></ng-content>
        </div>
        <div *ngSwitchCase="'hint'" [@transitionMessages]="_formControlFeedbackAnimationState" class="clearfix">
            <ng-content select="hint:not([align='end'])"></ng-content>
            <ng-content select="hint[align='end']"></ng-content>
        </div>
     </div>`
})
export class FormControlContainerComponent implements AfterViewInit, AfterContentInit, AfterContentChecked {

    @Input()
    public label: string;
    
    @ContentChild(InputDirective)
    private _inputChild: InputDirective;

    @ContentChildren(HintDirective)
    private _hintChildren: QueryList<HintDirective>;

    @ContentChildren(FormControlFeedbackDirective)
    private _formControlFeedbackChildren: QueryList<FormControlFeedbackDirective>;

    @ContentChildren(InputGroupAddonDirective)
    private _inputGroupAddonChildren: QueryList<InputGroupAddonDirective>;

    private _formControlFeedbackAnimationState: string;

    private _containerHasInputGroupAddonChildren: boolean;

    constructor(
        private _elementRef: ElementRef,
        private _changeDetectorRef: ChangeDetectorRef) {

        this._formControlFeedbackAnimationState = "";
    }

    public ngAfterContentInit(): void {
        this._validateInputChild();
        this._validateFieldAddons();
        this._processHints();

        //Revalidate when things change
        this._hintChildren.changes.subscribe(() => this._processHints());
        this._containerHasInputGroupAddonChildren = this._inputGroupAddonChildren.length > 0;
    }

    public ngAfterContentChecked(): void {
        this._validateInputChild();
    }

    public ngAfterViewInit(): void {
        //Avoid Animations on Load.
        this._formControlFeedbackAnimationState = "enter";
        this._changeDetectorRef.detectChanges();
    }

    /**
     * Determines whether or not to display messaging based on the state of the form
     * Defaults to none if no Feedback Message Directives are defined
     */
    private _getDisplayedMessages(): "error" | "hint" | "warning" | "success" | "none" {
        const input = this._inputChild;

        if (this._formControlFeedbackChildren.length < 0) return "none";
        if (this._hintChildren.length < 0) return "none";

        if (this._formControlFeedbackChildren.find(this._isErrorMessageDefined)) {
            if (input.isErrorState()) return "error";
        }

        if (this._formControlFeedbackChildren.find(this._isWarningMessageDefined)) {
            if (input.isWarningState()) return "warning";
        }

        if (this._formControlFeedbackChildren.find(this._isSuccessMessageDefined)) {
            if (input.isSuccessState()) return "success";
        }

        return "hint";
    }
    
    /**
     * Predicate for seeing if at least one feedback message directive is defined with a type of 'error'
     * @param feedback
     */
    private _isErrorMessageDefined(feedback: FormControlFeedbackDirective): boolean {
        return feedback.type === "error";
    }

    /**
     * Predicate for seeing if at least one feedback message directive is defined with a type of 'warning'
     * @param feedback
     */
    private _isWarningMessageDefined(feedback: FormControlFeedbackDirective): boolean {
        return feedback.type === "warning";
    }

    /**
     * Predicate for seeing if at least one feedback message directive is defined with a type of 'success'
     * @param feedback
     */
    private _isSuccessMessageDefined(feedback: FormControlFeedbackDirective): boolean {
        return feedback.type === "success";
    }

    /**
     * Determines whether a class from the NgControl should be forwarded to the host element.
     * @param prop
     */
    private _shouldForward(prop: string): boolean {
        const control = this._inputChild ? this._inputChild.ngControl : null;
        return control && (control as any)[prop];
    }

    /**
     * Does the extra processing that is required when handling the hints.
     */
    private _processHints(): void {
        this._validateHints();
        this._syncAriaDescribedBy();
    }


    /**
     * Ensure that there is a maximum of one of each `div[hint]` alignment specified
     */
    private _validateHints(): void {
        if (this._hintChildren) {
            let startHint: HintDirective;
            let endHint: HintDirective;
            this._hintChildren.forEach((hint: HintDirective) => {
                if (hint.align === "start") {
                    if (startHint) {
                        throw new Error("A hint was already declared for align=\"start\".");
                    }
                    startHint = hint;
                } else if (hint.align === "end") {
                    if (endHint) {
                        throw new Error("A hint was already declared for align=\"end\".");
                    }
                    endHint = hint;
                }
            });
        }
    }

    /**
     * Sets the child input's `aria-describedby` to a space-separated list of the ids
     * of the currently-specified hints, as well as a generated id for the hint label.
     * @returns {} 
     */
    private _syncAriaDescribedBy(): void {
        if (this._inputChild) {
            const ids: Array<string> = [];
            const startHint = this._hintChildren ? this._hintChildren.find(hint => hint.align === "start") : null;
            const endHint = this._hintChildren ? this._hintChildren.find(hint => hint.align === "end") : null;

            if (startHint)
                ids.push(startHint.id);

            if (endHint)
                ids.push(endHint.id);

            this._inputChild.ariaDescribedBy = ids.join(" ");
        }
    }

    /**
     * Throws an error if the container's input child was removed.
     */
    private _validateInputChild(): void {
        if (!this._inputChild)
            throw new Error("Form Control must contain an mav-input directive. " +
                "Did you forget to add mav-input to the native input or textarea element?");
    }

    private _validateFieldAddons(): void {
        if (this._inputChild.isTextArea()) {
            if (this._inputGroupAddonChildren.length > 0) {
                throw new Error("Form Control Container does not allow for field addons to be attached to a text area");
            }
        }
    }
}