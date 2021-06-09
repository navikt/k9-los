import React, {
  FunctionComponent, useMemo,
} from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Undertittel, Element } from 'nav-frontend-typografi';
import { Form } from 'react-final-form';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { ISO_DATE_FORMAT } from 'utils/formats';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import { SelectField } from 'form/FinalFields';
import { ALLE_YTELSETYPER_VALGT, ytelseTyper } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import { Column, Row } from 'nav-frontend-grid';
import NyeOgFerdigstilteOppgaverForIdagGraf from './NyeOgFerdigstilteOppgaverForIdagGraf';
import NyeOgFerdigstilteOppgaver from '../nyeOgFerdigstilteOppgaverTsType';

export const getNyeOgFerdigstilteForIDag = (nyeOgFerdigstilte: NyeOgFerdigstilteOppgaver[] = []) => {
  const iDag = moment();
  return nyeOgFerdigstilte.filter((oppgave) => iDag.isSame(moment(oppgave.dato, ISO_DATE_FORMAT), 'day'));
};

interface OwnProps {
    width: number;
    height: number;
    nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[];
}

/**
 * NyeOgFerdigstilteOppgaverForIdagPanel.
 */
export const NyeOgFerdigstilteOppgaverForIdagPanel: FunctionComponent<OwnProps> = ({
  width,
  height,
  nyeOgFerdigstilteOppgaver,
}) => {
  const behandlingTyper = useKodeverk(kodeverkTyper.BEHANDLING_TYPE);
  const nyeOgFerdigstilteOppgaverForIdag = useMemo(() => getNyeOgFerdigstilteForIDag(nyeOgFerdigstilteOppgaver), [nyeOgFerdigstilteOppgaver]);

  return (
    <>
      <Undertittel>
        <FormattedMessage id="NyeOgFerdigstilteOppgaverForIdagPanel.NyeOgFerdigstilte" />
      </Undertittel>
      <VerticalSpacer eightPx />
      <Form
        onSubmit={() => undefined}
        initialValues={{ ytelseType: ALLE_YTELSETYPER_VALGT }}
        render={({ values }) => (
          <>
            <Row>
              <Column xs="3">
                <Element>
                  <FormattedMessage id="NyeOgFerdigstilteOppgaverForIdagPanel.IDag" />
                </Element>
              </Column>
              <Column xs="9">
                <SelectField
                  name="ytelseType"
                  label=""
                  selectValues={ytelseTyper.map((u) => <option key={u.kode} value={u.kode}>{u.navn}</option>)}
                  bredde="m"
                />
              </Column>
            </Row>
            <NyeOgFerdigstilteOppgaverForIdagGraf
              width={width}
              height={height}
              nyeOgFerdigstilteOppgaver={
                  values.ytelseType === ALLE_YTELSETYPER_VALGT
                    ? nyeOgFerdigstilteOppgaverForIdag : nyeOgFerdigstilteOppgaver.filter((o) => o.fagsakYtelseType.kode === values.ytelseType)
              }
              behandlingTyper={behandlingTyper}
            />
          </>
        )}
      />
    </>
  );
};

export default NyeOgFerdigstilteOppgaverForIdagPanel;
