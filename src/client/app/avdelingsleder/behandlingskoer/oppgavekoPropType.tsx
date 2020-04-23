import PropTypes from 'prop-types';

import kodeverkPropType from 'kodeverk/kodeverkPropType';
import saksbehandlerPropType from 'avdelingsleder/saksbehandlere/saksbehandlerPropType';

const oppgavekoPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  navn: PropTypes.string,
  behandlingTyper: PropTypes.arrayOf(kodeverkPropType),
  fagsakYtelseTyper: PropTypes.arrayOf(kodeverkPropType),
  andreKriterier: PropTypes.arrayOf(kodeverkPropType),
  sistEndret: PropTypes.string.isRequired,
  sortering: PropTypes.shape({
    sorteringType: kodeverkPropType.isRequired,
    fomDato: PropTypes.string,
    tomDato: PropTypes.string,
  }),
  saksbehandlere: PropTypes.arrayOf(saksbehandlerPropType).isRequired,
});

export default oppgavekoPropType;
