import React, { Component, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import {
  injectIntl, intlShape, FormattedMessage,
} from 'react-intl';

import { Form } from 'react-final-form';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import { required } from 'utils/validation/validators';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { InputField } from 'form/FinalFields';
import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import { Saksbehandler } from '../saksbehandlerTsType';
import saksbehandlerPropType from '../saksbehandlerPropType';
import { getSaksbehandler, getSaksbehandlere, getSaksbehandlerSokFinished } from '../duck';

import styles from './leggTilSaksbehandlerForm.less';

interface TsProps {
  intl: any;
  finnSaksbehandler: (brukerIdent: string) => Promise<string>;
  leggTilSaksbehandler: (brukerIdent: string) => Promise<string>;
  resetSaksbehandlerSok: () => void;
  saksbehandler?: Saksbehandler;
  erLagtTilAllerede: boolean;
  erSokFerdig: boolean;
}

interface StateTsProps {
  leggerTilNySaksbehandler: boolean;
}

/**
 * LeggTilSaksbehandlerForm
 */
export class LeggTilSaksbehandlerForm extends Component<TsProps, StateTsProps> {
  nodes: ReactNode[];

  static propTypes = {
    intl: intlShape.isRequired,
    finnSaksbehandler: PropTypes.func.isRequired,
    leggTilSaksbehandler: PropTypes.func.isRequired,
    resetSaksbehandlerSok: PropTypes.func.isRequired,
    saksbehandler: saksbehandlerPropType,
    erLagtTilAllerede: PropTypes.bool.isRequired,
    erSokFerdig: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    saksbehandler: undefined,
  }

  constructor(props: TsProps) {
    super(props);

    this.state = {
      leggerTilNySaksbehandler: false,
    };
    this.nodes = [];
  }

  leggTilSaksbehandler = (resetFormValues: () => void) => {
    const {
      leggTilSaksbehandler, saksbehandler,
    } = this.props;

    if (saksbehandler) {
      this.setState(prevState => ({ ...prevState, leggerTilNySaksbehandler: true }));
      leggTilSaksbehandler(saksbehandler.brukerIdent).then(() => {
        this.resetSaksbehandlerSok(resetFormValues);
        this.setState(prevState => ({ ...prevState, leggerTilNySaksbehandler: false }));
      });
    }
  }

  resetSaksbehandlerSok = (resetFormValues: () => void) => {
    const {
      resetSaksbehandlerSok,
    } = this.props;
    resetSaksbehandlerSok();
    resetFormValues();
  }

  formatText = () => {
    const {
      intl, saksbehandler, erLagtTilAllerede, erSokFerdig,
    } = this.props;
    if (erSokFerdig && !saksbehandler) {
      return intl.formatMessage({ id: 'LeggTilSaksbehandlerForm.FinnesIkke' });
    }
    if (!saksbehandler) {
      return '';
    }

    const brukerinfo = `${saksbehandler.navn} ${saksbehandler.brukerIdent}`;
    return erLagtTilAllerede
      ? `${brukerinfo} (${intl.formatMessage({ id: 'LeggTilSaksbehandlerForm.FinnesAllerede' })})`
      : brukerinfo;
  }

  render = () => {
    const {
      intl, finnSaksbehandler, saksbehandler, erLagtTilAllerede, erSokFerdig,
    } = this.props;
    const {
      leggerTilNySaksbehandler,
    } = this.state;

    return (
      <Form
        onSubmit={(values: { epost: string}) => finnSaksbehandler(values.epost)}
        render={({
          submitting, handleSubmit, form,
        }) => (
          <form onSubmit={handleSubmit}>
            <Element>
              <FormattedMessage id="LeggTilSaksbehandlerForm.LeggTil" />
            </Element>
            <VerticalSpacer eightPx />
            <FlexContainer>
              <FlexRow>
                <FlexColumn>
                  <InputField
                    name="epost"
                    className={styles.epost}
                    label={intl.formatMessage({ id: 'LeggTilSaksbehandlerForm.Epost' })}
                    bredde="L"
                    validate={[required]}
                  />
                </FlexColumn>
                <FlexColumn>
                  <Knapp
                    mini
                    htmlType="submit"
                    className={styles.button}
                    spinner={submitting}
                    disabled={submitting || leggerTilNySaksbehandler}
                    tabIndex={0}
                  >
                    <FormattedMessage id="LeggTilSaksbehandlerForm.Sok" />
                  </Knapp>
                </FlexColumn>
              </FlexRow>
            </FlexContainer>
            {erSokFerdig && (
            <>
              <Normaltekst>
                {this.formatText()}
              </Normaltekst>
              <VerticalSpacer sixteenPx />
              <FlexContainer>
                <FlexRow>
                  <FlexColumn>
                    <Hovedknapp
                      mini
                      autoFocus
                      htmlType="button"
                      onClick={() => this.leggTilSaksbehandler(form.reset)}
                      spinner={leggerTilNySaksbehandler}
                      disabled={leggerTilNySaksbehandler || erLagtTilAllerede || !saksbehandler}
                    >
                      <FormattedMessage id="LeggTilSaksbehandlerForm.LeggTilIListen" />
                    </Hovedknapp>
                  </FlexColumn>
                  <FlexColumn>
                    <Knapp
                      mini
                      htmlType="button"
                      tabIndex={0}
                      disabled={leggerTilNySaksbehandler}
                      onClick={() => this.resetSaksbehandlerSok(form.reset)}
                    >
                      <FormattedMessage id="LeggTilSaksbehandlerForm.Nullstill" />
                    </Knapp>
                  </FlexColumn>
                </FlexRow>
              </FlexContainer>
            </>
            )
            }
          </form>
        )}
      />
    );
  }
}
const erSaksbehandlerLagtTilAllerede = createSelector([getSaksbehandler, getSaksbehandlere],
  (saksbehandler: Saksbehandler, avdelingensSaksbehandlere = []) => avdelingensSaksbehandlere instanceof Array
    && avdelingensSaksbehandlere.some(s => saksbehandler && s.brukerIdent.toLowerCase() === saksbehandler.brukerIdent.toLowerCase()));

const mapStateToProps = state => ({
  saksbehandler: getSaksbehandler(state),
  erLagtTilAllerede: erSaksbehandlerLagtTilAllerede(state),
  erSokFerdig: getSaksbehandlerSokFinished(state),
});

export default connect(mapStateToProps)(injectIntl(LeggTilSaksbehandlerForm));
