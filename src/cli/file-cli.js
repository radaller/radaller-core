import FileStorage from './storage/file';
import Cli from './cli';

const FileCli = Cli(FileStorage());

export default FileCli;