class Field {
    constructor(fieldElement, errorElement) {
        this.fieldElement = fieldElement;
        this.errorElement = errorElement;
    }
}

class Form {
    #isLoading = false;

    constructor(fields = [], finalButton) {
        this.fields = fields;
        this.finalButton = finalButton;

        this.finalButton.onaction = this.finalButton.onclick;
        this.finalButton.onclick = o => this.#onFinalButtonClick();

        this.#initializeField();
        this.activate();
    }

    #initializeField() {
        for (let i = 0; i < this.fields.length; i++) {
            const form = this;
            const currentFieldElement = this.fields[i]?.fieldElement;
            const nextFieldElement = this.fields[i+1]?.fieldElement;
            const currentErrorElement = this.fields[i]?.errorElement;

            if (currentFieldElement) {
                if (currentFieldElement.tagName == "INPUT") {
                    if (currentFieldElement.type == "tel")
                        registerPhoneInput(currentFieldElement);
                    else if (currentFieldElement.getAttribute("ad-type") == "otp")
                        registerOtpInput(currentFieldElement);
                    
                    currentFieldElement.addEventListener("keydown", function(event) {
                        if (event.key == "Enter") {
                            if (nextFieldElement == null)
                                form.finalButton.click();
                            else
                                nextFieldElement.focus();
                        }
                    });
                    
                    currentFieldElement.addEventListener("blur", function() {
                        if (currentErrorElement == null)
                            return;
        
                        if (currentFieldElement.validityStatus !== "OK")
                            currentErrorElement.classList.remove("hidden");
                        else
                            currentErrorElement.classList.add("hidden");
                    });
                }
                
                currentFieldElement.addEventListener("change", o => this.#checkFinalButtonState());
                currentFieldElement.addEventListener("input", o => this.#checkFinalButtonState());
                currentFieldElement.addEventListener("blur", o => this.#checkFinalButtonState());
            }
        }
    }
    
    clearFields() {
        for (let i = 0; i < this.fields.length; i++) {
            const currentFieldElement = this.fields[i]?.fieldElement;
            if (currentFieldElement)
                currentFieldElement.value = "";
        }
    }

    clearErrors() {
        for (let i = 0; i < this.fields.length; i++) {
            const currentErrorElement = this.fields[i]?.errorElement;
            if (currentErrorElement)
                currentErrorElement.classList.add("hidden");
        }
    }

    async #onFinalButtonClick() {
        // Check for validity first
        this.#checkFinalButtonState();
        if (this.finalButton.disabled == true)
            return;

        // Disable all inputs
        this.#setLoadingState(true);
        const isSuccess = await this.finalButton.onaction();

        if (isSuccess === false) {
            this.#setLoadingState(false);
            this.#checkFinalButtonState();
            this.activate();
        }
    }

    #setLoadingState(isLoading = false) {
        this.#isLoading = isLoading;
        this.finalButton.disabled = isLoading;

        for (const field of this.fields)
            if (field.fieldElement)
                field.fieldElement.disabled = isLoading;

        if (this.finalButton.children[0].classList.contains("progressring"))
            this.finalButton.children[0].style.display = isLoading ? "block" : "";
    }

    #checkFieldValidity(fieldElement, errorElement) {
        let validityStatus = "OK";

        if (fieldElement.type == "email") {
            validityStatus = InputValidator.checkEmail(fieldElement.value);
            if (errorElement)
                errorElement.innerHTML = INPUT_VALIDATOR_ERRORS.email[validityStatus];
        }
        else if (fieldElement.getAttribute("ad-type") == "confirmpassword") {
            validityStatus = passwordInput.value == fieldElement.value ? "OK" : "NOT_MATCH";
            if (errorElement)
                errorElement.innerHTML = INPUT_VALIDATOR_ERRORS.passwordconfirm[validityStatus];
        }
        else if (fieldElement.type == "password") {
            validityStatus = InputValidator.checkPassword(fieldElement.value);
            if (errorElement)
                errorElement.innerHTML = INPUT_VALIDATOR_ERRORS.password[validityStatus];
        }
        else if (fieldElement.getAttribute("ad-type") == "name") {
            validityStatus = InputValidator.checkEntityName(fieldElement.value);
            if (errorElement)
                errorElement.innerHTML = INPUT_VALIDATOR_ERRORS.name[validityStatus];
        }
        else if (fieldElement.type == "tel") {
            validityStatus = InputValidator.checkPhoneNumber(fieldElement.value);
            if (errorElement)
                errorElement.innerHTML = INPUT_VALIDATOR_ERRORS.phone[validityStatus];
        }
        
