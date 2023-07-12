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

}
