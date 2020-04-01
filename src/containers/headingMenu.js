import 'react-dropdown/style.css'
import '../index.scss'

import React, { Component } from 'react';

import Dropdown from 'react-dropdown'
import Modal from "styled-react-modal";

const options = [
    { code: "sv", text: 'Svenska 🇸🇪', speachCode: "Swedish Male", startText: "Starta" },
    { code: "en", text: 'English 🇬🇧', speachCode: "UK English Male", startText: "Begin" },
    { code: "fi", text: 'Soumi 🇫🇮', speachCode: "Finnish Male", startText: "Alkaa" },
    { code: "fr", text: "Français 🇫🇷", speachCode: "French Female", startText: "Début" },
    { code: "es", text: "Español 🇪🇸", speachCode: "Spanish Male", startText: "Comienzo" },
    { code: "da", text: "Dansk 🇩🇰", speachCode: "Danish Male", startText: "Start" },
    { code: "de", text: "Deutsch 🇩🇪", speachCode: "Deutsch Male", startText: "Starten" }
];

const StyledModal = Modal.styled`
  text-align: left;
  z-index:2;
  width: 20rem;
  height: 11rem;
  border-radius: 20px;
  padding: 40px;   
  background-color: white;
  opacity: ${props => props.opacity};
  transition: opacity ease 500ms;
  font-size:120%;
  line-height: 26pt;
  @media (max-width: 768px) {
    width: 20rem;
    height: 11rem;
    padding: 20px;   
  }
`;

class HeadingMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            opacity: 0,
            language: props.language,
            sound: props.sound,
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleSound = this.toggleSound.bind(this);
        this.afterOpen = this.afterOpen.bind(this);
        this.beforeClose = this.beforeClose.bind(this);
        this.onSelectChanged = this.onSelectChanged.bind(this);
    }

    onSelectChanged(e) {
        let language = options.find(y => y.text === e.value)
        this.setState({ language: language })
        this.props.onChange(language);
    }
    toggleModal(e) {
        this.setState({ isOpen: !this.state.isOpen });
    }

    toggleSound(e) {
        this.setState({ sound: !this.state.sound });
        this.props.onChange()

    }
    afterOpen() {
        setTimeout(() => {
            this.setState({ opacity: 1 });
        });
    }

    beforeClose() {
        return new Promise(resolve => {
            this.setState({ opacity: 0 });
            setTimeout(resolve, 200);
        });
    }

    render() {
        return (
            <div className={this.props.className}>
                <StyledModal
                    isOpen={this.state.isOpen}
                    afterOpen={this.afterOpen}
                    beforeClose={this.beforeClose}
                    onBackgroundClick={this.toggleModal}
                    onEscapeKeydown={this.toggleModal}
                    opacity={this.state.opacity}
                    backgroundProps={{ opacity: this.state.opacity }}>
                    <strong> Settings </strong> <br />
                    {this.state.sound ? <span style={{ cursor: "pointer" }} onClick={this.toggleSound} role="img" aria-label="soundOn"> Toggle sound 🔊</span> : <span style={{ cursor: "pointer" }} onClick={this.toggleSound} role="img" aria-label="soundOff"> Toggle sound 🔇</span>}
                    <section>Language:</section>
                    <Dropdown  role="img" value={this.state.language.text} options={options.map(y => y.text)} onChange={this.onSelectChanged} />
                </StyledModal>
                <h1 className="customTitle" onClick={this.toggleModal}>Dagopedia </h1>
            </div>
        );
    }
}
export default HeadingMenu;