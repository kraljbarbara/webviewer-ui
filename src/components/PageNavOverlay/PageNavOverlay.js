import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import core from 'core';
import getClassName from 'helpers/getClassName';
import selectors from 'selectors';

import './PageNavOverlay.scss';

class PageNavOverlay extends React.PureComponent {
  static propTypes = {
    isLeftPanelDisabled: PropTypes.bool,
    isLeftPanelOpen: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    pageLabels: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      input: '',
      isCustomPageLabels: false
    };
  }

  componentDidUpdate(prevProps) {
    const { currentPage, pageLabels } = this.props;
    
    const isCustomPageLabels = prevProps.pageLabels !== this.props.pageLabels && prevProps.pageLabels.length !== 0;
    if (isCustomPageLabels) {
      this.setState({ isCustomPageLabels: true });
    }

    if (prevProps.currentPage !== this.props.currentPage || prevProps.pageLabels !== this.props.pageLabels) {
      this.setState({ input: pageLabels[currentPage - 1] });
    }
  }

  onClick = () => {
    this.textInput.current.focus();
  }

  onInput = e => {
    this.setState({ input: e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();
    
    const { input } = this.state;
    const isValidInput = input === '' || this.props.pageLabels.includes(input);

    if (isValidInput) {
      const pageToGo = this.props.pageLabels.indexOf(input) + 1;
      core.setCurrentPage(pageToGo);
    } else {
      this.textInput.current.blur();
    }
  }

  onBlur = () => {
    const { currentPage, pageLabels } = this.props;

    this.setState({ input: pageLabels[currentPage - 1] });
  }

  render() {
    const { isDisabled, isLeftPanelOpen, isLeftPanelDisabled, currentPage, totalPages } = this.props;
    
    if (isDisabled) {
      return null;
    }

    const inputWidth = totalPages.toString().length * 10;
    const className = getClassName(`Overlay PageNavOverlay ${isLeftPanelOpen && !isLeftPanelDisabled ? 'shifted' : ''}`, this.props);
    
    return (
      <div className={className} data-element="pageNavOverlay" onClick={this.onClick}>
        <form onSubmit={this.onSubmit} onBlur={this.onBlur}>
          <input ref={this.textInput} type="text" value={this.state.input} style={{ width: inputWidth }} onInput={this.onInput} />
          {this.state.isCustomPageLabels 
          ? ` (${currentPage}/${totalPages})`
          : ` / ${totalPages}`
          }
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLeftPanelDisabled: selectors.isElementDisabled(state, 'leftPanel'),
  isLeftPanelOpen: selectors.isElementOpen(state, 'leftPanel'),
  isDisabled: selectors.isElementDisabled(state, 'pageNavOverlay'),
  isOpen: selectors.isElementOpen(state, 'pageNavOverlay'),
  currentPage: selectors.getCurrentPage(state),
  totalPages: selectors.getTotalPages(state),
  pageLabels: selectors.getPageLabels(state)
});

export default connect(mapStateToProps)(PageNavOverlay);