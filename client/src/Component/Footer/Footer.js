import React from 'react';
import "./Footer.css";
import 'bootstrap/dist/css/bootstrap.min.css';

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer" id="footer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-4">
            </div>
            <div className="col-sm-4">
              <center><p className="text-muted credit">Full Stack Web Development By Vinay Kumar Kuresi</p></center>
            </div>
            <div className="col-sm-4" style={{ "textAlign": 'right' }}>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}

export default Footer;
