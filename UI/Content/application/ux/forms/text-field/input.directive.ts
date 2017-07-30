import { Directive, Input, Renderer2, ElementRef, Self, Optional } from "@angular/core";
import { NgControl, NgForm, FormGroupDirective } from "@angular/forms";

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
        "(blur)": "_onBlur()",
        "(focus)": "_onFocus()",
        "(input)": "_onInput()"
    }
})
export class InputDirective {
    //Private Variables
    private _type: string;
    private _disabled: boolean;
    private _required: boolean;
    private _id: string;
    private _neverEmptyInputTypes: Array<string>;
    private _placeholder: string;
    private _formNoValidate: boolean;

    //Public Properties
    //Whether or not the element is focused
    public focused: boolean;

    // Set the aria-describedby attribute on the input for improved A11Y
    public ariaDescribedBy: string;

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

        this._neverEmptyInputTypes = ["date", "datetime", "datetime-local", "month", "time", "week"]
            .filter(t => this.getSupportedInputTypes().has(t));
    }

    //Public Methods
    public focus(): void { this._elementRef.nativeElement.focus(); }

    public isWarningState(): boolean {
        if (this.formNoValidate) return false;
        if (!this.required && this.empty) return false;
        
        const control = this.ngControl;
        const isInvalid = control && control.invalid;
        const isTouched = control && control.touched;
        const isSubmitted = (this._parentFormGroup && this._parentFormGroup.submitted) ||
            (this._parentForm && this._parentForm.submitted);
            
        return (isInvalid && (isTouched || isSubmitted));
    }
    
    public isSuccessState(): boolean {
        if (this.empty) return false;
        if (this.formNoValidate) return false;

        const control = this.ngControl;
        const isValid = control && control.valid;
        const isTouched = control && control.touched;

        return isTouched && isValid;
    }

    public isErrorState(): boolean {
        if (this.empty) return false;
        if (this.formNoValidate) return false;

        const control = this.ngControl;
        const isTouched = control && control.touched;
        const isSubmitted = (this._parentFormGroup && this._parentFormGroup.submitted) ||
            (this._parentForm && this._parentForm.submitted);
        const fieldHasError = this._elementRef.nativeElement.validity.customError;

        return fieldHasError && (isTouched || isSubmitted);
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
    private _onFocus(): void { this.focused = true; }

    private _onBlur(): void { this.focused = false; }

    private _onInput(): void {
        if (this._elementRef.nativeElement.validity.customError) {
            this._elementRef.nativeElement.setCustomValidity("");
        }
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