import React, {Component, PropTypes} from 'react';
import Modal from 'app/Layout/Modal';

export class Confirm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  accept() {
    this.setState({isOpen: false});
    if (this.props.accept) {
      this.props.accept();
    }
  }

  cancel() {
    this.setState({isOpen: false});
    if (this.props.cancel) {
      this.props.cancel();
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.accept !== this.props.accept) {
      this.setState({isOpen: true});
    }
  }

  render() {
    return (
      <Modal isOpen={this.state.isOpen || false} type={this.props.type || 'danger'}>

        <Modal.Body>
          <h4>{this.props.title || 'Confirm action'}</h4>
          <p>{this.props.message || 'Are you sure you want to continue?'}</p>
        </Modal.Body>

        <Modal.Footer>
          <button type="button" className="btn btn-default cancel-button"
            onClick={this.cancel.bind(this) }>Cancel</button>
          <button type="button" className="btn btn-danger confirm-button" onClick={this.accept.bind(this)}>Accept</button>
        </Modal.Footer>

      </Modal>
    );
  }
}

Confirm.propTypes = {
  isOpen: PropTypes.bool,
  accept: PropTypes.func,
  cancel: PropTypes.func,
  type: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string
};

export default Confirm;
