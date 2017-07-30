import { Component, ViewEncapsulation, ViewChildren, QueryList} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { InputDirective } from "../ux/forms/maverick-forms.module";

@Component({
    selector: "demo",
    template: `<div class="container">
        <form [formGroup]="demoForm" (ngSubmit)="onSubmit()">
        <div class="row">
        <div class="col-12">
        <text-field [label]="'Email'" 
                      [messages]="{ 
                                    'required': 'An Email is required',
                                    'email': 'This email is invalid',
                                    'success': 'This email is valid' 
                                  }">
        <text-field-addon position="left">Left</text-field-addon>
        <input [type]="'text'" id="Email" #email maxlength="50" formControlName="email" [required]="true" />
        <text-field-addon position="right">Right</text-field-addon>
        <hint [align]="'start'">Left Hint</hint>
        <hint [align]="'end'">{{email.value.length}} / 50</hint>
        </text-field>
        </div>
        </div>
        <div class="row">
        <div class="col-12">
        <text-field [label]="'Alternate Email'">
        <text-field-addon position="left">Left</text-field-addon>
        <input [type]="'text'" id="Email2" #email maxlength="50" formControlName="email2" />
        <text-field-addon position="right">right</text-field-addon>
        <hint [align]="'start'">Left Hint</hint>
        <hint [align]="'end'">{{email.value.length}} / 50</hint>
        </text-field>
        </div>
        </div>
        <div class="row">
        <div class="col-6">
        <text-field [label]="'No Validation Enabled'">
        <input [type]="text" id="Test" #test maxlength="25" formControlName="test" [formNoValidate]="true"/>
        <hint [align]="'start'">Left Hint</hint>
        <hint [align]="'end'">{{test.value.length}} / 25</hint>
        </text-field>
        </div>
        <div class="col-6">
        <text-field [label]="'Disabled Field'">
        <input [type]="text" id="DisabledField" formControlName="disabledField" [formNoValidate]="true" />
        </text-field>
        </div>
        </div>
            <div class="row">
                <div class="col-12">
                    <text-field [label]="'Text Area'">
                        <textarea id="textAreaDemo" [formNoValidate]="true" autosize></textarea>
                    </text-field>
                </div>
            </div>
        <button type="submit">Submit Form</button>
        </form>
        </div>`,
    encapsulation: ViewEncapsulation.None
})
export class DemoComponent {  
    
    public demoForm: FormGroup;

    @ViewChildren(InputDirective)
    public formInputs: QueryList<InputDirective>;

    constructor(
        private _formBuilder: FormBuilder
    ) {
        this.demoForm = this._formBuilder.group({
            email: ["", Validators.compose([Validators.email, Validators.required])],
            email2: ["", Validators.compose([Validators.email, Validators.required])],
            test: ["", Validators.nullValidator],
            disabledField: new FormControl({value: "", disabled: true}, Validators.nullValidator)
        });
    }
    
    public onSubmit() {
    
        if (this.demoForm.value["email"] === "test@test.com") {
            const emailField = this.formInputs.find((inputDirective) => inputDirective.id === "Email");
            emailField.setCustomError("This E-mail is not allowed!");
            return;
        }
    }
}