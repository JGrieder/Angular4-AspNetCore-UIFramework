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
import { InputDirective } from "./input.directive";
import { TextFieldAddonDirective } from "./text-field-addon.directive";

/**
 * TODO Create a CSS Class to make sure the required symbol appears as Red
 * TODO Consider implementing a means for a user to override the required symbol with something from Font-Awesome
 *
 * TODO In Error flow support a fallback approach in case the native validation message does not trigger
 */

@Component({
    selector: "text-field",
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
    template: `<label [attr.for]="_inputChild.id" class="form-control-label">{{label}}
        <span class="required" *ngIf="_inputChild.required">*</span>
     </label>
     
     <div [class.input-group]="_containerHasTextFieldAddonChildren">
        <ng-content select="text-field-addon[position='left']"></ng-content>
        <ng-content select="input, textarea"></ng-content>
        <ng-content select="text-field-addon[position='right']"></ng-content>
     </div>
   
     <div [ngSwitch]="this._getDisplayedMessages()">
        <div *ngSwitchCase="'error'" [@transitionMessages]="_formControlFeedbackAnimationState">
            <div class="form-control-feedback">{{_inputChild.getCustomError()}}</div>
        </div>
        <div *ngSwitchCase="'warning'" [@transitionMessages]="_formControlFeedbackAnimationState">
            <div class="form-control-feedback">{{_getValidationMessage()}}</div>
        </div>
        <div *ngSwitchCase="'success'" [@transitionMessages]="_formControlFeedbackAnimationState">
            <div class="form-control-feedback">{{_getSuccessMessage()}}</div>
        </div>
        <div *ngSwitchCase="'hint'" [@transitionMessages]="_formControlFeedbackAnimationState" class="clearfix">
            <ng-content select="hint:not([align='end'])"></ng-content>
            <ng-content select="hint[align='end']"></ng-content>
        </div>
     </div>`
})
export class TextFieldComponent implements AfterViewInit, AfterContentInit, AfterContentChecked {

    @Input()
    public label: string;

    @Input()
    public messages: Map<string, Set<string>>;

    @ContentChild(InputDirective)
    private _inputChild: InputDirective;

    @ContentChildren(HintDirective)
    private _hintChildren: QueryList<HintDirective>;
    
    @ContentChildren(TextFieldAddonDirective)
    private _textFieldAddonChildren: QueryList<TextFieldAddonDirective>;

    private _formControlFeedbackAnimationState: string;

    private _containerHasTextFieldAddonChildren: boolean;

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
        this._containerHasTextFieldAddonChildren = this._textFieldAddonChildren.length > 0;
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
        const hasHints: boolean = (this._hintChildren.length > 0 && this._hintChildren.length <= 2);

        if (!this.messages) {
            return hasHints ? "hint" : "none";
        }
        
        if (input.isErrorState()) return "error";
        
        if (input.isWarningState()) return "warning";
        
        if (input.isSuccessState()) return "success";
        
        return hasHints ? "hint" : "none";
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
            if (this._textFieldAddonChildren.length > 0) {
                throw new Error("Form Control Container does not allow for field addons to be attached to a text area");
            }
        }
    }

    private _getSuccessMessage(): Set<string> {

        if (!this.messages) return null;
        if (!this.messages["success"]) return null;
        return this.messages["success"];
    }

    private _getValidationMessage(): Set<string> {
        const errors = this._inputChild.ngControl.errors;

        if (!errors) return null;
        if (!this.messages) return null;
        
        let validationMessage: Set<string>;

        Object.keys(this.messages).some(key => {
            if (errors[key]) {
                validationMessage = this.messages[key];
                return true;
            }
            return false;
        });

        return validationMessage;
    }
}