import { Directive, Input, Renderer2, ElementRef, Self, Optional, OnChanges, OnDestroy, DoCheck } from "@angular/core";
import { NgControl, NgForm, FormGroupDirective } from "@angular/forms";
import { Subject } from "rxjs/Subject";


/**
 * TODO: Support Masking
 *       Reference text-mask on GitHub
 *       Translate the shared Javascript Code into Angular Service?
 * TODO: Check to see if parent form has no-validate enabled
 * 
 */
@Directive({
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
        "(blur)": "_focusChanged(false)",
        "(focus)": "_focusChanged(true)",
        "(input)": "_onInput()"
    }
})
export class InputDirective implements OnChanges, OnDestroy, DoCheck {
    
    //Private Variables
    private _type: string;
    private _disabled: boolean;
    private _required: boolean;
    private _id: string;
    private _neverEmptyInputTypes: Array<string>;
    private _placeholder: string;
    private _formNoValidate: boolean;
    private _previousNativeValue: string;
    
    //Public Properties
    //Whether or not the element is focused
    public focused: boolean;

    // Set the aria-describedby attribute on the input for improved A11Y
    public ariaDescribedBy: string;

    private _fieldState: ValidationState;
    public stateChanges: Subject<void>;

    @Input()
    public get disabled() { return this.ngControl ? this.ngControl.disabled : this._disabled; }
    public set disabled(value: any) { this._disabled = value != null && `${value}` !== "false"; }

    @Input()
    public get id() { return this._id; }
    public set id(value: string) { this._id = value; }

    @Input()
    public get required() { return this._required; }
    public set required(value: any) { this._required = value != null && `${value}` !== "false"; }

    @Input()
    public get type() { return this._type; }
    public set type(value: string) {
        this._type = value || "text";
        this._validateType();

        if (!this.isTextArea() && this.getSupportedInputTypes().has(this._type)) {
            this._renderer.setProperty(this._elementRef.nativeElement, "type", this._type);
        }
    }

    @Input()
    public get placeholder() { return this._placeholder; }
    public set placeholder(value: string) { this._placeholder = value; }

    @Input()
    public get formNoValidate() { return this._formNoValidate; }
    public set formNoValidate(value: boolean) { this._formNoValidate = value; }

    public get value() { return this._elementRef.nativeElement.value; }
    public set value(value: string) { this._elementRef.nativeElement.value = value; }

    public get empty() {
        return !this._isNeverEmpty() &&
            (this.value == null || this.value === "") &&
            !this._isBadInput();
    }

    constructor(
        private _elementRef: ElementRef,
        private _renderer: Renderer2,
        @Optional() @Self() public ngControl: NgControl,
        @Optional() private _parentForm: NgForm,
        @Optional() private _parentFormGroup: FormGroupDirective
    ) {
        this._type = "text";
        this._disabled = false;
        this._required = false;
        this._placeholder = "";
        this.focused = false;
        this._fieldState = ValidationState.None;

        this._previousNativeValue = this.value;
        this.stateChanges = new Subject<void>();

        this._neverEmptyInputTypes = ["date", "datetime", "datetime-local", "month", "time", "week"]
            .filter(t => this.getSupportedInputTypes().has(t));
    }

    public ngOnChanges(changes: Object): void {
        this.stateChanges.next();
    }

    public ngOnDestroy(): void {
        this.stateChanges.complete();
    }

    public ngDoCheck(): void {
        if (this.ngControl) {
            // We need to re-evaluate this on every change detection cycle, because there are some
            // error triggers that we can't subscribe to (e.g. parent form submissions). This means
            // that whatever logic is in here has to be super lean or we risk destroying the performance.
            this._updateValidatity();
        } else {
            this._dirtyCheckNativeValue();
        }
    }

    //Public Methods
    public focus(): void { this._elementRef.nativeElement.focus(); }

    public isWarningState(): boolean {
        return this._fieldState === ValidationState.Warning;
    }

    public isSuccessState(): boolean {
        return this._fieldState === ValidationState.Success;
    }

    public isErrorState(): boolean {
        return this._fieldState === ValidationState.Error;
    }

    public setCustomError(errorMessage: string): void {
        //Set Validity.CustomError to true and provide a custom message to display.
        this._elementRef.nativeElement.setCustomValidity(errorMessage);
    }

    public getCustomError(): string {
        return this._elementRef.nativeElement.validationMessage;
    }

    public getSupportedInputTypes(): Set<string> {
        const featureTestInput: HTMLInputElement = document.createElement("input") as HTMLInputElement;
        const supportedInputTypes = new Set([
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
        ].filter(value => {
            featureTestInput.setAttribute("type", value);
            return featureTestInput.type === value;
        }));

        return supportedInputTypes;
    }
    
    //Private Methods
    private _focusChanged(isFocused: boolean): void {
        if (isFocused !== this.focused) {
            this.focused = isFocused;
            this.stateChanges.next();
        }
    }

    private _onInput(): void {
        if (this._elementRef.nativeElement.validity.customError) {
            this._elementRef.nativeElement.setCustomValidity("");
        }
    }

    private _updateValidatity(): void {
        const oldState: ValidationState = this._fieldState;
        const newState: ValidationState = this._getValidationState();

        if (newState !== oldState) {
            this._fieldState = newState;
            this.stateChanges.next();
        }
    }

    private _dirtyCheckNativeValue(): void {
        const newValue = this.value;

        if (this._previousNativeValue !== newValue) {
            this._previousNativeValue = newValue;
            this.stateChanges.next();
        }
    }

    private _getValidationState(): ValidationState {
        if (this.formNoValidate) return ValidationState.None;
        if (!this.required && this.empty) return ValidationState.None;

        const control: NgControl = this.ngControl;
        const isTouched: boolean = control && control.touched;
        const isSubmitted: boolean = (this._parentFormGroup && this._parentFormGroup.submitted) ||
            (this._parentForm && this._parentForm.submitted);

        const fieldHasError: boolean = this._elementRef.nativeElement.validity.customError;
        if (fieldHasError && (isTouched || isSubmitted)) return ValidationState.Error;

        const isInvalid: boolean = control && control.invalid;
        if (isInvalid && (isTouched || isSubmitted)) return ValidationState.Warning;

        const isValid: boolean = control && control.valid;
        if (isTouched && isValid) return ValidationState.Success;

        return ValidationState.None;
    }

    private _validateType(): void {
        const invalidTypesForInputElement: Array<string> = ["button", "hidden", "reset", "submit"];
        if (invalidTypesForInputElement.indexOf(this._type) !== -1)
            throw new Error(`Input type "${this._type}" isn't supported by mav-form-group`);
    }

    private _isNeverEmpty() { return this._neverEmptyInputTypes.indexOf(this._type) !== -1; }

    private _isBadInput() { return (this._elementRef.nativeElement as HTMLInputElement).validity.badInput; }

    public isTextArea() {
        const nativeElement = this._elementRef.nativeElement;
        return nativeElement ? nativeElement.nodeName.toLowerCase() === "textarea" : false;
    }
}

enum ValidationState {
    None = 0,
    Success = 1,
    Warning = 2,
    Error = 3
}