import React, { Component } from 'react';
import classnames from 'classnames';
import { MAX_ATTRIBUTE_VALUE } from './constants';

class SidebarPetInfoAttribute extends Component {
  render() {
    const { attribute, label } = this.props;

    const labelClasses = classnames({
      'sidebar-pet-info--attr-title': true,
      green: attribute > 600,
      yellow: attribute <= 600 && attribute > 300,
      red: attribute <= 300
    });

    const progressBarClasses = classnames({
      inner: true,
      green: attribute > 600,
      yellow: attribute <= 600 && attribute > 300,
      red: attribute <= 300
    });

    return (
      <div className="sidebar-pet-info-stat-container">
        <p className={labelClasses}>{label}</p>
        <div className="sidebar-pet-info--progress-bar-root">
          <div
            className={progressBarClasses}
            style={{
              width: `${(attribute / MAX_ATTRIBUTE_VALUE) * 100}%`
            }}
          />
        </div>
      </div>
    );
  }
}

export default SidebarPetInfoAttribute;
