import React from 'react';
import { nanoid } from 'nanoid';
import { getDatabase, child, ref, set, get } from 'firebase/database';
import { isWebUrl } from 'valid-url'
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootsrap/Tooltip";

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

    contructor(props) {
        super(props);
        this.state = {
            longURL: '',
            preferedAlias: '',
            generatedURL: '',
            loading: false,
            errors: [],
            errorMessage: {},
            toolTipMessage: 'Copy to Clipboard'
        };
    }

    // onSubmit handles user event - user click
    onSubmit = async (event) => {
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
        var generatedAlias = nanoid(5)
        var generatedURL = "shrinklink.com/" + generatedAlias;

        // check if user has inputted a prefered alias
        if (this.state.preferedAlias !== '') {
            generatedAlias = this.state.preferedAlias;
            generatedURL = "shrinklink.com/" + this.state.preferedAlias;
        }

        /* Database Functionality */
        // ref to database
        const db = getDatabase();
        // set/write data to database, db = database reg, '/' + generatedAlias = key
        set(ref(db, '/' + generatedAlias), {
            generatedAlias: generatedAlias,
            longURL: this.state.longURL,
            preferedAlias: this.state.preferedAlias,
            gerneatedURL: generatedURL
        }).then((result) => {
            // once data is stored, set current state of component to generated URL stored and loading to false as database operations are complete
            this.setState({
                generatedURL: generatedURL,
                loading: false
            })
        // error handling
        }).catch((e) => {

        })



}
