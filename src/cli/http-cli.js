import HttpStorage from './storage/http';
import Cli from './cli';

const HttpCli = Cli(HttpStorage());

export default HttpCli;