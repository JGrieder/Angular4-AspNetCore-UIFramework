import { Directive, Input } from "@angular/core";

@Directive({
    selector: "form-control-feedback",
    host: {
        "[class.form-control-feedback]": "true"
    }
})
export class FormControlFeedbackDirective {

    @Input()
    public type: "error" | "success" | "warning";
}