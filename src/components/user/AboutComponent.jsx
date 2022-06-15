import React, { Component } from 'react';
import Founder from '../../images/team/founder.jpeg'
import Linnate from '../../images/team/linnate-1.jpeg'
import Lokee from '../../images/team/lokee.jpeg'
import Sree from '../../images/team/sree.jpeg'
import Basma from '../../images/team/basma.jpeg'
import Sabeetha from '../../images/team/sabeetha-1.jpg'
import Raouf from '../../images/team/raouf.jpeg'
import Aseel from '../../images/team/aseel.jpeg'
import Mert from '../../images/team/mert.png'




function AboutComponent() {
  return (
    <div>
      <div className="theme-layout">
        <div className="container-about pdng0">
          <div className="topbarLand transparent">
            <div className="logo">
              <a title href="/"><img src="/assets/images/New_Shareup_White.png" alt="" /></a>
            </div>
            <div className="top-area-land">
              <ul className="setting-area">
                <li><a href="/about" title="About" data-ripple>About</a></li>
                <li><a href="/privacyPolicy" title="Home" data-ripple>Privacy
                          Bill of Rights</a></li>
                <li><a href="#" title="Languages" data-ripple><i className="fa fa-globe" /></a>
                  <div className="dropdowns languages">
                    <a href="#" title><i className="ti-check" />English</a> <a href="#" title>Arabic</a> <a href="#" title>Dutch</a> <a href="#" title>French</a>
                  </div></li>
                  <li>
                      <a href="/" title><button className="shareIn-btn" type="button">
                        <span>Members Login</span>
                      </button></a></li>
              </ul>
            </div>
          </div>
          <div className="mainContnr">
            <div className="about-area">
              <div className="about-meta">
                <p>Shareup, a space for you with trust love care and privacy</p>
              </div>
            </div>

          </div>
        </div>
        <div className="tabs-about" id="our-story">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div style={{ height: '200px', textAlign: 'center', paddingTop: '50px' }}>
                <img width="150px" src="/assets/images/cyber-security-illustration-lock-symbol-scatter-blue-light-pixel-data-dark-background-presentation_115968-6.jpg" alt="img" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p className="feature">ShareUp never spam you. Provide secure
                  platform for sharing.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div style={{ height: '200px', textAlign: 'center', paddingTop: '50px' }}>
                <img width="150px" src="/assets/images/uklargetreasuryteam.jpg" alt="img" />
              </div>
              <div style={{ textAlign: 'center' }}>

                <p className="feature">No more Prying eyes! SHAREUP will cover
                  you.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div style={{ height: '200px', textAlign: 'center', paddingTop: '50px' }}>
                <img width="150px" src='/assets/images/hands-digital-universe-background.jpg' alt="img" />
              </div>
              <div style={{ textAlign: 'center' }}>

                <p className="feature">Find new ways to Share anything from
                  anywhere</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div style={{ height: '200px', textAlign: 'center', paddingTop: '50px' }}>
                <img width="150px" src="/assets/images/r46gr1uotloki6xkkp8bCopy.jpg" alt="img" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p className="feature">Start Socializing, you are not alone!</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row shareup">
          <h2 className="heading">ShareUp Story</h2>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="about-img">
              
              <img width="100"  src="/assets/images/Shareup-Main-without-texture1.png" alt="img" />
             
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="container">
              <div className="about-story">
                <p className="shareup-text">ShareUp started in Qatar(Middle East) with the aim of being the most private and secure social media in the world. Our founder Mr. Firat Yagmur came up with a wonderful and unique idea of  sharing platform where people can connect from heart to heart.

                More than that, it is secure and protects your privacy with the most  trending technology we use.

We provide you most private and secure social media platform. Your data is our concern. You Share, we share and everyone share. Let’s share without fear. You are our concern, not our target.</p>
              </div>
            </div>

          </div>
        </div>

        <div className="product-screenshot" id="screenshot">
          <div className="container">
            <div style={{ padding: "10px" ,marginBottom:'20px'}}>
              <h2 style={{    color: '#415592',fontSize: '30px',fontWeight: '900'}}>TEAM</h2>
            </div>
            <div className="row" style={{justifyContent:'center'}}>
              <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                <div
                >
                  <img
                    width="200px"
                    src={Founder}
                    alt="img"
                  />
                  <h1>Mr. Firat Yagmur</h1>
                  <h3>Founder</h3>
                </div>
              </div>
            </div>

            <div className="row" style={{marginBottom:'40px'}}>
              <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                <div>
                  <img
                    width="200px"
                    src={Linnate}
                    alt="img"
                  />
                  <h1>Linnate Muza</h1>
                  <h3>IT Co-ordinator & Secretary</h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                <div
                 
                >
                  <img
                    width="200px"
                    src={Sabeetha}
                    alt="img"
                  />
                  <h1>Sabeetha Masinghe</h1>
                  <h3>UI Designer & Executive Assistant</h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                <div
                 
                >
                  <img
                    width="200px"
                    src={Basma}
                    alt="img"
                  />
                   <h1>Basma saad shokry</h1>
                  <h3>Senior Full Stack Leader</h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                <div
                 
                >
                  <img
                    width="200px"
                    src={Lokee}
                    alt="img"
                  />
                   <h1>Kaneshamoorthy lokeesan</h1>
                  <h3>Mobile Application Developer</h3>
                </div>
              </div>
            </div>
            <div className="row" style={{justifyContent:'center'}}>
              <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                <div>
                  <img
                    width="200px"
                    src={Raouf}
                    alt="img"
                  />
                   <h1>Abderaouf Zerkouk</h1>
                  <h3>Software Engineer</h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                <div
                 
                >
                  <img
                    width="200px"
                    src={Sree}
                    alt="img"
                  />
                    <h1>Sreelakshmi Harikrishnan</h1>
                    <h3>Software Engineer</h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                <div
                 
                >
                  <img
                    width="200px"
                    src={Mert}
                    alt="img"
                  />
                    <h1>Mert Taştekne</h1>
                    <h3>Software Engineer</h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                <div
                 
                >
                  <img
                    width="200px"
                    src={Aseel}
                    alt="img"
                  />
                   <h1>Aseel Karingatti Kandy</h1>
                  <h3>Software Programmer</h3>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div className="container">
          <div className="row">
            <div className="widget">
              <ul className="list-style">
                <li>
                  <a href="#" title>
                    About
                  </a>
                </li>
                <li>
                  <a href="#" title>
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" title>
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" title>
                    English
                  </a>
                </li>
                <li>
                  <a href="#" title>
                    Help Centre
                  </a>
                </li>
              </ul>
              <ul className="list-style">
                <li>
                  <a href="#">Afrikaans</a>
                </li>
                <li>
                  <a href="#">Shqip</a>
                </li>
                <li>
                  <a href="#">العربية</a>
                </li>
                <li>
                  <a href="#">Հայերեն</a>
                </li>
                <li>
                  <a href="#">Azərbaycan</a>
                </li>
                <li>
                  <a href="#">dili</a>
                </li>
                <li>
                  <a href="#">Euskara</a>
                </li>
                <li>
                  <a href="#">Беларуская</a>
                </li>
                <li>
                  <a href="#">мова</a>
                </li>
                <li>
                  <a href="#">বাংলা</a>
                </li>
                <li>
                  <a href="#">简体中文</a>
                </li>
                <li>
                  <a href="#">繁體中文</a>
                </li>
                <li>
                  <a href="#">Corsu</a>
                </li>
                <li>
                  <a href="#">Dansk</a>
                </li>
                <li>
                  <a href="#">Netherlands</a>
                </li>
                <li>
                  <a href="#">English</a>
                </li>
                <li>
                  <a href="#">Filipino</a>
                </li>
                <li>
                  <a href="#">Suomi</a>
                </li>
                <li>
                  <a href="#">Français</a>
                </li>
                <li>
                  <a href="#">ქართული</a>
                </li>
                <li>
                  <a href="#">Deutsch</a>
                </li>
                <li>
                  <a href="#">Ελληνικά</a>
                </li>
                <li>
                  <a href="#">ગુજરાતી</a>
                </li>
                <li>
                  <a href="#">Kreyol</a>
                </li>
                <li>
                  <a href="#">ayisyen</a>
                </li>
                <li>
                  <a href="#">Harshen</a>
                </li>
                <li>
                  <a href="#">Hausa</a>
                </li>
                <li>
                  <a href="#">Ōlelo</a>
                </li>
                <li>
                  <a href="#">Hawaiʻi</a>
                </li>
                <li>
                  <a href="#">עִבְרִית</a>
                </li>
                <li>
                  <a href="#">हिन्दी</a>
                </li>
                <li>
                  <a href="#">Hmong</a>
                </li>
                <li>
                  <a href="#">Magyar</a>
                </li>
                <li>
                  <a href="#">Íslenska</a>
                </li>
                <li>
                  <a href="#">Igbo</a>
                </li>
                <li>
                  <a href="#">Bahasa Indonesia</a>
                </li>
                <li>
                  <a href="#">Gaelige</a>
                </li>
                <li>
                  <a href="#">Italiano</a>
                </li>
                <li>
                  <a href="#">日本語</a>
                </li>
                <li>
                  <a href="#">Basa Jawa</a>
                </li>
                <li>
                  <a href="#">ಕನ್ನಡ</a>
                </li>
                <li>
                  <a href="#">Қазақ</a>
                </li>
                <li>
                  <a href="#">тілі</a>
                </li>
                <li>
                  <a href="#">Slovenščina</a>
                </li>
                <li>
                  <a href="#">Afsoomaali</a>
                </li>
                <li>
                  <a href="#">Español</a>
                </li>
                <li>
                  <a href="#">Basa Sunda</a>
                </li>
                <li>
                  <a href="#">Kiswahili</a>
                </li>
                <li>
                  <a href="#">Svenska</a>
                </li>
                <li>
                  <a href="#">Тоҷикӣ</a>
                </li>
                <li>
                  <a href="#">Српски </a>
                </li>
                <li>
                  <a href="#">Malagasy</a>
                </li>
                <li>
                  <a href="#">Samoan</a>
                </li>
                <li>
                  <a href="#">Türkçe</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default AboutComponent;
