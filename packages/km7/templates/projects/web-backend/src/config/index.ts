import { AllConfig } from './conf';
import DevConf from './dev';
import ProdConf from './prod';
import StagingConf from './staging';

const config: AllConfig =
  process.env.UMI_ENV === 'prod'
    ? ProdConf
    : process.env.UMI_ENV === 'staging'
    ? StagingConf
    : DevConf;

export default config;
