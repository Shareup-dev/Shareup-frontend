import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useHistory } from "react-router-dom";
import UserService from '../../services/UserService';
import AuthService from '../../services/auth.services';
import { useJwt } from "react-jwt";
// import { Modal } from '../dashboard/Modal';
import Modal from 'react-modal';
import { GlobalStyle } from '../../styles/modalStyles';
import styled from 'styled-components';
import '../../modal.css';

function RegisterSuccessfulComponent({closeModal}) {
  let history = useHistory();

  return (
    <div class="modal-dialog modal-confirm">
    <div class="modal-content">
        <div class="modal-header">
            <div class="icon-box">
            <i class="fa fa-check" aria-hidden="true"></i>
            </div>				
            <h4 class="modal-title">Awesome!</h4>	
        </div>
        <div class="modal-body">
            <p class="text-center">Your registration was successful.</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-success btn-block" data-dismiss="modal" onClick={() => history.push("/newsfeed")}>Go To Newsfeed</button>
            <button class="btn " data-dismiss="modal" onClick={closeModal} style={{marginRight: '35%', backgroundColor: '#e25b5b'}}>Close</button>
        </div>
    </div>
</div>
  );
}
export default RegisterSuccessfulComponent;