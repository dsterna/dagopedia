import React, { Component } from 'react';
import Modal from "styled-react-modal";
import styled from 'styled-components';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'



const options = [
    {code: "sv", text:'Svenska 🇸🇪', speachCode: "Swedish Male"},
    {code: "en",text: 'English 🇬🇧', speachCode: "UK English Male"},
    {code: "fi" ,text:'Soumi 🇫🇮', speachCode: "Finnish Male"},
    {code: "fr", text: "Français 🇫🇷", speachCode: "French Female"},
    {code: "es", text: "Español 🇪🇸", speachCode: "Spanish Male"},
    {code: "da", text: "Dansk 🇩🇰", speachCode: "Danish Male"},
    {code: "de", text: "Deutsch 🇩🇪", speachCode: "Deutsch Male"}
];


const Title = styled.h1`
  font-family: Monoton
  color: #EDACB8;
  font-size: 300%;
  margin: 25px;
  padding-bottom: 5px;
  border-bottom: 1px solid #EDACB8;
  display: inline-block;
`;

const StyledModal = Modal.styled`
  z-index:2;
  width: 20rem;
  height: 10rem;
  border-radius: 20px;
  padding: 10px;   
  background-color: white;
  opacity: ${props => props.opacity};
  transition: opacity ease 500ms;
  font-size:120%;
  line-height: 26pt
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

    onSelectChanged(e){
        let language = options.find(y => y.text === e.value)
        this.setState({language: language})
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
                   <strong> Settings </strong> <br/>
                    {this.state.sound ?   <span  onClick={this.toggleSound} role="img" aria-label="soundOn"> Toggle sound 🔊</span>  :   <span onClick={this.toggleSound}role="img" aria-label="soundOff"> Toggle sound 🔇</span>}
                    <section>Language:</section>
                    <Dropdown role="img" value={this.state.language.text} options={options.map(y => y.text)} onChange={this.onSelectChanged}   />
                </StyledModal>
                <Title onClick={this.toggleModal}>Dagopedia</Title>
            </div>
        );
    }
}

export default styled(HeadingMenu)`
  width: 100vw;
  height: 20vh;
  text-align: center;
`;