        return validityStatus;
    }

    #checkFinalButtonState() {
        if (this.#isLoading == true)
            return;

        let isValid = true;

        for (const field of this.fields) {
            const fieldElement = field.fieldElement;
            const errorElement = field.errorElement;

            if (fieldElement) {
                if (fieldElement.tagName == "INPUT") {
                    if (fieldElement.value.trim() == "")
                        isValid = false;
                    else if (fieldElement.required && fieldElement.checked == false)
                        isValid = false;
                }
                else if (fieldElement.tagName == "SELECT") {
                    if (fieldElement.value.trim() == "" || fieldElement.value.trim() == "null")
                        isValid = false;
                }
                else {
                    if (fieldElement.classList.contains("filled") == false)
                        isValid = false;
                }
    
                if (errorElement) {
                    fieldElement.validityStatus = this.#checkFieldValidity(fieldElement, errorElement);
                    if (fieldElement.validityStatus === "OK")
                        errorElement.classList.add("hidden");
                    else
                        isValid = false;
                }
            }
        }

        this.finalButton.disabled = isValid == false;
    }

    activate() {
        if (this.fields[0])
            this.fields[0].fieldElement.focus();
    }
}

function registerPhoneInput(input) {
    const enforcePrefix = function() {
        let val = this.value;
        let minPos = val.startsWith("+62 ") ? 4 : (val.startsWith("+62") ? 3 : 0);
        
        if (this.selectionStart < minPos && this.selectionStart == this.selectionEnd)
            this.setSelectionRange(minPos, minPos);
    };

    input.addEventListener("click", enforcePrefix);
    input.addEventListener("keyup", enforcePrefix);
    input.addEventListener("focus", enforcePrefix);

    input.addEventListener("keydown", function(e) {
        let val = this.value;
        let minPos = val.startsWith("+62 ") ? 4 : (val.startsWith("+62") ? 3 : 0);

        if (this.selectionStart <= minPos) {
            if (e.key === "ArrowLeft") {
                e.preventDefault(); 
            }
            if (e.key === "Backspace" && this.selectionStart === minPos && this.selectionEnd === minPos) {
                e.preventDefault(); 
                this.value = "";
                this.dispatchEvent(new Event("input")); 
            }
        }
    });

    input.addEventListener("input", function() {
        let cursorPosition = this.selectionStart;
        let originalValue = this.value;
        let digitsBeforeCursor = 0;
        
        for (let i = 0; i < cursorPosition; i++) {
            if (/\d/.test(originalValue[i])) {
                digitsBeforeCursor++;
            }
        }

        let rawOriginal = originalValue.replace(/\D/g, "");
        let addedDigits = 0;
        
        if (rawOriginal.startsWith("0"))
            addedDigits = 1;
        else if (rawOriginal.length > 0 && !rawOriginal.startsWith("62") && rawOriginal !== "6")
            addedDigits = 2;
        
            
        if (digitsBeforeCursor > 0)
            digitsBeforeCursor += addedDigits;
            
        this.value = this.value.replaceAll(/[^0-9\+\-\s]/g, "");
        this.value = Formatter.PhoneNumber(this.value, false);
        
        let newCursorPos = -1;
        let digitsCounted = 0;
        
        for (let i = 0; i < this.value.length; i++) {
            if (digitsCounted === digitsBeforeCursor) {
                newCursorPos = i;
                break;
            }
            if (/\d/.test(this.value[i])) {
                digitsCounted++;
            }
        }
        
        if (newCursorPos === -1) {
            newCursorPos = this.value.length;
        }

        let minPosAfter = this.value.startsWith("+62 ") ? 4 : (this.value.startsWith("+62") ? 3 : 0);
        if (newCursorPos < minPosAfter) {
            newCursorPos = minPosAfter;
        }

        this.setSelectionRange(newCursorPos, newCursorPos);
    });
}

function registerOtpInput(input) {
    input.addEventListener("input", function() {
        this.value = this.value.replace(/[^0-9]/g, "");
    });
}