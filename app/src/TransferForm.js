import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import { getUserBankAccountsAndAccountsQuery } from 'graphql/users';

const PREV_USED_ACCOUNT_ID = 'prev-used-account-id';
const PREV_USED_BANK_ACCOUNT_ID = 'prev-used-bank-account-id';

class TransferForm extends Component {
  static defaultProps = {
    onUpdateAccountId() {},
    onUpdateBankAccountId() {}
  };

  static propTypes = {
    onUpdateAccountId: PropTypes.func,
    onUpdateBankAccountId: PropTypes.func
  };

  componentDidUpdate(prevProps) {
    const didReceiveAccounts =
      prevProps.accounts.length !== this.props.accounts.length;

    const didReceiveBankAccounts =
      prevProps.bankAccounts.length !== this.props.bankAccounts.length;

    if (didReceiveAccounts) {
      this.onReceiveAccounts(this.props.accounts);
    }

    if (didReceiveBankAccounts) {
      this.onReceiveBankAccounts(this.props.bankAccounts);
    }
  }

  render() {
    const {
      loading,
      accounts,
      bankAccounts,
      bankAccountId,
      accountId
    } = this.props;

    return (
      <div className="marketplace-modal--transfer-options-container">
        <div className="marketplace-modal--transfer-options-section">
          <p className="number-title label">Bank account</p>

          <select
            className="form-control size-sm"
            disabled={loading}
            value={bankAccountId}
            onChange={this.handleChangeBankAccountId}
          >
            {bankAccounts.map(({ accountName, accountNumber, id }) => (
              <option key={id} value={id}>
                ({accountNumber}) {accountName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p>to</p>
        </div>

        <div className="marketplace-modal--transfer-options-section">
          <p className="number-title label">Account</p>

          <select
            className="form-control size-sm"
            disabled={loading}
            value={accountId}
            onChange={this.handleChangeAccountId}
          >
            {accounts.map(({ id }) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  onReceiveAccounts = accounts => {
    const prevUsedAccount = localStorage.getItem(PREV_USED_ACCOUNT_ID);

    if (prevUsedAccount) {
      const isValid = accounts.find(({ id }) => id === prevUsedAccount);

      if (isValid) {
        this.props.onUpdateAccountId(prevUsedAccount);

        return;
      }
    }

    this.props.onUpdateAccountId(get(accounts, '[0].id'));
  };

  onReceiveBankAccounts = bankAccounts => {
    const prevUsedAccount = localStorage.getItem(PREV_USED_BANK_ACCOUNT_ID);

    if (prevUsedAccount) {
      const isValid = bankAccounts.find(({ id }) => id === prevUsedAccount);

      if (isValid) {
        this.props.onUpdateBankAccountId(prevUsedAccount);

        return;
      }
    }

    this.props.onUpdateBankAccountId(get(bankAccounts, '[0].id'));
  };

  handleChangeBankAccountId = ({ target: { value } }) => {
    localStorage.setItem(PREV_USED_BANK_ACCOUNT_ID, value);

    this.props.onUpdateAccountId(value);
  };

  handleChangeAccountId = ({ target: { value } }) => {
    localStorage.setItem(PREV_USED_ACCOUNT_ID, value);

    this.props.onUpdateAccountId(value);
  };
}

const WithQueryTransferForm = props => (
  <Query query={getUserBankAccountsAndAccountsQuery} fetchPolicy="cache-first">
    {({ loading, data }) => {
      const bankAccounts = get(data, 'viewer.bankAccounts', []);
      const accounts = get(data, 'viewer.accounts', []);

      return (
        <TransferForm
          loading={loading}
          accounts={accounts}
          bankAccounts={bankAccounts}
          {...props}
        />
      );
    }}
  </Query>
);

export default WithQueryTransferForm;
