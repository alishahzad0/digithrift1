/*
 *
 * Category
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import actions from '../../actions';
// import { ROLES } from '../../constants';
import List from './List';
import Page404 from '../../components/Common/Page404';

class Category extends React.PureComponent {
  render() {
    const { user } = this.props;

    return (
      <div className='category-dashboard'>
        <Switch>
          <Route exact path='/dashboard/verifyUser' component={List} />
          <Route path='*' component={Page404} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user
  };
};

export default connect(mapStateToProps, actions)(Category);
