import { Directive, Input } from "@angular/core";

/**
 * TODO Add Support for Input Group Button 
 */

@Directive({
    selector: "input-group-addon",
    host: {
        "[class.input-group-addon]": "true"
    }
})
export class InputGroupAddonDirective {

    @Input()
    public type: "prefix" | "suffix";

}