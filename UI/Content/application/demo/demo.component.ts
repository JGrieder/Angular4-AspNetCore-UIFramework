import { Component, ViewEncapsulation, ViewChildren, QueryList} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { InputDirective } from "../ux/forms/maverick-forms.module";

@Component({
    selector: "demo",
    template: `<div class="container">
        <form [formGroup]="demoForm" (ngSubmit)="onSubmit()">
        <div class="row">
        <div class="col-12">
        <form-control [label]="'Email'">
        <input-group-addon type="prefix">Prefix</input-group-addon>
        <input [type]="'text'" mav-input id="Email" #email maxlength="50" formControlName="email" [required]="true" />
        <input-group-addon type="suffix">Suffix</input-group-addon>
        <form-control-feedback type="warning">Email is invalid!</form-control-feedback>
        <form-control-feedback type="success">Email is valid!</form-control-feedback>
        <form-control-feedback type="error">{{email.validationMessage}}</form-control-feedback>
        <hint [align]="'start'">Left Hint</hint>
        <hint [align]="'end'">{{email.value.length}} / 50</hint>
        </form-control>
        </div>
        </div>
        <div class="row">
        <div class="col-12">
        <form-control [label]="'Alternate Email'">
        <input-group-addon type="prefix">Prefix</input-group-addon>
        <input [type]="'text'" mav-input id="Email2" #email maxlength="50" formControlName="email2" />
        <input-group-addon type="suffix">Suffix</input-group-addon>
        <form-control-feedback type="warning">Email is invalid!</form-control-feedback>
        <form-control-feedback type="success">Email is valid!</form-control-feedback>
        <form-control-feedback type="error">{{email.validationMessage}}</form-control-feedback>
        <hint [align]="'start'">Left Hint</hint>
        <hint [align]="'end'">{{email.value.length}} / 50</hint>
        </form-control>
        </div>
        </div>
        <div class="row">
        <div class="col-6">
        <form-control [label]="'No Validation Enabled'">
        <input [type]="text" mav-input id="Test" #test maxlength="25" formControlName="test" [formNoValidate]="true"/>
        <hint [align]="'start'">Left Hint</hint>
        <hint [align]="'end'">{{test.value.length}} / 25</hint>
        </form-control>
        </div>
        <div class="col-6">
        <form-control [label]="'Disabled Field'">
        <input [type]="text" mav-input id="DisabledField" formControlName="disabledField" [formNoValidate]="true" />
        </form-control>
        </div>
        </div>
            <div class="row">
                <div class="col-12">
                    <form-control [label]="'Text Area'">
                        <textarea mav-input id="textAreaDemo" [formNoValidate]="true" autosize></textarea>
                    </form-control>
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