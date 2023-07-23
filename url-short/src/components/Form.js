import React from 'react';
import { nanoid } from 'nanoid';
import { getDatabase, child, ref, set, get } from 'firebase/database';
import { isWebUri } from 'valid-url'
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

/*
Class - Form:
Generate main form class to handle user inputs and webpage structure/functionality

Variables:
LongURL - used to store the user input 'long' URL
preferedAlias - used to store the customizable sub directory of short URL or 'alias'
generatedURL - used to store the created URL derived from LongURL
loading - store boolean value wether or not database processes are in progress
errors - an array to hold errors indicating which part of the Form has failed
errorMessage - an object to hold a string value for the corresponding errors
toolTipMessage - a string to hold the necessary value of the copy to clipboard tooltip
*/
class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            longURL: '',
            preferedAlias: '',
            generatedURL: '',
            loading: false,
            errors: [],
            errorMessage: {},
            toolTipMessage: 'Copy To Clipboard'
        };
    }

    // onSubmit handles user event - user click
    onSubmit = async (event) => {
        console.log("on submit triggered");
        // used to prevent default of refreshing page upon suer click
        event.preventDefault();
        // sets loading state to true and resets generated URL to blank (in cases of multiple use)
        this.setState({
            loading: true,
            generatedURL: ''
        })

        // calls method validateInput() to verifiy submitted user input is in a valid form
        var isFormValid = await this.validateInput()
        if (!isFormValid) {
            return
        }

        // generate alias for short URL and attaches it to domain
        var generatedKey = nanoid(5);
        var generatedURL = "shrinklink.com/" + generatedKey;

        console.log(generatedURL);

        // check if user has inputted a prefered alias
        if (this.state.preferedAlias !== '') {
            console.log("if statement triggered");
            generatedKey = this.state.preferedAlias;
            generatedURL = "shrinklink.com/" + this.state.preferedAlias;
            console.log(generatedURL);
        }

        /* Database Functionality */
        // ref to database
        const db = getDatabase()
        console.log(db);
        // set/write data to database, db = database reg, '/' + generatedAlias = key
        set(ref(db, '/' + generatedKey), {
            generatedKey: generatedKey,
            longURL: this.state.longURL,
            preferedAlias: this.state.preferedAlias,
            generatedURL: generatedURL
        }).then((result) => {
            this.setState({
                generatedURL: generatedURL,
                loading: false
            })
        }).catch((e) => {

        })
    };

    /* Error handling */

    // check if input field holds an error
    hasError = (key) => {
        return this.state.errors.indexOf(key) !== -1;
    }

    // save contect of form as user updates
    handleChange = (event) => {
        const { id, value } = event.target
        this.setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    // validates the user input
    validateInput = async () => {
        var errors = [];
        var errorMessages = this.state.errorMessage

        // Long URL validation
        // checks if a long URL has been added by user
        if (this.state.longURL.length === 0) {
            // adds longURL error to errors array
            errors.push("longURL");
            errorMessages['longURL'] = 'Please enter your URL!';
        }
        // checks if provided URL is valid
        else if (!isWebUri(this.state.longURL)) {
            // adds longURL error
            errors.push("longURL");
            errorMessages['longURL'] = 'Please a URL in the form of https://www....';
        }
        // add error checking to test if longURL is the same size or shorter than the new provided short URL


        // Perfered Alias validation
        // checks if user has added an alias
        if (this.state.preferedAlias !== '') {
            // alias should be less than 7 characters
            if (this.state.preferedAlias.length > 7) {
                errors.push("suggestedAlias");
                errorMessages['suggestedAlias'] = 'Please Enter an Alias less than 7 Characters';
            }
            // alias should not have any spaces
            else if (this.state.preferedAlias.indexOf(' ') >= 0) {
                errors.push("suggestedAlias");
                errorMessages['suggestedAlias'] = 'Spaces are not allowed in URLS';
            }

            // check if alias provided already exists
            var keyExists = await this.checkKeyExists()

            if (keyExists.exists()) {
                errors.push("suggestedAlias");
                errorMessages['suggestedAlias'] = 'The Alias you have entered already exists! Please enter another one =-)';
            }
        }

        // update state of component
        this.setState({
            errors: errors,
            errorMessages: errorMessages,
            loading: false
        });

        // checks if errors are present
        if (errors.length > 0) {
            return false;
        }

        return true;
    }

    // method to check if alias already exists
    checkKeyExists = async () => {
        const dbRef = ref(getDatabase());
        return get(child(dbRef, `/${this.state.preferedAlias}`)).catch((error) => {
            return false
        });
    }

    // method to copy generated URL to clipboard
    copyToClipBoard = () => {
        navigator.clipboard.writeText(this.state.generatedURL)
        this.setState({
            toolTipMessage: 'Copied!'
        })
    }

    // method to render HTML code
    render() {
        return (
            <div className="container">
                <form autoComplete="off">
                    <h3>Shrink Link</h3>

                    <div className="form-group">
                        <label>Enter your long URL</label>
                        <input
                            id="longURL"
                            // user input - handle change
                            onChange={this.handleChange}
                            value={this.state.longURL}
                            type="url"
                            required
                            // checks if error array has value longURL
                            className={
                                this.hasError("longURL")
                                    // if error, show form is invalid
                                    ? "form-control is-invalid"
                                    // otherwise carry on
                                    : "form-control"
                            }
                            // placeholder for user input box                      
                            placeholder="https://www..."
                        />
                    </div>

                    <div
                        // hide error message until state has changed (user clicked button)
                        className={
                            this.hasError("longURL")
                                ? "text-danger" : "visually-hidden"
                        }
                    >
                        {this.state.errorMessage.longURL}
                    </div>


                    <div className="form-group">
                        <label htmlFor="basic-url">Your Short URL</label>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">shrinklink.com/</span>
                            </div>
                            <input
                                id="preferedAlias"
                                onChange={this.handleChange}
                                value={this.state.preferedAlias}
                                className={
                                    this.hasError("preferedAlias")
                                        ? "form-control is-invalid"
                                        : "form-control"
                                }
                                type="text" placeholder="eg. 3fwias (Optional)"
                            />
                        </div>
                        <div
                            className={
                                this.hasError("suggestedAlias") ? "text-danger" : "visually-hidden"
                            }
                        >
                            {this.state.errorMessage.suggestedAlias}
                        </div>
                    </div>
                    <button className="btn btn-primary" type="button" onClick={this.onSubmit}>
                        {
                            // if state is loading show spinner button, if not hide spinner
                            this.state.loading ?
                                <div>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                </div> :
                                <div>
                                    <span className="visually-hidden spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span>Generate Link</span>
                                </div>
                        }
                    </button>

                    {
                        this.state.generatedURL === '' ?
                            <div></div>
                            :
                            <div className="generatedurl">
                                <span>Your generated URL is: </span>
                                <div className="input-group mb-3">
                                    <input disabled type="text" value={this.state.generatedURL} className="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                    <div className="input-group-append">
                                        <OverlayTrigger
                                            key={'top'}
                                            placement={'top'}
                                            overlay={
                                                <Tooltip id={`tooltip-${'top'}`}>
                                                    {this.state.toolTipMessage}
                                                </Tooltip>
                                            }
                                        >
                                            <button onClick={() => this.copyToClipBoard()} data-toggle="tooltip" data-placement="top" title="Tooltip on top" className="btn btn-outline-secondary" type="button">Copy</button>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            </div>
                    }
                    
                </form>
            </div>
        );
    }
}

export default Form;