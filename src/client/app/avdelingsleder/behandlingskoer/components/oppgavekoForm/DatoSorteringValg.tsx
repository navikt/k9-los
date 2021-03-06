import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';
import { hasValidDate } from 'utils/validation/validators';
import { Undertekst } from 'nav-frontend-typografi';
import { FormattedMessage, WrappedComponentProps } from 'react-intl';
import React, { FunctionComponent } from 'react';
import {
  DatepickerField,
} from 'form/FinalFields';
import { ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import moment from 'moment';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ArrowBox from 'sharedComponents/ArrowBox';
import styles from './sorteringVelger.less';

const finnDato = (antallDager) => moment().add(antallDager, 'd').format();

const getLagreDatoFn = (lagreOppgavekoSorteringTidsintervallDato, valgtOppgavekoId, annenDato, erFomDato, hentKo) => (e) => {
  let dato = e.target.value;
  if (dato) {
    dato = moment(dato, DDMMYYYY_DATE_FORMAT, true);
  }
  if (!dato || dato.isValid()) {
    const d = dato ? dato.format(ISO_DATE_FORMAT) : dato;

    const params = erFomDato ? {
      id: valgtOppgavekoId,
      fomDato: d,
      tomDato: annenDato,
    } : {
      id: valgtOppgavekoId,
      fomDato: annenDato,
      tomDato: d,
    };

    return lagreOppgavekoSorteringTidsintervallDato(params)
      .then(() => {
        hentKo(valgtOppgavekoId);
      });
  }
  return undefined;
};
interface OwnProps {
    valgtOppgavekoId: string;
    lagreOppgavekoSorteringTidsintervallDato: (params: {id: string, fomDato: string, tomDato: string}) => void;
    hentOppgaveko:(id: string) => void;
    fomDato: string;
    tomDato: string;
}

export const DatoSorteringValg: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  valgtOppgavekoId,
  lagreOppgavekoSorteringTidsintervallDato,
  fomDato,
  tomDato,
  hentOppgaveko,
}) => (
  <ArrowBox>
    <Undertekst>
      <FormattedMessage id="SorteringVelger.FiltrerPaTidsintervall" />
    </Undertekst>
    <>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <DatepickerField
              name="fomDato"
              label={{ id: 'SorteringVelger.Fom' }}
              onBlurValidation
              validate={[hasValidDate]}
              onBlur={getLagreDatoFn(lagreOppgavekoSorteringTidsintervallDato, valgtOppgavekoId, tomDato, true, hentOppgaveko)}
            />
          </FlexColumn>
          <FlexColumn>
            <Undertekst className={styles.dager}>
              <FormattedMessage id="SorteringVelger.Bindestrek" />
            </Undertekst>
          </FlexColumn>
          <FlexColumn className={styles.tomDato}>
            <DatepickerField
              name="tomDato"
              label={{ id: 'SorteringVelger.Tom' }}
              onBlurValidation
              validate={[hasValidDate]}
              onBlur={getLagreDatoFn(lagreOppgavekoSorteringTidsintervallDato, valgtOppgavekoId, fomDato, false, hentOppgaveko)}
            />
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </>
    <VerticalSpacer eightPx />
  </ArrowBox>
);

export default DatoSorteringValg;
