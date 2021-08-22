import React, { Component } from 'react';
import styled from 'styled-components'

class FooterComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            employees: []
        }
    }

    render() {
        return (
            <div>
                 <footer>
          <div className="container">
            <div className="row">
              <div className="widget">
                <ul className="list-style">
                  <li><a href="#" title>About</a></li>
                  <li><a href="#" title>FAQ</a></li>
                  <li><a href="#" title>Privacy</a></li>
                  <li><a href="#" title>English</a></li>
                  <li><a href="#" title>Help Centre</a></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>  
            </div>
        );
    }
}

export default FooterComponent;

const footer = styled.footer`
    margin-left:50%;
`